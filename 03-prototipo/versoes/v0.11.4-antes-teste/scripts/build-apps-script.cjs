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
function build({ check = false } = {}) {
  checking = check;
  let shared =
    "/* Gerado: matriz, regras e validação compartilhadas com o protótipo. */\nvar window = { SmartDesk: {} };\n";
  shared +=
    "var SMARTDESK_PORTAL_VERSION = " + JSON.stringify(require("../package.json").version) + ";\n";
  // Mesmas instruções e esquemas de IA no servidor local e no Apps Script.
  const ai = require("../server/ai-provider.cjs");
  for (const [name, value] of [
    ["SMARTDESK_ASSIST_INSTRUCTION", ai.ASSIST_INSTRUCTION],
    ["SMARTDESK_ASSIST_SCHEMA", ai.ASSIST_SCHEMA],
    ["SMARTDESK_EXTRACT_INSTRUCTION", ai.EXTRACT_INSTRUCTION],
    ["SMARTDESK_EXTRACT_SCHEMA", ai.EXTRACT_SCHEMA],
    ["SMARTDESK_ANALYZE_INSTRUCTION", ai.ANALYZE_INSTRUCTION],
  ])
    shared += "var " + name + " = " + JSON.stringify(value) + ";\n";
  shared +=
    ai.analyzeCategories
      .toString()
      .replace("function analyzeCategories", "function analyzeCategories_") + "\n";
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
    "safeAssist",
    "safeExtract",
    "extractableFields",
    "weekdayName",
    "localSubject",
  ])
    validation = validation.replace(new RegExp("\\b" + name + "\\b", "g"), name + "_");
  validation = validation.replace(
    'if (!["http:", "https:"].includes(new URL(value).protocol)) throw Error();',
    "if (!/^https?:\\/\\/[^\\s/?#]+(?:[/?#][^\\s]*)?$/.test(value)) throw Error();",
  );
  shared += validation;
  write("PortalShared.gs", shared);
  console.log("PortalShared.gs conferido/gerado sem credenciais; interface no Pages.");
}
if (require.main === module) build({ check: process.argv.includes("--check") });
module.exports = { build };
