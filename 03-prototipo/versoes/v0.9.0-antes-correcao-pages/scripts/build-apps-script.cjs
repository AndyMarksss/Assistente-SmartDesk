"use strict";
const fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
const destination = path.join(root, "integracoes/apps-script");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
let checking = false;
const write = (name, text) => {
  text = text.replace(/^[ \t]+$/gm, "").trimEnd() + "\n";
  const target = path.join(destination, name);
  if (checking) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== text)
      throw Error("Artefato Google fora de sincronia: " + name);
  } else fs.writeFileSync(target, text);
};
const dataURI = (file) => {
  const mime = { ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ttf": "font/ttf" }[
    path.extname(file)
  ];
  if (!mime) throw Error("Formato de asset não previsto: " + file);
  return "data:" + mime + ";base64," + fs.readFileSync(path.join(root, file)).toString("base64");
};
function css(file) {
  return read(file)
    .replace(/,\s*url\([^)]*\.ttf\)\s*format\("truetype"\)/g, "")
    .replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g, (match, quote, relative) => {
      if (/^(data:|https:|#)/.test(relative)) return match;
      const asset = path.posix.normalize(path.posix.join(path.posix.dirname(file), relative));
      return 'url("' + dataURI(asset) + '")';
    });
}
function page(name) {
  let html = read(name),
    deferred = [];
  html = html.replace(/<script\s+(defer\s+)?src="([^"]+)"\s*><\/script>/g, (match, defer, file) => {
    if (file === "assets/js/runtime.js") return "";
    const inline = "<script>\n" + read(file).replace(/<\/script/gi, "<\\/script") + "\n</script>";
    if (defer) {
      deferred.push(inline);
      return "";
    }
    return inline;
  });
  html = html.replace(
    /<link rel="stylesheet" href="([^"]+)"\s*\/>/g,
    (match, file) => "<style>\n" + css(file) + "\n</style>",
  );
  html = html.replace(/assets\/img\/[a-zA-Z0-9_.-]+\.svg/g, (file) => dataURI(file));
  html = html.replace(
    /href="(index|admin)\.html"/g,
    (match, page) => 'href="<?= portalUrl ?>?page=' + (page === "admin" ? "admin" : "chat") + '"',
  );
  html = html.replace("<head>", '<head>\n<base target="_top">');
  const access = `<dialog id="portal-access" aria-labelledby="portal-access-title"><form id="portal-access-form"><small>SMARTDESK / TI</small><h2 id="portal-access-title">Acesso ao protótipo</h2><p>Use a senha de avaliação fornecida junto do link.</p><label for="portal-password">Senha de avaliação</label><input id="portal-password" type="password" required autocomplete="current-password" maxlength="256"><button type="submit">Entrar no SmartDesk</button><p id="portal-access-error" role="status"></p></form></dialog>`;
  const styles =
    "<style>#portal-access{max-width:400px;width:calc(100% - 64px);padding:28px;border:1px solid #53677f;border-radius:24px;background:#23364a;color:#ecf1fa;font:16px system-ui}#portal-access::backdrop{background:rgba(7,15,25,.88);backdrop-filter:blur(8px)}#portal-access label{display:block;margin:20px 0 8px}#portal-access input{box-sizing:border-box;width:100%;padding:14px;border:1px solid #8fa6be;border-radius:10px;font:inherit;background:#101e2d;color:#fff}#portal-access button{width:100%;padding:14px;border:0;border-radius:12px;background:#bba4ff;color:#21133c;font:inherit;font-weight:700;margin-top:16px}#portal-access p{line-height:1.6}#portal-access-error{min-height:24px}</style>";
  html = html.replace(
    "</body>",
    access +
      styles +
      "<script>\n" +
      read("assets/js/portal-access.js") +
      "\n</script>\n" +
      deferred.join("\n") +
      "\n</body>",
  );
  html = html.replace(
    "Abra o SmartDesk pelo servidor local para usar a IA e enviar chamados.",
    "Entre para abrir seu chamado com a TI.",
  );
  html = html.replace(/assets\/img\/[a-zA-Z0-9_.-]+\.svg/g, (file) => dataURI(file));
  return (
    "<!-- Gerado por npm run build:apps-script. Editar as fontes do protótipo, não este arquivo. -->\n" +
    html
  );
}
function build({ check = false } = {}) {
  checking = check;
  let shared =
    "/* Gerado: matriz, regras e validação compartilhadas com o protótipo. */\nvar window = { SmartDesk: {} };\n";
  shared +=
    "var SMARTDESK_PORTAL_VERSION = " + JSON.stringify(require("../package.json").version) + ";\n";
  for (const name of ["knowledge-base", "classifier", "flows", "request-policy"])
    shared += read("assets/js/" + name + ".js") + "\n";
  shared +=
    "\nclass InvalidRequest extends Error { constructor(message, status = 400) { super(message); this.status = status; } }\n";
  shared +=
    'var policy = window.SmartDesk.requestPolicy;\npolicy.localDay = () => Utilities.formatDate(new Date(), "America/Sao_Paulo", "yyyy-MM-dd");\n';
  let validation = read("server/ticket-validation.cjs");
  validation = validation.slice(
    validation.indexOf("function validateSelection"),
    validation.indexOf("module.exports"),
  );
  for (const name of [
    "validateSelection",
    "validateDescription",
    "validateAnswers",
    "safeSubject",
    "localSubject",
  ])
    validation = validation.replace(new RegExp("\\b" + name + "\\b", "g"), name + "_");
  validation = validation.replace(
    'if (!["http:", "https:"].includes(new URL(value).protocol)) throw Error();',
    "if (!/^https?:\\/\\/[^\\s/?#]+(?:[/?#][^\\s]*)?$/.test(value)) throw Error();",
  );
  shared += validation;
  write("PortalShared.gs", shared);
  write("PortalChat.html", page("index.html"));
  write("PortalAdmin.html", page("admin.html"));
  console.log("PortalChat.html, PortalAdmin.html e PortalShared.gs gerados sem credenciais.");
}
if (require.main === module) build({ check: process.argv.includes("--check") });
module.exports = { build };
