"use strict";
// Avaliação técnica da interpretação da IA do SmartDesk.
// Uso: node avaliar-ia.cjs --rodada nome [--banco relatos.json] [--base http://127.0.0.1:4173] [--intervalo 4500]
// Precisa do servidor local (npm start) com a chave do Gemini e, de preferência, sem o envio ao
// Google configurado. Só chama /api/analyze e /api/extract: nenhum chamado é criado.
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
const RODADA = args.rodada || "rodada";
const INTERVALO = Number(args.intervalo || 4500);
const AQUI = __dirname;
const PROTOTIPO = path.join(AQUI, "../../03-prototipo");
const SAIDA = path.join(AQUI, "resultados-" + RODADA + ".json");

// Regras e base local, as mesmas do site.
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
const itens = Object.fromEntries(
  desk.knowledgeBase.items.map((item) => [item.id, item]),
);
const hoje = desk.requestPolicy.localDay();

const banco = JSON.parse(
  fs.readFileSync(path.join(AQUI, args.banco || "relatos.json"), "utf8"),
);
const casos = banco.casos.map((caso, index) => ({ n: index + 1, ...caso }));

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const compacto = (valor) =>
  String(valor || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
function somarDias(iso, dias) {
  return new Date(Date.parse(iso + "T12:00:00Z") + dias * 864e5)
    .toISOString()
    .slice(0, 10);
}
function dataEsperada(token) {
  if (token === "+1") return somarDias(hoje, 1);
  const [tipo, numero] = token.split(":");
  if (tipo === "dow") {
    for (let d = 1; d <= 7; d++) {
      const dia = somarDias(hoje, d);
      if (new Date(dia + "T12:00:00Z").getUTCDay() === Number(numero))
        return dia;
    }
  }
  if (tipo === "dia") {
    const mesmo = hoje.slice(0, 8) + String(numero).padStart(2, "0");
    if (mesmo >= hoje) return mesmo;
    const proximo = new Date(Date.parse(hoje.slice(0, 8) + "01T12:00:00Z"));
    proximo.setUTCMonth(proximo.getUTCMonth() + 1);
    return proximo.toISOString().slice(0, 8) + String(numero).padStart(2, "0");
  }
  throw new Error("Data esperada inválida: " + token);
}
function conferirCampo(esperado, obtido) {
  if (obtido === undefined || obtido === "") return "ausente";
  if (esperado.startsWith("@"))
    return obtido === dataEsperada(esperado.slice(1)) ? "ok" : "errado";
  if (esperado.startsWith("="))
    return obtido === esperado.slice(1) ? "ok" : "errado";
  if (esperado.startsWith("~"))
    return compacto(obtido).includes(compacto(esperado.slice(1)))
      ? "ok"
      : "errado";
  throw new Error("Expectativa inválida: " + esperado);
}

async function post(rota, corpo) {
  const resposta = await fetch(BASE + rota, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
  const json = await resposta.json().catch(() => ({}));
  return { status: resposta.status, json };
}
// A IA pode falhar por limite de uso; o servidor então cai na base local. Tenta de novo com pausa.
async function comIA(rota, corpo) {
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    const resposta = await post(rota, corpo);
    await esperar(INTERVALO);
    if (resposta.status !== 200) return { ...resposta, tentativas: tentativa };
    if (resposta.json.source === "ai")
      return { ...resposta, tentativas: tentativa };
    console.log(
      "  IA indisponível em " +
        rota +
        " (tentativa " +
        tentativa +
        "); aguardando…",
    );
    await esperar(20000 * tentativa);
  }
  return { status: 0, json: { source: "falha-ia" }, tentativas: 5 };
}

function pontuar(caso, ids) {
  const certos = [caso.esperado, ...(caso.aceitos || [])].filter(Boolean);
  if (caso.tipo === "misto")
    return {
      top1: certos.includes(ids[0]),
      top3: caso.todos.every((id) => ids.slice(0, 3).includes(id)),
    };
  if (caso.esperado === null) {
    const restritos = ["TI-QB-001", "TI-QB-002", "TI-CAM-001"];
    const ok =
      caso.tipo === "restrito"
        ? ids.every((id) => certos.includes(id)) &&
          !ids.some((id) => restritos.includes(id))
        : ids.length === 0;
    return { top1: ok, top3: ok };
  }
  return {
    top1: certos.includes(ids[0]),
    top3: ids.slice(0, 3).some((id) => certos.includes(id)),
  };
}

async function main() {
  const saude = await fetch(BASE + "/api/status")
    .then((r) => r.json())
    .catch(() => null);
  if (!saude) throw new Error("Servidor local não respondeu em " + BASE);
  const anterior = fs.existsSync(SAIDA)
    ? JSON.parse(fs.readFileSync(SAIDA, "utf8"))
    : { casos: [] };
  const feitos = new Map(
    anterior.casos
      .filter((c) => c.analise?.source === "ai")
      .map((c) => [c.n, c]),
  );
  const resultados = [];
  console.log(
    "Rodada " + RODADA + ": " + casos.length + " relatos, hoje " + hoje + ".",
  );
  for (const caso of casos) {
    if (feitos.has(caso.n)) {
      resultados.push(feitos.get(caso.n));
      continue;
    }
    const local = desk.classifier
      .classify(caso.relato, caso.setor)
      .candidates.map((c) => c.item.id);
    const analise = await comIA("/api/analyze", {
      description: caso.relato,
      sector: caso.setor,
    });
    const ids = (analise.json.candidates || []).map((c) => c.item.id);
    const registro = {
      n: caso.n,
      tipo: caso.tipo,
      setor: caso.setor,
      relato: caso.relato,
      esperado: caso.esperado,
      aceitos: caso.aceitos || [],
      analise: {
        source: analise.json.source,
        ids,
        tentativas: analise.tentativas,
      },
      pontos: pontuar(caso, ids),
      local: { ids: local, pontos: pontuar(caso, local) },
    };
    if (caso.extrair && caso.esperado) {
      const extracao = await comIA("/api/extract", {
        sector: caso.setor,
        selectionId: caso.esperado,
        description: caso.relato,
      });
      const respostas = extracao.json.answers || {};
      registro.extracao = {
        source: extracao.json.source,
        status: extracao.status,
        erro: extracao.json.error,
        respostas,
        intent: extracao.json.intent || "",
        campos: Object.fromEntries(
          Object.entries(caso.extrair).map(([campo, esperado]) => [
            campo,
            {
              esperado,
              obtido: respostas[campo],
              resultado: conferirCampo(esperado, respostas[campo]),
            },
          ]),
        ),
        extras: Object.keys(respostas).filter(
          (campo) => !(campo in caso.extrair),
        ),
      };
    }
    resultados.push(registro);
    const marca = registro.pontos.top1
      ? "ok "
      : registro.pontos.top3
        ? "~  "
        : "ERR";
    console.log(
      marca +
        " #" +
        caso.n +
        " " +
        (caso.esperado || "(nada)") +
        " → " +
        (ids.join(", ") || "(nada)"),
    );
    fs.writeFileSync(
      SAIDA,
      JSON.stringify({ rodada: RODADA, hoje, casos: resultados }, null, 2),
    );
  }
  fs.writeFileSync(
    SAIDA,
    JSON.stringify({ rodada: RODADA, hoje, casos: resultados }, null, 2),
  );
  console.log("Resultados em " + SAIDA);
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
