"use strict";
// 0.12.18 — caminho da IA (entendimento, relato completo, outro pedido, dicas antes dos dados) e
// as correções de coerência da análise da árvore de decisões.
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const root = path.resolve(__dirname, "../.."),
  ctx = vm.createContext({ window: {} });
for (const file of ["knowledge-base", "classifier", "flows", "request-policy", "conversation-copy"])
  vm.runInContext(fs.readFileSync(path.join(root, "assets/js", file + ".js"), "utf8"), ctx);
const desk = ctx.window.SmartDesk,
  p = desk.requestPolicy,
  copy = desk.conversationCopy,
  items = desk.knowledgeBase.items,
  byId = (id) => items.find((item) => item.id === id);
const { safeExtract, validateAnswers, policy } = require("../ticket-validation.cjs");

// Tipo do pedido, aval da liderança, telefone, horário de hoje e assuntos de outras equipes.
assert.equal(p.requestKind(byId("GOO-006")), "dúvida");
assert.equal(p.requestKind(byId("TI-001")), "dúvida");
assert(!p.needsAuthorization(byId("IMP-010"), "Preciso comprar toner preto"));
assert(p.needsAuthorization(byId("TI-003"), "Preciso comprar um monitor"));
for (const phone of ["(11) 91234-5678", "11 3456-7890", "+55 11 91234-5678"])
  assert(p.phoneValue(phone), phone);
for (const phone of ["Dado fictício", "1234", "(11) 9123", "11 91234-5678 ramal 2"])
  assert.equal(p.phoneValue(phone), null, phone);
assert(p.pastTimeToday("2026-10-29", "09:00", "2026-10-29", "10:00"));
assert(!p.pastTimeToday("2026-10-30", "09:00", "2026-10-29", "10:00"));
assert(!p.pastTimeToday("2026-10-29", "11:00", "2026-10-29", "10:00"));
assert.equal(p.otherTeam("O ar-condicionado da sala 3 está pingando"), "da manutenção do prédio");
assert.equal(p.otherTeam("Quero saber das minhas férias"), "do RH");
assert.equal(p.otherTeam("Segunda via do boleto da mensalidade"), "da Secretaria ou do Financeiro");
assert.equal(p.otherTeam("A impressora não imprime"), "");

// Textos do chat: aberturas, perguntas e descrições coerentes com o tipo do pedido.
for (const item of items) {
  const opening = copy.opening(item),
    kind = p.requestKind(item);
  assert(!/questão no /.test(opening), item.id + ": " + opening);
  if (!(item.fields || []).length && !p.asksEquipmentIntent(item))
    assert(!/algumas perguntas/.test(opening), item.id + ": " + opening);
  const story = copy.description(item);
  if (kind === "solicitação") assert(!/desde quando/.test(story), item.id + ": " + story);
  if ((item.fields || []).some((f) => ["data", "periodo", "horario-periodo"].includes(f.id)))
    assert(!/para quando/.test(story), item.id + ": " + story);
}
assert.equal(
  copy.opening(byId("GOO-005")),
  "Vamos ver o que está acontecendo no Google Drive. Me passe alguns detalhes para a equipe saber por onde começar.",
);
assert(copy.opening(byId("GOO-007")).includes("no Gmail."));
assert(copy.opening(byId("GOO-010")).includes("reserva"));
assert(copy.opening(byId("GOO-011")).includes("nunca precisa me dizer a senha"));
assert(copy.opening(byId("GOO-006")).includes("dúvida"));
assert(copy.description(byId("GOO-006")).startsWith("Qual é a sua dúvida?"));
assert(copy.description(byId("TI-INT-003")).startsWith("Qual é a sua sugestão?"));
// Reservas do Chromebook e do notebook pedem o mesmo: local, atividade e pessoas.
assert.equal(copy.description(byId("TI-COMP-006")), copy.description(byId("GOO-010")));
assert(!copy.detailsOptional(byId("TI-COMP-006")));
assert.equal(
  copy.field(byId("TI-MENT-004"), { id: "periodo", label: "Período" }),
  "Qual período letivo vai ser encerrado? Por exemplo, 3º bimestre.",
);
assert.equal(
  copy.field(byId("TI-NET-002"), { id: "periodo", label: "Período" }),
  "Em qual período você vai precisar?",
);
assert(
  copy.description(byId("TI-NET-001"), "", { "tipo-de-conexao": "Wi-Fi" }).includes("rede Wi-Fi"),
);
// Pergunta de descrição que o caminho da IA confere no relato.
assert.equal(copy.flowQuestion(byId("AV-007")), "");
assert.equal(copy.flowQuestion(byId("IMP-008")), "");
assert(copy.flowQuestion(byId("AV-003")).startsWith("Como vai ser o uso?"));
assert(copy.flowQuestion(byId("TI-COMP-007"), "purchase").startsWith("Qual item você quer"));
assert.equal(copy.flowQuestion(byId("TI-COMP-007"), "repair"), "");

// Rascunho da IA: só entra o que é seguro mostrar e usar.
const av = byId("AV-001"),
  mouse = byId("TI-COMP-007"),
  today = policy.localDay();
