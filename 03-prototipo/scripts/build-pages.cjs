"use strict";
const fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
function build(destination, address = "") {
  if (address) {
    const u = new URL(address);
    if (
      u.origin !== "https://script.google.com" ||
      !/^\/macros\/s\/[\w-]+\/exec$/.test(u.pathname) ||
      u.search ||
      u.hash ||
      u.username ||
      u.password
    )
      throw Error("Use somente a URL pública /exec do Apps Script.");
  }
  fs.mkdirSync(destination, { recursive: true });
  function copyAssets(source, target) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.isSymbolicLink())
        throw Error("Asset inattendu: " + entry.name);
      const from = path.join(source, entry.name),
        to = path.join(target, entry.name);
      if (entry.isDirectory()) copyAssets(from, to);
      else fs.writeFileSync(to, fs.readFileSync(from));
    }
  }
  copyAssets(path.join(root, "assets"), path.join(destination, "assets"));
  fs.writeFileSync(
    path.join(destination, "smartdesk-config.js"),
    '"use strict";\nwindow.SMARTDESK_SERVICE_URL = ' +
      JSON.stringify(address).replace(/</g, "\\u003c") +
      ";\n",
  );
  const access = `<dialog id="portal-access" aria-labelledby="portal-access-title"><form id="portal-access-form"><small>SMARTDESK / TI</small><h2 id="portal-access-title">Acesso ao protótipo</h2><p>Use a senha de avaliação fornecida junto do link.</p><label for="portal-password">Senha de avaliação</label><input id="portal-password" type="password" required autocomplete="current-password" maxlength="256"><button type="submit">Entrar no SmartDesk</button><p id="portal-access-error" role="status"></p></form></dialog>`;
  for (const page of ["index.html", "admin.html"]) {
    let html = fs.readFileSync(path.join(root, page), "utf8");
    html = html.replace(
      "<head>",
      '<head>\n<script src="smartdesk-config.js"></script>\n<script defer src="assets/js/pages-transport.js"></script>\n<script defer src="assets/js/portal-access.js"></script>\n<link rel="stylesheet" href="assets/css/portal-access.css">',
    );
    // Estes scripts registram acesso antes dos scripts da aplicação.
    html = html.replace("</body>", access + "\n</body>");
    if (!address)
      html = html
        .replace(
          "Use a senha de avaliação fornecida junto do link.",
          "A conexão Google ainda está sendo configurada. Este protótipo ainda não está pronto para avaliação.",
        )
        .replace('<button type="submit">', '<button type="submit" disabled>');
    fs.writeFileSync(path.join(destination, page), html);
  }
  fs.writeFileSync(path.join(destination, ".nojekyll"), "");
}
if (require.main === module)
  build(
    path.resolve(process.argv[2] || "pages-dist"),
    String(
      process.env.SMARTDESK_SERVICE_URL ||
        require("../integracoes/apps-script/public-config.json").endpoint ||
        "",
    ).trim(),
  );
module.exports = { build };
