/** Sessão técnica automática; avaliação pública sem senha. */
// Limites da avaliação pública: protegem a cota gratuita, o Drive e a planilha do dono.
var PORTAL_LIMITS = {
  sessionStartsPerMinute: 100,
  sessionTickets: 5,
  sessionAI: 40,
  dailyTickets: 60,
  dailyAI: 600,
  files: 3,
  fileBytes: 5 * 1024 * 1024,
  totalBytes: 5 * 1024 * 1024,
};
function smartdeskStartSession_() {
  var cache = CacheService.getScriptCache(),
    lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { error: "Muitos acessos neste momento. Aguarde um minuto." };
  try {
    // Uma chave por minuto: a janela termina mesmo com tráfego contínuo.
    var minute = "portal:session-starts:" + Math.floor(Date.now() / 60000),
      count = Number(cache.get(minute) || 0);
    if (count >= PORTAL_LIMITS.sessionStartsPerMinute)
      return { error: "Muitos acessos neste momento. Aguarde um minuto." };
    cache.put(minute, String(count + 1), 120);
    var token = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
    cache.put(
      "portal:session:" + token,
      JSON.stringify({ success: 0, failed: false, ai: 0, tickets: 0 }),
      3600,
    );
    return { session: token };
  } finally {
    lock.releaseLock();
  }
}
function portalDaily_(kind, limit) {
  // Contagem aproximada e durável por dia; serve para frear abuso, não para faturar.
  var props = PropertiesService.getScriptProperties(),
    day = Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyyMMdd"),
    key = "QUOTA_" + day + "_" + kind,
    used = Number(props.getProperty(key) || 0);
  if (used >= limit) return false;
  if (!used && typeof props.getKeys === "function")
    props.getKeys().forEach(function (old) {
      if (/^QUOTA_/.test(old) && old.indexOf("QUOTA_" + day + "_") !== 0) props.deleteProperty(old);
    });
  props.setProperty(key, String(used + 1));
  return true;
}
function portalSession_(token) {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token))
    throw new InvalidRequest("Acesso expirado. Entre novamente.", 401);
  var value = CacheService.getScriptCache().get("portal:session:" + token);
  if (!value) throw new InvalidRequest("Acesso expirado. Entre novamente.", 401);
  return JSON.parse(value);
}
function portalStatus_(session) {
  var p = PropertiesService.getScriptProperties();
  var ready = Boolean(p.getProperty("GEMINI_API_KEY"));
  return {
    aiReady: ready,
    aiOnline: ready && !session.failed && Date.now() - session.success < 120000,
    aiState: !ready
      ? "absent"
      : session.failed
        ? "unavailable"
        : Date.now() - session.success < 120000
          ? "online"
          : "standby",
    provider: "Gemini",
    limits: {
      files: PORTAL_LIMITS.files,
      fileBytes: PORTAL_LIMITS.fileBytes,
      totalBytes: PORTAL_LIMITS.totalBytes,
    },
    ticketsReady: Boolean(
      p.getProperty("SMARTDESK_SHEET_ID") &&
      p.getProperty("SMARTDESK_FOLDER_ID") &&
      p.getProperty("SMARTDESK_TOKEN"),
    ),
  };
}
function portalAI_(token, instruction, data, field, limit) {
  var output = portalAIJson_(token, instruction, data, {
    type: "OBJECT",
    properties: { [field]: { type: "STRING" } },
    required: [field],
  })[field];
  if (
    typeof output !== "string" ||
    !output.trim() ||
    output.trim().length > limit ||
    /[<>\x00-\x08]/.test(output)
  )
    throw Error("Resposta inválida");
  return output.trim();
}
function portalAIJson_(token, instruction, data, schema, temperature) {
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty("GEMINI_API_KEY");
  var model = props.getProperty("GEMINI_MODEL") || "gemini-3.5-flash-lite";
  if (!key || !/^[a-zA-Z0-9.-]+$/.test(model)) throw Error("IA indisponível");
  var session = portalSession_(token);
  // Cota atingida não marca a IA como falha: a conversa segue com as opções locais.
  if ((session.ai || 0) >= PORTAL_LIMITS.sessionAI || !portalDaily_("AI", PORTAL_LIMITS.dailyAI))
    throw Error("Cota de IA atingida");
  session.ai = (session.ai || 0) + 1;
  try {
    var response = UrlFetchApp.fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
      {
        method: "post",
        contentType: "application/json",
        headers: { "x-goog-api-key": key },
        muteHttpExceptions: true,
        payload: JSON.stringify({
          systemInstruction: { parts: [{ text: instruction }] },
          contents: [{ role: "user", parts: [{ text: JSON.stringify(data) }] }],
          generationConfig: {
            temperature: temperature === undefined ? 0.2 : temperature,
            maxOutputTokens: 512,
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        }),
      },
    );
    if (response.getResponseCode() !== 200) throw Error("IA indisponível");
    var result = JSON.parse(response.getContentText());
    var text = (result.candidates?.[0]?.content?.parts || [])
      .filter((p) => !p.thought)
      .map((p) => p.text || "")
      .join("");
    var output = JSON.parse(text);
    if (!output || typeof output !== "object") throw Error("Resposta inválida");
    session.success = Date.now();
    session.failed = false;
    return output;
  } catch (error) {
    session.failed = true;
    throw Error("IA indisponível");
  } finally {
    CacheService.getScriptCache().put("portal:session:" + token, JSON.stringify(session), 3600);
  }
}
function portalAnalyze_(token, body, desk) {
  if (
    typeof body.description !== "string" ||
    !body.description.trim() ||
    body.description.length > 2000 ||
    !desk.flows.sectors.includes(body.sector)
  )
    throw new InvalidRequest("Confira o relato e o setor.");
  var allowed = desk.knowledgeBase.items.filter(function (item) {
      return desk.classifier.isAllowed(item, body.sector);
    }),
    pick = function (ids) {
      return ids.map(function (id) {
        var item = allowed.find(function (entry) {
          return entry.id === id;
        });
        return { item: { id: item.id, area: item.area, need: item.need, path: item.path } };
      });
    };
  try {
    var ids = portalAIJson_(
      token,
      SMARTDESK_ANALYZE_INSTRUCTION,
      {
        relato: body.description.trim(),
        setor: body.sector,
        categorias: analyzeCategories_(allowed),
      },
      {
        type: "OBJECT",
        properties: {
          itemIds: {
            type: "ARRAY",
            items: {
              type: "STRING",
              enum: allowed.map(function (item) {
                return item.id;
              }),
            },
          },
        },
        required: ["itemIds"],
      },
      0,
    ).itemIds;
    if (!Array.isArray(ids)) throw Error("Resposta inválida");
    ids = ids.filter(function (id, i) {
      return ids.indexOf(id) === i;
    });
    if (
      ids.some(function (id) {
        return !allowed.some(function (item) {
          return item.id === id;
        });
      })
    )
      throw Error("Classificação desconhecida");
    ids = ids.slice(0, 3);
    return {
      status: !ids.length ? "unknown" : ids.length === 1 ? "suggested" : "ambiguous",
      candidates: pick(ids),
      source: "ai",
    };
  } catch (error) {
    var local = desk.classifier.classify(body.description, body.sector);
    return {
      status: local.status,
      candidates: pick(
        local.candidates.slice(0, 3).map(function (candidate) {
          return candidate.item.id;
        }),
      ),
      source: "local",
    };
  }
}
function portalGestao_(payload) {
  payload.token = PropertiesService.getScriptProperties().getProperty("SMARTDESK_TOKEN");
  return portalResult_(doPost({ postData: { contents: JSON.stringify(payload) } }));
}
function portalCount_(token, kind, limit, message) {
  // Contador simples por sessão para consultas públicas (acompanhamento, registros).
  var session = portalSession_(token);
  if ((session[kind] || 0) >= limit) throw new InvalidRequest(message, 429);
  session[kind] = (session[kind] || 0) + 1;
  CacheService.getScriptCache().put("portal:session:" + token, JSON.stringify(session), 3600);
}
function portalResult_(content) {
  var value = JSON.parse(content.getContent());
  if (!value.ok)
    throw new InvalidRequest(value.error || "Não foi possível confirmar a operação.", 502);
  return value;
}
function portalFile_(file) {
  if (!file || typeof file.name !== "string" || typeof file.base64 !== "string")
    throw new InvalidRequest("Confira os anexos.");
  var bytes = Utilities.base64Decode(file.base64)
      .slice(0, 4096)
      .map(function (b) {
        return b & 255;
      }),
    starts = function (signature) {
      return signature.every(function (value, i) {
        return bytes[i] === value;
      });
    },
    ext = (/\.([a-z]+)$/i.exec(file.name) || ["", ""])[1].toLowerCase(),
    ok = {
      png: starts([0x89, 0x50, 0x4e, 0x47]),
      jpg: starts([0xff, 0xd8, 0xff]),
      jpeg: starts([0xff, 0xd8, 0xff]),
      gif: starts([0x47, 0x49, 0x46, 0x38]),
      webp: starts([0x52, 0x49, 0x46, 0x46]) && bytes[8] === 0x57 && bytes[9] === 0x45,
      pdf: starts([0x25, 0x50, 0x44, 0x46]),
      docx: starts([0x50, 0x4b, 0x03, 0x04]),
      xlsx: starts([0x50, 0x4b, 0x03, 0x04]),
      txt: bytes.indexOf(0) === -1,
    }[ext];
  if (!ok)
    throw new InvalidRequest("O conteúdo de " + file.name + " não confere com o tipo do arquivo.");
}
function portalTicket_(body, item) {
  var files = Array.isArray(body.attachments) ? body.attachments : [];
  if (files.length > PORTAL_LIMITS.files)
    throw new InvalidRequest(
      "Nesta avaliação pública, envie até " + PORTAL_LIMITS.files + " anexos.",
    );
  var total = 0;
  files.forEach(function (file) {
    var size =
      file && typeof file.base64 === "string" ? Math.floor((file.base64.length * 3) / 4) : 0;
    if (size > PORTAL_LIMITS.fileBytes)
      throw new InvalidRequest("Nesta avaliação pública, cada anexo pode ter até 5 MB.");
    total += size;
  });
  if (total > PORTAL_LIMITS.totalBytes)
    throw new InvalidRequest("Nesta avaliação pública, os anexos somam no máximo 5 MB.");
  files.forEach(portalFile_);
  var description = validateDescription_(body.description),
    answers = validateAnswers_(body.answers, item);
  if (!policy.fullName(body.name)) throw new InvalidRequest("Informe seu nome e sobrenome.");
  if (
    typeof body.email !== "string" ||
    body.email.length > 160 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  )
    throw new InvalidRequest("Informe seu e-mail institucional.");
  var subject = safeSubject_(body.subject);
  if (!subject) throw new InvalidRequest("Confira o assunto de até 80 caracteres.");
  if (policy.asksEquipmentIntent(item) && !["repair", "purchase"].includes(body.equipmentIntent))
    throw new InvalidRequest("Informe se o item está com defeito ou se é um pedido novo.");
  if (
    body.equipmentIntent !== undefined &&
    !["", "repair", "purchase"].includes(body.equipmentIntent)
  )
    throw new InvalidRequest("Tipo de pedido inválido.");
  var authorization = null;
  if (policy.needsAuthorization(item, description, body.equipmentIntent)) {
    var auth = body.authorization;
    if (
      !auth ||
      !["pending", "reported"].includes(auth.status) ||
      (auth.status === "reported" && !policy.fullName(auth.by))
    )
      throw new InvalidRequest("Informe a autorização da liderança ou marque que está pendente.");
    authorization = { status: auth.status, by: auth.status === "reported" ? auth.by.trim() : "" };
  }
  var ticket = {
    requestId: body.requestId,
    name: body.name.trim(),
    email: body.email,
    sector: body.sector,
    selectionId: item.id,
    area: item.area,
    need: item.need,
    subject: subject,
    description: description,
    answers: answers,
    attachments: body.attachments,
    authorization: authorization,
  };
  var participant = safeParticipant_(body.participant);
  if (participant) ticket.participant = participant;
  try {
    validar_(ticket);
  } catch (error) {
    throw new InvalidRequest("Confira os anexos e os dados do chamado.");
  } // Limites de arquivos e matriz.
  return ticket;
}
var PORTAL_DEMO_NEEDS = {
  "Projetor sem imagem": "Projetor",
  "Impressora não imprime": "Não imprime",
  "Acesso ao Gmail": "Gmail",
  "Conexão instável": "INTERNET > Problemas com Wi-Fi",
  "Reserva de microfone": "Microfone",
  "Toner magenta": "Solicitação de Toner / Tinta",
  "Computador lento": "COMPUTADOR > Problemas com lentidão",
  "Acesso ao Drive": "Drive",
  "Notebook para apresentação": "COMPUTADOR > Reserva de Notebook",
  "Projetor para evento": "Projetor",
  "Papel atolado": "Papel Atolado",
  "Dúvida no sistema": "Dúvidas",
};
function portalDemo_(token, route, body) {
  var cache = CacheService.getScriptCache(),
    key = "portal:demo:" + token;
  var rows = JSON.parse(cache.get(key) || "[]");
  if (route === "/api/admin/seed" && !rows.length) {
    rows = [
      "Projetor sem imagem",
      "Impressora não imprime",
      "Acesso ao Gmail",
      "Conexão instável",
      "Reserva de microfone",
      "Toner magenta",
      "Computador lento",
      "Acesso ao Drive",
      "Notebook para apresentação",
      "Projetor para evento",
      "Papel atolado",
      "Dúvida no sistema",
    ].map((subject, i) => ({
      number: "#SIM-" + String(i + 1).padStart(3, "0"),
      requestId: "sim-" + (i + 1),
      name: "Pessoa fictícia " + (i + 1),
      email: "pessoa" + (i + 1) + "@example.com",
      sector: ["Secretaria", "Financeiro", "TI", "Marketing"][i % 4],
      area: ["Audiovisual", "Impressora", "Google", "TI"][[0, 1, 2, 3, 0, 1, 3, 2, 3, 0, 1, 3][i]],
      // Categoria real do catálogo: o painel agrupa por área › categoria.
      need: PORTAL_DEMO_NEEDS[subject] || subject,
      subject: subject,
      description: "Chamado simulado para demonstração: " + subject + ".",
      status: PORTAL_STAGES[i % 7],
      createdAt: new Date(Date.now() - (i + 1) * 18000000).toISOString(),
      answers: {},
      attachments: [],
      simulation: true,
    }));
  }
  if (route === "/api/admin/status") {
    var item = rows.find((row) => row.requestId === body.requestId);
    if (!item) throw new InvalidRequest("Chamado não encontrado.", 404);
    if (body.expectedStatus && body.expectedStatus !== item.status)
      throw new InvalidRequest("Etapa alterada. Atualize o painel.", 409);
    item.status = body.status;
  }
  cache.put(key, JSON.stringify(rows), 3600);
  return { tickets: rows, stages: PORTAL_STAGES, mode: "demo", ok: true };
}
var PORTAL_STAGES = [
  "Novos chamados",
  "Em atendimento",
  "Aguardando terceiros",
  "Empréstimos",
  "Agendado",
  "Finalizado",
  "Cancelado",
];
// O Pages é público: nos chamados de outras pessoas, só o primeiro nome com a inicial do último,
// e-mail com o começo e o domínio, e anexos sem endereço (a contagem continua). A planilha
// guarda tudo.
function portalShortName_(name) {
  var parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "";
  return parts.length > 1
    ? parts[0] + " " + parts[parts.length - 1].charAt(0).toUpperCase() + "."
    : parts[0];
}
function portalMaskEmail_(email) {
  var match = /^([^@\s]+)@([^@\s]+)$/.exec(String(email || "").trim());
  return match ? match[1].slice(0, 2) + "•••@" + match[2] : "";
}
function portalPublicTicket_(ticket) {
  var copy = JSON.parse(JSON.stringify(ticket));
  copy.name = portalShortName_(copy.name);
  copy.email = portalMaskEmail_(copy.email);
  copy.attachments = (copy.attachments || []).map(function () {
    return "";
  });
  if (copy.authorization && copy.authorization.by)
    copy.authorization.by = portalShortName_(copy.authorization.by);
  copy.masked = true;
  return copy;
}
function smartdeskCall(session, route, body) {
  try {
    var state = portalSession_(session);
    if (typeof route !== "string" || route.length > 150)
      throw new InvalidRequest("Pedido inválido.");
    if (route === "/api/status") return { status: 200, body: portalStatus_(state) };
    if (
      body !== null &&
      body !== undefined &&
      (typeof body !== "object" ||
        Array.isArray(body) ||
        JSON.stringify(body).length > 30 * 1024 * 1024)
    )
      throw new InvalidRequest("Pedido inválido.");
    body = body || {};
    if (route.startsWith("/api/admin/")) {
      var listing = /^\/api\/admin\/tickets\?mode=(demo|google)$/.exec(route);
      var mode = listing ? listing[1] : body.mode;
      if (!["demo", "google"].includes(mode)) throw new InvalidRequest("Modo inválido.");
      if (!listing && !["/api/admin/seed", "/api/admin/status"].includes(route))
        throw new InvalidRequest("Operação inválida.", 404);
      if (
        route === "/api/admin/status" &&
        (!PORTAL_STAGES.includes(body.status) ||
          typeof body.requestId !== "string" ||
          body.requestId.length > 100)
      )
        throw new InvalidRequest("Etapa inválida.");
      if (mode === "demo") {
        var demoLock = LockService.getScriptLock();
        demoLock.waitLock(25000);
        try {
          var demoBody = portalDemo_(session, listing ? "/api/admin/tickets" : route, body);
          if (listing) demoBody.selfHelp = { resolved: 3, continued: 7, simulation: true };
          return { status: 200, body: demoBody };
        } finally {
          demoLock.releaseLock();
        }
      }
      if (!listing && route !== "/api/admin/status")
        throw new InvalidRequest("Simulações são separadas dos dados reais.");
      // 0.12.16: o painel publicado mostra todos os chamados da planilha e muda a etapa de
      // qualquer um; nome e e-mail de quem não abriu o chamado nesta aba chegam abreviados.
      var owned = JSON.parse(CacheService.getScriptCache().get("portal:owned:" + session) || "[]");
      var response = portalResult_(
        doPost({
          postData: {
            contents: JSON.stringify({
              token: PropertiesService.getScriptProperties().getProperty("SMARTDESK_TOKEN"),
              action: listing ? "listTickets" : "updateStatus",
              requestId: body.requestId,
              status: body.status,
              expectedStatus: body.expectedStatus,
            }),
          },
        }),
      );
      if (listing) {
        response.tickets = response.tickets.map((ticket) =>
          owned.includes(ticket.requestId) ? ticket : portalPublicTicket_(ticket),
        );
        response.stages = PORTAL_STAGES; // o painel monta as colunas a partir desta lista
        try {
          // Totais anônimos de autoatendimento (sem nomes): mostram se as dicas da IA ajudam.
          var stats = portalGestao_({ action: "selfHelpStats" });
          response.selfHelp = { resolved: stats.resolved || 0, continued: stats.continued || 0 };
        } catch (error) {
          response.selfHelp = null;
        }
      }
      return { status: 200, body: response };
    }
    if (
      ![
        "/api/analyze",
        "/api/extract",
        "/api/assist",
        "/api/track",
        "/api/selfhelp",
        "/api/metrics",
        "/api/next-prompt",
        "/api/subject",
        "/api/tickets",
      ].includes(route)
    )
      throw new InvalidRequest("Operação inválida.", 404);
    var desk = window.SmartDesk;
    if (route === "/api/metrics") {
      // Métricas anônimas do atendimento para o teste com usuários (aba Sessões).
      var metrics = safeMetrics_(body, desk),
        saved = false;
      try {
        portalCount_(session, "metrics", 60, "Limite de registros.");
        portalGestao_({ action: "sessionMetrics", metrics: metrics, origin: "Pages" });
        saved = true;
      } catch (error) {}
      return { status: 200, body: { stored: saved } };
    }
    if (route === "/api/analyze") return { status: 200, body: portalAnalyze_(session, body, desk) };
    if (route === "/api/track") {
      // Acompanhamento pelo solicitante: número + e-mail da abertura, poucas consultas por sessão.
      var number =
          "#" +
          String(body.number || "")
            .replace(/\D/g, "")
            .padStart(3, "0"),
        email = String(body.email || "")
          .trim()
          .toLowerCase();
      if (number === "#000" || email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new InvalidRequest(
          "Informe o número do chamado (ex.: #012) e o e-mail usado na abertura.",
        );
      portalCount_(session, "track", 10, "Muitas consultas nesta sessão. Recarregue a página.");
      var tracked = portalGestao_({ action: "trackTicket", number: number, email: email });
      return { status: 200, body: { ticket: tracked.ticket || null } };
    }
    var item = validateSelection_(body, desk);
    if (route === "/api/selfhelp") {
      if (!["resolved", "continued"].includes(body.outcome))
        throw new InvalidRequest("Resultado inválido.");
      var stored = false;
      try {
        portalCount_(session, "selfHelp", 20, "Limite de registros.");
        portalGestao_({
          action: "selfHelp",
          sector: body.sector,
          area: item.area,
          need: item.need,
          outcome: body.outcome,
          origin: "Pages",
        });
        stored = true;
      } catch (error) {}
      return { status: 200, body: { stored: stored } };
    }
    if (route === "/api/extract") {
      // Rascunho a partir do relato livre: só valores no formato certo; o resto é perguntado.
      // Mesmo sem campos a preencher, a IA diz o que entendeu, confere o relato e pode dar dicas.
      var told = validateDescription_(body.description),
        draft = {
          answers: {},
          intent: "",
          understanding: "",
          complete: null,
          otherRequest: false,
          tips: [],
        },
        from = "local",
        allowTips = policy.selfHelpEligible(item, ""),
        fields = extractableFields_(item).map(function (field) {
          var entry = { id: field.id, rotulo: field.label, tipo: field.type };
          if (field.options) entry.opcoes = field.options;
          return entry;
        });
      try {
        var today = policy.localDay();
        draft = safeExtract_(
          item,
          portalAIJson_(
            session,
            SMARTDESK_EXTRACT_INSTRUCTION,
            {
              hoje: today + " (" + weekdayName_(today) + ")",
              setor: body.sector,
              area: item.area,
              necessidade: item.need,
              campos: fields,
              relato: told,
              perguntaDoFluxo: desk.conversationCopy.flowQuestion(
                item,
                policy.asksEquipmentIntent(item) ? "purchase" : "",
              ),
              dicasPermitidas: allowTips,
            },
            SMARTDESK_EXTRACT_SCHEMA,
            0,
          ),
          allowTips,
          told,
        );
        from = "ai";
      } catch (error) {}
      return {
        status: 200,
        body: {
          answers: draft.answers,
          intent: draft.intent,
          understanding: draft.understanding,
          complete: draft.complete,
          otherRequest: draft.otherRequest,
          tips: draft.tips,
          source: from,
          selectionId: item.id,
        },
      };
    }
    if (route === "/api/tickets") {
      var ticket = portalTicket_(body, item),
        known = JSON.parse(CacheService.getScriptCache().get("portal:owned:" + session) || "[]");
      // Repetir o mesmo envio (mesmo ID) não consome cota: o receptor devolve o mesmo número.
      if (!known.includes(ticket.requestId)) {
        if ((state.tickets || 0) >= PORTAL_LIMITS.sessionTickets)
          throw new InvalidRequest(
            "Esta sessão de avaliação já enviou " +
              PORTAL_LIMITS.sessionTickets +
              " chamados. Recarregue a página para iniciar outra.",
            429,
          );
        if (!portalDaily_("TICKETS", PORTAL_LIMITS.dailyTickets))
          throw new InvalidRequest(
            "O limite diário de chamados desta avaliação foi atingido. Tente amanhã.",
            429,
          );
      }
      var receipt = portalResult_(
        receberChamado_({
          postData: {
            contents: JSON.stringify({
              token: PropertiesService.getScriptProperties().getProperty("SMARTDESK_TOKEN"),
              ticket: ticket,
            }),
          },
        }),
      );
      var ownerLock = LockService.getScriptLock();
      ownerLock.waitLock(25000);
      try {
        var cache = CacheService.getScriptCache(),
          owned = JSON.parse(cache.get("portal:owned:" + session) || "[]");
        if (!owned.includes(ticket.requestId)) {
          owned.push(ticket.requestId);
          var current = portalSession_(session);
          current.tickets = (current.tickets || 0) + 1;
          cache.put("portal:session:" + session, JSON.stringify(current), 3600);
        }
        cache.put("portal:owned:" + session, JSON.stringify(owned), 3600);
      } finally {
        ownerLock.releaseLock();
      }
      // Mesmo recibo do servidor local: o chat só confirma com status, ID e número válidos.
      if (!/^#\d{3,}$/.test(receipt.number) || receipt.requestId !== ticket.requestId)
        throw new InvalidRequest("Não foi possível confirmar o recebimento.", 502);
      return {
        status: 201,
        body: {
          status: "enviado",
          number: receipt.number,
          requestId: receipt.requestId,
          attachmentCount: receipt.attachmentCount,
        },
      };
    }
    if (route === "/api/next-prompt") {
      var reply =
          "Você selecionou " +
          item.need +
          ". Descreva brevemente o que aconteceu ou o que precisa. Esse texto será a descrição do chamado.",
        source = "local";
      try {
        reply = portalAI_(
          session,
          "Escreva uma frase curta em português reconhecendo a necessidade e pedindo uma descrição breve. Não acrescente perguntas, instruções técnicas, promessas ou outra classificação. Máximo 240 caracteres.",
          { area: item.area, necessidade: item.need },
          "reply",
          240,
        );
        source = "ai";
      } catch (error) {}
      return { status: 200, body: { reply: reply, source: source } };
    }
    var description = validateDescription_(body.description),
      answers = validateAnswers_(body.answers, item),
      optionAnswers = {};
    (item.fields || [])
      .filter((field) => field.type === "choice" && answers[field.id])
      .forEach((field) => (optionAnswers[field.label] = answers[field.id]));
    if (route === "/api/assist") {
      var allowTips = policy.selfHelpEligible(item, body.equipmentIntent || ""),
        review = { question: "", help: "", tips: [], coherent: true, reason: "" },
        origin = "local";
      try {
        review = safeAssist_(
          portalAIJson_(
            session,
            SMARTDESK_ASSIST_INSTRUCTION,
            {
              setor: body.sector,
              area: item.area,
              necessidade: item.need,
              tipo: policy.requestKind(item, body.equipmentIntent || ""),
              descricao: description,
              opcoes: optionAnswers,
              jaInformado: answeredForAI_(item, answers),
              dicasPermitidas: allowTips,
            },
            SMARTDESK_ASSIST_SCHEMA,
            0.3,
          ),
          allowTips,
          item,
          answers,
        );
        origin = "ai";
      } catch (error) {}
      return {
        status: 200,
        body: {
          question: review.question,
          help: review.help,
          tips: review.tips,
          coherent: review.coherent,
          reason: review.reason,
          source: origin,
          selectionId: item.id,
        },
      };
    }
    var subject = localSubject_(item),
      source = "local",
      fallback = false;
    try {
      var candidate = portalAI_(
        session,
        SMARTDESK_SUBJECT_INSTRUCTION,
        {
          setor: body.sector,
          area: item.area,
          necessidade: item.need,
          tipo: policy.requestKind(item, body.equipmentIntent || ""),
          descricao: description,
          opcoes: optionAnswers,
        },
        "subject",
        80,
      );
      if (!safeSubject_(candidate)) throw Error("Assunto inválido");
      subject = candidate;
      source = "ai";
    } catch (error) {
      fallback = true;
    }
    return {
      status: 200,
      body: { subject: subject, source: source, fallback: fallback, selectionId: item.id },
    };
  } catch (error) {
    return {
      status: error instanceof InvalidRequest ? error.status : 502,
      body: {
        error:
          error instanceof InvalidRequest
            ? error.message
            : "Não consegui confirmar a operação no Google. Seus dados continuam aqui; tente novamente.",
      },
    };
  }
}
