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
    const field = payload.generationConfig.responseSchema.required[0];
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
                            pergunta: "Desde quando isso acontece?",
                            dicas: ["Retire a folha presa com cuidado.", "Veja http://exemplo.com"],
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
assert.equal(call("/api/admin/tickets?mode=google").body.tickets.length, 0);
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
const isolated = ctx.smartdeskStartSession_().session;
assert.equal(
  ctx.smartdeskCall(isolated, "/api/admin/tickets?mode=google", null).body.tickets.length,
  0,
);
assert.equal(
  ctx.smartdeskCall(isolated, "/api/admin/status", {
    mode: "google",
    requestId: body.requestId,
    status: "Finalizado",
    expectedStatus: "Em atendimento",
  }).status,
  403,
);
assert.equal(call("/api/admin/tickets?mode=google").body.tickets.length, 1);
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