let draft = safeExtract(
  av,
  {
    campos: [
      { id: "data", valor: today },
      { id: "horario", valor: "00:00" },
    ],
    entendimento: "Você precisa de caixa de som no auditório <b>hoje</b>.",
    relatoCompleto: false,
    outroPedido: true,
    dicas: ["Reinicie o equipamento."],
  },
  false,
);
assert.equal(draft.understanding, "Você precisa de caixa de som no auditório b hoje /b .");
assert.equal(draft.complete, false);
assert.equal(draft.otherRequest, true);
assert.deepEqual(draft.tips, []); // reserva: sem dicas
if (policy.localTime() > "00:00") assert.equal(draft.answers.horario, undefined); // já passou
draft = safeExtract(av, { campos: [], entendimento: "Veja https://exemplo.com", dicas: [] });
assert.equal(draft.understanding, "");
assert.equal(draft.complete, null);
assert.equal(draft.otherRequest, false);
// "É para um evento?" só sai do relato quando ele fala em evento.
const eventAnswer = (story) =>
  safeExtract(av, { campos: [{ id: "evento", valor: "Não" }] }, false, story).answers.evento;
assert.equal(eventAnswer("Caixa de som na quadra para a aula de educação física"), undefined);
assert.equal(eventAnswer("Não é um evento, é uma aula"), "Não");
// O horário só sai do relato quando ele diz a hora ("na primeira aula" virava 07:00).
const timeAnswer = (story) =>
  safeExtract(
    av,
    {
      campos: [
        { id: "data", valor: "2099-01-02" },
        { id: "horario", valor: "07:30" },
      ],
    },
    false,
    story,
  ).answers.horario;
assert.equal(timeAnswer("Datashow pra sala 3 amanhã na primeira aula"), undefined);
for (const story of ["amanhã às 7h30", "às 7:30", "7 horas e meia", "07h30"])
  assert.equal(timeAnswer(story), "07:30", story);
const tips = [
  "Troque a pilha do mouse.",
  "Teste em outra porta USB.",
  "Limpe o sensor.",
  "Mais um.",
];
assert.equal(
  safeExtract(mouse, { campos: [], intencao: "repair", dicas: tips }, true).tips.length,
  3,
);
assert.deepEqual(
  safeExtract(mouse, { campos: [], intencao: "purchase", dicas: tips }, true).tips,
  [],
);
assert.deepEqual(safeExtract(mouse, { campos: [], intencao: "", dicas: tips }, true).tips, []);

// Envio: telefone e horário de hoje conferidos também no servidor.
const camera = byId("TI-CAM-001"),
  cameraAnswers = {
    aluno: "Aluno Fictício",
    turma: "1º A",
    responsavel: "Responsável Fictício",
    "email-responsavel": "ficticio@example.com",
  };
assert.throws(
  () => validateAnswers({ ...cameraAnswers, "contato-responsavel": "não sei" }, camera),
  /telefone/,
);
assert.equal(
  typeof validateAnswers({ ...cameraAnswers, "contato-responsavel": "(11) 91234-5678" }, camera),
  "object",
);
const now = policy.localTime(),
  minutes = Number(now.slice(0, 2)) * 60 + Number(now.slice(3, 5));
if (minutes >= 120) {
  const early = String(Math.floor((minutes - 90) / 60)).padStart(2, "0") + ":00";
  assert.throws(
    () => validateAnswers({ data: today, horario: early, evento: "Não" }, av),
    /horário já passou/,
  );
}
assert.equal(
  typeof validateAnswers({ data: "2099-10-05", horario: "07:00", evento: "Não" }, av),
  "object",
);

// A IA recebe a pergunta de descrição do caminho e a permissão de dicas; o rascunho é pedido
// mesmo em caminhos sem campos para preencher (antes não havia chamada).
const { createProvider, EXTRACT_SCHEMA } = require("../ai-provider.cjs");
assert.deepEqual(EXTRACT_SCHEMA.required, [
  "campos",
  "entendimento",
  "relatoCompleto",
  "outroPedido",
  "dicas",
]);
let captured = null;
const provider = createProvider({
  env: { GEMINI_API_KEY: "ficticia" },
  fetchImpl: async (url, options) => {
    captured = JSON.parse(JSON.parse(options.body).contents[0].parts[0].text);
    return {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: JSON.stringify({ campos: [] }) }] } }],
      }),
    };
  },
});
(async () => {
  await provider.extract({
    today,
    sector: "Secretaria",
    area: "Audiovisual",
    need: "Caixa de Som",
    fields: [],
    description: "Relato fictício",
    flowQuestion: "Como vai ser o uso?",
    allowTips: false,
  });
  assert.equal(captured.perguntaDoFluxo, "Como vai ser o uso?");
  assert.equal(captured.dicasPermitidas, false);
  assert(!("nome" in captured) && !("email" in captured));

  let extracted = null;
  const server = require("../server.cjs").createServer({
    ready: () => true,
    status: () => "online",
    online: () => true,
    name: "Simulado",
    extract: async (request) => {
      extracted = request;
      return {
        campos: [],
        entendimento: "Você quer sugerir uma melhoria na intranet.",
        relatoCompleto: true,
        outroPedido: false,
        dicas: [],
      };
    },
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const response = await fetch("http://127.0.0.1:" + server.address().port + "/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sector: "Secretaria",
        selectionId: "TI-INT-003",
        description: "Sugiro colocar o cardápio da semana na intranet.",
      }),
    });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.source, "ai");
    assert.equal(body.understanding, "Você quer sugerir uma melhoria na intranet.");
    assert.equal(body.complete, true);
    assert(extracted.flowQuestion.startsWith("Qual é a sua sugestão?"));
    assert.equal(extracted.allowTips, false);
  } finally {
    server.close();
  }
  console.log(
    "Caminho da IA (entendimento, relato completo, outro pedido, dicas) e coerência dos 57 caminhos (tipos, aberturas, descrições, telefone, horário de hoje, toner e outras equipes) passaram.",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
