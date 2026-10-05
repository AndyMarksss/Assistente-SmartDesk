"use strict";
const assert = require("node:assert/strict"),
  http = require("node:http"),
  fs = require("node:fs"),
  os = require("node:os"),
  path = require("node:path");
const { configuration } = require("../hosting.cjs"),
  { createServer } = require("../server.cjs"),
  { build } = require("../../scripts/build-pages.cjs");
async function run() {
  assert.equal(configuration({}).host, "127.0.0.1");
  assert.throws(() => configuration({ NODE_ENV: "production" }));
  for (const address of [
    "http://site.test",
    "https://site.test/path",
    "https://user@site.test",
    "https://site.test/?q=1",
  ])
    assert.throws(() =>
      configuration({
        SMARTDESK_PUBLIC_ORIGIN: address,
        SMARTDESK_ACCESS_PASSWORD: "long-example-password",
      }),
    );
  const env = {
    RENDER: "true",
    RENDER_EXTERNAL_URL: "https://smartdesk.test",
    PORT: "10000",
    SMARTDESK_ACCESS_PASSWORD: "long-example-password",
  };
  assert.equal(configuration(env).host, "0.0.0.0");
  assert.equal(configuration(env).port, 10000);
  const server = createServer({ ready: () => false, name: "test" }, { env });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const request = (route, headers = {}) =>
    new Promise((resolve, reject) => {
      const req = http.get(
        {
          hostname: "127.0.0.1",
          port: server.address().port,
          path: route,
          headers: { host: "smartdesk.test", ...headers },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => resolve({ status: res.statusCode, body, headers: res.headers }));
        },
      );
      req.on("error", reject);
    });
  try {
    assert.equal((await request("/healthz")).status, 200);
    for (const route of ["/", "/admin.html", "/api/status", "/api/admin/tickets?mode=google"])
      assert.equal((await request(route)).status, 401);
    const authorization =
      "Basic " + Buffer.from("avaliador:" + env.SMARTDESK_ACCESS_PASSWORD).toString("base64");
    assert.equal((await request("/", { authorization })).status, 200);
    assert.equal(
      (await request("/api/status", { authorization, origin: "https://smartdesk.test" })).status,
      200,
    );
    assert.equal(
      (await request("/api/status", { authorization, origin: "https://other.test" })).status,
      403,
    );
    assert.equal((await request("/", { authorization, host: "other.test" })).status, 403);
    for (const route of ["/.env", "/server/data/tickets.json", "/server/server.cjs"])
      assert.equal((await request(route, { authorization })).status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), "smartdesk-pages-"));
  try {
    build(destination, "https://smartdesk.test");
    assert.deepEqual(fs.readdirSync(destination).sort(), [".nojekyll", "admin.html", "index.html"]);
    assert.ok(
      fs
        .readFileSync(path.join(destination, "admin.html"), "utf8")
        .includes("https://smartdesk.test/admin.html"),
    );
    assert.throws(() => build(destination, "http://invalid.test"));
    build(destination);
    assert.match(
      fs.readFileSync(path.join(destination, "index.html"), "utf8"),
      /ainda não está pronto para avaliação/,
    );
  } finally {
    fs.rmSync(destination, { recursive: true, force: true });
  }
  console.log(
    "Hospedagem: origem, autenticação, saúde, arquivos privados e entrada Pages aprovados; sem chamadas externas.",
  );
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
