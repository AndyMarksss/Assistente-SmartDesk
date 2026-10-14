"use strict";
// Edge sem janela controlado pelo protocolo de depuração (CDP). Uso: node navegador-cdp.cjs roteiro.cjs
// steps.cjs exports async function (page) using page.nav/page.js/page.shot/page.size.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 9333;
const HELPERS = `
window.__t = (s) => String(s || "").replace(/\\s+/g, " ").trim();
window.__vis = (b) => !b.disabled && b.offsetParent !== null;
window.__find = (text) => [...document.querySelectorAll("button, [role=option], li.combo-option")].filter(__vis).find((b) => __t(b.textContent).includes(text));
window.__click = (text) => { const b = __find(text); if (!b) throw Error("Sem botão: " + text); b.click(); return __t(b.textContent); };
window.__waitFor = (fn, ms = 30000) => new Promise((res, rej) => { const t0 = Date.now(); const tick = () => { let v; try { v = fn(); } catch {} if (v) return res(v); if (Date.now() - t0 > ms) return rej(Error("timeout")); setTimeout(tick, 150); }; tick(); });
window.__waitBtn = (text, ms) => __waitFor(() => __find(text), ms);
window.__type = async (text) => { const i = await __waitFor(() => { const x = document.getElementById("chat-input"); return x && !x.disabled && x; }); i.value = text; i.dispatchEvent(new Event("input", { bubbles: true })); document.getElementById("composer").requestSubmit(); };
window.__combo = async (text) => { const i = await __waitFor(() => document.getElementById("combo-input")); i.value = text; i.dispatchEvent(new Event("input", { bubbles: true })); await new Promise((r) => setTimeout(r, 200)); i.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })); };
window.__last = () => __t([...document.querySelectorAll("#messages .message")].slice(-1)[0]?.textContent);
`;
async function main() {
  const steps = require(path.resolve(process.argv[2]));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "edge-cdp-"));
  const edge = spawn(
    EDGE,
    [
      "--headless=new",
      "--remote-debugging-port=" + PORT,
      "--user-data-dir=" + profile,
      "--no-first-run",
      "--disable-extensions",
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  let version;
  for (let i = 0; i < 50 && !version; i++) {
    try {
      version = await (
        await fetch("http://127.0.0.1:" + PORT + "/json/version")
      ).json();
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  const list = await (
    await fetch("http://127.0.0.1:" + PORT + "/json/list")
  ).json();
  const target = list.find((t) => t.type === "page");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map(),
    listeners = [];
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? rej(Error(JSON.stringify(msg.error))) : res(msg.result);
    } else if (msg.method) listeners.forEach((fn) => fn(msg));
  });
  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const n = ++id;
      pending.set(n, { res, rej });
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  await send("Page.enable");
  await send("Runtime.enable");
  listeners.push((m) => {
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
      console.log(
        "[console.error]",
        m.params.args.map((a) => a.value || a.description).join(" "),
      );
    if (m.method === "Runtime.exceptionThrown")
      console.log(
        "[exception]",
        m.params.exceptionDetails.exception?.description,
      );
  });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: HELPERS });
  const page = {
    async size(width, height, scale = 2, mobile = width < 700) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: scale,
        mobile,
      });
      if (mobile)
        await send("Emulation.setTouchEmulationEnabled", { enabled: false });
    },
    async scheme(value) {
      await send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-color-scheme", value }],
      });
    },
    async nav(url) {
      const loaded = new Promise((r) => {
        const fn = (m) => {
          if (m.method === "Page.loadEventFired") {
            listeners.splice(listeners.indexOf(fn), 1);
            r();
          }
        };
        listeners.push(fn);
      });
      await send("Page.navigate", { url });
      await loaded;
      await new Promise((r) => setTimeout(r, 800));
    },
    async js(code, wait = 0) {
      const result = await send("Runtime.evaluate", {
        expression: "(async () => {" + code + "})()",
        awaitPromise: true,
        returnByValue: true,
      });
      if (result.exceptionDetails)
        throw Error(
          "JS: " +
            (result.exceptionDetails.exception?.description ||
              result.exceptionDetails.text),
        );
      if (wait) await new Promise((r) => setTimeout(r, wait));
      return result.result.value;
    },
    async shot(file, { full = false } = {}) {
      const params = {
        format: file.endsWith(".png") ? "png" : "jpeg",
        quality: 88,
      };
      if (full) {
        const m = await send("Page.getLayoutMetrics");
        params.captureBeyondViewport = true;
        params.clip = {
          x: 0,
          y: 0,
          width: m.cssContentSize.width,
          height: m.cssContentSize.height,
          scale: 1,
        };
      }
      const { data } = await send("Page.captureScreenshot", params);
      fs.writeFileSync(file, Buffer.from(data, "base64"));
      console.log("captura:", file);
    },
    wait: (ms) => new Promise((r) => setTimeout(r, ms)),
  };
  try {
    await steps(page);
  } catch (error) {
    console.error("FALHA:", error.message);
    try {
      await page.shot(path.join(path.dirname(process.argv[2]), "falha.jpg"));
      console.log("último:", await page.js("return __last()"));
    } catch {}
    process.exitCode = 1;
  } finally {
    ws.close();
    edge.kill();
    setTimeout(() => {
      try {
        fs.rmSync(profile, { recursive: true, force: true });
      } catch {}
      process.exit();
    }, 800);
  }
}
main();
