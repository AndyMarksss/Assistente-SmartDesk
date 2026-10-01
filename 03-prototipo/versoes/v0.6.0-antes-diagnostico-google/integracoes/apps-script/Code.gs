/** SmartDesk 0.6.0 — receptor Apps Script. Não editar a matriz acadêmica. */
var HEADERS = [
  "Número",
  "Recebido em",
  "Solicitante",
  "Setor",
  "Área",
  "Necessidade",
  "Assunto",
  "Descrição",
  "Detalhes",
  "Anexos (Drive)",
  "Status",
  "ID de envio",
  "Hash do conteúdo",
];

function configurarSmartDesk() {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty("SMARTDESK_SHEET_ID");
    if (!sheetId) {
      var book = SpreadsheetApp.create("SmartDesk — Chamados");
      sheetId = book.getId();
      props.setProperty("SMARTDESK_SHEET_ID", sheetId);
      var sheet = book.getSheets()[0];
      sheet.setName("Chamados");
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
      sheet
        .getRange(1, 1, 1, HEADERS.length)
        .setBackground("#7050cc")
        .setFontColor("#ffffff")
        .setFontWeight("bold");
      sheet.setColumnWidths(1, HEADERS.length, 155);
      sheet.setColumnWidth(8, 400);
      sheet.setColumnWidth(10, 350);
      sheet.hideColumns(12, 2);
    }
    var folderId = props.getProperty("SMARTDESK_FOLDER_ID");
    if (!folderId) {
      var folder = DriveApp.createFolder("SmartDesk — Anexos");
      folderId = folder.getId();
      props.setProperty("SMARTDESK_FOLDER_ID", folderId);
    }
    if (!props.getProperty("SMARTDESK_TOKEN"))
      props.setProperty(
        "SMARTDESK_TOKEN",
        Utilities.getUuid().replace(/-/g, "") +
          Utilities.getUuid().replace(/-/g, ""),
      );
    console.log("Planilha: " + SpreadsheetApp.openById(sheetId).getUrl());
    console.log("Pasta privada: " + DriveApp.getFolderById(folderId).getUrl());
    console.log(
      "Configuração pronta. O token fica nas Propriedades do script; não aparece neste registro.",
    );
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return resposta_({ ok: true, service: "SmartDesk", version: "0.6.0" });
}
function doPost(e) {
  var lock;
  try {
    if (
      !e ||
      !e.postData ||
      typeof e.postData.contents !== "string" ||
      e.postData.contents.length > 30 * 1024 * 1024
    )
      throw Error("Pedido inválido.");
    var body = JSON.parse(e.postData.contents),
      props = PropertiesService.getScriptProperties(),
      secret = props.getProperty("SMARTDESK_TOKEN");
    if (
      !secret ||
      typeof body.token !== "string" ||
      !igualSeguro_(secret, body.token)
    )
      return resposta_({ ok: false, error: "Não autorizado." });
    var ticket = validar_(body.ticket),
      digest = hash_(JSON.stringify(ticket));
    lock = LockService.getScriptLock();
    if (!lock.tryLock(25000))
      return resposta_({
        ok: false,
        error: "Recebimento ocupado. Tente novamente.",
      });
    var book = SpreadsheetApp.openById(props.getProperty("SMARTDESK_SHEET_ID")),
      sheet = book.getSheetByName("Chamados");
    if (
      !sheet ||
      JSON.stringify(sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]) !==
        JSON.stringify(HEADERS)
    )
      throw Error("Confira a estrutura da planilha de chamados.");
    var rows =
        sheet.getLastRow() > 1
          ? sheet
              .getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length)
              .getValues()
          : [],
      found = -1,
      max = 0;
    rows.forEach(function (row, index) {
      var n = /^#(\d+)$/.exec(String(row[0]));
      if (n) max = Math.max(max, Number(n[1]));
      if (String(row[11]) === ticket.requestId) found = index;
    });
    var number, rowIndex;
    if (found >= 0) {
      var previous = rows[found];
      if (String(previous[12]) !== digest)
        throw Error("Este envio já possui outro conteúdo. Confira a planilha.");
      number = String(previous[0]);
      rowIndex = found + 2;
      if (previous[10] === "Recebido")
        return resposta_({
          ok: true,
          number: number,
          requestId: ticket.requestId,
          attachmentCount: ticket.attachments.length,
        });
    } else {
      number = "#" + String(max + 1).padStart(3, "0");
      rowIndex = sheet.getLastRow() + 1;
      var values = [
        number,
        new Date().toISOString(),
        ticket.name,
        ticket.sector,
        ticket.area,
        ticket.need,
        ticket.subject,
        ticket.description,
        JSON.stringify(ticket.answers),
        "",
        "Recebendo",
        ticket.requestId,
        digest,
      ];
      texto_(sheet.getRange(rowIndex, 1, 1, HEADERS.length), values);
      SpreadsheetApp.flush();
    }
    // Reservar a linha antes de criar arquivos permite retomar um envio parcial, sem nova numeração.
    var links = [];
    if (ticket.attachments.length) {
      var root = DriveApp.getFolderById(
          props.getProperty("SMARTDESK_FOLDER_ID"),
        ),
        folderName = number + "_" + ticket.requestId,
        folders = root.getFoldersByName(folderName),
        folder = folders.hasNext()
          ? folders.next()
          : root.createFolder(folderName);
      ticket.attachments.forEach(function (file, index) {
        var name =
            String(index + 1).padStart(2, "0") +
            "_" +
            file.name.replace(/[\/\\\x00-\x1f]/g, "_"),
          existing = folder.getFilesByName(name),
          stored;
        if (existing.hasNext()) stored = existing.next();
        else
          stored = folder.createFile(
            Utilities.newBlob(
              Utilities.base64Decode(file.base64),
              mime_(file.name),
              name,
            ),
          );
        links.push(stored.getUrl());
      });
    }
    var allLinks = links.join("\n"),
      rich = SpreadsheetApp.newRichTextValue().setText(allLinks),
      offset = 0;
    links.forEach(function (url) {
      rich.setLinkUrl(offset, offset + url.length, url);
      offset += url.length + 1;
    });
    sheet.getRange(rowIndex, 10).setRichTextValue(rich.build());
    texto_(sheet.getRange(rowIndex, 11), ["Recebido"]);
    sheet
      .getRange(rowIndex, 1, 1, HEADERS.length)
      .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    sheet.setRowHeight(rowIndex, 32);
    SpreadsheetApp.flush();
    return resposta_({
      ok: true,
      number: number,
      requestId: ticket.requestId,
      attachmentCount: links.length,
    });
  } catch (error) {
    return resposta_({
      ok: false,
      error:
        "Não foi possível concluir o recebimento. Confira a configuração e tente novamente.",
    });
  } finally {
    if (lock) lock.releaseLock();
  }
}

