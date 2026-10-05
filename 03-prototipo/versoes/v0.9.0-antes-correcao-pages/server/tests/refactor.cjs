"use strict";
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const proto = path.resolve(__dirname, "../..");
const context = vm.createContext({ window: {}, AbortSignal, FileReader: undefined });
for (const file of ["client-api", "attachments"])
  vm.runInContext(fs.readFileSync(path.join(proto, "assets/js", file + ".js"), "utf8"), context);
const { api, attachments } = context.window.SmartDesk;
(async () => {
  const body = { description: "Texto original" },
    received = [];
  const response = (value, ok = true, status = 200, type = "application/json") => ({
    ok,
    status,
    headers: { get: () => type },
    json: async () => value,
  });
  const fetchImpl = async (route, options) => {
    received.push({ route, options });
    return response({ ok: true });
  };
  await api.request("/api/tickets", { body, fetchImpl });
  assert.equal(received[0].options.method, "POST");
  assert.deepEqual(JSON.parse(received[0].options.body), body);
  await api.request("/api/status", { fetchImpl });
  assert.equal(received[1].options.method, undefined);
  await assert.rejects(
    api.request("/api/tickets", {
      fetchImpl: async () => response({ error: "Falha controlada" }, false, 502),
    }),
    (e) => e.name === "ApiError" && e.status === 502 && e.message === "Falha controlada",
  );
  await assert.rejects(
    api.request("/api/tickets", {
      fetchImpl: async () => response("html", true, 200, "text/html"),
    }),
    /servidor iniciado/,
  );
  await assert.rejects(
    api.request("/api/tickets", {
      fetchImpl: async () => ({
        ...response({}),
        json: async () => {
          throw Error();
        },
      }),
    }),
    /ler a resposta/,
  );
  await assert.rejects(
    api.request("/api/tickets", { fetchImpl: async () => response(null) }),
    /resposta inválida/,
  );
  const file = { name: "teste.txt", size: 12, lastModified: 1 };
  assert.equal(attachments.merge([file], [file]).files.length, 1);
  assert.equal(attachments.merge([], [{ ...file, name: "teste.exe" }]).files.length, 0);
  assert(
    attachments.merge([file], [{ ...file, name: "grande.txt", size: 10 * 1024 * 1024 + 1 }]).error,
  );
  assert(
    attachments.merge(
      [],
      Array.from({ length: 6 }, (_, i) => ({ ...file, name: i + ".txt" })),
    ).error,
  );
  const huge = Array.from({ length: 3 }, (_, i) => ({
    ...file,
    name: i + ".txt",
    size: 8 * 1024 * 1024,
  }));
  assert(attachments.merge([], huge).error);
  assert.equal(attachments.merge([], [{ ...file, size: 0 }]).files.length, 0);

  // Cancelled conversations must never append an old reply or restore old controls.
  class Node {
    constructor() {
      this.children = [];
      this.className = "";
    }
    append(...nodes) {
      for (const n of nodes) {
        n.parent = this;
        this.children.push(n);
      }
    }
    setAttribute() {}
    remove() {
      if (this.parent) this.parent.children = this.parent.children.filter((n) => n !== this);
    }
    querySelectorAll(selector) {
      return this.children.filter((n) => n.className === selector.slice(1));
    }
  }
  const streamContext = vm.createContext({
    window: { SmartDesk: {} },
    document: { createElement: () => new Node() },
    requestAnimationFrame: (fn) => fn(),
  });
  vm.runInContext(
    fs.readFileSync(path.join(proto, "assets/js/chat-view.js"), "utf8"),
    streamContext,
  );
  const create = streamContext.window.SmartDesk.chatView.createMessageStream;
  const container = new Node(),
    waits = [];
  let restored = false;
  const stream = create({
    container,
    scroll: () => {},
    reducedMotion: () => false,
    wait: () => new Promise((resolve) => waits.push(resolve)),
  });
  stream.append("resposta antiga");
  const ready = stream.whenReady(() => {
    restored = true;
  });
  await Promise.resolve();
  assert.equal(container.children[0].className, "typing");
  stream.cancel();
  waits.shift()();
  await ready;
  assert.equal(container.children.length, 0);
  assert.equal(restored, false);
  const ordered = new Node();
  const reduced = create({
    container: ordered,
    scroll: () => {},
    reducedMotion: () => true,
    wait: () => {
      throw Error("Movimento reduzido não deve atrasar respostas");
    },
  });
  reduced.append("primeira");
  reduced.append("segunda");
  await reduced.whenReady(() => assert.equal(ordered.children.length, 2));
  assert.equal(ordered.children[0].children[1].children[1].textContent, "primeira");
  assert.equal(ordered.children[1].children[1].children[1].textContent, "segunda");

  // Follow content and viewport resize after interaction, but preserve the initial welcome.
  const frames = [],
    observed = [],
    viewport = { scrollTop: 0, scrollHeight: 1000 };
  let notify;
  class Observer {
    constructor(callback) {
      notify = callback;
    }
    observe(element) {
      observed.push(element);
    }
  }
  const follower = streamContext.window.SmartDesk.chatView.createScrollFollower({
    viewport,
    content: {},
    dock: {},
    frame: (callback) => frames.push(callback),
    Observer,
  });
  assert.equal(observed.length, 3);
  follower.schedule();
  frames.shift()();
  assert.equal(viewport.scrollTop, 0);
  follower.follow();
  frames.shift()();
  assert.equal(viewport.scrollTop, 1000);
  viewport.scrollHeight = 1400;
  notify();
  frames.shift()();
  assert.equal(viewport.scrollTop, 1400);
  follower.schedule();
  follower.reset();
  assert.equal(frames.length, 1);
  frames.shift()();
  assert.equal(viewport.scrollTop, 0);
  notify();
  assert.equal(frames.length, 0);
  // All four lights terminate at the robot, using one staggered pass each.
  const html = fs.readFileSync(path.join(proto, "index.html"), "utf8");
  const signals = [...html.matchAll(/class="connection-signal from-[^"]+"[^>]*d="([^"]+)"/g)];
  assert.equal(signals.length, 4);
  signals.forEach((signal) => assert(signal[1].endsWith("L190 140")));
  // Data topology and policy must remain byte-for-byte equivalent as evaluated data.
  function base(folder) {
    const c = vm.createContext({ window: {} });
    for (const n of ["knowledge-base", "classifier", "flows", "request-policy"])
      vm.runInContext(fs.readFileSync(path.join(folder, "assets/js", n + ".js"), "utf8"), c);
    return c.window.SmartDesk;
  }
  const before = base(path.join(proto, "versoes/v0.8.10-antes-refatoracao")),
    after = base(proto);
  assert.equal(JSON.stringify(before.knowledgeBase), JSON.stringify(after.knowledgeBase));
  assert.equal(JSON.stringify(before.flows), JSON.stringify(after.flows));
  for (const item of after.knowledgeBase.items)
    for (const sector of after.flows.sectors)
      assert.equal(
        before.classifier.isAllowed(
          before.knowledgeBase.items.find((x) => x.id === item.id),
          sector,
        ),
        after.classifier.isAllowed(item, sector),
      );
  const css = fs.readFileSync(path.join(proto, "assets/css/motion.css"), "utf8");
  assert(css.includes("prefers-reduced-motion: reduce"));
  assert(!css.match(/mascot-float[^;]*infinite/));
  for (const file of ["style", "responsive", "visual-depth", "personality", "identity", "admin"])
    assert(
      !/@keyframes|animation\s*:|transition\s*:/.test(
        fs.readFileSync(path.join(proto, "assets/css", file + ".css"), "utf8"),
      ),
    );
  console.log(
    "Refatoração: API, erros, limites/deduplicação de anexos, 57 caminhos × 25 setores preservados e movimento centralizado passaram.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
