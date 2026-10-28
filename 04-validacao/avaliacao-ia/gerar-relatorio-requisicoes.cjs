"use strict";
// Monta relatorio-requisicoes-v0.12.17.md a partir das rodadas de verificar-requisicoes.cjs.
// Uso: node gerar-relatorio-requisicoes.cjs
const fs = require("node:fs");
const path = require("node:path");
const AQUI = __dirname;
const ler = (nome) =>
  fs.existsSync(path.join(AQUI, nome)) ? JSON.parse(fs.readFileSync(path.join(AQUI, nome), "utf8")) : [];
const antes = ler("requisicoes-antes.json");
const primeira = ler("requisicoes-parcial-1a-instrucao.json");
const assuntoAntes = ler("requisicoes-parcial-2a-assunto.json");
const depois = ler("requisicoes-depois.json");
const chave = (r) => r.id + "|" + (r.nota || "");
const mapa = (lista, etapa) =>
  new Map(lista.filter((r) => r.etapa === etapa).map((r) => [chave(r), r]));
const A = mapa(antes, "assist"),
  P = mapa(primeira, "assist"),
  D = mapa(depois, "assist"),
  SA = mapa(assuntoAntes, "subject"),
  SD = mapa(depois, "subject");
// Leitura humana da rodada "antes": perguntas que voltam a um dado já respondido, mas que a
// marcação automática não pegou (ou que não fazem sentido para o pedido).
const REVISAO_ANTES = {
  "AV-003|": "pergunta qual dos três equipamentos, que a necessidade já diz",
  "IMP-003|": "nome ou patrimônio da impressora, com o modelo já informado",
  "TI-MENT-002|": "nome do relatório já informado",
  "TI-MENT-008|": "nome do relatório já informado",
  "GOO-004|": "nome do documento já informado",
  "TI-003|": "alerta falso: TV é assunto de TI e o caminho é Outros",
  "IMP-001|": "pede e-mail (a instrução proíbe)",
  "AV-003|relato sem sentido": "volta a perguntar qual equipamento",
};
const celula = (r, campo) =>
  !r
    ? "—"
    : r.source !== "ai"
      ? "(IA indisponível)"
      : campo === "assunto"
        ? r.assunto || "—"
        : (r.coerente ? "" : "**Alerta:** " + r.motivo + " ") + (r.pergunta || "(sem pergunta)");
const linhas = [...new Set([...A.keys(), ...D.keys()])].map((k) => {
  const a = A.get(k),
    d = D.get(k);
  const marca = [
    a && a.repete && a.repete.length ? "repete " + a.repete.join(", ") : "",
    REVISAO_ANTES[k] || "",
  ]
    .filter(Boolean)
    .join("; ");
  return (
    "| " +
    k.replace("|", " ").trim() +
    " | " +
    celula(a) +
    (marca ? " ⚠ _" + marca + "_" : "") +
    " | " +
    celula(P.get(k)) +
    " | " +
    celula(d) +
    " |"
  );
});
const conta = (m, f) => [...m.values()].filter(f).length;
const repetidasAntes = [...A.entries()].filter(
  ([k, r]) => r.pergunta && ((r.repete && r.repete.length) || REVISAO_ANTES[k]),
).length;
const assuntos = [...new Set([...SA.keys(), ...SD.keys()])].map(
  (k) => "| " + k.replace("|", "").trim() + " | " + celula(SA.get(k), "assunto") + " | " + celula(SD.get(k), "assunto") + " |",
);
const analyze = depois.filter((r) => r.etapa === "analyze");
const extract = depois.filter((r) => r.etapa === "extract");
const md = `# Verificação de todas as requisições da IA — 0.12.17

Data: 2026-10-28. Servidor local com a chave do \`.env\` e o envio ao Google desligado; nenhum chamado criado. Cada caminho foi percorrido como na conversa pelos botões: campos já respondidos (data daqui a 3 dias, 14:00, "Não" no evento, valores de texto fictícios) e o relato **vago** do banco \`relatos.json\`, que não repete esses dados — é quando a IA mais pergunta. Mais cinco casos-limite vistos na planilha (#014, #020, #021, #022).

## Revisão (\`/api/assist\`)

| Rodada | Perguntas | Voltam a dado já respondido ou não fazem sentido | Alertas de incoerência |
|---|---|---|---|
| Antes (0.12.16) | ${conta(A, (r) => r.pergunta)} em ${A.size} | ${repetidasAntes} | ${conta(A, (r) => !r.coerente)} (1 falso, em Outros) |
| 1ª instrução nova (rodada interrompida) | ${conta(P, (r) => r.pergunta)} em ${P.size} | local perguntado até em Agendas do Google | ${conta(P, (r) => !r.coerente)} |
| Depois (0.12.17) | ${conta(D, (r) => r.pergunta)} em ${D.size} | 0 | ${conta(D, (r) => !r.coerente)} (micro-ondas num pedido de som) |

O que mudou: a IA recebe o valor de data, horário e opções já respondidos (textos livres continuam só pelo rótulo); a instrução proíbe pedir de novo o que já foi respondido, perguntar qual equipamento quando a necessidade já diz e perguntar o setor, e limita a pergunta de local a reservas, instalações e equipamentos; e o servidor descarta a pergunta que ainda volte a um dado respondido (\`repeatsAnswered\`).

| Caminho | Antes (0.12.16) | 1ª instrução nova | Depois (0.12.17) |
|---|---|---|---|
${linhas.join("\n")}

## Assunto (\`/api/subject\`)

O Pages usava uma instrução mais curta que o servidor local; agora as duas usam \`SUBJECT_INSTRUCTION\`, que também recebe o tipo do pedido. A coluna "antes" é a instrução unificada sem as regras de resumo e de tipo.

| Caminho | Antes | Depois |
|---|---|---|
${assuntos.join("\n")}

## Identificação e extração (\`/api/analyze\`, \`/api/extract\`)

Instruções sem mudança desde a 0.11.4 (57/57 caminhos naquela avaliação). Conferência de hoje com o relato claro: identificação certa na 1ª sugestão em ${analyze.filter((r) => r.certo).length} de ${analyze.length} caminhos; extração em ${extract.length} caminhos, com datas relativas resolvidas a partir de 28/10 (quarta): amanhã → 29/10, sexta → 30/10, dia 20 → 20/11, terça → 03/11. A rodada parou nesse ponto para poupar a cota diária e refazer a revisão.

| Caminho | Relato | Extraído |
|---|---|---|
${extract.map((r) => "| " + r.id + " | " + r.relato.replace(/\|/g, "/") + " | " + JSON.stringify(r.respostas).replace(/\|/g, "/") + " |").join("\n")}
`;
fs.writeFileSync(path.join(AQUI, "relatorio-requisicoes-v0.12.17.md"), md);
console.log("relatorio-requisicoes-v0.12.17.md gerado");
