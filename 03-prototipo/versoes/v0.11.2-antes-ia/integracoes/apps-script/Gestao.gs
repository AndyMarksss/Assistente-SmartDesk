/** Gestão v0.7: preserva colunas existentes; e-mail em N. Token nunca no navegador. */
function prepararGestao_(sheet) {
  var cell = sheet.getRange(1, 14),
    value = String(cell.getValue() || "");
  if (value && value !== "E-mail institucional")
    throw Error("Coluna N ocupada; revisar antes da migração.");
  if (!value) texto_(cell, ["E-mail institucional"]);
  var authCell = sheet.getRange(1, 15),
    authHeader = String(authCell.getValue() || "");
  if (authHeader && authHeader !== "Autorização da liderança")
    throw Error("Coluna O ocupada; revisar antes da migração.");
  if (!authHeader) texto_(authCell, ["Autorização da liderança"]);
}
function doPost(e) {
  if (e && e.parameter && typeof e.parameter.smartdesk === "string") return pagesRequest_(e);
  try {
    if (
      !e ||
      !e.postData ||
      typeof e.postData.contents !== "string" ||
      e.postData.contents.length > 30 * 1024 * 1024
    )
      throw Error("Pedido inválido");
    var body = JSON.parse(e.postData.contents);
    if (!body.action) return receberChamado_(e);
    var props = PropertiesService.getScriptProperties(),
      secret = props.getProperty("SMARTDESK_TOKEN");
    if (!secret || typeof body.token !== "string" || !igualSeguro_(secret, body.token))
      return resposta_({ ok: false, error: "Não autorizado." });
    if (
      ["listTickets", "updateStatus", "trackTicket", "selfHelp", "selfHelpStats"].indexOf(
        body.action,
      ) < 0
    )
      throw Error("Ação inválida");
    var lock = LockService.getScriptLock();
    lock.waitLock(25000);
    try {
      if (["selfHelp", "selfHelpStats"].indexOf(body.action) >= 0)
        return resposta_(autoatendimento_(props, body));
      var sheet = SpreadsheetApp.openById(props.getProperty("SMARTDESK_SHEET_ID")).getSheetByName(
        "Chamados",
      );
      if (
        !sheet ||
        JSON.stringify(sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]) !==
          JSON.stringify(HEADERS)
      )
        throw Error("Estrutura inválida");
      prepararGestao_(sheet);
      var rows =
        sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 15).getValues() : [];
      if (body.action === "trackTicket") {
        // Acompanhamento pelo solicitante: número + e-mail; devolve só a situação.
        var wanted = String(body.number || ""),
          email = String(body.email || "")
            .trim()
            .toLowerCase(),
          found = rows.filter(function (r) {
            return (
              String(r[0]) === wanted &&
              email &&
              String(r[13] || "")
                .trim()
                .toLowerCase() === email
            );
          })[0];
        return resposta_({
          ok: true,
          ticket: found
            ? {
                number: String(found[0]),
                createdAt: String(found[1]),
                area: String(found[4]),
                need: String(found[5]),
                status: found[10] === "Recebido" ? "Novos chamados" : String(found[10]),
              }
            : null,
        });
      }
      if (body.action === "updateStatus") {
        var stages = [
          "Novos chamados",
          "Em atendimento",
          "Aguardando terceiros",
          "Empréstimos",
          "Agendado",
          "Finalizado",
          "Cancelado",
        ];
        if (stages.indexOf(body.status) < 0 || typeof body.requestId !== "string")
          throw Error("Etapa inválida");
        var index = rows.findIndex(function (r) {
          return String(r[11]) === body.requestId;
        });
        if (index < 0) throw Error("Chamado não encontrado");
        var current = rows[index][10] === "Recebido" ? "Novos chamados" : String(rows[index][10]);
        if (current === "Recebendo") throw Error("Envio incompleto");
        if (body.expectedStatus && current !== body.expectedStatus)
          throw Error("Conflito de etapa");
        texto_(sheet.getRange(index + 2, 11), [body.status]);
        SpreadsheetApp.flush();
        return resposta_({ ok: true });
      }
      return resposta_({
        ok: true,
        tickets: rows
          .filter(function (r) {
            return /^#\d+$/.test(String(r[0]));
          })
          .map(function (r) {
            var answers = {},
              authorization = null;
            try {
              authorization = JSON.parse(String(r[14] || "null"));
            } catch (e) {}
            try {
              answers = JSON.parse(String(r[8]));
            } catch (e) {}
            return {
              number: String(r[0]),
              createdAt: String(r[1]),
              name: String(r[2]),
              sector: String(r[3]),
              area: String(r[4]),
              need: String(r[5]),
              subject: String(r[6]),
              description: String(r[7]),
              answers: answers,
              attachments: String(r[9] || "")
                .split("\n")
                .filter(Boolean),
              status: r[10] === "Recebido" ? "Novos chamados" : String(r[10]),
              requestId: String(r[11]),
              email: String(r[13] || ""),
              authorization: authorization,
              simulation: false,
            };
          }),
      });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return resposta_({
      ok: false,
      error: "Gestão indisponível. Confira implantação, estrutura ou conflito de etapa.",
    });
  }
}

/** Autoatendimento: registro anônimo (setor, caminho, resultado) na aba Autoatendimento. */
function autoatendimento_(props, body) {
  var book = SpreadsheetApp.openById(props.getProperty("SMARTDESK_SHEET_ID")),
    sheet = book.getSheetByName("Autoatendimento"),
    headers = ["Data", "Setor", "Área", "Necessidade", "Resultado", "Origem"];
  if (!sheet) {
    sheet = book.insertSheet("Autoatendimento");
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  if (body.action === "selfHelp") {
    var outcomes = { resolved: "Resolvido com as dicas", continued: "Seguiu para o chamado" };
    if (!outcomes[body.outcome]) throw Error("Resultado inválido");
    var values = [body.sector, body.area, body.need, body.origin].map(function (value) {
      return String(value || "").slice(0, 120);
    });
    texto_(sheet.getRange(sheet.getLastRow() + 1, 1, 1, headers.length), [
      new Date().toISOString(),
      values[0],
      values[1],
      values[2],
      outcomes[body.outcome],
      values[3],
    ]);
    return { ok: true };
  }
  var rows =
    sheet.getLastRow() > 1 ? sheet.getRange(2, 5, sheet.getLastRow() - 1, 1).getValues() : [];
  return {
    ok: true,
    resolved: rows.filter(function (r) {
      return r[0] === "Resolvido com as dicas";
    }).length,
    continued: rows.filter(function (r) {
      return r[0] === "Seguiu para o chamado";
    }).length,
  };
}
