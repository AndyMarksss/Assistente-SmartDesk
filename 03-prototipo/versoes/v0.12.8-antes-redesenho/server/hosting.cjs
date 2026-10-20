"use strict";
const { createHash, timingSafeEqual } = require("node:crypto");
function configuration(env = process.env) {
  const address = String(env.SMARTDESK_PUBLIC_ORIGIN || env.RENDER_EXTERNAL_URL || "").trim();
  const hosted = Boolean(address || env.RENDER === "true" || env.NODE_ENV === "production");
  let origin = "";
  if (address) {
    const parsed = new URL(address);
    if (
      parsed.protocol !== "https:" ||
      parsed.username ||
      parsed.password ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash
    )
      throw Error("Configure uma origem pública HTTPS, sem caminho ou credenciais.");
    origin = parsed.origin;
  }
  const user = String(env.SMARTDESK_ACCESS_USER || "avaliador");
  const password = String(env.SMARTDESK_ACCESS_PASSWORD || "");
  if (hosted && (!origin || password.length < 16 || /[:\r\n]/.test(user)))
    throw Error("Hospedagem exige origem HTTPS e senha de avaliação com pelo menos 16 caracteres.");
  const port = Number(env.PORT || env.SMARTDESK_PORT || 4173);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error("Porta inválida.");
  return { origin, hosted, user, password, port, host: hosted ? "0.0.0.0" : "127.0.0.1" };
}
function authorize(req, res, config) {
  if (!config.hosted) return true;
  const expected = "Basic " + Buffer.from(config.user + ":" + config.password).toString("base64");
  const digest = (value) => createHash("sha256").update(value).digest();
  if (timingSafeEqual(digest(String(req.headers.authorization || "")), digest(expected)))
    return true;
  res.writeHead(401, {
    "WWW-Authenticate": 'Basic realm="SmartDesk - avaliacao", charset="UTF-8"',
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end("Informe o acesso de avaliação fornecido pelo responsável pelo protótipo.");
  return false;
}
function allowedRequest(req, config) {
  const port = req.socket.localPort;
  const hosts = ["127.0.0.1:" + port, "localhost:" + port];
  const origins = ["http://127.0.0.1:" + port, "http://localhost:" + port];
  if (config.origin) {
    hosts.push(new URL(config.origin).host);
    origins.push(config.origin);
  }
  return (
    hosts.includes(req.headers.host) &&
    (!req.headers.origin || origins.includes(req.headers.origin))
  );
}
module.exports = { configuration, authorize, allowedRequest };
