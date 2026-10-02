const assert = require("node:assert/strict"),
  fs = require("node:fs/promises"),
  os = require("node:os"),
  path = require("node:path");
const { createManagement } = require("../management.cjs");
(async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "smartdesk-gestao-")),
    handle = createManagement({
      root,
      json: (r, status, body) => {
        r.status = status;
        r.body = body;
      },
      storage: { manage: async (action) => ({ ok: true, tickets: [{ number: "#001" }] }) },
    });
  const call = async (url, body) => {
    const req = {
        method: body ? "POST" : "GET",
        headers: { "content-type": "application/json" },
        async *[Symbol.asyncIterator]() {
          if (body) yield Buffer.from(JSON.stringify(body));
        },
      },
      res = {};
    await handle(req, res, new URL(url, "http://localhost"));
    return res;
  };
  let r = await call("/api/admin/seed", { mode: "demo" });
  assert.equal(r.body.tickets.length, 12);
  const id = r.body.tickets[0].requestId;
  r = await call("/api/admin/seed", { mode: "demo" });
  assert.equal(r.body.tickets.length, 12);
  r = await call("/api/admin/status", {
    mode: "demo",
    requestId: id,
    status: "Em atendimento",
    expectedStatus: "Novos chamados",
  });
  assert.equal(r.status, 200);
  r = await call("/api/admin/tickets?mode=demo");
  assert.equal(r.body.tickets.find((t) => t.requestId === id).status, "Em atendimento");
  assert.equal(
    (
      await call("/api/admin/status", {
        mode: "demo",
        requestId: id,
        status: "Finalizado",
        expectedStatus: "Novos chamados",
      })
    ).status,
    409,
  );
  assert.equal(
    (await call("/api/admin/status", { mode: "demo", requestId: id, status: "Inventado" })).status,
    400,
  );
  assert.equal((await call("/api/admin/tickets?mode=google")).body.tickets[0].number, "#001");
  console.log(
    "Gestão HTTP: 12 simulações, seed sem duplicata, etapa persistida, conflito, etapa inválida e origem Google isolada passaram.",
  );
})();
