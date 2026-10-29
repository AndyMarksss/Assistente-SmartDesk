const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  assert = require("node:assert/strict");
const proto = path.resolve(__dirname, "../..");
const ctx = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(proto, "assets/js/request-policy.js"), "utf8"), ctx);
const p = ctx.window.SmartDesk.requestPolicy;
for (const name of [
  "Élodie D’Arcy",
  "João de Sá",
  "Ana-Maria O'Neill",
  "李 小龍",
  "Nga Nguyễn",
  "A B",
])
  assert(p.fullName(name), name);
for (const name of ["Andy", "de da", "Ana 123", "<Ana Silva>", ""]) assert(!p.fullName(name), name);
assert(!p.needsAuthorization({ id: "AV-007", need: "Troca de cabo HDMI" }, "Quero um cabo novo"));
assert(!p.needsAuthorization({ need: "COMPUTADOR > Troca de Mouse" }, "Trocar mouse", "repair"));
assert(p.needsAuthorization({ need: "COMPUTADOR > Troca de Mouse" }, "", "purchase"));
assert(p.needsAuthorization({ id: "TI-003", need: "Outros" }, "Quero um headset novo"));
assert(!p.needsAuthorization({ need: "Não imprime" }, "Parou de imprimir ontem"));
// 0.12.18: defeito com um segundo pedido de compra no relato não pede aval.
assert(
  !p.needsAuthorization(
    { id: "IMP-008", need: "Papel Atolado" },
    "Papel atolado e também preciso de um mouse novo",
  ),
);
// 0.12.3 — conferências locais: equipamento a mais no relato e evento respondido "Não".
vm.runInContext(fs.readFileSync(path.join(proto, "assets/js/knowledge-base.js"), "utf8"), ctx);
const kbItems = ctx.window.SmartDesk.knowledgeBase.items,
  av = (id) => kbItems.find((item) => item.id === id),
  fuller = (id, texts) => {
    const found = p.fullerItem(av(id), texts, kbItems);
    return found ? found.item.id + " +" + found.extra.join(",") : "";
  };
assert.equal(
  fuller("AV-001", [
    "Teremos um evento na quinta, a palestrante solicitou o sistema de som",
    "Não só caixa de som, preciso de microfone também",
  ]),
  "AV-002 +microfone",
);
assert.equal(fuller("AV-001", ["som e projetor no auditório, sem microfone"]), "AV-004 +projetor");
assert.equal(
  fuller("AV-006", ["projetor, caixa de som e microfone"]),
  "AV-003 +caixa de som,microfone",
);
assert.equal(fuller("AV-001", ["sistema de som; não vamos precisar de microfone"]), "");
assert.equal(fuller("AV-002", ["só a caixa de som, somente isso"]), "");
assert.equal(fuller("AV-007", ["o cabo HDMI não passa som"]), "");
assert(p.eventMismatch(av("AV-001"), { evento: "Não" }, ["Teremos um evento na quinta"]));
assert(!p.eventMismatch(av("AV-001"), { evento: "Não" }, ["Não é um evento, é uma aula"]));
assert(!p.eventMismatch(av("AV-001"), { evento: "Sim" }, ["Teremos um evento"]));
assert(!p.eventMismatch(av("AV-001"), { evento: "Não" }, ["Aula de música na sala 3"]));
const { createProvider } = require(path.join(proto, "server/ai-provider.cjs"));
let release;
const fake = createProvider({
  env: { GEMINI_API_KEY: "ficticia" },
  fetchImpl: () => new Promise((resolve) => (release = resolve)),
});
assert.equal(fake.status(), "standby");
const attempt = fake.subject({});
assert.equal(fake.status(), "busy");
release({
  ok: true,
  json: async () => ({ candidates: [{ content: { parts: [{ text: '{"subject":"Mouse"}' }] } }] }),
});
(async () => {
  await attempt;
  assert.equal(fake.status(), "online");
  const offline = createProvider({
    env: { GEMINI_API_KEY: "ficticia" },
    fetchImpl: async () => {
      throw Error("offline");
    },
  });
  await assert.rejects(offline.subject({}));
  assert.equal(offline.status(), "unavailable");
  assert.equal(createProvider({ env: {} }).status(), "absent");
  const { createStorage } = require(path.join(proto, "server/google-storage.cjs"));
  let posted = false;
  const old = createStorage({
    env: {
      SMARTDESK_APPS_SCRIPT_URL: "https://script.google.com/macros/s/ficticio/exec",
      SMARTDESK_APPS_SCRIPT_TOKEN: "a".repeat(32),
    },
    fetchImpl: async (url, opts) => {
      if (opts.method) posted = true;
      return { ok: true, json: async () => ({ version: "0.7.0" }) };
    },
  });
  await assert.rejects(
    old.submit({ email: "test@example.com", authorization: { status: "pending", by: "" } }),
    (e) => e.requiresUpgrade === true,
  );
  assert(!posted);
  // 0.12: receptor 0.10+ também aceita e-mail (antes a regra só aceitava 0.7 a 0.9).
  let postedCurrent = false;
  const current = createStorage({
    env: {
      SMARTDESK_APPS_SCRIPT_URL: "https://script.google.com/macros/s/ficticio/exec",
      SMARTDESK_APPS_SCRIPT_TOKEN: "a".repeat(32),
    },
    fetchImpl: async (url, opts) => {
      if (!opts.method)
        return { ok: true, json: async () => ({ version: "0.11.4", features: ["authorization"] }) };
      postedCurrent = true;
      return {
        ok: true,
        json: async () => ({
          ok: true,
          number: "#001",
          requestId: "r",
          attachmentCount: 0,
          notice: "sent",
        }),
      };
    },
  });
  const sentReceipt = await current.submit({ email: "test@example.com", requestId: "r" });
  assert.equal(sentReceipt.number, "#001");
  assert.equal(sentReceipt.emailSent, true); // 0.13.0: o recibo diz se o ticket foi por e-mail
  assert(postedCurrent);
  console.log(
    "Política de nomes Unicode, aquisição/troca, estados da IA e proteção contra perda de autorização em implantação antiga passaram.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
