/** Diagnóstico do recebimento — somente chamado fictício, mesmo ID de tentativa. */
function diagnosticarSmartDesk_() {
  var props = PropertiesService.getScriptProperties();
  var ticket = {
    requestId: "91be4010-6210-4a29-b4f2-05910dbaf2d9",
    name: "Teste técnico fictício",
    sector: "Secretaria",
    selectionId: "IMP-010",
    answers: {
      cor: "Magenta",
      modelo: "Impressora fictícia",
    },
    description:
      "TESTE DO PROTÓTIPO — solicitação fictícia de toner magenta. Sem dados pessoais ou atendimento real.",
    subject: "Teste de recebimento — toner magenta",
    attachments: [
      {
        name: "anexo-ficticio-smartdesk.txt",
        base64:
          "U21hcnREZXNrOiBhcnF1aXZvIGZpY3TDrWNpbyB1c2FkbyBwYXJhIGNvbmZlcmlyIG8gcmVjZWJpbWVudG8gbm8gR29vZ2xlIERyaXZlLiBOw6NvIGNvbnTDqW0gZGFkb3MgcmVhaXMu",
      },
    ],
  };
  // Nunca imprimir as propriedades nem o token.
  var item = SMARTDESK_SCHEMA.items.filter(function (i) {
    return i.id === ticket.selectionId;
  })[0];
  console.log("ID selecionado: " + ticket.selectionId);
  console.log(
    "Campos da versão publicada no editor: " +
      (item
        ? item.fields
            .map(function (f) {
              return f.id;
            })
            .join(", ")
        : "ID não encontrado"),
  );
  try {
    if (!item) throw Error("ID da solicitação não encontrado no Schema.");
    // Mesmo contrato do servidor: rótulos vêm da seleção, sem digitação livre.
    ticket.area = item.area;
    ticket.need = item.need;
    validar_(ticket);
    console.log("Validação da solicitação fictícia: OK");
    var book = SpreadsheetApp.openById(props.getProperty("SMARTDESK_SHEET_ID"));
    console.log("Planilha: " + book.getUrl());
    var sheet = book.getSheetByName("Chamados");
    if (!sheet) throw Error("A aba Chamados não foi encontrada.");
    if (
      JSON.stringify(sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]) !==
      JSON.stringify(HEADERS)
    )
      throw Error("Cabeçalhos diferentes dos esperados.");
    console.log("Cabeçalhos da aba Chamados: OK");
    console.log(
      "Pasta: " + DriveApp.getFolderById(props.getProperty("SMARTDESK_FOLDER_ID")).getUrl(),
    );
    var output = JSON.parse(
      doPost({
        postData: {
          contents: JSON.stringify({
            token: props.getProperty("SMARTDESK_TOKEN"),
            ticket: ticket,
          }),
        },
      }).getContent(),
    );
    console.log(
      JSON.stringify({
        ok: output.ok,
        number: output.number,
        attachmentCount: output.attachmentCount,
        error: output.error,
      }),
    );
    if (!output.ok)
      throw Error("O receptor falhou. Confira a mensagem SmartDesk: falha no recebimento acima.");
  } catch (error) {
    console.error("Diagnóstico: " + error.name + ": " + error.message);
    throw error;
  }
}

/**
 * Executar no editor (Executar → diagnosticarIA). Confere se o script pode chamar o Gemini.
 * Na primeira execução o Google pede para autorizar "conectar a um serviço externo":
 * sem essa autorização o portal público não consegue usar a IA. Nunca mostra a chave.
 */
function diagnosticarIA() {
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty("GEMINI_API_KEY");
  var model = props.getProperty("GEMINI_MODEL") || "gemini-3.5-flash-lite";
  console.log("Chave do Gemini configurada: " + (key ? "sim" : "NÃO"));
  console.log("Modelo: " + model);
  if (!key) return;
  var response = UrlFetchApp.fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
    {
      method: "post",
      contentType: "application/json",
      headers: { "x-goog-api-key": key },
      muteHttpExceptions: true,
      payload: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Responda só: ok" }] }],
      }),
    },
  );
  console.log("Resposta do Gemini: HTTP " + response.getResponseCode());
  console.log(response.getContentText().slice(0, 300));
}
