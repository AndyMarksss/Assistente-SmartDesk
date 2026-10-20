/**
 * Teste com usuários (0.12). Executar no editor uma vez antes das sessões
 * (Executar → prepararPlanilhaDeValidacao). Cria, na planilha do SmartDesk, as abas
 * "Validação — Tarefas", "Validação — Participantes" e "Validação — Resumo", ao lado da aba
 * Sessões (métricas automáticas). Pode rodar de novo: só cria o que estiver faltando.
 * Cenários CT-01 a CT-11 da Matriz Mestre; colunas no modelo da aba 05_Resultados_Validacao.
 */
var VALIDACAO_CENARIOS = {
  "CT-01": [
    "O projetor da sala não mostra a imagem do meu notebook.",
    "Audiovisual > Projetor / possível HDMI",
  ],
  "CT-02": [
    "Preciso de caixa de som e microfone para uma palestra na sexta-feira.",
    "Audiovisual > Caixa de Som / Microfone",
  ],
  "CT-03": [
    "Acabou o toner magenta da impressora do setor.",
    "Impressora > Solicitação de Toner / Tinta",
  ],
  "CT-04": ["A impressora está prendendo as folhas.", "Impressora > Papel Atolado"],
  "CT-05": ["Esqueci a senha do meu e-mail institucional.", "Google > Resetar senha"],
  "CT-06": ["Preciso reservar um Chromebook para amanhã.", "Google > Reserva de Chromebook"],
  "CT-07": [
    "Meu computador está muito lento e trava quando abro os programas.",
    "TI > COMPUTADOR > Problemas com lentidão",
  ],
  "CT-08": [
    "Meu notebook conecta no Wi-Fi mas a internet fica caindo.",
    "TI > INTERNET > Problemas com Wi-Fi",
  ],
  "CT-09": ["Preciso alterar uma nota no Mentor Web.", "TI > MENTOR WEB > Alteração de notas"],
  "CT-10": [
    "Sou do Financeiro e o QuickBooks está apresentando erro.",
    "TI > QUICKBOOKS > Erro no sistema",
  ],
  "CT-11": [
    "Sou da Coordenação do Infantil e preciso acessar as câmeras.",
    "TI > CÂMERAS > Acesso às Câmeras",
  ],
};
// Rodízio: cada cenário pelo menos uma vez; CT-01, CT-02, CT-04 e CT-09 duas vezes.
var VALIDACAO_RODIZIO = [
  ["P01", ["CT-01", "CT-04", "CT-09"]],
  ["P02", ["CT-02", "CT-05", "CT-07"]],
  ["P03", ["CT-03", "CT-08", "CT-10"]],
  ["P04", ["CT-06", "CT-11", "CT-01"]],
  ["P05", ["CT-04", "CT-02", "CT-09"]],
];
var VALIDACAO_TAREFAS = "Validação — Tarefas",
  VALIDACAO_PARTICIPANTES = "Validação — Participantes",
  VALIDACAO_RESUMO = "Validação — Resumo";

function prepararPlanilhaDeValidacao() {
  var book = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty("SMARTDESK_SHEET_ID"),
    ),
    criadas = [];
  if (!book.getSheetByName("Sessões")) {
    var sessoes = book.insertSheet("Sessões");
    sessoes
      .getRange(1, 1, 1, SESSOES_CABECALHO.length)
      .setValues([SESSOES_CABECALHO])
      .setFontWeight("bold");
    sessoes.setFrozenRows(1);
    criadas.push("Sessões");
  }
  if (!book.getSheetByName(VALIDACAO_TAREFAS)) {
    validacaoTarefas_(book.insertSheet(VALIDACAO_TAREFAS));
    criadas.push(VALIDACAO_TAREFAS);
  }
  if (!book.getSheetByName(VALIDACAO_PARTICIPANTES)) {
    validacaoParticipantes_(book.insertSheet(VALIDACAO_PARTICIPANTES));
    criadas.push(VALIDACAO_PARTICIPANTES);
  }
  if (!book.getSheetByName(VALIDACAO_RESUMO)) {
    validacaoResumo_(book.insertSheet(VALIDACAO_RESUMO));
    criadas.push(VALIDACAO_RESUMO);
  }
  console.log(
    criadas.length
      ? "Abas criadas: " + criadas.join(", ") + "."
      : "As abas de validação já existiam; nada foi alterado.",
  );
  return criadas;
}

function validacaoLista_(valores) {
  return SpreadsheetApp.newDataValidation()
    .requireValueInList(valores, true)
    .setAllowInvalid(false)
    .build();
}

