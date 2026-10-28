"use strict";
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const { ctx, props } = require("./apps-script.cjs");
const proto = path.resolve(__dirname, "../..");
const cached = new Map();
let remote = [],
  failAI = false;
ctx.CacheService = {
  getScriptCache: () => ({
    get: (key) => cached.get(key) || null,
    put: (key, value) => cached.set(key, value),
    remove: (key) => cached.delete(key),
  }),
};
ctx.Utilities.formatDate = (now) =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
ctx.ContentService = {
  MimeType: { JSON: "json" },
  createTextOutput: (text) => ({ setMimeType: () => ({ getContent: () => text }) }),
};
ctx.ScriptApp = {
  getService: () => ({ getUrl: () => "https://script.google.com/macros/s/EXAMPLE_TEST/exec" }),
};
ctx.HtmlService = {
  createTemplateFromFile: (name) => ({
    evaluate: () => ({ setTitle: () => ({ addMetaTag: () => ({ file: name }) }) }),
  }),
};
ctx.UrlFetchApp = {
  fetch: (url, options) => {
    const payload = JSON.parse(options.payload);
    remote.push(payload);
    const schema = payload.generationConfig.responseSchema,
      field = schema.properties.pergunta
        ? "pergunta"
        : schema.properties.campos
          ? "campos"
          : schema.required[0];
    return {
      getResponseCode: () => (failAI ? 429 : 200),
      getContentText: () =>
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify(
                      field === "pergunta"
                        ? {
                            coerente: true,
                            pergunta: "Desde quando isso acontece?",
                            ajuda:
                              "Veja no visor da impressora; se não houver visor, confira a gaveta.",
                            dicas: ["Retire a folha presa com cuidado.", "Veja http://exemplo.com"],
                          }
                        : field === "campos"
                          ? {
                              campos: [
                                { id: "data", valor: "2099-10-16" },
                                { id: "horario", valor: "25:00" },
                                { id: "evento", valor: "Sim" },
                              ],
                              intencao: "",
                            }
                          : field === "itemIds"
                            ? { itemIds: ["IMP-008", "TI-QB-001"] }
                            : {
                                [field]:
                                  field === "subject"
                                    ? "Toner magenta para impressora"
                                    : "Conte o que aconteceu para organizarmos seu chamado.",
                              },
                    ),
                  },
                ],
              },
            },
          ],
        }),
    };
  },
};
props.SMARTDESK_PORTAL_PASSWORD = "synthetic-test-access-123456";
props.GEMINI_API_KEY = "synthetic-key-not-real";
for (const file of ["PortalShared.gs", "Portal.gs"])
  vm.runInContext(fs.readFileSync(path.join(proto, "integracoes/apps-script", file), "utf8"), ctx);
assert.equal(ctx.smartdeskCall("invalid", "/api/status", null).status, 401);

const session = ctx.smartdeskStartSession_().session;
assert.equal(session.length, 64);
const call = (route, body) => ctx.smartdeskCall(session, route, body);
assert.equal(call("/api/status").body.aiState, "standby");
// Chamados já gravados por outras pessoas aparecem, sempre abreviados para esta sessão.
const earlier = call("/api/admin/tickets?mode=google").body.tickets;
assert(earlier.every((t) => t.masked && !/^[^•]+@/.test(t.email || "")));
assert.equal(call("/api/admin/seed", { mode: "google" }).status, 400);
assert.equal(call("/api/admin/seed", { mode: "demo" }).body.tickets.length, 12);
assert.equal(call("/api/admin/seed", { mode: "demo" }).body.tickets.length, 12);
assert.equal(
  call("/api/admin/status", {
    mode: "demo",
    requestId: "sim-1",
    status: "Em atendimento",
    expectedStatus: "wrong",
  }).status,
  409,
);
assert.equal(
  call("/api/admin/status", {
    mode: "demo",
    requestId: "sim-1",
    status: "Em atendimento",
    expectedStatus: "Novos chamados",
  }).status,
  200,
);
const desk = ctx.window.SmartDesk;
assert.equal(desk.knowledgeBase.items.length, 57);
assert.equal(desk.flows.sectors.length, 25);
for (const item of desk.knowledgeBase.items)
  for (const sector of desk.flows.sectors) {
    const allowed = desk.classifier.isAllowed(item, sector);
    if (allowed)
      assert.equal(ctx.validateSelection_({ selectionId: item.id, sector }, desk).id, item.id);
    else assert.throws(() => ctx.validateSelection_({ selectionId: item.id, sector }, desk));
  }
