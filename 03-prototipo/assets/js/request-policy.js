"use strict";
(function (desk) {
  const fullName = (value) =>
    typeof value === "string" &&
    value.trim().length <= 100 &&
    /^[\p{L}\p{M}]+(?:[’'\-][\p{L}\p{M}]+)*(?:\s+[\p{L}\p{M}]+(?:[’'\-][\p{L}\p{M}]+)*)+$/u.test(
      value.trim(),
    ) &&
    value
      .trim()
      .split(/\s+/)
      .filter((p) => !["de", "da", "do", "das", "dos", "e"].includes(p.toLowerCase())).length >= 2;
  const isRoutineMaintenance = (item) => item.id === "AV-007" || /cabo\s+hdmi/i.test(item.need);
  const asksEquipmentIntent = (item) =>
    ["TI-COMP-001", "TI-COMP-007", "TI-COMP-008"].includes(item.id);
  // Toner e tinta são reposição de rotina: "comprar toner" no relato não pede aval da liderança.
  const ROUTINE_SUPPLY = ["IMP-010"];
  const needsAuthorization = (item, description = "", intent = "") => {
    if (isRoutineMaintenance(item) || ROUTINE_SUPPLY.includes(item.id) || intent === "repair")
      return false;
    if (intent === "purchase") return true;
    // Defeito não é compra: um relato com dois pedidos ("papel atolado e preciso de um mouse
    // novo") pedia aval no chamado da impressora. O item novo vai no chamado dele.
    if (requestKind(item, intent) === "problema" && !asksEquipmentIntent(item)) return false;
    const text = description
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (
      /\b(nao|sem)\s+(preciso|quero|necessidade de)?\s*(comprar|compra|adquirir|aquisicao)\b/.test(
        text,
      )
    )
      return false;
    return (
      /\b(comprar|compra|adquirir|aquisicao)\b/.test(text) ||
      /\b(quero|preciso|solicito|solicitar)\b.{0,50}\b(teclado|mouse|headset|fone|notebook|computador|monitor|equipamento|kit)\b.{0,40}\b(novo|nova|novos|novas|sem fio)\b/.test(
        text,
      )
    );
  };
  function localDay(now = new Date()) {
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  }
  function localTime(now = new Date()) {
    return (
      String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0")
    );
  }
  // Horário de um atendimento marcado para hoje: não pode ser um horário que já passou.
  const pastTimeToday = (date, time, today = localDay(), now = localTime()) =>
    !!date && !!time && date === today && time < now;
  // Telefone com DDD: só dígitos, espaços, parênteses, hífen, ponto e +, com 10 a 13 dígitos.
  const phoneValue = (raw) => {
    const v = String(raw || "").trim(),
      digits = v.replace(/\D/g, "");
    return /^[+()\d\s.-]+$/.test(v) && digits.length >= 10 && digits.length <= 13 ? v : null;
  };
  function dateValue(raw) {
    const v = String(raw).trim();
    let m = v.match(/^(\d{2})[/. -](\d{2})[/. -](\d{4})$/) || v.match(/^(\d{2})(\d{2})(\d{4})$/);
    const iso = m ? m[3] + "-" + m[2] + "-" + m[1] : v;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const d = new Date(iso + "T12:00:00Z");
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso ? iso : null;
  }
  function timeValue(raw) {
    const v = String(raw).trim();
    const m = v.match(/^(\d{1,2})[:h](\d{2})$/i) || v.match(/^(\d{2})(\d{2})$/);
    if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return null;
    return m[1].padStart(2, "0") + ":" + m[2];
  }
  const usefulDescription = (value) =>
    typeof value === "string" && (value.match(/[\p{L}]/gu) || []).length >= 3;
  // Defeitos que a própria pessoa pode tentar contornar com segurança. Reservas, compras,
  // acessos, senhas e instalações seguem direto para a equipe, sem dicas da IA.
  const SELF_HELP = [
    "AV-007",
    "IMP-002",
    "IMP-005",
    "IMP-006",
    "IMP-007",
    "IMP-008",
    "IMP-009",
    "GOO-001",
    "GOO-002",
    "GOO-003",
    "GOO-004",
    "GOO-005",
    "GOO-007",
    "GOO-008",
    "GOO-009",
    "GOO-012",
    "TI-COMP-001",
    "TI-COMP-002",
    "TI-COMP-003",
    "TI-COMP-004",
    "TI-COMP-005",
    "TI-COMP-007",
    "TI-COMP-008",
    "TI-NET-001",
    "TI-NET-003",
    "TI-MENT-002",
    "TI-MENT-005",
    "TI-QB-001",
  ];
  const selfHelpEligible = (item, intent = "") =>
    !!item && SELF_HELP.includes(item.id) && intent !== "purchase";
  // Pedidos (reservas, instalações, acessos, criações) não são defeitos: a IA não deve
  // perguntar "qual é o problema" nem sugerir consertos nesses caminhos.
  const REQUESTS = [
    "AV-001",
    "AV-002",
    "AV-003",
    "AV-004",
    "AV-005",
    "AV-006",
    "IMP-001",
    "IMP-003",
    "IMP-010",
    "GOO-010",
    "GOO-011",
    "TI-002",
    "TI-COMP-006",
    "TI-NET-002",
    "TI-INT-001",
    "TI-INT-002",
    "TI-INT-003",
    "TI-MENT-001",
    "TI-MENT-003",
    "TI-MENT-004",
    "TI-MENT-006",
    "TI-MENT-007",
    "TI-MENT-008",
    "TI-QB-002",
    "TI-CAM-001",
  ];
  // Dúvidas da TI e do Google são perguntas, não defeitos.
  const QUESTIONS = ["TI-001", "GOO-006"];
  const requestKind = (item, intent = "") =>
    !item
      ? "outro"
      : QUESTIONS.includes(item.id)
        ? "dúvida"
        : item.id === "TI-003"
          ? "outro"
          : intent === "purchase" || REQUESTS.includes(item.id)
            ? "solicitação"
            : "problema";
  // Conferências locais do pedido, sem IA. Audiovisual: cada tipo é uma combinação de
  // equipamentos; se o relato ou as respostas citam um que o tipo escolhido não tem ("preciso
  // de microfone também"), sugere o tipo que junta tudo — nunca tira nada do pedido.
  const plain = (text) =>
    String(text || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  const EQUIPMENT = {
    som: {
      name: "caixa de som",
      label: /caixa de som/,
      said: /\b(caixas? de som|caixinhas? de som|som|sonorizacao|audio|amplificador(es)?)\b/,
    },
    microfone: { name: "microfone", label: /microfone/, said: /\b(microfones?|mics?|lapela)\b/ },
    projetor: {
      name: "projetor",
      label: /projetor/,
      said: /\b(projetor(es)?|projecao|datashow|data show|telao)\b/,
    },
  };
  const NO_EQUIPMENT =
    /\b(?:sem|nao\s+(?:precis\w*|vou precisar|vamos precisar|quero|queremos|vou usar|vamos usar|usaremos|usarei))(?:\s+(?:de|do|da|dos|das|o|a|os|as|um|uma|nenhum|nenhuma))*\s+(?:caixas? de som|som|microfones?|projetor(?:es)?|datashow|telao)\b/g;
  function equipmentOf(item) {
    if (!item || item.area !== "Audiovisual") return null;
    const kinds = plain(item.need)
      .split("/")
      .map((part) => Object.keys(EQUIPMENT).find((kind) => EQUIPMENT[kind].label.test(part)));
    return kinds.every(Boolean) ? kinds : null;
  }
  function fullerItem(item, texts, items) {
    const current = equipmentOf(item);
    if (!current) return null;
    const said = plain(texts.join("\n")).replace(NO_EQUIPMENT, " "),
      wanted = new Set(current);
    for (const kind of Object.keys(EQUIPMENT))
      if (EQUIPMENT[kind].said.test(said)) wanted.add(kind);
    if (wanted.size === current.length) return null;
    const match = items.find((other) => {
      const kinds = equipmentOf(other);
      return kinds && kinds.length === wanted.size && kinds.every((kind) => wanted.has(kind));
    });
    return match
      ? {
          item: match,
          extra: [...wanted]
            .filter((kind) => !current.includes(kind))
            .map((k) => EQUIPMENT[k].name),
        }
      : null;
  }
  // "É para um evento?" respondido "Não" quando o próprio relato fala em evento.
  const NOT_EVENT = /\bnao\s+(?:e|sera|vai ser)\s+(?:(?:um|uma|para|pra|de)\s+)*eventos?\b/g;
  const eventMismatch = (item, answers, texts) =>
    !!item &&
    (item.fields || []).some((field) => field.id === "evento") &&
    answers.evento === "Não" &&
    /\beventos?\b/.test(plain(texts.join("\n")).replace(NOT_EVENT, " "));
  // Relato livre que a IA não ligou a nenhum caminho: assuntos de outras equipes da escola,
  // para orientar a pessoa em vez de só voltar às opções.
  const OTHER_TEAMS = [
    [
      /\b(ar[- ]?condicionado|lampadas? (da sala|do teto|queimad\w*)|vazamento|goteira|torneira|descarga|encanamento|moveis|cadeiras?|armarios?|limpeza|pintura|disjuntor|fiacao)\b/,
      "da manutenção do prédio",
    ],
    [
      /\b(ferias|holerite|contracheque|salario|folha de ponto|bater ponto|beneficios?|rh)\b/,
      "do RH",
    ],
    [
      /\b(matriculas?|rematriculas?|mensalidades?|boletos?|historico escolar|declaracao escolar|uniformes?)\b/,
      "da Secretaria ou do Financeiro",
    ],
  ];
  const otherTeam = (text) =>
    (OTHER_TEAMS.find(([pattern]) => pattern.test(plain(text))) || [])[1] || "";
  desk.requestPolicy = {
    otherTeam,
    localTime,
    pastTimeToday,
    phoneValue,
    fullerItem,
    eventMismatch,
    selfHelpEligible,
    requestKind,
    dateValue,
    timeValue,
    localDay,
    usefulDescription,
    fullName,
    needsAuthorization,
    asksEquipmentIntent,
    isRoutineMaintenance,
  };
})((window.SmartDesk = window.SmartDesk || {}));