function validar_(t) {
  if (
    !t ||
    typeof t.requestId !== "string" ||
    !/^[a-f0-9-]{36}$/i.test(t.requestId)
  )
    throw Error("Identificação inválida.");
  ["name", "sector", "area", "need", "subject", "description"].forEach(
    function (key) {
      if (typeof t[key] !== "string" || !t[key].trim())
        throw Error("Campo obrigatório.");
    },
  );
  if (
    t.name.length > 100 ||
    t.subject.length > 80 ||
    t.description.length > 2000 ||
    /[\r\n<>\x00-\x1f]/.test(t.subject)
  )
    throw Error("Limite de texto.");
  if (SMARTDESK_SCHEMA.sectors.indexOf(t.sector) < 0)
    throw Error("Setor inválido.");
  var item = SMARTDESK_SCHEMA.items.filter(function (i) {
    return i.id === t.selectionId;
  })[0];
  if (
    !item ||
    item.area !== t.area ||
    item.need !== t.need ||
    (item.sectors && item.sectors.indexOf(t.sector) < 0)
  )
    throw Error("Seleção inválida.");
  if (
    !t.answers ||
    typeof t.answers !== "object" ||
    Array.isArray(t.answers) ||
    Object.keys(t.answers).some(function (key) {
      return !item.fields.some(function (f) {
        return f.id === key;
      });
    })
  )
    throw Error("Detalhes inválidos.");
  item.fields.forEach(function (f) {
    if (f.when && t.answers[f.when.field] !== f.when.equals) return;
    var value = t.answers[f.id];
    if (
      typeof value !== "string" ||
      !value.trim() ||
      value.length > 1000 ||
      (f.type === "choice" && f.options.indexOf(value) < 0)
    )
      throw Error("Detalhes inválidos.");
    if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      throw Error("E-mail inválido.");
    if (f.type === "url" && !/^https?:\/\/[^\s]+$/i.test(value))
      throw Error("Link inválido.");
    if (
      f.type === "date" &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        isNaN(Date.parse(value + "T00:00:00Z")) ||
        new Date(value + "T00:00:00Z").toISOString().slice(0, 10) !== value)
    )
      throw Error("Data inválida.");
    if (f.type === "time" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value))
      throw Error("Horário inválido.");
  });
  if (!Array.isArray(t.attachments) || t.attachments.length > 5)
    throw Error("Anexos inválidos.");
  var total = 0;
  t.attachments.forEach(function (f) {
    if (
      !f ||
      typeof f.name !== "string" ||
      f.name.length > 200 ||
      !/\.(png|jpe?g|webp|gif|pdf|txt|docx|xlsx)$/i.test(f.name) ||
      typeof f.base64 !== "string" ||
      !f.base64 ||
      f.base64.length > 14 * 1024 * 1024 ||
      f.base64.length % 4 ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        f.base64,
      )
    )
      throw Error("Anexo inválido.");
    var size = Utilities.base64Decode(f.base64).length;
    if (!size || size > 10 * 1024 * 1024) throw Error("Anexo excede limite.");
    total += size;
  });
  if (total > 20 * 1024 * 1024) throw Error("Anexos excedem limite.");
  return {
    requestId: t.requestId,
    name: t.name,
    sector: t.sector,
    selectionId: item.id,
    area: item.area,
    need: item.need,
    answers: t.answers,
    subject: t.subject,
    description: t.description,
    attachments: t.attachments,
  };
}
function texto_(range, values) {
  range.setRichTextValues([
    values.map(function (v) {
      return SpreadsheetApp.newRichTextValue().setText(String(v)).build();
    }),
  ]);
}
function hash_(text) {
  return Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    text,
    Utilities.Charset.UTF_8,
  )
    .map(function (b) {
      return ("0" + ((b + 256) % 256).toString(16)).slice(-2);
    })
    .join("");
}
function igualSeguro_(a, b) {
  var x = hash_(a),
    y = hash_(b),
    diff = 0;
  for (var i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}
function resposta_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
function mime_(name) {
  var extension = name.split(".").pop().toLowerCase();
  return {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    pdf: "application/pdf",
    txt: "text/plain",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  }[extension];
}
