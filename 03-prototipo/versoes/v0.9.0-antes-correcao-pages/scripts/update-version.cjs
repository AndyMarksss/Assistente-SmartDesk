"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const packagePath = path.join(root, "package.json");
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const checking = process.argv[2] === "--check";
const version = checking ? pkg.version : process.argv[2] || pkg.version;
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("Use uma versão no formato 0.8.12.");
const changes = [];
function update(file, content) {
  const target = path.join(root, file);
  const previous = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (previous.replace(/\r\n/g, "\n") === content.replace(/\r\n/g, "\n")) return;
  changes.push(file);
  if (!checking) fs.writeFileSync(target, content);
}
pkg.version = version;
update("package.json", JSON.stringify(pkg, null, 2) + "\n");
const lock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
lock.version = version;
lock.packages[""].version = version;
update("package-lock.json", JSON.stringify(lock, null, 2) + "\n");
for (const file of ["index.html", "admin.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (!html.includes("data-project-version")) throw new Error("Rodapé de versão ausente: " + file);
  update(
    file,
    html.replace(/(<span data-project-version>)[^<]*(<\/span>)/g, "$1" + version + "$2"),
  );
}
update(
  "VERSAO.md",
  "# Versão atual do SmartDesk\n\n**" +
    version +
    "**\n\nA fonte da versão é package.json. Os rodapés do chat e do painel, package-lock.json e este documento são sincronizados por npm run version:update -- NOVA_VERSAO.\n\nA cada entrega com mudanças no código ou interface, incrementar a versão, executar a sincronização e registrar o que mudou em CHANGELOG.md e no relatório de verificação. Ajustes e correções incrementam o último número; funcionalidades novas podem incrementar o número intermediário. Documentos históricos preservam a versão original.\n\nExemplo: npm run version:update -- 0.8.13. Para verificar a consistência antes do commit: npm run version:check.\n",
);
const architecture = fs.readFileSync(path.join(root, "arquitetura.md"), "utf8");
update(
  "arquitetura.md",
  architecture.replace(
    /^# Estrutura do SmartDesk — [^\r\n]+/,
    "# Estrutura do SmartDesk — " + version,
  ),
);
if (fs.existsSync(path.join(root, "scripts/build-apps-script.cjs")))
  require("./build-apps-script.cjs").build({ check: checking });
if (checking && changes.length) {
  console.error("Versão fora de sincronia: " + changes.join(", "));
  process.exitCode = 1;
} else
  console.log(
    checking ? "Versão " + version + " consistente." : "Versão " + version + " sincronizada.",
  );
