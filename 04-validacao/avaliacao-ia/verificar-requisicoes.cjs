"use strict";
// Verificação 0.12.17: todas as chamadas da IA nos 57 caminhos, do jeito que a conversa faz.
// - identificar (/api/analyze) e extrair (/api/extract) com o relato claro de cada caminho;
// - revisar (/api/assist) e dar assunto (/api/subject) como no percurso pelos botões: campos já
//   respondidos (data, horário, opções, textos) e um relato vago que não repete esses dados;
// - casos-limite vistos na planilha: relato sem sentido, item de outra área, relato de uma palavra.
// Marca "REPETE" quando a pergunta da IA volta a um dado já respondido. Nenhum chamado é criado.
// Uso: node verificar-requisicoes.cjs --rodada nome [--etapas analyze,extract,assist,subject]
//      [--base http://127.0.0.1:4173] [--intervalo 4500]
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce(
      (list, value, index, all) =>
        value.startsWith("--") ? [...list, [value.slice(2), all[index + 1]]] : list,
      [],
    ),
);
const BASE = args.base || "http://127.0.0.1:4173";
const RODADA = args.rodada || "verificacao";
const ETAPAS = (args.etapas || "analyze,extract,assist,subject").split(",");
const INTERVALO = Number(args.intervalo || 4500);
const AQUI = __dirname;
const PROTOTIPO = path.join(AQUI, "../../03-prototipo");
const SAIDA = path.join(AQUI, "requisicoes-" + RODADA + ".json");

const context = vm.createContext({ window: { SmartDesk: {} } });
for (const file of ["knowledge-base.js", "flows.js", "classifier.js", "request-policy.js"])
  vm.runInContext(fs.readFileSync(path.join(PROTOTIPO, "assets/js", file), "utf8"), context);
const desk = context.window.SmartDesk;
const policy = desk.requestPolicy;
const dia = (n) =>
  new Date(Date.parse(policy.localDay() + "T12:00:00Z") + n * 864e5).toISOString().slice(0, 10);
const relatos = JSON.parse(fs.readFileSync(path.join(AQUI, "relatos.json"), "utf8")).casos;
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Respostas que uma pessoa daria pelos botões (valores fictícios, nenhum dado real).
const TEXTOS = {
  modelo: "Ricoh MP 3055",
  computador: "PC-SEC-04",
  equipamento: "PC-SEC-04",
  "mensagem-de-erro": "Erro de conexão",
  "mensagem-do-visor": "J012",
  "erro-apresentado": "Falha de servidor",
  erro: "Dispositivo não encontrado",
  turma: "7º ano B",
  "aluno-turma": "7º ano B",
  disciplina: "Matemática",
  periodo: "Manhã",
  "horario-periodo": "3ª e 4ª aula",
  programa: "GeoGebra",
  dispositivo: "Notebook",
  rede: "Rede dos professores",
};
function respostas(item) {
  const answers = {};
  for (const field of item.fields || []) {
    if (field.when && answers[field.when.field] !== field.when.equals) continue;
    answers[field.id] =
      field.type === "choice"
        ? field.options.includes("Não")
          ? "Não"
          : field.options[0]
        : field.type === "date"
          ? dia(3)
          : field.type === "time"
            ? "14:00"
            : field.type === "email"
              ? "conta.ficticia@exemplo.com"
              : field.type === "tel"
                ? "11 99999-0000"
                : field.type === "url"
                  ? "Ainda não informado"
                  : TEXTOS[field.id] || "Informação de teste 01";
  }
  return answers;
}
// Dado já respondido que a pergunta volta a pedir (para a revisão humana conferir).
function repete(pergunta, item, answers) {
  if (!pergunta) return [];
  const q = pergunta.toLowerCase();
  const achados = [];
  for (const field of item.fields || []) {
    if (!answers[field.id]) continue;
    if (field.type === "date" && /\bdata\b|que dia|qual (o )?dia|para quando|\bquando\b/.test(q))
      achados.push(field.label);
    else if (
      (field.type === "time" || /hor[áa]rio|per[íi]odo/i.test(field.label)) &&
      /hor[áa]rio|que horas|\bhoras?\b|per[íi]odo|manh[ãa]|tarde|noite/.test(q) &&
      !/at[ée] que horas|t[ée]rmino|termina|dura[çc][ãa]o|quanto tempo/.test(q)
    )
      achados.push(field.label);
    else if (field.type === "choice" && /evento/i.test(field.label) && /\bevento\b\?/.test(q))
      achados.push(field.label);
    else {
      const chave = field.label
        .toLowerCase()
        .split(/[^\p{L}]+/u)
        .find((w) => w.length > 3 && !["identificação", "envolvida", "apresentado"].includes(w));
      if (chave && new RegExp("qual (é )?(o |a )?" + chave).test(q)) achados.push(field.label);
    }
  }
  if (/\bsetor\b/.test(q)) achados.push("Setor");
  return achados;
}

