"use strict";
const path = require("node:path");
const { InvalidRequest } = require("./request-body.cjs");
const policyContext = require("node:vm").createContext({ window: {} });
require("node:vm").runInContext(
  require("node:fs").readFileSync(path.join(__dirname, "../assets/js/request-policy.js"), "utf8"),
  policyContext,
);
const policy = policyContext.window.SmartDesk.requestPolicy;
function validateSelection(body, desk) {
  if (
    !body ||
    typeof body !== "object" ||
    typeof body.sector !== "string" ||
    !desk.flows.sectors.includes(body.sector)
  )
    throw new InvalidRequest("Selecione um setor cadastrado.");
  const item = desk.knowledgeBase.items.find(
    (item) => item.id === body.selectionId && desk.classifier.isAllowed(item, body.sector),
  );
  if (!item) throw new InvalidRequest("Selecione uma necessidade permitida para seu setor.");
  return item;
}
function validateDescription(description) {
  if (typeof description !== "string" || !description.trim() || description.length > 2000)
    throw new InvalidRequest("Informe uma descrição de até 2.000 caracteres.");
  if (!policy.usefulDescription(description))
    throw new InvalidRequest("Conte o problema ou pedido com suas palavras.");
  return description; // Preserve the original text: never substitute the model's interpretation.
}
function safeSubject(value) {
  if (typeof value !== "string") return null;
  const subject = value.trim();
  if (
    !subject ||
    subject.length > 80 ||
    /[\r\n<>\x00-\x1f]/.test(subject) ||
    /https?:\/\//i.test(subject)
  )
    return null;
  return subject;
}
function safeAssist(result, allowTips) {
  // A IA só sugere: uma pergunta de complemento (com dica de onde achar a resposta),
  // até três passos seguros e um alerta quando o relato não combina com o caminho.
  const clean = (value) =>
    typeof value === "string"
      ? value
          .replace(/[\x00-\x1f<>]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "";
  const links = /https?:\/\/|www\./i;
  let question = clean(result && result.pergunta);
  if (
    question.length < 8 ||
    question.length > 180 ||
    links.test(question) ||
    /senha|password|cpf|telefone|celular/i.test(question) ||
    // Nunca pedir nome de pessoas nem endereço de e-mail. A avaliação 0.11.3 pegou
    // "Qual é o nome do aluno…?" e "o nome completo e o e-mail institucional da professora".
    (/\bnomes?\b/i.test(question) &&
      /alun|respons|\bpai\b|m[ãa]e\b|pessoa|professor|funcion|usu[áa]ri|colaborador|estagi/i.test(
        question,
      )) ||
    /e-?mail (institucional|d[aeo]s?\s|para contato)|endere[çc]o de e-?mail/i.test(question)
  )
    question = "";
  let help = question ? clean(result && result.ajuda) : "";
  if (help.length < 8 || help.length > 180 || links.test(help)) help = "";
  const tips =
    allowTips && result && Array.isArray(result.dicas)
      ? result.dicas
          .map(clean)
          .filter((tip) => tip.length >= 6 && tip.length <= 160 && !links.test(tip))
          .slice(0, 3)
      : [];
  const coherent = !(result && result.coerente === false);
  let reason = coherent ? "" : clean(result && result.motivo);
  if (reason.length > 160 || links.test(reason)) reason = reason.slice(0, 157) + "…";
  return { question, help, tips, coherent, reason };
}
// Campos que a IA nunca preenche: contatos, contas e dados de alunos continuam com a pessoa.
const EXTRACT_SKIP = [
  "computador",
  "conta",
  "e-mail-da-conta",
  "usuario",
  "aluno",
  "aluno-turma",
  "responsavel",
  "email-responsavel",
  "contato-responsavel",
  "descricao-do-problema",
];
function extractableFields(item) {
  return (item.fields || []).filter(
    (field) => field.type !== "email" && !EXTRACT_SKIP.includes(field.id),
  );
}
function weekdayName(iso) {
  return [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ][new Date(iso + "T12:00:00Z").getUTCDay()];
}
function safeExtract(item, result) {
  // Só valores no formato do campo entram no rascunho; o resto será perguntado.
  const answers = {},
    allowed = extractableFields(item),
    list = result && Array.isArray(result.campos) ? result.campos : [];
  for (const entry of list) {
    const field = allowed.find((f) => f.id === (entry && entry.id));
    if (!field || answers[field.id] !== undefined) continue;
    const value = typeof entry.valor === "string" ? entry.valor.trim() : "";
    if (!value || value.length > 200 || /[<>]/.test(value)) continue;
    if (field.type === "choice" && !field.options.includes(value)) continue;
    if (field.type === "date") {
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        new Date(value + "T00:00:00Z").toISOString().slice(0, 10) !== value ||
        value < policy.localDay()
      )
        continue;
    }
    if (field.type === "time" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) continue;
    if (field.type === "url" && !/^https?:\/\/[^\s/?#]+(?:[/?#][^\s]*)?$/.test(value)) continue;
    answers[field.id] = value;
  }
  for (const field of item.fields || [])
    if (
      field.when &&
      answers[field.id] !== undefined &&
      answers[field.when.field] !== field.when.equals
    )
      delete answers[field.id];
  // Defeito x item novo só existe nos periféricos; em reservas e outros pedidos é ignorado.
  const intent =
    policy.asksEquipmentIntent(item) && result && ["repair", "purchase"].includes(result.intencao)
      ? result.intencao
      : "";
  return { answers, intent };
}
function localSubject(item) {
  return (
    item.area +
    " — " +
    item.need.replace(/\s*[—–]\s*confirmar.*$/i, "").replace(/\s*>\s*/g, " — ")
  ).slice(0, 80);
}
// Link combinado para depois (ex.: roteiro do evento ainda não pronto).
const PENDING_LINK = "Ainda não informado";
function validateAnswers(input, item) {
  const answers = input || {};
  if (
    typeof answers !== "object" ||
    Array.isArray(answers) ||
    Object.keys(answers).some((key) => !item.fields?.some((field) => field.id === key))
  )
    throw new InvalidRequest("Confira os detalhes da solicitação.");
  const result = {};
  for (const field of item.fields || []) {
    if (field.when && answers[field.when.field] !== field.when.equals) continue;
    const value = answers[field.id];
    if (typeof value !== "string" || !value.trim() || value.length > 1000)
      throw new InvalidRequest("Preencha: " + field.label);
    if (field.type === "choice" && !field.options.includes(value))
      throw new InvalidRequest("Selecione uma opção válida: " + field.label);
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      throw new InvalidRequest("Confira: " + field.label);
    if (
      field.type === "date" &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        Number.isNaN(Date.parse(value + "T00:00:00Z")) ||
        new Date(value + "T00:00:00Z").toISOString().slice(0, 10) !== value)
    )
      throw new InvalidRequest("Confira a data.");
    if (field.type === "date" && value < policy.localDay())
      throw new InvalidRequest("Escolha hoje ou uma data futura para o atendimento.");
    if (field.type === "time" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value))
      throw new InvalidRequest("Confira o horário.");
    if (field.type === "url" && value !== PENDING_LINK) {
      try {
        if (!["http:", "https:"].includes(new URL(value).protocol)) throw Error();
      } catch {
        throw new InvalidRequest("Informe um link válido.");
      }
    }
    result[field.id] = value;
  }
  return result;
}
// Teste com usuários (0.12): código do participante vindo do link (?p=P01).
function safeParticipant(value) {
  const code = typeof value === "string" ? value.trim().toUpperCase() : "";
  return /^P\d{2,3}$/.test(code) ? code : "";
}
// Métricas anônimas de um atendimento: só valores de listas fechadas, números, o número do
// chamado e um comentário curto. Nunca nome, e-mail ou o texto do relato.
const METRIC_OPTIONS = {
  stage: ["início", "identificação", "caminho", "resumo", "enviado", "resolvido sem chamado"],
  device: ["celular", "computador"],
  method: ["", "botões", "descrição", "descrição, depois botões"],
  aiDraft: [
    "",
    "aceito",
    "corrigiu os dados",
    "trocou pelo sugerido",
    "escolheu pelas opções",
    "sem IA",
    "não identificou",
  ],
  coherence: ["", "trocou o tipo", "manteve"],
  followUp: ["", "respondeu", "não sabia", "pulou"],
  tips: ["", "resolveu", "seguiu para o chamado"],
};
// Nome legível do caminho para a planilha (a validação guarda o ID, para poder ser refeita).
function metricPathLabel(id, desk) {
  const item = id ? desk.knowledgeBase.items.filter((entry) => entry.id === id)[0] : null;
  return item ? item.area + " › " + item.need : "";
}
function safeMetrics(body, desk) {
  if (
    !body ||
    typeof body !== "object" ||
    typeof body.sessionId !== "string" ||
    !/^[a-f0-9-]{36}$/i.test(body.sessionId)
  )
    throw new InvalidRequest("Sessão inválida.");
  const pick = (key) => {
    const value = typeof body[key] === "string" ? body[key] : "";
    if (METRIC_OPTIONS[key].indexOf(value) < 0) throw new InvalidRequest("Métrica inválida.");
    return value;
  };
  const whole = (value, max) =>
    typeof value === "number" && Math.floor(value) === value && value >= 0 && value <= max
      ? value
      : null;
  const item = body.path
    ? desk.knowledgeBase.items.filter((entry) => entry.id === body.path)[0]
    : null;
  if (body.path && !item) throw new InvalidRequest("Caminho inválido.");
  const backs = whole(body.backs, 500),
    ease = whole(body.ease, 5);
  return {
    sessionId: body.sessionId.toLowerCase(),
    participant: safeParticipant(body.participant),
    device: pick("device"),
    stage: pick("stage"),
    method: pick("method"),
    path: item ? item.id : "",
    aiDraft: pick("aiDraft"),
    coherence: pick("coherence"),
    followUp: pick("followUp"),
    tips: pick("tips"),
    backs: backs === null ? 0 : backs,
    ticket: typeof body.ticket === "string" && /^#\d{3,}$/.test(body.ticket) ? body.ticket : "",
    secondsToSend: whole(body.secondsToSend, 86400),
    ease: ease === null ? 0 : ease,
    comment:
      typeof body.comment === "string"
        ? body.comment
            .replace(/[\x00-\x1f<>]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 300)
        : "",
  };
}

module.exports = {
  policy,
  validateSelection,
  validateDescription,
  safeSubject,
  safeAssist,
  safeExtract,
  extractableFields,
  weekdayName,
  PENDING_LINK,
  localSubject,
  validateAnswers,
  safeParticipant,
  safeMetrics,
  metricPathLabel,
  METRIC_OPTIONS,
};
