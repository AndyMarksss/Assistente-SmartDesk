"use strict";
// Percorre pelos botões, no navegador, cada um dos 57 caminhos até o resumo (sem enviar).
// Usa o relato "claro" de relatos.json como descrição, para ver se a IA da revisão acusa
// incoerência sem motivo, que pergunta faz e que dicas dá. Roda pelo cdp-run (Edge sem janela):
//   node cdp-run.cjs percorrer-botoes.cjs   (com o servidor local em 127.0.0.1:4173)
const fs = require("node:fs");
const path = require("node:path");
const BASE = process.env.BASE || "http://127.0.0.1:4173/index.html";
const SAIDA = path.join(__dirname, "percurso-botoes.json");
const banco = JSON.parse(
  fs.readFileSync(path.join(__dirname, "relatos.json"), "utf8"),
);
const relatoClaro = Object.fromEntries(
  banco.casos
    .filter((c) => c.tipo === "claro")
    .map((c) => [c.esperado, c.relato]),
);

module.exports = async (page) => {
  await page.size(1280, 900, 1, false);
  await page.nav(BASE);
  const itens = await page.js(
    "return window.SmartDesk.knowledgeBase.items.map((i) => ({ id: i.id, area: i.area, path: i.path, fields: i.fields || [], sectors: i.sectors || null, labels: i.path.map(window.SmartDesk.chatFormat.displayLabel) }));",
  );
  const feitos = fs.existsSync(SAIDA)
    ? JSON.parse(fs.readFileSync(SAIDA, "utf8"))
    : [];
  const resultados = feitos.filter((r) => r.ok);
  const so = process.env.SO ? process.env.SO.split(",") : null;
  for (const item of itens) {
    if (so && !so.includes(item.id)) continue;
    if (resultados.some((r) => r.id === item.id)) continue;
    const inicio = Date.now();
    const r = {
      id: item.id,
      ok: false,
      passos: [],
      alerta: null,
      perguntas: [],
      dicas: null,
      resumo: "",
    };
    try {
      await page.nav(BASE);
      await page.js("localStorage.clear(); sessionStorage.clear();");
      await page.nav(BASE);
      await page.js(`
        window.__count = () => document.querySelectorAll('#messages .message').length;
        window.__exact = (text) => [...document.querySelectorAll('#choices button')].filter(__vis).find((b) => __t(b.textContent) === text);
        window.__starts = (text) => [...document.querySelectorAll('#choices button')].filter(__vis).find((b) => __t(b.textContent).startsWith(text));
        window.__settle = async (before) => {
          await __waitFor(() => __count() > before + 1 && !document.querySelector('#messages .message.thinking'), 90000);
          await new Promise((r) => setTimeout(r, 700));
        };
        await __waitBtn('Sim, vamos começar', 30000);
      `);
      const act = async (code, passo) => {
        r.passos.push(passo);
        await page.js(
          "const before = __count(); " + code + "; await __settle(before);",
        );
      };
      await act("__click('Sim, vamos começar')", "início");
      await act("await __type('Pessoa Ficticia Teste')", "nome");
      await act("await __type('teste.ficticio@exemplo.com')", "e-mail");
      const setor = item.sectors ? item.sectors[0] : "Secretaria";
      await act(`await __combo(${JSON.stringify(setor)})`, "setor " + setor);
      await act(
        `(await __waitFor(() => __starts(${JSON.stringify(item.area)}))).click()`,
        "área " + item.area,
      );
      for (const label of item.labels)
        await act(
          `(await __waitFor(() => __exact(${JSON.stringify(label)}))).click()`,
          "caminho " + label,
        );
      let descreveu = false;
      for (let volta = 0; volta < 30; volta++) {
        const st = await page.js(`
          return await __waitFor(() => {
            if (document.querySelector('#messages .message.thinking')) return false;
            const btns = [...document.querySelectorAll('#choices button')].filter(__vis).map((b) => __t(b.textContent));
            const structured = document.getElementById('structured-input');
            const input = document.getElementById('chat-input');
            const livre = input && !input.disabled && input.offsetParent !== null ? input.placeholder : null;
            if (!btns.length && !structured && !livre) return false;
            return { btns, structured: structured ? structured.placeholder : null, livre, ultima: __last() };
          }, 90000);
        `);
        const tem = (texto) => st.btns.includes(texto);
        if (tem("Enviar chamado")) {
          r.ok = true;
          r.resumo = await page.js(
            "return __t([...document.querySelectorAll('.summary-card')].slice(-1)[0]?.textContent)",
          );
          break;
        }
        if (tem("Está certo assim")) {
          r.alerta = st.ultima;
          await act(
            "__exact('Está certo assim').click()",
            "alerta de incoerência → está certo",
          );
        } else if (tem("Pular esta pergunta")) {
          r.perguntas.push(st.ultima);
          await act(
            "__exact('Pular esta pergunta').click()",
            "pergunta da IA → pular",
          );
        } else if (tem("Não resolveu, seguir com o chamado")) {
          r.dicas = st.ultima;
          await act(
            "__exact('Não resolveu, seguir com o chamado').click()",
            "dicas → seguir",
          );
        } else if (tem("Ainda não tenho autorização")) {
          await act(
            "__exact('Ainda não tenho autorização').click()",
            "autorização pendente",
          );
        } else if (tem("Meu item está com defeito")) {
          await act("__exact('Meu item está com defeito').click()", "defeito");
        } else if (
          tem("Eu uso este computador") ||
          tem("Eu uso esse equipamento")
        ) {
          await act(
            "(__exact('Eu uso este computador') || __exact('Eu uso esse equipamento')).click()",
            "quem usa → eu",
          );
        } else if (tem("Continuar sem anexo")) {
          await act("__exact('Continuar sem anexo').click()", "sem anexo");
        } else if (tem("Enviar o link depois")) {
          await act("__exact('Enviar o link depois').click()", "link depois");
        } else if (st.structured === "DD/MM/AAAA") {
          await act(
            "[...document.querySelectorAll('.date-chip')].find((b) => __t(b.textContent) === 'Amanhã').click()",
            "data amanhã",
          );
        } else if (st.structured === "HH:MM") {
          await act(
            "const f = document.getElementById('structured-input'); f.value = '10:00'; f.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('#structured-field button.primary').click()",
            "horário 10:00",
          );
        } else if (st.livre) {
          const campo = item.fields.find((f) => f.label + "…" === st.livre);
          let valor;
          if (!campo) {
            if (descreveu)
              throw new Error("Pediu a descrição de novo: " + st.livre);
            descreveu = true;
            valor = relatoClaro[item.id];
          } else if (campo.type === "email")
            valor = "teste.ficticio@exemplo.com";
          else if (campo.type === "tel") valor = "11 99999-0000";
          else if (campo.type === "url") valor = "https://exemplo.com/roteiro";
          else if (campo.id === "descricao-do-problema")
            valor = relatoClaro[item.id];
          else valor = "Informação de teste 01";
          await act(
            "await __type(" + JSON.stringify(valor) + ")",
            (campo ? "campo " + campo.id : "descrição") +
              " = " +
              valor.slice(0, 40),
          );
        } else if (st.btns.length) {
          await act(
            "[...document.querySelectorAll('#choices button')].filter(__vis)[0].click()",
            "opção " + st.btns[0],
          );
        } else
          throw new Error("Tela sem ação conhecida: " + JSON.stringify(st));
      }
      if (!r.ok) throw new Error("Não chegou ao resumo em 30 passos.");
    } catch (error) {
      r.erro = error.message;
      r.ultima = await page.js("return __last()").catch(() => "");
      await page
        .shot(path.join(__dirname, "falha-" + item.id + ".jpg"))
        .catch(() => {});
    }
    r.segundos = Math.round((Date.now() - inicio) / 1000);
    console.log(
      (r.ok ? "ok  " : "FALHA ") +
        item.id +
        " (" +
        r.segundos +
        "s)" +
        (r.alerta ? " ALERTA" : "") +
        (r.perguntas.length ? " pergunta" : "") +
        (r.dicas ? " dicas" : "") +
        (r.erro ? " — " + r.erro : ""),
    );
    resultados.push(r);
    fs.writeFileSync(SAIDA, JSON.stringify(resultados, null, 2));
  }
};
