"use strict";
// Confere só a revisão da IA (/api/assist) nos 57 caminhos, com o relato claro de cada um e
// respostas fictícias válidas: alerta de incoerência, pergunta de complemento e dicas.
// Uso: node revisar-ia.cjs --rodada nome [--base http://127.0.0.1:4173] [--intervalo 4500]
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce(
      (list, value, index, all) =>
        value.startsWith("--")
          ? [...list, [value.slice(2), all[index + 1]]]
          : list,
      [],
    ),
);
const BASE = args.base || "http://127.0.0.1:4173";
const RODADA = args.rodada || "revisao";
const INTERVALO = Number(args.intervalo || 4500);
const AQUI = __dirname;
const PROTOTIPO = path.join(AQUI, "../../03-prototipo");
const SAIDA = path.join(AQUI, "revisao-" + RODADA + ".json");

const context = vm.createContext({ window: { SmartDesk: {} } });
for (const file of [
  "knowledge-base.js",
  "flows.js",
  "classifier.js",
  "request-policy.js",
])
  vm.runInContext(
    fs.readFileSync(path.join(PROTOTIPO, "assets/js", file), "utf8"),
    context,
  );
const desk = context.window.SmartDesk;
const policy = desk.requestPolicy;
const amanha = new Date(Date.parse(policy.localDay() + "T12:00:00Z") + 864e5)
  .toISOString()
  .slice(0, 10);
const relatos = JSON.parse(
  fs.readFileSync(path.join(AQUI, "relatos.json"), "utf8"),
).casos;
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function respostas(item) {
  const answers = {};
  for (const field of item.fields || []) {
    if (field.when && answers[field.when.field] !== field.when.equals) continue;
    answers[field.id] =
      field.type === "choice"
        ? field.options[0]
        : field.type === "date"
          ? amanha
          : field.type === "time"
            ? "10:00"
            : field.type === "email"
              ? "teste.ficticio@exemplo.com"
              : field.type === "tel"
                ? "11 99999-0000"
                : field.type === "url"
                  ? "Ainda não informado"
                  : "Informação de teste 01";
  }
  return answers;
}

async function main() {
  const anterior = fs.existsSync(SAIDA)
    ? JSON.parse(fs.readFileSync(SAIDA, "utf8"))
    : [];
  const resultados = anterior.filter((r) => r.source === "ai");
  for (const item of desk.knowledgeBase.items) {
    if (resultados.some((r) => r.id === item.id)) continue;
    const setor = item.sectors ? item.sectors[0] : "Secretaria",
      relato = relatos.find(
        (c) => c.esperado === item.id && c.tipo === "claro",
      ).relato;
    let corpo = {};
    for (let tentativa = 1; tentativa <= 5; tentativa++) {
      const resposta = await fetch(BASE + "/api/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector: setor,
          selectionId: item.id,
          description: relato,
          answers: respostas(item),
          equipmentIntent: policy.asksEquipmentIntent(item) ? "repair" : "",
        }),
      });
      corpo = await resposta.json().catch(() => ({}));
      await esperar(INTERVALO);
      if (corpo.source === "ai" || resposta.status !== 200) break;
      console.log(
        "  IA indisponível (tentativa " + tentativa + "); aguardando…",
      );
      await esperar(20000 * tentativa);
    }
    const r = {
      id: item.id,
      relato,
      source: corpo.source || "erro",
      erro: corpo.error,
      coerente: corpo.coherent !== false,
      motivo: corpo.reason || "",
      pergunta: corpo.question || "",
      ajuda: corpo.help || "",
      dicas: corpo.tips || [],
    };
    resultados.push(r);
    console.log(
      (r.coerente ? "ok   " : "ALERTA ") +
        item.id +
        (r.pergunta ? " | pergunta: " + r.pergunta : "") +
        (r.motivo ? " | motivo: " + r.motivo : "") +
        (r.erro ? " | erro: " + r.erro : ""),
    );
    fs.writeFileSync(SAIDA, JSON.stringify(resultados, null, 2));
  }
  console.log("Resultados em " + path.basename(SAIDA));
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
