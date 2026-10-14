"use strict";
// Gera relatorio-avaliacao-ia.md a partir das rodadas (resultados-*.json) e do percurso pelos botões.
// Uso: node gerar-relatorio.cjs antes,depois [controle-antes,controle-depois]
const fs = require("node:fs");
const path = require("node:path");
const AQUI = __dirname;
const ler = (lista) =>
  (lista || "")
    .split(",")
    .filter(Boolean)
    .map((nome) => ({
      nome,
      ...JSON.parse(
        fs.readFileSync(
          path.join(AQUI, "resultados-" + nome + ".json"),
          "utf8",
        ),
      ),
    }));
const rodadas = ler(process.argv[2]);
const controles = ler(process.argv[3]);
const parciais = ler(process.argv[4]);
if (!rodadas.length) throw new Error("Informe ao menos uma rodada.");
const percursoArquivo = path.join(AQUI, "percurso-botoes.json");
const percurso = fs.existsSync(percursoArquivo)
  ? JSON.parse(fs.readFileSync(percursoArquivo, "utf8"))
  : [];

const pct = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "—");
const fracao = (a, b) => a + "/" + b + " (" + pct(a, b) + ")";
const area = (id) => (id ? id.split("-")[0] : "—");
const AREAS = { AV: "Audiovisual", IMP: "Impressora", GOO: "Google", TI: "TI" };

function placar(casos, chave) {
  const so = (filtro) => casos.filter(filtro);
  const linha = (lista) => [
    fracao(lista.filter((c) => chave(c).top1).length, lista.length),
    fracao(lista.filter((c) => chave(c).top3).length, lista.length),
  ];
  const caminhos = so((c) => c.esperado && c.tipo !== "misto");
  return {
    geral: linha(caminhos),
    claro: linha(so((c) => c.tipo === "claro")),
    vago: linha(so((c) => c.tipo === "vago")),
    informal: linha(so((c) => c.tipo === "informal")),
    areas: Object.fromEntries(
      Object.keys(AREAS).map((a) => [
        a,
        linha(caminhos.filter((c) => area(c.esperado) === a)),
      ]),
    ),
    fora: fracao(
      so((c) => c.tipo === "fora").filter((c) => chave(c).top1).length,
      so((c) => c.tipo === "fora").length,
    ),
    restrito: fracao(
      so((c) => c.tipo === "restrito").filter((c) => chave(c).top1).length,
      so((c) => c.tipo === "restrito").length,
    ),
    misto: linha(so((c) => c.tipo === "misto")),
  };
}
function extracao(casos) {
  const campos = casos.flatMap((c) =>
    c.extracao
      ? Object.entries(c.extracao.campos).map(([id, v]) => ({
          caso: c,
          id,
          ...v,
        }))
      : [],
  );
  const datas = campos.filter((c) => c.esperado.startsWith("@"));
  return {
    campos,
    total: fracao(
      campos.filter((c) => c.resultado === "ok").length,
      campos.length,
    ),
    datas: fracao(
      datas.filter((c) => c.resultado === "ok").length,
      datas.length,
    ),
    outros: fracao(
      campos.filter((c) => !c.esperado.startsWith("@") && c.resultado === "ok")
        .length,
      campos.length - datas.length,
    ),
    erros: campos.filter((c) => c.resultado !== "ok"),
    extras: casos.filter((c) => c.extracao && c.extracao.extras.length),
  };
}

const ultima = rodadas[rodadas.length - 1];
const ia = (c) => c.pontos;
const local = (c) => c.local.pontos;
let md = "# Avaliação técnica da IA do SmartDesk\n\n";
md +=
  "Gerado em " +
  new Date().toISOString().slice(0, 10) +
  " a partir de `relatos.json` (" +
  ultima.casos.length +
  " relatos fictícios: 3 por caminho — claro, vago e informal — mais casos fora do escopo, restritos por setor, mistos e uma tentativa de manipular a IA). ";
md +=
  "Servidor local com o Gemini real (`/api/analyze` e `/api/extract`), envio ao Google desligado. É uma verificação técnica, não substitui o teste com usuários.\n\n";
md +=
  '**Como ler:** "1ª sugestão" = o caminho certo veio em primeiro (é o que o rascunho usa). "Entre as 3" = apareceu em alguma das sugestões. A base local é o classificador por palavras-chave usado quando a IA está fora.\n\n';
const pendentes = [];
if (parciais.length) pendentes.push("a rodada completa da instrução nova e o banco de controle com ela");
if (percurso.length < 57) pendentes.push("o percurso pelos botões (" + percurso.length + " de 57 caminhos feitos)");
if (pendentes.length)
  md += "**Situação:** avaliação incompleta. Faltam " + pendentes.join(" e ") + ", que esperam a cota diária do Gemini voltar.\n\n";

