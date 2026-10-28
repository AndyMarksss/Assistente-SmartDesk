"use strict";
const path = require("node:path");
const { InvalidRequest } = require("./request-body.cjs");
const policyContext = require("node:vm").createContext({ window: {} });
require("node:vm").runInContext(
  require("node:fs").readFileSync(path.join(__dirname, "../assets/js/request-policy.js"), "utf8"),
  policyContext,
);
const policy = policyContext.window.SmartDesk.requestPolicy;
function validateSelection(body, desk) {
  if (
    !body ||
    typeof body !== "object" ||
    typeof body.sector !== "string" ||
    !desk.flows.sectors.includes(body.sector)
  )
    throw new InvalidRequest("Selecione um setor cadastrado.");
  const item = desk.knowledgeBase.items.find(
    (item) => item.id === body.selectionId && desk.classifier.isAllowed(item, body.sector),
  );
  if (!item) throw new InvalidRequest("Selecione uma necessidade permitida para seu setor.");
  return item;
}
function validateDescription(description) {
  if (typeof description !== "string" || !description.trim() || description.length > 2000)
    throw new InvalidRequest("Informe uma descrição de até 2.000 caracteres.");
  if (!policy.usefulDescription(description))
    throw new InvalidRequest("Conte o problema ou pedido com suas palavras.");
  return description; // Preserve the original text: never substitute the model's interpretation.
}
function safeSubject(value) {
  if (typeof value !== "string") return null;
  const subject = value.trim();
  if (
    !subject ||
    subject.length > 80 ||
    /[\r\n<>\x00-\x1f]/.test(subject) ||
    /https?:\/\//i.test(subject)
  )
    return null;
  return subject;
}
// O que a pessoa já respondeu, para a revisão da IA não perguntar de novo. Data, horário e
// opções vão com o valor (não são dados pessoais); dos textos livres, só o rótulo.
function answeredForAI(item, answers) {
  return (item.fields || [])
    .filter((field) => answers[field.id])
    .map((field) => {
      const value = answers[field.id];
      if (value === PENDING_LINK) return field.label + ": a pessoa vai enviar depois";
      if (field.type === "date")
        return (
          field.label +
          ": " +
          value.split("-").reverse().join("/") +
          " (" +
          weekdayName(value) +
          ")"
        );
      if (field.type === "time" || field.type === "choice") return field.label + ": " + value;
      return field.label + " (respondido)";
    });
}
// Rede de segurança da revisão: pergunta que volta a um dado já respondido, mesmo com outras
// palavras, é descartada. A verificação 0.12.17 pegou o horário de novo no Audiovisual, o nome
// do programa, a mensagem de erro, o nome do relatório ou do arquivo e "qual equipamento" num
// pedido que já diz os três.
const asksFor = (nouns) =>
  new RegExp(
    "\\b(qual|quais|que)\\s+(é\\s+|são\\s+|seria\\s+)?((o|a|os|as)\\s+)?((nome|endereço|link)\\s+(exato\\s+)?(do|da|de|dos|das)\\s+)?(" +
      nouns +
      ")\\b|\\bnome\\s+(exato\\s+)?(do|da)\\s+(" +
      nouns +
      ")\\b",
  );
