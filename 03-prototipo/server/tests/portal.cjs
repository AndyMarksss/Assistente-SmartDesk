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
                    text: JSON.stringify({
                      [field]:
                        field === "subject"
                          ? "Toner magenta para impressora"
                          : "Conte o que aconteceu para organizarmos seu chamado.",
                    }),
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
assert(ctx.smartdeskLogin("wrong").error);
const session = ctx.smartdeskLogin(props.SMARTDESK_PORTAL_PASSWORD).session;
assert.equal(session.length, 64);
const call = (route, body) => ctx.smartdeskCall(session, route, body);
assert.equal(call("/api/status").body.aiState, "standby");
assert.equal(call("/api/admin/tickets?mode=google").body.tickets.length, 5);
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
const browser = vm.createContext({
  window: {
    fetch: () => {
      throw Error("Fetch não deve ser usado no portal");
    },
    smartdeskPortalSession: Promise.resolve(session),
    google: {
      script: {
        run: {
          withSuccessHandler(handler) {
            this.ok = handler;
            return this;
          },
          withFailureHandler(handler) {
            this.fail = handler;
            return this;
          },
          smartdeskCall(token, route, body) {
            this.ok(ctx.smartdeskCall(token, route, body));
          },
        },
      },
    },
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
