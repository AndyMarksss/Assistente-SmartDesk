"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
if (fs.existsSync(path.join(root,".env"))) process.loadEnvFile(path.join(root,".env"));
const provider = require("./ai-provider.cjs");
function loadBase() {
  const context = vm.createContext({window:{}});
  for (const file of ["knowledge-base.js", "classifier.js", "flows.js"]) vm.runInContext(fs.readFileSync(path.join(root, "assets/js", file), "utf8"), context);
  return context.window.SmartDesk;
}
function createServer(adapter = provider, options = {}) {
  const desk = loadBase();
  const json = (res, status, content) => { res.writeHead(status, {"Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store", "X-Content-Type-Options":"nosniff"}); res.end(JSON.stringify(content)); };
  const ticketService = require("./ticket-service.cjs").createTicketService({root,desk,provider:adapter,json,...options});
  return http.createServer(async (req,res) => {
    const port = req.socket.localPort;
    if (!["127.0.0.1:" + port, "localhost:" + port].includes(req.headers.host)) return json(res,403,{error:"Host não permitido."});
    if (req.headers.origin && !["http://127.0.0.1:" + port,"http://localhost:" + port].includes(req.headers.origin)) return json(res,403,{error:"Origem não permitida."});
    const url = new URL(req.url, "http://127.0.0.1");
    if (await ticketService(req,res,url)) return;
    if (url.pathname === "/api/status" && req.method === "GET") return json(res,200,{aiReady:adapter.ready() === true, provider:adapter.name, mode:adapter.ready() === true ? "ai" : "local", ticketsReady:require("./google-storage.cjs").ready()});
    if (url.pathname === "/api/analyze" && req.method === "POST") {
      if (!String(req.headers["content-type"] || "").startsWith("application/json")) return json(res,415,{error:"Envie JSON."});
      try {
        const chunks = []; let size = 0;
        for await (const chunk of req) { size += chunk.length; if (size > 16384) return json(res,413,{error:"Relato muito grande."}); chunks.push(chunk); }
        const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        if (typeof body.description !== "string" || !body.description.trim() || body.description.length > 2000 || typeof body.sector !== "string" || body.sector.length > 100) return json(res,400,{error:"Confira o relato e o contexto."});
        const request = {description:body.description.trim(), sector:body.sector.trim()};
        const allowed = desk.knowledgeBase.items.filter((item) => desk.classifier.isAllowed(item, request.sector));
        if (adapter.ready() === true) {
          try {
            const output = await adapter.analyze(request, allowed.map(({id,area,need}) => ({id,area,need})));
            if (!output || !Array.isArray(output.itemIds) || output.itemIds.length > allowed.length) throw new Error("Invalid AI output");
            const uniqueIds = [...new Set(output.itemIds)];
            if (uniqueIds.some((id) => !allowed.some((item) => item.id === id))) throw new Error("Unknown classification");
            const candidates = uniqueIds.map((id) => ({item:allowed.find((item) => item.id === id)}));
            return json(res,200,{status:candidates.length === 0 ? "unknown" : candidates.length === 1 ? "suggested" : "ambiguous",candidates,source:"ai"});
          } catch { return json(res,200,{...desk.classifier.classify(request.description,request.sector),source:"local",fallback:true}); }
        }
        return json(res,200,{...desk.classifier.classify(request.description,request.sector),source:"local"});
      } catch { return json(res,400,{error:"Não foi possível ler o relato."}); }
    }
    if (req.method !== "GET") return json(res,405,{error:"Método não permitido."});
    let relative;
    try { relative = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html"; } catch { return json(res,400,{error:"Caminho inválido."}); }
    // Only public UI assets are served. Backups, documents and server files are excluded.
    if (!/^(index\.html|assets\/(css|js|img)\/[a-zA-Z0-9_\-/.]+|assets\/vendor\/fontawesome\/(css|webfonts)\/[a-zA-Z0-9_\-/.]+)$/.test(relative) || relative.includes("..")) return json(res,404,{error:"Arquivo não disponível."});
    const file = path.resolve(root,relative);
    if (!file.startsWith(root + path.sep)) return json(res,403,{error:"Caminho não permitido."});
    const types = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".woff2":"font/woff2"};
    fs.readFile(file,(error,data) => {
      if (error) return json(res,404,{error:"Arquivo não encontrado."});
      res.writeHead(200,{"Content-Type":types[path.extname(file)] || "application/octet-stream","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}); res.end(data);
    });
  });
}
if (require.main === module) {
  const port = Number(process.env.SMARTDESK_PORT || 4173);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Porta inválida.");
  createServer().listen(port,"127.0.0.1",() => console.log("SmartDesk: http://127.0.0.1:" + port + (provider.ready() ? " — Gemini configurado; conexão será verificada ao analisar." : " — Gemini aguardando chave; base local ativa.")));
}
module.exports = {createServer};