// Uma linha por participante × cenário. Quem facilita preenche o número do chamado e o que
// observou; caminho, forma de escolha, rascunho da IA, tempo, voltas e nota vêm da aba Sessões.
function validacaoTarefas_(sheet) {
  var cabecalho = [
    "Participante",
    "Perfil",
    "Cenário",
    "Texto apresentado ao participante",
    "Classificação esperada",
    "Chamado (nº)",
    "Classificação escolhida",
    "Como escolheu",
    "Rascunho da IA",
    "Caminho certo?",
    "Concluiu sem ajuda?",
    "Precisou corrigir?",
    "Tempo até enviar (s)",
    "Voltas",
    "Facilidade no chat (1 a 5)",
    "Clareza (1 a 5)",
    "Usaria novamente?",
    "Comentário / feedback",
    "Observações do teste",
  ];
  sheet.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]).setFontWeight("bold");
  sheet.setFrozenRows(1);
  var linhas = [];
  VALIDACAO_RODIZIO.forEach(function (par) {
    par[1].forEach(function (cenario) {
      linhas.push([par[0], "", cenario, VALIDACAO_CENARIOS[cenario][0], VALIDACAO_CENARIOS[cenario][1]]);
    });
  });
  sheet.getRange(2, 1, linhas.length, 5).setValues(linhas);
  // Busca na aba Sessões pela coluna N (Chamado). Sessões guarda texto; VALUE converte números.
  var busca = function (coluna, numero, r) {
    var achado = "INDEX('Sessões'!$" + coluna + ":$" + coluna + ",MATCH($F" + r + ",'Sessões'!$N:$N,0))";
    return '=IF($F' + r + '="","",IFERROR(' + (numero ? "VALUE(" + achado + ")" : achado) + ',"não encontrado"))';
  };
  var formulas = [];
  for (var r = 2; r < linhas.length + 2; r++)
    formulas.push([
      busca("H", false, r),
      busca("G", false, r),
      busca("I", false, r),
    ]);
  sheet.getRange(2, 7, linhas.length, 3).setFormulas(formulas);
  var numeros = [];
  for (var n = 2; n < linhas.length + 2; n++)
    numeros.push([busca("O", true, n), busca("M", true, n), busca("P", true, n)]);
  sheet.getRange(2, 13, linhas.length, 3).setFormulas(numeros);
  var altura = 200;
  sheet.getRange(2, 10, altura, 1).setDataValidation(validacaoLista_(["Sim", "Não"]));
  sheet.getRange(2, 11, altura, 1).setDataValidation(validacaoLista_(["Sim", "Com ajuda", "Não"]));
  sheet.getRange(2, 12, altura, 1).setDataValidation(validacaoLista_(["Sim", "Não"]));
  sheet.getRange(2, 16, altura, 1).setDataValidation(validacaoLista_(["1", "2", "3", "4", "5"]));
  sheet.getRange(2, 17, altura, 1).setDataValidation(validacaoLista_(["Sim", "Talvez", "Não"]));
}

function validacaoParticipantes_(sheet) {
  var cabecalho = [
    "Participante",
    "Perfil / setor",
    "Uso de tecnologia",
    "Dispositivo",
    "Como pede ajuda à TI hoje",
    "Usaria no dia a dia?",
    "Nota de recomendação (0 a 10)",
    "O que mais gostou",
    "O que mudaria",
    "Observações",
  ];
  sheet.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]).setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange(2, 1, VALIDACAO_RODIZIO.length, 1).setValues(
    VALIDACAO_RODIZIO.map(function (par) {
      return [par[0]];
    }),
  );
  var altura = 50;
  sheet.getRange(2, 3, altura, 1).setDataValidation(validacaoLista_(["Baixo", "Médio", "Alto"]));
  sheet.getRange(2, 4, altura, 1).setDataValidation(validacaoLista_(["Celular", "Computador"]));
  sheet.getRange(2, 6, altura, 1).setDataValidation(validacaoLista_(["Sim", "Talvez", "Não"]));
  sheet
    .getRange(2, 7, altura, 1)
    .setDataValidation(validacaoLista_(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]));
}