md +=
  "## Identificação do caminho\n\n| Recorte | " +
  rodadas
    .map(
      (r) => "IA " + r.nome + " — 1ª sugestão | IA " + r.nome + " — entre as 3",
    )
    .join(" | ") +
  " | Base local — 1ª | Base local — entre as 3 |\n|---|" +
  rodadas.map(() => "---|---").join("|") +
  "|---|---|\n";
const placares = rodadas.map((r) => placar(r.casos, ia)),
  placarLocal = placar(ultima.casos, local);
for (const [rotulo, chave] of [
  ["Todos os 57 caminhos", "geral"],
  ["Relatos claros", "claro"],
  ["Relatos vagos", "vago"],
  ["Relatos informais", "informal"],
])
  md +=
    "| " +
    rotulo +
    " | " +
    placares.map((p) => p[chave].join(" | ")).join(" | ") +
    " | " +
    placarLocal[chave].join(" | ") +
    " |\n";
for (const [sigla, nome] of Object.entries(AREAS))
  md +=
    "| " +
    nome +
    " | " +
    placares.map((p) => p.areas[sigla].join(" | ")).join(" | ") +
    " | " +
    placarLocal.areas[sigla].join(" | ") +
    " |\n";
md +=
  "\n| Casos especiais | " +
  rodadas.map((r) => "IA " + r.nome).join(" | ") +
  " | Base local |\n|---|" +
  rodadas.map(() => "---").join("|") +
  "|---|\n";
md +=
  "| Fora do escopo barrados (nenhuma sugestão) | " +
  placares.map((p) => p.fora).join(" | ") +
  " | " +
  placarLocal.fora +
  " |\n";
md +=
  "| Restritos ao setor sem sugestão indevida | " +
  placares.map((p) => p.restrito).join(" | ") +
  " | " +
  placarLocal.restrito +
  " |\n";
md +=
  "| Dois pedidos no mesmo relato — os dois sugeridos | " +
  placares.map((p) => p.misto[1]).join(" | ") +
  " | " +
  placarLocal.misto[1] +
  " |\n\n";

md += "## Extração dos dados do relato (rodada " + ultima.nome + ")\n\n";
for (const r of rodadas) {
  const e = extracao(r.casos);
  md +=
    "- **" +
    r.nome +
    ":** " +
    e.total +
    " dos campos conferidos certos; datas " +
    e.datas +
    "; demais campos " +
    e.outros +
    ".\n";
}
const ex = extracao(ultima.casos);
if (ex.erros.length) {
  md +=
    "\nCampos que não bateram:\n\n| Relato | Campo | Esperado | Obtido |\n|---|---|---|---|\n";
  for (const e of ex.erros)
    md +=
      "| " +
      e.caso.relato +
      " | " +
      e.id +
      " | " +
      e.esperado +
      " | " +
      (e.obtido || "(vazio)") +
      " |\n";
}
if (ex.extras.length) {
  md +=
    "\nCampos preenchidos além dos conferidos (revisar se estavam mesmo no relato):\n\n| Relato | Campos extras |\n|---|---|\n";
  for (const c of ex.extras)
    md +=
      "| " +
      c.relato +
      " | " +
      c.extracao.extras
        .map((id) => id + " = " + c.extracao.respostas[id])
        .join("; ") +
      " |\n";
}

