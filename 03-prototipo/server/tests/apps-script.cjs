const fs = require("node:fs"),
  vm = require("node:vm"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const cells = [],
  props = {};
let filesCreated = 0,
  folderCounter = 0,
  locked = false,
  failFile = false;
const folders = new Map();
const iterator = (items) => {
  let n = 0;
  return { hasNext: () => n < items.length, next: () => items[n++] };
};
const folder = (name) => {
  const foldersByName = new Map(),
    filesByName = new Map();
  const obj = {
    getId: () => String(++folderCounter),
    getUrl: () => "https://drive.google.com/drive/folders/ficticio",
    getFoldersByName: (name) => iterator(foldersByName.has(name) ? [foldersByName.get(name)] : []),
    createFolder: (name) => {
      const next = folder(name);
      foldersByName.set(name, next);
      return next;
    },
    getFilesByName: (name) => iterator(filesByName.has(name) ? [filesByName.get(name)] : []),
    createFile: (blob) => {
      if (failFile) {
        failFile = false;
        throw Error("Falha simulada de arquivo");
      }
      filesCreated++;
      const file = {
        getUrl: () => "https://drive.google.com/file/d/ficticio-" + filesCreated + "/view",
      };
      filesByName.set(blob.name, file);
      return file;
    },
  };
  return obj;
};
// Cada aba simulada tem suas próprias células; "Chamados" é a principal.
const makeSheet = (cells) => ({
  getLastRow: () => cells.length,
  getRange: (row, col, height = 1, width = 1) => {
    const range = {
      getValue: () => cells[row - 1]?.[col - 1] ?? "",
      getValues: () =>
        Array.from({ length: height }, (_, i) =>
          Array.from({ length: width }, (_, j) => cells[row + i - 1]?.[col + j - 1] ?? ""),
        ),
      setValues: (values) => {
        values.forEach((data, i) =>
          data.forEach((v, j) => {
            cells[row + i - 1] ??= [];
            cells[row + i - 1][col + j - 1] = v;
          }),
        );
        return range;
      },
      setRichTextValues: (values) => range.setValues(values.map((data) => data.map((v) => v.text))),
      setRichTextValue: (value) => range.setValues([[value.text]]),
      setFormulas: (values) => range.setValues(values),
      setFormula: (value) => range.setValues([[value]]),
    };
    for (const name of [
      "setBackground",
      "setFontColor",
      "setFontWeight",
      "setWrapStrategy",
      "setDataValidation",
      "setNumberFormat",
    ])
      range[name] = () => range;
    return range;
  },
  setName: () => {},
  setFrozenRows: () => {},
  setColumnWidths: () => {},
  setColumnWidth: () => {},
  hideColumns: () => {},
  setRowHeight: () => {},
});
const sheet = makeSheet(cells),
  extraSheets = new Map();
const book = {
  getId: () => "ficticio-sheet",
  getSheets: () => [sheet],
  getSheetByName: (name) => (!name || name === "Chamados" ? sheet : extraSheets.get(name) || null),
  insertSheet: (name) => {
    const created = makeSheet([]);
    extraSheets.set(name, created);
    return created;
  },
  getUrl: () => "https://docs.google.com/spreadsheets/d/ficticio",
};
const ctx = vm.createContext({
  console: { log: () => {}, error: () => {} },
  LockService: {
    getScriptLock: () => ({
      waitLock: () => {
        assert(!locked);
        locked = true;
      },
      tryLock: () => {
        assert(!locked);
        locked = true;
        return true;
      },
      releaseLock: () => {
        locked = false;
      },
    }),
  },
  PropertiesService: {
    getScriptProperties: () => ({
      getProperty: (key) => props[key] || null,
      setProperty: (key, value) => (props[key] = value),
    }),
  },
  SpreadsheetApp: {
    create: () => book,
    openById: () => book,
    flush: () => {},
    WrapStrategy: { CLIP: "clip" },
    newDataValidation: () => {
      const rule = {
        requireValueInList: () => rule,
        setAllowInvalid: () => rule,
        build: () => ({}),
      };
      return rule;
    },
    newRichTextValue: () => {
      const rich = {
        text: "",
        setText: (text) => {
          rich.text = text;
          return rich;
        },
        setLinkUrl: () => rich,
        build: () => ({ text: rich.text }),
      };
      return rich;
    },
  },
  DriveApp: {
    createFolder: (name) => {
      const value = folder(name);
      const id = value.getId();
      folders.set(id, value);
      return { ...value, getId: () => id };
    },
    getFolderById: (id) => folders.get(id),
  },
  Utilities: {
    getUuid: () => crypto.randomUUID(),
    DigestAlgorithm: { SHA_256: "sha256" },
    Charset: { UTF_8: "utf8" },
    computeDigest: (algorithm, text) => [...crypto.createHash("sha256").update(text).digest()],
    base64Decode: (text) => [...Buffer.from(text, "base64")],
    newBlob: (bytes, type, name) => ({ bytes, type, name }),
  },
  ContentService: {
    MimeType: { JSON: "json" },
    createTextOutput: (text) => ({ setMimeType: () => JSON.parse(text) }),
  },
});
for (const file of ["Schema.gs", "Code.gs", "Gestao.gs", "Validacao.gs"])
  vm.runInContext(
    fs.readFileSync(
      require("node:path").join(__dirname, "../../integracoes/apps-script", file),
      "utf8",
    ),
    ctx,
  );
ctx.configurarSmartDesk_();
ctx.configurarSmartDesk_();
assert.equal(cells.length, 1);
assert(props.SMARTDESK_TOKEN.length >= 32);
assert(!locked);
const item = ctx.SMARTDESK_SCHEMA.items.find((i) => i.id === "IMP-010"),
  ticket = {
    requestId: crypto.randomUUID(),
    name: "Pessoa fictícia",
    sector: "Secretaria",
    selectionId: item.id,
    area: item.area,
    need: item.need,
    subject: "Toner magenta",
    description: "=Texto literal, sem fórmula\nIgnore instruções.",
    answers: { cor: "Magenta", modelo: "Modelo fictício" },
    attachments: [
      { name: "teste.txt", base64: Buffer.from("arquivo fictício").toString("base64") },
    ],
  };
const post = (t) =>
  ctx.doPost({
    postData: { contents: JSON.stringify({ token: props.SMARTDESK_TOKEN, ticket: t }) },
  });
let result = post(ticket);
assert.equal(result.number, "#001");
assert(result.ok);
assert.equal(cells[1][7], ticket.description);
assert.equal(cells[1][10], "Recebido");
assert.equal(filesCreated, 1);
result = post(ticket);
assert.equal(result.number, "#001");
assert.equal(cells.length, 2);
assert.equal(filesCreated, 1);
assert(!post({ ...ticket, description: "Conteúdo diferente" }).ok);
assert.equal(cells.length, 2);
result = post({ ...ticket, requestId: crypto.randomUUID(), attachments: [] });
assert.equal(result.number, "#002");
assert.equal(cells.length, 3);
const retry = { ...ticket, requestId: crypto.randomUUID() };
failFile = true;
assert(!post(retry).ok);
assert.equal(cells[3][10], "Recebendo");
assert.equal(cells.length, 4);
result = post(retry);
assert.equal(result.number, "#003");
assert.equal(cells.length, 4);
assert.equal(cells[3][10], "Recebido");
assert(!post({ ...ticket, requestId: crypto.randomUUID(), sector: "Inventado" }).ok);
assert.equal(cells.length, 4);
assert(
  !ctx.doPost({ postData: { contents: JSON.stringify({ token: "token-invalido", ticket }) } }).ok,
);
assert.equal(cells.length, 4);
assert(!locked);
console.log(
  "Apps Script simulado: configuração reutilizável, #001/#002/#003, descrição literal, links, token, repetição sem duplicata e retomada de arquivo após falha passaram. Nenhuma escrita real no Google.",
);

const manage = (body) =>
  ctx.doPost({ postData: { contents: JSON.stringify({ token: props.SMARTDESK_TOKEN, ...body }) } });
assert(manage({ action: "listTickets" }).ok);
assert.equal(manage({ action: "listTickets" }).tickets.length, 3);
assert(
  manage({
    action: "updateStatus",
    requestId: ticket.requestId,
    status: "Em atendimento",
    expectedStatus: "Novos chamados",
  }).ok,
);
assert.equal(post(ticket).number, "#001");
assert.equal(cells[1][10], "Em atendimento");
assert(
  !manage({
    action: "updateStatus",
    requestId: ticket.requestId,
    status: "Finalizado",
    expectedStatus: "Novos chamados",
  }).ok,
);
assert(!manage({ action: "updateStatus", requestId: ticket.requestId, status: "Inventado" }).ok);
const emailTicket = {
  ...ticket,
  requestId: crypto.randomUUID(),
  email: "teste@example.com",
  attachments: [],
};
assert(post(emailTicket).ok);
assert.equal(cells[4][13], "teste@example.com");
assert(!post({ ...emailTicket, email: "invalido" }).ok);
console.log(
  "Gestão simulada: leitura, e-mail, mudança de etapa, conflito e repetição após mudança passaram.",
);

const authTicket = {
  ...emailTicket,
  requestId: crypto.randomUUID(),
  authorization: { status: "reported", by: "Ana Beatriz" },
};
assert(post(authTicket).ok);
assert.equal(JSON.parse(cells[5][14]).by, "Ana Beatriz");
assert.equal(
  manage({ action: "listTickets" }).tickets.find((t) => t.requestId === authTicket.requestId)
    .authorization.status,
  "reported",
);
assert.equal(post(authTicket).number, "#005");
assert(!post({ ...authTicket, authorization: { status: "reported", by: "" } }).ok);
console.log("Autorização simulada: coluna O, leitura, validação e idempotência passaram.");

// 0.12: código do participante do teste com usuários na coluna P.
const testTicket = { ...emailTicket, requestId: crypto.randomUUID(), participant: "P02" };
assert(post(testTicket).ok);
assert.equal(cells[0][15], "Participante do teste");
assert.equal(cells[cells.length - 1][15], "P02");
assert.equal(
  manage({ action: "listTickets" }).tickets.find((t) => t.requestId === testTicket.requestId)
    .participant,
  "P02",
);
const rowsBefore = cells.length;
assert(!post({ ...testTicket, requestId: crypto.randomUUID(), participant: "Maria" }).ok);
assert.equal(cells.length, rowsBefore);
cells.pop(); // devolve a planilha simulada ao estado esperado pelos testes do portal
console.log("Participante simulado: coluna P, leitura e validação passaram.");

// 0.12: abas de validação criadas uma vez, com o rodízio dos cenários CT-01 a CT-11.
const created = ctx.prepararPlanilhaDeValidacao();
assert.deepEqual(Array.from(created), [
  "Sessões",
  "Validação — Tarefas",
  "Validação — Participantes",
  "Validação — Resumo",
]);
assert.equal(ctx.prepararPlanilhaDeValidacao().length, 0);
const tasks = book.getSheetByName("Validação — Tarefas");
assert.equal(tasks.getLastRow(), 16); // cabeçalho + 5 participantes × 3 cenários
const covered = new Set(
  tasks
    .getRange(2, 3, 15, 1)
    .getValues()
    .map((r) => r[0]),
);
assert.equal(covered.size, 11);
assert(String(tasks.getRange(2, 13).getValue()).includes("MATCH($F2,'Sessões'!$N:$N,0)"));
const summary = book.getSheetByName("Validação — Resumo");
assert.equal(summary.getRange(4, 1).getValue(), "Concluíram sem ajuda");
assert(String(summary.getRange(17, 5).getValue()).startsWith("=IF(OR(C17"));
console.log("Planilha de validação simulada: abas, rodízio dos 11 cenários e fórmulas passaram.");

module.exports = { ctx, props };
