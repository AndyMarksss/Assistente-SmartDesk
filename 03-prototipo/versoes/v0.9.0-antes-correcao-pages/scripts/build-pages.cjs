"use strict";
const fs = require("node:fs"),
  path = require("node:path");
function build(destination, address = "") {
  let origin = "",
    appsScript = false;
  if (address) {
    const url = new URL(address);
    appsScript =
      url.hostname === "script.google.com" &&
      /^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      (!appsScript && url.pathname !== "/") ||
      url.search ||
      url.hash
    )
      throw Error(
        "SMARTDESK_SERVICE_URL deve ser a URL HTTPS /exec do Apps Script ou uma origem HTTPS.",
      );
    origin = appsScript ? url.href : url.origin;
  }
  const target = (page) =>
    appsScript
      ? origin + "?page=" + (page === "admin.html" ? "admin" : "chat")
      : origin + "/" + page;
  const escape = (s) =>
    s.replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const version = require("../package.json").version;
  fs.mkdirSync(destination, { recursive: true });
  const html = (page) =>
    '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SmartDesk · Suporte de TI</title><style>body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#0e1926;color:#ecf1fa;font:16px system-ui}main{max-width:560px;padding:40px;background:#23364a;border:1px solid #53677f;border-radius:24px;margin:20px}h1{font-size:32px}a{display:inline-block;background:#bba4ff;color:#20153f;padding:14px 24px;border-radius:12px;text-decoration:none;font-weight:700}p{line-height:1.6}small{color:#bfcbdc}</style><main><small>SMARTDESK / TI</small><h1>Seu ponto de apoio na TI.</h1><p>' +
    (origin
      ? "Abrindo o protótipo com integrações reais. Use o acesso de avaliação fornecido junto da entrega."
      : "A publicação do protótipo no Google está sendo configurada. Este endereço ainda não está pronto para avaliação.") +
    "</p>" +
    (origin
      ? '<a href="' +
        escape(target(page)) +
        '">Abrir protótipo</a><script>location.replace(' +
        JSON.stringify(target(page)).replace(/</g, "\u003c") +
        ")</script>"
      : "") +
    "<p><small>SmartDesk · v" +
    version +
    "</small></p></main></html>";
  for (const page of ["index.html", "admin.html"])
    fs.writeFileSync(path.join(destination, page), html(page));
  fs.writeFileSync(path.join(destination, ".nojekyll"), "");
}
if (require.main === module)
  build(
    path.resolve(process.argv[2] || "pages-dist"),
    String(process.env.SMARTDESK_SERVICE_URL || "").trim(),
  );
module.exports = { build };
