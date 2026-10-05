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
function localSubject(item) {
  return (
    item.area +
    " — " +
    item.need.replace(/\s*[—–]\s*confirmar.*$/i, "").replace(/\s*>\s*/g, " — ")
  ).slice(0, 80);
}
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
    if (field.type === "url") {
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

module.exports = {
  policy,
  validateSelection,
  validateDescription,
  safeSubject,
  localSubject,
  validateAnswers,
};