async function post(rota, corpo) {
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    const resposta = await fetch(BASE + rota, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });
    const json = await resposta.json().catch(() => ({}));
    await esperar(INTERVALO);
    if (resposta.status !== 200 || json.source === "ai") return { status: resposta.status, json };
    console.log("  IA indisponível em " + rota + " (tentativa " + tentativa + "); aguardando…");
    await esperar(20000 * tentativa);
  }
  return { status: 0, json: { source: "falha-ia" } };
}

const LIMITES = [
  { id: "AV-003", relato: "Uujj", nota: "relato sem sentido" },
  { id: "AV-003", relato: "Microondas", nota: "item de outra área" },
  { id: "IMP-003", relato: "Instalar", nota: "relato de uma palavra" },
  { id: "AV-002", relato: "Para a reunião de pais", nota: "evento sem roteiro" },
  { id: "GOO-010", relato: "Para a aula de pesquisa", nota: "reserva com período" },
];

async function main() {
  const saude = await fetch(BASE + "/api/status")
    .then((r) => r.json())
    .catch(() => null);
  if (!saude) throw new Error("Servidor local não respondeu em " + BASE);
  const anterior = fs.existsSync(SAIDA) ? JSON.parse(fs.readFileSync(SAIDA, "utf8")) : [];
  const feito = (chave) => anterior.find((r) => r.chave === chave && r.source === "ai");
  const resultados = [];
  const casos = [
    ...desk.knowledgeBase.items.map((item) => ({
      item,
      claro: relatos.find((c) => c.esperado === item.id && c.tipo === "claro").relato,
      vago: relatos.find((c) => c.esperado === item.id && c.tipo === "vago").relato,
    })),
    ...LIMITES.map((l) => ({
      item: desk.knowledgeBase.items.find((i) => i.id === l.id),
      vago: l.relato,
      nota: l.nota,
    })),
  ];
  for (const caso of casos) {
    const { item } = caso,
      setor = item.sectors ? item.sectors[0] : "Secretaria",
      answers = respostas(item),
      intent = policy.asksEquipmentIntent(item) ? "repair" : "";
    const etapas = caso.nota ? ETAPAS.filter((e) => e === "assist") : ETAPAS;
    for (const etapa of etapas) {
      const chave = etapa + "|" + item.id + "|" + (caso.nota || "");
      const antes = feito(chave);
      if (antes) {
        resultados.push(antes);
        continue;
      }
      const r = { chave, etapa, id: item.id, nota: caso.nota || "" };
      if (etapa === "analyze") {
        const { json } = await post("/api/analyze", { description: caso.claro, sector: setor });
        const ids = (json.candidates || []).map((c) => c.item.id);
        Object.assign(r, { relato: caso.claro, source: json.source, ids, certo: ids[0] === item.id });
      } else if (etapa === "extract") {
        const { json } = await post("/api/extract", {
          sector: setor,
          selectionId: item.id,
          description: caso.claro,
        });
        Object.assign(r, {
          relato: caso.claro,
          source: json.source,
          respostas: json.answers || {},
          intent: json.intent || "",
        });
      } else {
        const corpo = {
          sector: setor,
          selectionId: item.id,
          description: caso.vago,
          answers,
          equipmentIntent: intent,
        };
        const { json } = await post("/api/" + etapa, corpo);
        Object.assign(r, { relato: caso.vago, respondido: answers, source: json.source });
        if (etapa === "subject") r.assunto = json.subject || "";
        else
          Object.assign(r, {
            coerente: json.coherent !== false,
            motivo: json.reason || "",
            pergunta: json.question || "",
            ajuda: json.help || "",
            dicas: json.tips || [],
            repete: repete(json.question, item, answers),
          });
      }
      resultados.push(r);
      console.log(
        [
          etapa.padEnd(7),
          item.id.padEnd(11),
          caso.nota ? "(" + caso.nota + ")" : "",
          etapa === "analyze" ? (r.certo ? "ok" : "ERRO " + r.ids.join(",")) : "",
          etapa === "extract" ? JSON.stringify(r.respostas) : "",
          etapa === "subject" ? r.assunto : "",
          etapa === "assist"
            ? (r.coerente ? "" : "ALERTA: " + r.motivo + " ") +
              (r.pergunta ? "pergunta: " + r.pergunta : "(sem pergunta)") +
              (r.repete.length ? "  <<REPETE " + r.repete.join(", ") + ">>" : "")
            : "",
          r.source === "ai" ? "" : "[" + r.source + "]",
        ]
          .filter(Boolean)
          .join(" "),
      );
      fs.writeFileSync(SAIDA, JSON.stringify([...resultados, ...anterior.filter((a) => !resultados.some((b) => b.chave === a.chave))], null, 2));
    }
  }
  const assist = resultados.filter((r) => r.etapa === "assist");
  console.log(
    "Resumo: " +
      assist.filter((r) => r.pergunta).length +
      " perguntas em " +
      assist.length +
      " revisões; " +
      assist.filter((r) => r.repete.length).length +
      " repetem dado já respondido; " +
      assist.filter((r) => !r.coerente).length +
      " alertas.",
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