const sampleAnswers = (item) => {
  const answers = {};
  for (const field of item.fields) {
    if (field.when && answers[field.when.field] !== field.when.equals) continue;
    answers[field.id] =
      field.type === "choice"
        ? field.options[0]
        : field.type === "date"
          ? "2050-10-05"
          : field.type === "time"
            ? "09:30"
            : field.type === "email"
              ? "teste@example.com"
              : field.type === "url"
                ? "https://example.com/roteiro"
                : "Informação fictícia";
  }
  return answers;
};
for (const item of desk.knowledgeBase.items)
  assert.equal(typeof ctx.validateAnswers_(sampleAnswers(item), item), "object");
const item = desk.knowledgeBase.items.find((i) => i.id === "IMP-010");
const body = {
  name: "Pessoa Fictícia",
  email: "ficticio@example.com",
  requestId: crypto.randomUUID(),
  selectionId: item.id,
  sector: "Secretaria",
  description: "TESTE ACADÊMICO: preciso de toner magenta.",
  answers: { cor: "Magenta", modelo: "Impressora fictícia" },
  attachments: [{ name: "teste.txt", base64: Buffer.from("Anexo fictício").toString("base64") }],
  subject: "Toner magenta",
};
assert.equal(call("/api/next-prompt", body).body.source, "ai");
assert.equal(call("/api/subject", body).body.source, "ai");
assert.equal(call("/api/status").body.aiState, "online");
assert(!JSON.stringify(remote).includes(body.name));
assert(!JSON.stringify(remote).includes(body.email));
assert(!JSON.stringify(remote).includes("Anexo fictício"));
failAI = true;
assert.equal(call("/api/subject", body).body.source, "local");
assert.equal(call("/api/status").body.aiState, "unavailable");
failAI = false;
const receipt = call("/api/tickets", body);
assert.equal(receipt.status, 201);
assert.equal(receipt.body.number, "#006");
// O recibo do portal precisa seguir o contrato do chat: status, mesmo ID e número.
assert.equal(receipt.body.status, "enviado");
assert.equal(receipt.body.requestId, body.requestId);
assert.equal(call("/api/tickets", body).body.number, "#006");
assert.equal(call("/api/tickets", { ...body, name: "Pessoa" }).status, 400);
assert.equal(call("/api/tickets", { ...body, email: "invalid" }).status, 400);
assert.equal(
  call("/api/tickets", { ...body, attachments: [{ name: "evil.exe", base64: "Zg==" }] }).status,
  400,
);
assert.equal(call("/api/tickets", { ...body, description: "123456" }).status, 400);
assert.equal(
  call("/api/admin/status", {
    mode: "google",
    requestId: body.requestId,
    status: "Em atendimento",
    expectedStatus: "Novos chamados",
  }).status,
  200,
);
assert.equal(
  call("/api/admin/tickets?mode=google").body.tickets.find((t) => t.requestId === body.requestId)
    .description,
  body.description,
);
assert.equal(
  JSON.parse(ctx.doGet({ parameter: { page: "chat" } }).getContent()).service,
  "SmartDesk",
);
// 0.12.16: outra aba vê todos os chamados, com nome e e-mail abreviados e anexos sem endereço,
// e pode mudar a etapa; quem enviou continua vendo os dados completos.
const isolated = ctx.smartdeskStartSession_().session;
const publicList = ctx.smartdeskCall(isolated, "/api/admin/tickets?mode=google", null).body.tickets;
assert.equal(publicList.length, earlier.length + 1);
const seen = publicList.find((t) => t.requestId === body.requestId);
assert.equal(seen.masked, true);
assert.equal(seen.name, "Pessoa F.");
assert.equal(seen.email, "fi•••@example.com");
assert(seen.attachments.length && !seen.attachments.some(Boolean));
assert.equal(
  ctx.smartdeskCall(isolated, "/api/admin/status", {
    mode: "google",
    requestId: body.requestId,
    status: "Finalizado",
    expectedStatus: "Em atendimento",
  }).status,
  200,
);
const mine = call("/api/admin/tickets?mode=google").body.tickets.find(
  (t) => t.requestId === body.requestId,
);
assert.equal(mine.email, body.email);
assert(!mine.masked);
assert.equal(
  call("/api/admin/status", {
    mode: "google",
    requestId: body.requestId,
    status: "Em atendimento",
    expectedStatus: "Finalizado",
  }).status,
  200,
);
// A listagem pública traz as etapas: sem elas o painel não monta as colunas.
assert.equal(call("/api/admin/tickets?mode=google").body.stages.length, 7);
// 0.10: revisão da IA, sugestão de caminho, cotas e conferência do conteúdo dos anexos.
const jam = desk.knowledgeBase.items.find((i) => i.id === "IMP-008");
const jamBody = {
  sector: "Secretaria",
  selectionId: jam.id,
  description: "A folha fica presa na saída.",
  answers: sampleAnswers(jam),
};
remote = [];
let review = call("/api/assist", jamBody).body;
assert.equal(review.source, "ai");
assert.equal(review.question, "Desde quando isso acontece?");
assert.equal(JSON.stringify(review.tips), JSON.stringify(["Retire a folha presa com cuidado."]));
assert(JSON.parse(remote[0].contents[0].parts[0].text).dicasPermitidas === true);
assert(!JSON.stringify(remote).includes("Informação fictícia"));
const reset = desk.knowledgeBase.items.find((i) => i.id === "GOO-011");
review = call("/api/assist", {
  sector: "Secretaria",
  selectionId: reset.id,
  description: "Esqueci minha senha do e-mail.",
  answers: sampleAnswers(reset),
}).body;
assert.equal(review.tips.length, 0);
// A IA só pode sugerir caminhos permitidos ao setor; resposta fora da lista cai na base local.
let analysis = call("/api/analyze", {
  description: "papel preso na impressora",
  sector: "Secretaria",
});
assert.equal(analysis.status, 200);
assert.equal(analysis.body.source, "local");
assert(analysis.body.candidates.every((c) => c.item.id !== "TI-QB-001"));
// No Financeiro os dois IDs são permitidos: a resposta da IA vale e usa a instrução compartilhada.
analysis = call("/api/analyze", { description: "o QuickBooks não abre", sector: "Financeiro" });
assert.equal(analysis.body.source, "ai");
assert.equal(
  JSON.stringify(analysis.body.candidates.map((c) => c.item.id)),
  JSON.stringify(["IMP-008", "TI-QB-001"]),
);
const analyzeRequest = JSON.stringify(remote[remote.length - 1]);
assert(analyzeRequest.includes("Glossário da escola"));
assert(analyzeRequest.includes("QUICKBOOKS > Erro no sistema"));
assert.equal(
  call("/api/analyze", { description: "x".repeat(2001), sector: "Secretaria" }).status,
  400,
);
// Cotas por sessão: chamados novos e chamadas de IA.
const quota = ctx.smartdeskStartSession_().session;
const quotaCall = (route, payload) => ctx.smartdeskCall(quota, route, payload);
const first = { ...body, requestId: crypto.randomUUID(), attachments: [] };
for (let i = 0; i < 5; i++)
  assert.equal(
    quotaCall("/api/tickets", i ? { ...first, requestId: crypto.randomUUID() } : first).status,
    201,
  );
