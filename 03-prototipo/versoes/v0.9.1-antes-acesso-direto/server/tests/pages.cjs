"use strict";
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  crypto = require("node:crypto");
const { ctx, props, session } = require("./portal.cjs"),
  proto = path.resolve(__dirname, "../..");
ctx.HtmlService = {
  XFrameOptionsMode: { ALLOWALL: "allow" },
  createHtmlOutput: (html) => ({
    html,
    setXFrameOptionsMode(mode) {
      this.mode = mode;
      return this;
    },
  }),
};
vm.runInContext(fs.readFileSync(path.join(proto, "integracoes/apps-script/Pages.gs"), "utf8"), ctx);
const id = "b".repeat(64),
  origin = "https://andymarksss.github.io";
function post(route, body, changes = {}) {
  return ctx.doPost({
    parameter: {
      smartdesk: JSON.stringify({
        protocol: "smartdesk-pages-v1",
        id,
        origin,
        route,
        body,
        ...changes,
      }),
    },
  });
}
function packet(response) {
  let msg;
  vm.runInNewContext(response.html.match(/<script>([\s\S]*)<\/script>/)[1], {
    window: {
      top: {
        postMessage: (data, to) => {
          assert.equal(to, origin);
          msg = data;
        },
      },
    },
  });
  return msg;
}
assert.equal(
  packet(post("/auth/login", { password: props.SMARTDESK_PORTAL_PASSWORD })).result.status,
  200,
);
assert.equal(packet(post("/auth/login", { password: "wrong" })).result.status, 401);
assert.equal(packet(post("/api/status", { session })).result.status, 200);
assert.equal(packet(post("/api/status", { session: "invalid" })).result.status, 401);
assert.equal(packet(post("/api/invalid", { session })).result.status, 404);
assert.equal(post("/api/status", { session }, { origin: "https://attacker.test" }).html, undefined);
assert.equal(post("/api/status", { session }, { id: "bad" }).html, undefined);
assert.equal(post("/api/status", { session }).mode, "allow");
assert(!post("/api/status", { session }).html.includes(props.SMARTDESK_TOKEN));
assert(
  !post("/auth/login", { password: props.SMARTDESK_PORTAL_PASSWORD }).html.includes(
    props.SMARTDESK_PORTAL_PASSWORD,
  ),
);
const elements = [],
  events = new Map();
let submitted;
const document = {
  createElement(tag) {
    const e = {
      tag,
      children: [],
      setAttribute() {},
      append(...a) {
        this.children.push(...a);
      },
      remove() {
        this.removed = true;
      },
      submit() {
        submitted = JSON.parse(this.children[0].value);
      },
    };
    elements.push(e);
    return e;
  },
  body: { append() {} },
};
const w = {
  SMARTDESK_SERVICE_URL: "https://script.google.com/macros/s/test/exec",
  addEventListener: (n, fn) => events.set(n, fn),
  removeEventListener: (n) => events.delete(n),
};
const browser = vm.createContext({
  window: w,
  document,
  location: { origin },
  URL,
  crypto: crypto.webcrypto,
  setTimeout,
  clearTimeout,
});
vm.runInContext(fs.readFileSync(path.join(proto, "assets/js/pages-transport.js"), "utf8"), browser);
(async () => {
  const promise = w.smartdeskRemote("/api/status", { session }, 1000);
  const answer = {
    protocol: "smartdesk-pages-v1",
    id: submitted.id,
    result: { status: 200, body: { aiReady: true } },
  };
  const receive = events.get("message");
  receive({ origin: "https://attacker.test", data: answer });
  assert(events.has("message"));
  receive({ origin: "https://a-script.googleusercontent.com.attacker.test", data: answer });
  assert(events.has("message"));
  receive({
    origin: "https://n-test-script.googleusercontent.com",
    data: { ...answer, id: "c".repeat(64) },
  });
  assert(events.has("message"));
  receive({ origin: "https://n-test-script.googleusercontent.com", data: answer });
  assert.equal((await promise).body.aiReady, true);
  assert(!events.has("message"));
  assert(elements.every((e) => e.tag === "textarea" || e.removed));
  await assert.rejects(w.smartdeskRemote("/api/status", { session }, 5), /não confirmou/);
  assert(!events.has("message"));
  w.fetch = () => {
    throw Error("não usar fetch para resposta opaca");
  };
  w.smartdeskPortalSession = Promise.resolve(session);
  w.smartdeskRemote = async (route, body) => {
    assert.equal(body.session, session);
    return {
      status: route === "/api/status" ? 200 : 409,
      body: route === "/api/status" ? { aiReady: true } : { error: "Conflito" },
    };
  };
  browser.AbortSignal = AbortSignal;
  vm.runInContext(fs.readFileSync(path.join(proto, "assets/js/client-api.js"), "utf8"), browser);
  assert.equal((await w.SmartDesk.api.request("/api/status")).aiReady, true);
  await assert.rejects(w.SmartDesk.api.request("/api/conflict"), (e) => e.status === 409);
  console.log(
    "Pages: interface estática, origem/nonce, POST sem segredos na URL, confirmação real exigida, timeout/limpeza e adaptador passaram; Google simulado.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
