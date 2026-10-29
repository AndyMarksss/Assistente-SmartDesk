"use strict";
// Atualiza os 57 caminhos dos dois desenhos a partir do próprio protótipo, para não ficarem
// desatualizados quando a Matriz Mestre ou os textos do chat mudarem:
// - arvore-de-decisoes.html (visão geral): necessidade, dados pedidos e regras;
// - fluxo-detalhado.html (passo a passo): as perguntas exatas do chat, os botões, as respostas
//   rápidas e as validações de cada dado, com os mesmos textos de conversation-copy.js;
// - arvore-completa.html e arvore-vertical.html (árvore de decisões completa, na horizontal e na
//   vertical): os mesmos dados, desenhados como ramos (estrutura em arvore-estrutura.js).
// Uso: node gerar-caminhos.cjs
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const JS = path.join(__dirname, "../../03-prototipo/assets/js");
const context = vm.createContext({ window: { SmartDesk: {} } });
for (const file of [
  "knowledge-base.js",
  "classifier.js",
  "flows.js",
  "request-policy.js",
  "chat-format.js",
  "conversation-copy.js",
])
  vm.runInContext(fs.readFileSync(path.join(JS, file), "utf8"), context);
const desk = context.window.SmartDesk;
const policy = desk.requestPolicy;
const copy = desk.conversationCopy;
const label = desk.chatFormat.displayLabel;

const base = (item) => ({
  id: item.id,
  area: item.area,
  grupo: item.path.length > 1 ? label(item.path[0]) : "",
  nome: label(item.path[item.path.length - 1]),
  setores: item.sectors || null,
  tipo: policy.requestKind(item, ""),
  dicas: policy.selfHelpEligible(item, ""),
  defeitoOuNovo: policy.asksEquipmentIntent(item),
  descricaoOpcional: copy.detailsOptional(item, ""),
  manutencao: policy.isRoutineMaintenance(item),
});

// Visão geral
const caminhos = desk.knowledgeBase.items.map((item) => ({
  ...base(item),
  campos: (item.fields || []).map((f) => ({
    rotulo: f.label,
    tipo: f.type,
    ...(f.when ? { se: f.when.equals } : {}),
  })),
}));

// Passo a passo: o que o chat pergunta em cada dado (askFieldValue em app.js).
function pergunta(item, f) {
  const hardware = policy.asksEquipmentIntent(item);
  if (f.id === "computador")
    return {
      id: f.id,
      rotulo: "Quem utiliza",
      tipo: "computador",
      pergunta: hardware
        ? [
            { se: "Defeito", texto: "Quem usa o equipamento que está com defeito?" },
            { se: "Item novo", texto: "Quem vai usar esse novo item?" },
          ]
        : "Quem usa o computador que precisa de atendimento?",
      opcoes: [
        {
          botao: hardware
            ? "Eu uso esse equipamento (defeito) · É para mim (item novo)"
            : "Eu uso este computador",
          depois: "registra o nome da própria pessoa",
        },
        {
          botao: "Outra pessoa",
          depois:
            "campo “Nome e sobrenome de quem usa…” · se faltar o sobrenome: “Informe o nome e sobrenome de quem usa.”",
        },
        {
          botao: "Uso compartilhado",
          depois: "campo “Onde fica o equipamento compartilhado? Ex.: recepção…”",
        },
      ],
    };
  const p = {
    id: f.id,
    rotulo: f.label,
    tipo: f.type,
    pergunta: copy.field(item, f),
    ...(f.when ? { se: { campo: f.when.field, valor: f.when.equals } } : {}),
  };
  if (f.type === "choice") p.opcoes = f.options.map((o) => ({ botao: o }));
  else if (f.type === "date")
    p.controle =
      "Data: digitar dd/mm/aaaa ou tocar no calendário; atalhos Hoje · Amanhã · próximos 3 dias úteis (ex.: “qui 29/10”)";
  else if (f.type === "time") p.controle = "Horário: digitar HH:MM ou tocar no relógio";
  else
    p.controle =
      "Digitação: “" +
      (f.id === "descricao-do-problema" ? "Conte o que acontece com o cabo HDMI…" : f.label + "…") +
      "”";
  const rapidas = copy.quickReplies(item, f, { email: "e-mail informado" }).map((q) => q.label);
  if (rapidas.length) p.rapidas = rapidas;
  p.validacao =
    f.type === "date"
      ? ["Essa data não existe. Use dia/mês/ano.", "Escolha hoje ou uma data futura para o atendimento."]
      : f.type === "time"
        ? [
            "Confira o horário. Use horas e minutos, como 09:30.",
            "Esse horário já passou hoje. Escolha um horário a partir de {agora}.",
          ]
        : f.type === "email"
          ? ["Informe um e-mail válido."]
          : f.type === "url"
            ? ["Informe um link começando com https:// ou http://."]
            : f.type === "tel"
              ? ["Informe o telefone com DDD, por exemplo (11) 91234-5678."]
              : f.id === "descricao-do-problema"
                ? ["Me conte o que acontece com o cabo. Só o número da sala não explica o problema."]
                : f.type === "choice"
                  ? []
                  : ["Preencha este dado para continuar."];
  return p;
}
const passos = desk.knowledgeBase.items.map((item) => {
  const intent = policy.asksEquipmentIntent(item);
  const comCampo = (item.fields || []).some((f) => f.id === "descricao-do-problema");
  return {
    ...base(item),
    necessidade: item.need,
    abertura: copy.opening(item),
    intencao: intent
      ? {
          pergunta:
            "É um problema com o item que você já usa ou você quer solicitar um item novo ou diferente?",
          opcoes: [
            {
              botao: "Meu item está com defeito",
              resposta:
                "Entendi. Vamos registrar o defeito para a equipe avaliar o reparo ou a reposição.",
            },
            {
              botao: "Quero um item novo ou diferente",
              resposta: "Certo. Vamos registrar o que você precisa e quem autorizou esse pedido.",
            },
          ],
        }
      : null,
    campos: (item.fields || []).map((f) => pergunta(item, f)),
    descricao: comCampo
      ? null
      : {
          pergunta: copy.description(item, ""),
          opcional: copy.detailsOptional(item, ""),
          compra: intent ? copy.description(item, "purchase") : null,
          automatica: item.need + ". {dado}: {resposta}; …",
        },
  };
});

function inject(file, id, data) {
  const target = path.join(__dirname, file);
  const html = fs.readFileSync(target, "utf8");
  const start = '<script id="' + id + '" type="application/json">';
  const a = html.indexOf(start),
    b = html.indexOf("</script>", a);
  if (a < 0 || b < 0) throw new Error("Bloco " + id + " não encontrado em " + file);
  fs.writeFileSync(
    target,
    html.slice(0, a + start.length) + "\n" + JSON.stringify(data) + "\n" + html.slice(b),
  );
}
inject("arvore-de-decisoes.html", "caminhos", caminhos);
for (const file of ["fluxo-detalhado.html", "arvore-completa.html", "arvore-vertical.html"])
  if (fs.existsSync(path.join(__dirname, file))) inject(file, "passos", passos);
console.log(
  caminhos.length +
    " caminhos gravados; dicas da IA em " +
    caminhos.filter((c) => c.dicas).length +
    ", setor restrito em " +
    caminhos.filter((c) => c.setores).length +
    "; " +
    passos.reduce((n, p) => n + p.campos.length, 0) +
    " perguntas de dados no passo a passo.",
);
