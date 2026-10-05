"use strict";
class InvalidRequest extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
async function readJSON(req, limit) {
  if (!String(req.headers["content-type"] || "").startsWith("application/json"))
    throw new InvalidRequest("Envie JSON.", 415);
  const parts = [];
  let bytes = 0;
  for await (const part of req) {
    bytes += part.length;
    if (bytes > limit) throw new InvalidRequest("O conteúdo ultrapassa o limite permitido.", 413);
    parts.push(part);
  }
  try {
    return JSON.parse(Buffer.concat(parts).toString("utf8"));
  } catch {
    throw new InvalidRequest("Pedido inválido.");
  }
}

module.exports = { InvalidRequest, readJSON };