assert.equal(quotaCall("/api/tickets", { ...first, requestId: crypto.randomUUID() }).status, 429);
assert.equal(quotaCall("/api/tickets", first).status, 201); // repetir o mesmo envio não consome cota
for (let i = 0; i < 40; i++) quotaCall("/api/subject", body);
assert.equal(quotaCall("/api/subject", body).body.source, "local");
assert.equal(quotaCall("/api/status").body.aiState === "unavailable", false);
// Anexos públicos: quantidade, tamanho e conteúdo coerente com a extensão.
const fresh = () => ({ ...body, requestId: crypto.randomUUID() });
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]).toString("base64");
assert.equal(
  call("/api/tickets", { ...fresh(), attachments: [{ name: "foto.png", base64: png }] }).status,
  201,
);
assert.equal(
  call("/api/tickets", {
    ...fresh(),
    attachments: [{ name: "foto.png", base64: Buffer.from("não é imagem").toString("base64") }],
  }).status,
  400,
);
assert.equal(
  call("/api/tickets", {
    ...fresh(),
    attachments: Array.from({ length: 4 }, (_, i) => ({ name: i + ".png", base64: png })),
  }).status,
  400,
);
assert.equal(call("/api/status").body.limits.files, 3);
// 0.11: rascunho pela IA, revisão com ajuda e tipo, roteiro depois, acompanhamento e autoatendimento.
const av3 = desk.knowledgeBase.items.find((i) => i.id === "AV-003");
const draft = call("/api/extract", {
  sector: "Secretaria",
  selectionId: av3.id,
  description: "Evento na sexta-feira, preciso de som, microfone e projetor.",
}).body;
assert.equal(draft.source, "ai");
// Horário fora do formato é descartado; data e opção válidas entram no rascunho.
assert.equal(JSON.stringify(draft.answers), JSON.stringify({ data: "2099-10-16", evento: "Sim" }));
remote = [];
const helped = call("/api/assist", jamBody).body;
assert(helped.help.includes("visor") && helped.coherent === true);
const sent = JSON.parse(remote[0].contents[0].parts[0].text);
assert.equal(sent.tipo, "problema");
assert(sent.jaInformado.includes("Modelo da impressora (respondido)"));
assert(!JSON.stringify(sent).includes("Informação fictícia"));
remote = [];
call("/api/assist", {
  sector: "Secretaria",
  selectionId: av3.id,
  answers: { data: "2099-10-16", horario: "09:30", evento: "Não" },
  description: "Palestra no auditório para 80 pessoas.",
});
assert.equal(JSON.parse(remote[0].contents[0].parts[0].text).tipo, "solicitação");
assert.equal(
  typeof ctx.validateAnswers_(
    { data: "2099-10-16", horario: "09:30", evento: "Sim", roteiro: "Ainda não informado" },
    av3,
  ),
  "object",
);
const tracked = call("/api/track", { number: "6", email: "FICTICIO@example.com" }).body.ticket;
assert.equal(tracked.number, "#006");
assert.equal(tracked.status, "Em atendimento");
assert(!("description" in tracked) && !("email" in tracked) && !("name" in tracked));
assert.equal(call("/api/track", { number: "#006", email: "outra@example.com" }).body.ticket, null);
assert.equal(call("/api/track", { number: "abc", email: "x" }).status, 400);
assert.equal(
  call("/api/selfhelp", { sector: "Secretaria", selectionId: "IMP-008", outcome: "resolved" }).body
    .stored,
  true,
);
assert.equal(
  call("/api/selfhelp", { sector: "Secretaria", selectionId: "IMP-008", outcome: "x" }).status,
  400,
);
assert.equal(call("/api/admin/tickets?mode=google").body.selfHelp.resolved, 1);
assert.equal(call("/api/admin/tickets?mode=demo").body.selfHelp.simulation, true);
// 0.12: métricas anônimas do atendimento numa linha por sessão (aba Sessões).
const metricSession = crypto.randomUUID(),
  metric = {
    sessionId: metricSession,
    participant: "p04",
    device: "celular",
    stage: "caminho",
    method: "descrição",
    path: "IMP-008",
    aiDraft: "aceito",
    coherence: "",
    followUp: "",
    tips: "",
    backs: 1,
    ticket: "",
    secondsToSend: null,
    ease: 0,
    comment: "",
    name: "Nome que não deve ir",
  };
