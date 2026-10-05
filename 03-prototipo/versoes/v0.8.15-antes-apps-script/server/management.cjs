"use strict";
const fs = require("node:fs/promises"),
  path = require("node:path");
const { InvalidRequest, readJSON } = require("./request-body.cjs");
const STAGES = [
  "Novos chamados",
  "Em atendimento",
  "Aguardando terceiros",
  "Empréstimos",
  "Agendado",
  "Finalizado",
  "Cancelado",
];
function createManagement({ root, json, storage = require("./google-storage.cjs") }) {
  const file = path.join(root, "server/data/gestao-simulada.json");
  let serial = Promise.resolve();
  async function demo() {
    try {
      return JSON.parse(await fs.readFile(file, "utf8"));
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
      return [];
    }
  }
  async function write(rows) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const temp = file + ".tmp";
    await fs.writeFile(temp, JSON.stringify(rows, null, 2));
    await fs.rename(temp, file);
  }
  async function cloud(action, payload = {}) {
    return storage.manage(action, payload);
  }
  return async (req, res, url) => {
    if (!url.pathname.startsWith("/api/admin/")) return false;
    let mode = url.searchParams.get("mode") || "demo";
    try {
      if (req.method === "GET" && url.pathname === "/api/admin/tickets") {
        if (!["demo", "google"].includes(mode)) throw new InvalidRequest("Modo inválido.");
        const tickets = mode === "demo" ? await demo() : (await cloud("listTickets")).tickets;
        json(res, 200, { tickets, stages: STAGES, mode });
        return true;
      }
      if (
        req.method !== "POST" ||
        !String(req.headers["content-type"] || "").startsWith("application/json")
      ) {
        json(res, 405, { error: "Operação não permitida." });
        return true;
      }
      const body = await readJSON(req, 8192);
      if (!body || typeof body !== "object" || Array.isArray(body))
        throw new InvalidRequest("Pedido inválido.");
      if (!["demo", "google"].includes(body.mode))
        throw new InvalidRequest("Selecione a origem dos dados.");
      mode = body.mode;
      if (url.pathname === "/api/admin/seed" && body.mode === "demo") {
        const job = serial.then(async () => {
          let rows = await demo();
          if (!rows.length) {
            const subjects = [
              "Projetor sem imagem",
              "Impressora não imprime",
              "Acesso ao Gmail",
              "Conexão instável",
              "Reserva de microfone",
              "Toner magenta",
              "Computador lento",
              "Acesso ao Drive",
              "Notebook para apresentação",
              "Projetor para evento",
              "Papel atolado",
              "Dúvida no sistema",
            ];
            rows = subjects.map((subject, i) => ({
              number: "#SIM-" + String(i + 1).padStart(3, "0"),
              requestId: "sim-" + (i + 1),
              name: "Pessoa fictícia " + (i + 1),
              email: "pessoa" + (i + 1) + "@example.com",
              sector: ["Secretaria", "Financeiro", "TI", "Marketing"][i % 4],
              area: ["Audiovisual", "Impressora", "Google", "TI"][
                [0, 1, 2, 3, 0, 1, 3, 2, 3, 0, 1, 3][i]
              ],
              need: subject,
              subject,
              description: "Chamado simulado para demonstração do painel: " + subject + ".",
              status: STAGES[i % 7],
              createdAt: new Date(Date.now() - (i + 1) * 3600000 * 5).toISOString(),
              answers: {},
              attachments: [],
              simulation: true,
            }));
            await write(rows);
          }
          return rows;
        });
        serial = job.catch(() => {});
        json(res, 200, { tickets: await job, mode: "demo" });
        return true;
      }
      if (url.pathname === "/api/admin/status") {
        if (
          !STAGES.includes(body.status) ||
          typeof body.requestId !== "string" ||
          body.requestId.length > 100
        )
          throw new InvalidRequest("Etapa ou chamado inválido.");
        if (body.mode === "google") {
          const result = await cloud("updateStatus", {
            requestId: body.requestId,
            status: body.status,
            expectedStatus: body.expectedStatus,
          });
          json(res, 200, result);
          return true;
        }
        const job = serial.then(async () => {
          const rows = await demo(),
            item = rows.find((t) => t.requestId === body.requestId);
          if (!item) throw new InvalidRequest("Chamado não encontrado.", 404);
          if (body.expectedStatus && body.expectedStatus !== item.status)
            throw new InvalidRequest("Etapa alterada em outra tela. Atualize o painel.", 409);
          item.status = body.status;
          item.updatedAt = new Date().toISOString();
          await write(rows);
          return item;
        });
        serial = job.catch(() => {});
        json(res, 200, { ok: true, ticket: await job });
        return true;
      }
      json(res, 404, { error: "Operação não encontrada." });
      return true;
    } catch (error) {
      json(res, error instanceof InvalidRequest ? error.status : 502, {
        error:
          error instanceof InvalidRequest
            ? error.message
            : mode === "google"
              ? "Não consegui confirmar a atualização na planilha. Atualize o painel e tente novamente."
              : "Não consegui salvar a demonstração local. Tente novamente em instantes.",
      });
      return true;
    }
  };
}
module.exports = { createManagement, STAGES };