// "Evento" preenchido pela IA sem estar entre os campos esperados do relato.
const eventoExtra = (casos) => {
  const comExtracao = casos.filter(
    (c) =>
      c.extracao && c.extracao.source === "ai" && c.esperado?.startsWith("AV-"),
  );
  return fracao(
    comExtracao.filter(
      (c) =>
        "evento" in c.extracao.respostas && !("evento" in c.extracao.campos),
    ).length,
    comExtracao.length,
  );
};
if (parciais.length) {
  const base = rodadas[0];
  md += "\n## Mudanças na instrução, comparadas nos mesmos relatos\n\n";
  md +=
    "Estas rodadas pararam no limite diário gratuito do Gemini (500 pedidos por dia). A comparação usa só os relatos que a IA respondeu, contra os mesmos relatos da rodada " +
    base.nome +
    ".\n\n";
  md +=
    "| Versão | Relatos respondidos | Caminho certo em 1º | Mesmos relatos na rodada " +
    base.nome +
    ' | "Evento" marcado sem estar no relato (Audiovisual) | Na rodada ' +
    base.nome +
    " |\n|---|---|---|---|---|---|\n";
  for (const r of parciais) {
    const feitos = r.casos.filter((c) => c.analise.source === "ai"),
      nums = new Set(feitos.map((c) => c.n)),
      mesmos = base.casos.filter((c) => nums.has(c.n)),
      comExtracao = new Set(
        feitos
          .filter((c) => c.extracao && c.extracao.source === "ai")
          .map((c) => c.n),
      );
    md +=
      "| " +
      r.nome +
      " | " +
      feitos.length +
      " | " +
      fracao(feitos.filter((c) => c.pontos.top1).length, feitos.length) +
      " | " +
      fracao(mesmos.filter((c) => c.pontos.top1).length, mesmos.length) +
      " | " +
      eventoExtra(feitos) +
      " | " +
      eventoExtra(mesmos.filter((c) => comExtracao.has(c.n))) +
      " |\n";
  }
  for (const r of parciais) {
    const erros = r.casos.filter(
      (c) => c.analise.source === "ai" && !c.pontos.top1,
    );
    if (erros.length)
      md +=
        "\nErros de " +
        r.nome +
        ": " +
        erros
          .map(
            (c) =>
              "#" +
              c.n +
              ' "' +
              c.relato +
              '" → ' +
              (c.analise.ids.join(", ") || "nenhuma") +
              " (esperado " +
              (c.esperado || "nenhuma") +
              ")",
          )
          .join("; ") +
        ".\n";
  }
}
if (controles.length) {
  md +=
    "\n## Banco de controle (relatos novos, nunca usados para ajustar a IA)\n\n| Rodada | Caminho certo em 1º | Entre as 3 | Fora do escopo barrados | Extração |\n|---|---|---|---|---|\n";
  for (const r of controles) {
    const caminhos = r.casos.filter((c) => c.esperado),
      fora = r.casos.filter((c) => !c.esperado),
      e = extracao(r.casos);
    md +=
      "| " +
      r.nome +
      " | " +
      fracao(caminhos.filter((c) => c.pontos.top1).length, caminhos.length) +
      " | " +
      fracao(caminhos.filter((c) => c.pontos.top3).length, caminhos.length) +
      " | " +
      fracao(fora.filter((c) => c.pontos.top1).length, fora.length) +
      " | " +
      e.total +
      " |\n";
  }
  const ultimoControle = controles[controles.length - 1];
  const errosControle = ultimoControle.casos.filter((c) => !c.pontos.top1);
  if (errosControle.length) {
    md +=
      "\nErros no controle (" +
      ultimoControle.nome +
      "):\n\n| Relato | Esperado | Sugestões da IA |\n|---|---|---|\n";
    for (const c of errosControle)
      md +=
        "| " +
        c.relato +
        " | " +
        (c.esperado || "nenhuma") +
        " | " +
        (c.analise.ids.join(", ") || "nenhuma") +
        " |\n";
  }
}
md +=
  "\n## Erros da IA na rodada " +
  ultima.nome +
  "\n\n| # | Tipo | Setor | Relato | Esperado | Sugestões da IA |\n|---|---|---|---|---|---|\n";
for (const c of ultima.casos.filter((c) => !c.pontos.top1))
  md +=
    "| " +
    c.n +
    " | " +
    c.tipo +
    " | " +
    c.setor +
    " | " +
    c.relato +
    " | " +
    (c.esperado || "nenhuma") +
    (c.aceitos.length ? " (ou " + c.aceitos.join(", ") + ")" : "") +
    " | " +
    (c.analise.ids.join(", ") || "nenhuma") +
    " |\n";

if (percurso.length) {
  const ok = percurso.filter((p) => p.ok);
  md +=
    "\n## Percurso pelos botões (" +
    ok.length +
    "/" +
    percurso.length +
    " caminhos até o resumo)\n\n";
  md +=
    "Cada caminho foi percorrido no navegador do início ao resumo, sem enviar, usando o relato claro como descrição.\n\n";
  const falhas = percurso.filter((p) => !p.ok);
  if (falhas.length)
    md +=
      "Falhas:\n\n" +
      falhas
        .map(
          (p) =>
            "- " + p.id + ": " + p.erro + " — última mensagem: " + p.ultima,
        )
        .join("\n") +
      "\n\n";
  const alertas = percurso.filter((p) => p.alerta);
  md +=
    "- Alertas de incoerência com relato coerente (falso alarme): " +
    fracao(alertas.length, percurso.length) +
    "\n";
  md +=
    "- Caminhos em que a IA fez pergunta de complemento: " +
    fracao(percurso.filter((p) => p.perguntas.length).length, percurso.length) +
    "\n";
  md +=
    "- Caminhos com dicas antes do envio: " +
    fracao(percurso.filter((p) => p.dicas).length, percurso.length) +
    "\n\n";
  if (alertas.length)
    md +=
      "Falsos alarmes:\n\n" +
      alertas
        .map(
          (p) => "- " + p.id + ": " + p.alerta.replace(/^SmartDesk( IA)?/, ""),
        )
        .join("\n") +
      "\n\n";
  const perguntas = percurso.filter((p) => p.perguntas.length);
  if (perguntas.length)
    md +=
      "Perguntas feitas pela IA:\n\n" +
      perguntas
        .map(
          (p) =>
            "- " +
            p.id +
            ": " +
            p.perguntas
              .map((q) => q.replace(/^SmartDesk( IA)?/, ""))
              .join(" / "),
        )
        .join("\n") +
      "\n";
}
fs.writeFileSync(path.join(AQUI, "relatorio-avaliacao-ia.md"), md);
console.log(md.slice(0, 3000));
