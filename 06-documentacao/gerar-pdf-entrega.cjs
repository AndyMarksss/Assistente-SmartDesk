"use strict";
// Gera o PDF da entrega (README do case + parte teórica) pelo Edge, a partir dos Markdown do repositório.
// Uso, na raiz do repositório: node 06-documentacao/gerar-pdf-entrega.cjs [pasta-de-envio]
// Os links relativos viram endereços do GitHub e as imagens vão embutidas. Com uma pasta, grava nela
// a cópia do PDF e um README.md autocontido (imagens embutidas), para enviar junto com o PDF.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const ROOT = path.resolve(__dirname, "..");
const REPO = "https://github.com/AndyMarksss/Assistente-SmartDesk/blob/main/";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function link(href, base) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [file, hash] = href.split("#");
  const rel = path.posix.normalize(path.posix.join(path.posix.dirname(base), decodeURI(file)));
  return REPO + encodeURI(rel) + (hash ? "#" + hash : "");
}
function image(src, base) {
  if (/^https?:/.test(src)) return src;
  const abs = path.join(ROOT, path.posix.dirname(base), decodeURI(src));
  const ext = path.extname(abs).slice(1).replace("jpg", "jpeg");
  return "data:image/" + ext + ";base64," + fs.readFileSync(abs).toString("base64");
}
function inline(text, base) {
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, c) => "\u0000" + (codes.push("<code>" + esc(c) + "</code>") - 1) + "\u0000");
  s = s.replace(/<(?!\/?(b|strong|br|img|span|p)\b)/g, "&lt;");
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => '<img alt="' + alt + '" src="' + image(src, base) + '">');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, h) => '<a href="' + link(h, base) + '">' + t + "</a>");
  s = s.replace(/<(https?:[^>]+)>/g, '<a href="$1">$1</a>');
  s = s.replace(/&lt;(https?:[^\s]+?)>/g, '<a href="$1">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[i]);
}
function render(md, base) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^<p align=/.test(l)) {
      out.push(l.replace(/src="([^"]+)"/, (_, s) => 'src="' + image(s, base) + '"'));
      i++;
      continue;
    }
    let m;
    if ((m = /^(#{1,6})\s+(.*)$/.exec(l))) {
      out.push("<h" + m[1].length + ">" + inline(m[2], base) + "</h" + m[1].length + ">");
      i++;
      continue;
    }
    if (/^---+$/.test(l.trim())) { out.push("<hr>"); i++; continue; }
    if (/^\|/.test(l)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push("<table><thead><tr>" + head.map((c) => "<th>" + inline(c, base) + "</th>").join("") + "</tr></thead><tbody>" +
        body.map((r) => "<tr>" + r.map((c) => "<td>" + inline(c, base) + "</td>").join("") + "</tr>").join("") + "</tbody></table>");
      continue;
    }
    if (/^>\s?/.test(l)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ""));
      out.push("<blockquote>" + render(q.join("\n"), base) + "</blockquote>");
      continue;
    }
    if (/^(\s*)([-*]|\d+\.)\s+/.test(l)) {
      const items = [];
      while (i < lines.length && (/^(\s*)([-*]|\d+\.)\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        const mm = /^(\s*)([-*]|\d+\.)\s+(.*)$/.exec(lines[i]);
        if (mm) items.push({ ind: mm[1].length, ord: /\d/.test(mm[2]), text: mm[3] });
        else items[items.length - 1].text += " " + lines[i].trim();
        i++;
      }
      let html = "";
      const stack = [];
      for (const it of items) {
        while (stack.length && it.ind < stack[stack.length - 1].ind) html += "</li></" + stack.pop().tag + ">";
        if (!stack.length || it.ind > stack[stack.length - 1].ind) {
          const tag = it.ord ? "ol" : "ul";
          stack.push({ ind: it.ind, tag });
          html += "<" + tag + "><li>";
        } else html += "</li><li>";
        html += inline(it.text, base);
      }
      while (stack.length) html += "</li></" + stack.pop().tag + ">";
      out.push(html);
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\||>|---+$|(\s*)([-*]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++]);
    out.push("<p>" + inline(para.join(" "), base) + "</p>");
  }
  return out.join("\n");
}
const outPdf = path.join(ROOT, "06-documentacao/case/smartdesk-entrega.pdf");
const inputs = ["06-documentacao/case/README.md", "06-documentacao/parte-teorica-hipoteses-e-validacao.md"];
const body = inputs
  .map((rel, n) => '<section class="doc' + (n ? " break" : "") + '">' + render(fs.readFileSync(path.join(ROOT, rel), "utf8"), rel) + "</section>")
  .join("\n");
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>SmartDesk — entrega</title><style>
@page { size: A4; margin: 16mm 15mm; }
body { font: 10.5pt/1.5 "Segoe UI", Arial, sans-serif; color: #1d2230; }
h1 { font-size: 20pt; margin: 0 0 6px; color: #2b1f6b; } h2 { font-size: 14pt; margin: 18px 0 6px; color: #2b1f6b; border-bottom: 1.5px solid #d9d2f5; padding-bottom: 3px; }
h3 { font-size: 11.5pt; margin: 12px 0 4px; } p { margin: 4px 0 8px; } ul, ol { margin: 2px 0 8px; padding-left: 20px; } li { margin: 2px 0; }
table { width: 100%; border-collapse: collapse; margin: 6px 0 10px; font-size: 9.5pt; page-break-inside: avoid; } th, td { border: 1px solid #c9ccd8; padding: 4px 6px; text-align: left; vertical-align: top; } th { background: #f1eefc; }
blockquote { margin: 8px 0; padding: 6px 12px; border-left: 3px solid #6b4fd8; background: #f6f4fd; } code { font: 9pt Consolas, monospace; background: #f1eefc; padding: 0 3px; border-radius: 3px; }
a { color: #4a33b8; text-decoration: none; } img { max-width: 100%; } .break { page-break-before: always; } hr { border: 0; border-top: 1px solid #ddd; }
h1, h2, h3 { break-after: avoid; page-break-after: avoid; } img, blockquote { break-inside: avoid; }
p:not([align]) > img:only-child { display: block; margin: 8px auto 0; border: 1px solid #d9dbe3; } p > em:only-child { display: block; text-align: center; font-size: 9pt; color: #5b6172; }
</style></head><body>${body}</body></html>`;
const tmpHtml = path.join(os.tmpdir(), "smartdesk-entrega.html");
fs.writeFileSync(tmpHtml, html);
if (fs.existsSync(outPdf)) fs.unlinkSync(outPdf);
execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=" + path.resolve(outPdf), "file:///" + tmpHtml.replace(/\\/g, "/")], { stdio: "ignore" });
const t0 = Date.now();
const pause = () => execFileSync(process.execPath, ["-e", "setTimeout(()=>{},300)"]);
// o Edge devolve antes de terminar de gravar: espera o arquivo existir e parar de crescer
let size = -1;
while (Date.now() - t0 < 30000) {
  pause();
  const now = fs.existsSync(outPdf) ? fs.statSync(outPdf).size : -1;
  if (now > 0 && now === size) break;
  size = now;
}
if (!fs.existsSync(outPdf)) throw Error("PDF não apareceu");
console.log("PDF: " + outPdf);

// README autocontido: as imagens viram data URI e os links relativos apontam para o GitHub.
function standalone(rel) {
  return fs
    .readFileSync(path.join(ROOT, rel), "utf8")
    .replace(/src="([^"]+)"/g, (m, src) => (/^(https?:|data:)/.test(src) ? m : 'src="' + image(src, rel) + '"'))
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => "![" + alt + "](" + image(src, rel) + ")")
    .replace(/(^|[^!])\[([^\]]+)\]\(([^)]+)\)/g, (_, pre, text, href) => pre + "[" + text + "](" + link(href, rel) + ")");
}
const dest = process.argv[2];
if (dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, "README.md"), standalone(inputs[0]));
  try {
    fs.copyFileSync(outPdf, path.join(dest, "Documentação Metodologias Ágeis e Validação de Produtos - Anderson Barbosa Marques da Silva (16732).pdf"));
  } catch (error) {
    if (error.code !== "EBUSY") throw error;
    console.log("A cópia do PDF em " + path.resolve(dest) + " está aberta em outro programa: feche-a e rode de novo.");
    process.exitCode = 1;
  }
  console.log("Envio: " + path.resolve(dest));
}