const DATE_ASK = /\b(data|dia|dias)\b|\bquando\b/;
const TIME_ASK = /hor[áa]rio|que horas|\bhoras?\b|\bturno\b|per[íi]odo/;
const TIME_END = /at[ée] que horas|t[ée]rmino|termin|dura[çc][ãa]o|quanto tempo/;
const ERROR_ASK = asksFor("mensagem|erro|c[óo]digo|aviso");
const FILE_ASK = asksFor("arquivo|documento|planilha|site|apresenta[çc][ãa]o|pasta|recurso|link");
const CLASS_ASK = asksFor("turma|s[ée]rie");
const MACHINE_ASK = asksFor(
  "computador|m[áa]quina|equipamento|identifica[çc][ãa]o|patrim[ôo]nio|etiqueta",
);
const ASKED_AGAIN = {
  modelo: asksFor("modelo|marca"),
  computador: MACHINE_ASK,
  equipamento: MACHINE_ASK,
  "mensagem-de-erro": ERROR_ASK,
  "erro-apresentado": ERROR_ASK,
  erro: ERROR_ASK,
  "mensagem-do-visor": ERROR_ASK,
  programa: asksFor("programa|software|aplicativo"),
  relatorio: asksFor("relat[óo]rio"),
  "link-ou-nome-do-arquivo": FILE_ASK,
  arquivo: FILE_ASK,
  "link-ou-nome-do-recurso": FILE_ASK,
  "link-ou-nome-da-planilha": FILE_ASK,
  "link-ou-nome-do-site": FILE_ASK,
  "arquivos-links": FILE_ASK,
  turma: CLASS_ASK,
  "aluno-turma": CLASS_ASK,
  "turma-atual": CLASS_ASK,
  "turma-destino": CLASS_ASK,
  disciplina: asksFor("disciplina|mat[ée]ria"),
  grupo: asksFor("grupo"),
  dispositivo: asksFor("dispositivo|aparelho"),
  rede: asksFor("rede"),
  usuario: asksFor("usu[áa]rio|login"),
  perfil: asksFor("perfil"),
  "pagina-secao": asksFor("p[áa]gina|se[çc][ãa]o"),
  secao: asksFor("se[çc][ãa]o"),
  finalidade: /finalidade|objetivo|para (que|qu[êe]) (ser[áa]|vai|v[ãa]o|serve)/,
  "sistema-processo": asksFor("sistema|processo"),
  evento: /\b(é|será|se trata de) (para )?um evento\b/,
  "tipo-de-conexao": /\bcabo\b|wi-?fi|tipo de conex/,
  cor: /\bcor\b|\bpreto\b|colorid|ciano|magenta|amarel/,
  roteiro: /roteiro/,
};
function repeatsAnswered(question, item, answers) {
  const q = question.toLowerCase();
  // O setor vem da identificação; a pergunta certa é a sala ou o local.
  if (/\bqual\s+(é\s+)?(o\s+)?(seu\s+)?setor\b/.test(q)) return true;
  // A necessidade já diz o equipamento (ex.: Caixa de Som / Microfone / Projetor).
  if (
    item.area === "Audiovisual" &&
    /\b(qual|quais)\s+(equipamentos?|itens|item|aparelhos?)\b/.test(q)
  )
    return true;
  return (item.fields || []).some((field) => {
    if (!answers[field.id]) return false;
    if (field.type === "date") return DATE_ASK.test(q);
    // Horário ou período já informado: só vale perguntar até que horas ou quanto tempo.
    if (field.type === "time" || field.id === "periodo" || field.id === "horario-periodo")
      return (TIME_ASK.test(q) || (field.type !== "time" && DATE_ASK.test(q))) && !TIME_END.test(q);
    const rule = ASKED_AGAIN[field.id];
    return !!rule && rule.test(q);
  });
}
function safeAssist(result, allowTips, item, answers) {
  // A IA só sugere: uma pergunta de complemento (com dica de onde achar a resposta),
  // até três passos seguros e um alerta quando o relato não combina com o caminho.
  const clean = (value) =>
    typeof value === "string"
      ? value
          .replace(/[\x00-\x1f<>]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "";
  const links = /https?:\/\/|www\./i;
  let question = clean(result && result.pergunta);
  if (
    question.length < 8 ||
    question.length > 180 ||
    links.test(question) ||
    /senha|password|cpf|telefone|celular/i.test(question) ||
    // Nunca pedir nome de pessoas nem endereço de e-mail. A avaliação 0.11.3 pegou
    // "Qual é o nome do aluno…?" e "o nome completo e o e-mail institucional da professora".
    (/\bnomes?\b/i.test(question) &&
      /alun|respons|\bpai\b|m[ãa]e\b|pessoa|professor|funcion|usu[áa]ri|colaborador|estagi/i.test(
        question,
      )) ||
    /e-?mail (institucional|d[aeo]s?\s|para contato)|endere[çc]o de e-?mail/i.test(question) ||
    (item && repeatsAnswered(question, item, answers || {}))
  )
    question = "";
  let help = question ? clean(result && result.ajuda) : "";
  if (help.length < 8 || help.length > 180 || links.test(help)) help = "";
  const tips =
    allowTips && result && Array.isArray(result.dicas)
      ? result.dicas
          .map(clean)
          .filter((tip) => tip.length >= 6 && tip.length <= 160 && !links.test(tip))
          .slice(0, 3)
      : [];
  const coherent = !(result && result.coerente === false);
  let reason = coherent ? "" : clean(result && result.motivo);
  if (reason.length > 160 || links.test(reason)) reason = reason.slice(0, 157) + "…";
  return { question, help, tips, coherent, reason };
}
// Campos que a IA nunca preenche: contatos, contas e dados de alunos continuam com a pessoa.
const EXTRACT_SKIP = [
  "computador",
  "conta",
  "e-mail-da-conta",
  "usuario",
  "aluno",
  "aluno-turma",
  "responsavel",
  "email-responsavel",
  "contato-responsavel",
  "descricao-do-problema",
];
function extractableFields(item) {
  return (item.fields || []).filter(
    (field) => field.type !== "email" && !EXTRACT_SKIP.includes(field.id),
  );
}
function weekdayName(iso) {
  return [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ][new Date(iso + "T12:00:00Z").getUTCDay()];
}
function safeExtract(item, result) {
  // Só valores no formato do campo entram no rascunho; o resto será perguntado.
  const answers = {},
    allowed = extractableFields(item),
    list = result && Array.isArray(result.campos) ? result.campos : [];
  for (const entry of list) {
    const field = allowed.find((f) => f.id === (entry && entry.id));
    if (!field || answers[field.id] !== undefined) continue;
    const value = typeof entry.valor === "string" ? entry.valor.trim() : "";
    if (!value || value.length > 200 || /[<>]/.test(value)) continue;
    if (field.type === "choice" && !field.options.includes(value)) continue;
    if (field.type === "date") {
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        new Date(value + "T00:00:00Z").toISOString().slice(0, 10) !== value ||
        value < policy.localDay()
      )
        continue;
    }
    if (field.type === "time" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) continue;
    if (field.type === "url" && !/^https?:\/\/[^\s/?#]+(?:[/?#][^\s]*)?$/.test(value)) continue;
    answers[field.id] = value;
  }
  for (const field of item.fields || [])
    if (
      field.when &&
      answers[field.id] !== undefined &&
      answers[field.when.field] !== field.when.equals
    )
      delete answers[field.id];
  // Defeito x item novo só existe nos periféricos; em reservas e outros pedidos é ignorado.
  const intent =
    policy.asksEquipmentIntent(item) && result && ["repair", "purchase"].includes(result.intencao)
      ? result.intencao
      : "";
  return { answers, intent };
}
function localSubject(item) {
  return (
    item.area +
    " — " +
    item.need.replace(/\s*[—–]\s*confirmar.*$/i, "").replace(/\s*>\s*/g, " — ")
  ).slice(0, 80);
}
// Link combinado para depois (ex.: roteiro do evento ainda não pronto).
const PENDING_LINK = "Ainda não informado";
function validateAnswers(input, item) {
  const answers = input || {};
  if (
    typeof answers !== "object" ||
    Array.isArray(answers) ||
    Object.keys(answers).some((key) => !item.fields?.some((field) => field.id === key))
  )
    throw new InvalidRequest("Confira os detalhes da solicitação.");
  const result = {};
  for (const field of item.fields || []) {
    if (field.when && answers[field.when.field] !== field.when.equals) continue;
    const value = answers[field.id];
    if (typeof value !== "string" || !value.trim() || value.length > 1000)
      throw new InvalidRequest("Preencha: " + field.label);
    if (field.type === "choice" && !field.options.includes(value))
      throw new InvalidRequest("Selecione uma opção válida: " + field.label);
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      throw new InvalidRequest("Confira: " + field.label);
    if (
      field.type === "date" &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        Number.isNaN(Date.parse(value + "T00:00:00Z")) ||
        new Date(value + "T00:00:00Z").toISOString().slice(0, 10) !== value)
    )
      throw new InvalidRequest("Confira a data.");
    if (field.type === "date" && value < policy.localDay())
      throw new InvalidRequest("Escolha hoje ou uma data futura para o atendimento.");
    if (field.type === "time" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value))
      throw new InvalidRequest("Confira o horário.");
    if (field.type === "url" && value !== PENDING_LINK) {
      try {
        if (!["http:", "https:"].includes(new URL(value).protocol)) throw Error();
      } catch {
        throw new InvalidRequest("Informe um link válido.");
      }
    }
    result[field.id] = value;
  }
  return result;
}
// Teste com usuários (0.12): código do participante vindo do link (?p=P01).
function safeParticipant(value) {
  const code = typeof value === "string" ? value.trim().toUpperCase() : "";
  return /^P\d{2,3}$/.test(code) ? code : "";
}
// Métricas anônimas de um atendimento: só valores de listas fechadas, números, o número do
// chamado e um comentário curto. Nunca nome, e-mail ou o texto do relato.
const METRIC_OPTIONS = {
  stage: ["início", "identificação", "caminho", "resumo", "enviado", "resolvido sem chamado"],
  device: ["celular", "computador"],
  method: ["", "botões", "descrição", "descrição, depois botões"],
  aiDraft: [
    "",
    "aceito",
    "corrigiu os dados",
    "trocou pelo sugerido",
    "escolheu pelas opções",
    "sem IA",
    "não identificou",
  ],
  coherence: ["", "trocou o tipo", "manteve"],
  followUp: ["", "respondeu", "não sabia", "pulou"],
  tips: ["", "resolveu", "seguiu para o chamado"],
};
// Nome legível do caminho para a planilha (a validação guarda o ID, para poder ser refeita).
function metricPathLabel(id, desk) {
  const item = id ? desk.knowledgeBase.items.filter((entry) => entry.id === id)[0] : null;
  return item ? item.area + " › " + item.need : "";
}
function safeMetrics(body, desk) {
  if (
    !body ||
    typeof body !== "object" ||
    typeof body.sessionId !== "string" ||
    !/^[a-f0-9-]{36}$/i.test(body.sessionId)
  )
    throw new InvalidRequest("Sessão inválida.");
  const pick = (key) => {
    const value = typeof body[key] === "string" ? body[key] : "";
    if (METRIC_OPTIONS[key].indexOf(value) < 0) throw new InvalidRequest("Métrica inválida.");
    return value;
  };
  const whole = (value, max) =>
    typeof value === "number" && Math.floor(value) === value && value >= 0 && value <= max
      ? value
      : null;
  const item = body.path
    ? desk.knowledgeBase.items.filter((entry) => entry.id === body.path)[0]
    : null;
  if (body.path && !item) throw new InvalidRequest("Caminho inválido.");
  const backs = whole(body.backs, 500),
    ease = whole(body.ease, 5);
  return {
    sessionId: body.sessionId.toLowerCase(),
    participant: safeParticipant(body.participant),
    device: pick("device"),
    stage: pick("stage"),
    method: pick("method"),
    path: item ? item.id : "",
    aiDraft: pick("aiDraft"),
    coherence: pick("coherence"),
    followUp: pick("followUp"),
    tips: pick("tips"),
    backs: backs === null ? 0 : backs,
    ticket: typeof body.ticket === "string" && /^#\d{3,}$/.test(body.ticket) ? body.ticket : "",
    secondsToSend: whole(body.secondsToSend, 86400),
    ease: ease === null ? 0 : ease,
    comment:
      typeof body.comment === "string"
        ? body.comment
            .replace(/[\x00-\x1f<>]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 300)
        : "",
  };
}

module.exports = {
  policy,
  validateSelection,
  validateDescription,
  safeSubject,
  safeAssist,
  answeredForAI,
  repeatsAnswered,
  safeExtract,
  extractableFields,
  weekdayName,
  PENDING_LINK,
  localSubject,
  validateAnswers,
  safeParticipant,
  safeMetrics,
  metricPathLabel,
  METRIC_OPTIONS,
};
