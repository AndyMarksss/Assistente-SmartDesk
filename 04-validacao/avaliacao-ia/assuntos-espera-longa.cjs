"use strict";
// Assuntos dos 57 caminhos com a instrução 0.12.17 direto no Gemini, com espera de até 90 s.
// Usado em 2026-10-28, quando o Gemini respondia em 10–30 s e o servidor (que desiste em 12 s)
// caía no assunto local. Mesmos dados que o servidor envia: setor, área, necessidade, tipo,
// relato vago e opções. A chave vem do .env e nunca é impressa. Grava em requisicoes-depois.json.
// Uso: node assuntos-espera-longa.cjs
const fs = require("node:fs"), vm = require("node:vm"), path = require("node:path");
const AQUI = __dirname, PROTOTIPO = path.join(AQUI, "../../03-prototipo");
const env = Object.fromEntries(
  fs.readFileSync(path.join(PROTOTIPO, ".env"), "utf8").split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const ai = require(path.join(PROTOTIPO, "server/ai-provider.cjs"));
const { safeSubject } = require(path.join(PROTOTIPO, "server/ticket-validation.cjs"));
const ctx = vm.createContext({ window: { SmartDesk: {} } });
for (const f of ["knowledge-base.js", "flows.js", "classifier.js", "request-policy.js"])
  vm.runInContext(fs.readFileSync(path.join(PROTOTIPO, "assets/js", f), "utf8"), ctx);
const desk = ctx.window.SmartDesk, policy = desk.requestPolicy;
const relatos = JSON.parse(fs.readFileSync(path.join(AQUI, "relatos.json"), "utf8")).casos;
const SAIDA = path.join(AQUI, "requisicoes-depois.json");
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const todos = JSON.parse(fs.readFileSync(SAIDA, "utf8"));
  for (const item of desk.knowledgeBase.items) {
    const ch = "subject|" + item.id + "|";
    if (todos.some((r) => r.chave === ch && r.source === "ai")) continue;
    const relato = relatos.find((c) => c.esperado === item.id && c.tipo === "vago").relato;
    const intent = policy.asksEquipmentIntent(item) ? "repair" : "";
    const opcoes = {};
    for (const f of item.fields || [])
      if (f.type === "choice") opcoes[f.label] = f.options.includes("Não") ? "Não" : f.options[0];
    const data = { setor: item.sectors ? item.sectors[0] : "Secretaria", area: item.area, necessidade: item.need,
      tipo: policy.requestKind(item, intent), descricao: relato, opcoes };
    let assunto = "", ms = 0;
    for (let tentativa = 1; tentativa <= 3 && !assunto; tentativa++) {
      const t0 = Date.now();
      try {
        const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + (env.GEMINI_MODEL || "gemini-3.5-flash-lite") + ":generateContent", {
          method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
          signal: AbortSignal.timeout(90000),
          body: JSON.stringify({ systemInstruction: { parts: [{ text: ai.SUBJECT_INSTRUCTION }] },
            contents: [{ role: "user", parts: [{ text: JSON.stringify(data) }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 512, responseMimeType: "application/json",
              responseSchema: { type: "OBJECT", properties: { subject: { type: "STRING" } }, required: ["subject"] } } }),
        });
        const j = await r.json();
        const text = (j.candidates?.[0]?.content?.parts || []).filter((p) => !p.thought).map((p) => p.text || "").join("");
        assunto = safeSubject(JSON.parse(text).subject) || "";
      } catch {}
      ms = Date.now() - t0;
      if (!assunto) await esperar(15000 * tentativa);
    }
    const entrada = { chave: ch, etapa: "subject", id: item.id, nota: "", relato, source: assunto ? "ai" : "falha-ia", assunto, ms, viaDireta: true };
    const i = todos.findIndex((r) => r.chave === ch);
    if (i >= 0) todos[i] = entrada; else todos.push(entrada);
    fs.writeFileSync(SAIDA, JSON.stringify(todos, null, 2));
    console.log("subject", item.id.padEnd(11), (ms + "ms").padEnd(8), assunto || "[falha-ia]");
    await esperar(4500);
  }
})();