assert.equal(call("/api/metrics", metric).body.stored, true);
assert.equal(
  call("/api/metrics", {
    ...metric,
    stage: "enviado",
    ticket: "#009",
    secondsToSend: 140,
    ease: 4,
    comment: "Faltou <b>ver</b> o horário",
  }).body.stored,
  true,
);
const sessions = ctx.SpreadsheetApp.openById().getSheetByName("Sessões");
assert.equal(sessions.getLastRow(), 2); // a segunda chamada atualizou a mesma linha
const saved = sessions.getRange(2, 1, 1, 18).getValues()[0];
assert.equal(saved[0], metricSession);
assert.equal(saved[1], "P04");
assert.equal(saved[5], "enviado");
assert.equal(saved[7], "Impressora › Papel Atolado");
assert.equal(saved[13], "#009");
assert.equal(saved[15], "4");
assert(!saved.join(" ").includes("Nome que não deve ir") && !saved[16].includes("<"));
assert.equal(saved[17], "Pages");
assert.equal(call("/api/metrics", { ...metric, stage: "inventada" }).status, 400);
assert.equal(call("/api/metrics", { ...metric, sessionId: "x" }).status, 400);
assert.equal(call("/api/metrics", { ...metric, path: "NAO-EXISTE" }).status, 400);
// Limitador por minuto: a janela é uma chave própria e não bloqueia o minuto seguinte.
const minuteKey = "portal:session-starts:" + Math.floor(Date.now() / 60000);
const before = cached.get(minuteKey);
cached.set(minuteKey, "100");
assert(ctx.smartdeskStartSession_().error);
if (before === undefined) cached.delete(minuteKey);
else cached.set(minuteKey, before);
const browser = vm.createContext({
  window: {
    fetch: () => {
      throw Error("Fetch não deve ser usado no portal");
    },
    smartdeskGetSession: async () => session,
    smartdeskRemote: async (route, body) => ctx.smartdeskCall(body.session, route, body.payload),
    smartdeskPortalExpired: () => {},
  },
  setTimeout,
  clearTimeout,
  AbortSignal,
});
vm.runInContext(fs.readFileSync(path.join(proto, "assets/js/client-api.js"), "utf8"), browser);
(async () => {
  const result = await browser.window.SmartDesk.api.request("/api/status");
  assert.equal(typeof result.aiReady, "boolean");
  await assert.rejects(
    browser.window.SmartDesk.api.request("/api/invalid"),
    (e) => e.status === 404,
  );
  console.log(
    "Portal Apps Script: sessão, 57×25 regras, IA sem contatos/anexos, envio idempotente, Drive, gestão/demo, transporte local e regras compartilhadas aprovados. Somente serviços simulados.",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
module.exports = { ctx, props, session, call };
