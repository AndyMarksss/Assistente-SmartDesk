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
assert(p.needsAuthorization({ need: "Outros" }, "Quero um headset novo"));
assert(!p.needsAuthorization({ need: "Não imprime" }, "Parou de imprimir ontem"));
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
  console.log(
    "Política de nomes Unicode, aquisição/troca, estados da IA e proteção contra perda de autorização em implantação antiga passaram.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