// Indicadores calculados e quadro de critérios. As metas ficam em branco: são definidas antes
// dos testes, na parte de hipóteses, e não pelo sistema.
function validacaoResumo_(sheet) {
  var t = "'" + VALIDACAO_TAREFAS + "'!",
    p = "'" + VALIDACAO_PARTICIPANTES + "'!",
    indicadores = [
      ["Indicador", "Valor", "Como é calculado"],
      [
        "Participantes com sessão registrada",
        "=SUMPRODUCT((" + p + "A2:A<>\"\")*(COUNTIF('Sessões'!B2:B," + p + "A2:A)>0))",
        "Códigos da aba Participantes que aparecem em Sessões (ensaios como P00 ficam de fora)",
      ],
      ["Tarefas observadas", "=COUNTA(" + t + "K2:K)", "Linhas com Concluiu sem ajuda preenchido"],
      [
        "Concluíram sem ajuda",
        "=IFERROR(COUNTIF(" + t + "K2:K,\"Sim\")/COUNTA(" + t + "K2:K),\"\")",
        "Sim ÷ tarefas observadas",
      ],
      [
        "Chegaram ao caminho certo",
        "=IFERROR(COUNTIF(" + t + "J2:J,\"Sim\")/COUNTA(" + t + "J2:J),\"\")",
        "Sim ÷ tarefas com Caminho certo preenchido",
      ],
      [
        "Precisaram corrigir",
        "=IFERROR(COUNTIF(" + t + "L2:L,\"Sim\")/COUNTA(" + t + "L2:L),\"\")",
        "Sim ÷ tarefas com Precisou corrigir preenchido",
      ],
      ["Tempo médio até enviar (s)", "=IFERROR(AVERAGE(" + t + "M2:M),\"\")", "Média da aba Sessões"],
      ["Voltas por tarefa (média)", "=IFERROR(AVERAGE(" + t + "N2:N),\"\")", "Média da aba Sessões"],
      [
        "Facilidade no chat (média 1 a 5)",
        "=IFERROR(AVERAGE(" + t + "O2:O),\"\")",
        "Nota dada no fim do chat",
      ],
      ["Clareza (média 1 a 5)", "=IFERROR(AVERAGE(ARRAYFORMULA(VALUE(FILTER(" + t + "P2:P," + t + "P2:P<>\"\")))),\"\")", "Nota anotada por quem facilita"],
      [
        "Usariam novamente",
        "=IFERROR(COUNTIF(" + t + "Q2:Q,\"Sim\")/COUNTA(" + t + "Q2:Q),\"\")",
        "Sim ÷ respostas",
      ],
      [
        "Recomendação (média 0 a 10)",
        "=IFERROR(AVERAGE(ARRAYFORMULA(VALUE(FILTER(" + p + "G2:G," + p + "G2:G<>\"\")))),\"\")",
        "Aba Participantes",
      ],
      [
        "Sessões de participantes não concluídas",
        "=SUMPRODUCT(('Sessões'!B2:B<>\"\")*(COUNTIF(" +
          p +
          "A2:A,'Sessões'!B2:B)>0)*('Sessões'!F2:F<>\"enviado\")*('Sessões'!F2:F<>\"resolvido sem chamado\"))",
        "Atendimentos dos participantes listados que pararam antes de enviar (ver Última etapa)",
      ],
    ];
  sheet.getRange(1, 1, indicadores.length, 3).setValues(indicadores);
  sheet.getRange(1, 1, 1, 3).setFontWeight("bold");
  [4, 5, 6, 11].forEach(function (linha) {
    sheet.getRange(linha, 2).setNumberFormat("0%");
  });
  [7, 8, 9, 10, 12].forEach(function (linha) {
    sheet.getRange(linha, 2).setNumberFormat("0.0");
  });
  var inicio = indicadores.length + 2,
    criterios = [
      ["Critérios de decisão", "", "", "", ""],
      [
        "Hipótese (escreva antes dos testes)",
        "Indicador",
        "Meta",
        "Resultado",
        "Atingiu?",
      ],
      ["", "Concluíram sem ajuda", "", "=B4", ""],
      ["", "Chegaram ao caminho certo", "", "=B5", ""],
      ["", "Tempo médio até enviar (s) — quanto menor, melhor", "", "=B7", ""],
      ["", "Facilidade no chat (média 1 a 5)", "", "=B9", ""],
      ["", "Usariam novamente", "", "=B11", ""],
    ];
  sheet.getRange(inicio, 1, criterios.length, 5).setValues(criterios);
  sheet.getRange(inicio, 1, 2, 5).setFontWeight("bold");
  for (var i = 2; i < criterios.length; i++) {
    var linha = inicio + i,
      menor = criterios[i][1].indexOf("quanto menor") >= 0;
    sheet
      .getRange(linha, 5)
      .setFormula(
        '=IF(OR(C' + linha + '="",D' + linha + '=""),"",IF(D' + linha + (menor ? "<=" : ">=") + "C" + linha + ',"Sim","Não"))',
      );
  }
}
