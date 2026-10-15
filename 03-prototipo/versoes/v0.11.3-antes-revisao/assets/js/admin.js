"use strict";
(() => {
  if (window.smartdeskWrongRuntime) return;
  const $ = (id) => document.getElementById(id);
  let tickets = [],
    stages = [],
    selfHelp = null,
    mode = "demo",
    current = null,
    busy = false,
    loadId = 0,
    autoSeeded = false,
    loaded = false;
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  const icon = (name) => {
    const i = el("i", undefined, "fa-solid " + name);
    i.setAttribute("aria-hidden", "true");
    return i;
  };
  const api = (route, body) => window.SmartDesk.api.request(route, { body, timeout: 60000 });
  const items = () => window.SmartDesk.knowledgeBase?.items || [];
  // Nome legível do campo da matriz (ex.: mensagem-do-visor → Mensagem do visor).
  const fieldLabel = (key) =>
    key === "computador"
      ? "Quem utiliza"
      : items()
          .flatMap((item) => item.fields || [])
          .find((field) => field.id === key)?.label || key;
  const fieldType = (key) =>
    items()
      .flatMap((item) => item.fields || [])
      .find((field) => field.id === key)?.type;
  const isoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || "");
  const brDate = (iso) => iso.split("-").reverse().join("/");
  const plural = (n, one, many) => n + " " + (n === 1 ? one : many);
  // Cor de cada etapa: o quadro fica legível de longe e o cartão "muda de cor" ao mover.
  const STAGE_KEYS = {
    "Novos chamados": "new",
    "Em atendimento": "doing",
    "Aguardando terceiros": "waiting",
    Empréstimos: "loan",
    Agendado: "scheduled",
    Finalizado: "done",
    Cancelado: "cancelled",
  };
  const stageKey = (stage) => STAGE_KEYS[stage] || "other";
  const AREA_ICONS = {
    Audiovisual: "fa-video",
    Impressora: "fa-print",
    Google: "fa-envelope",
    TI: "fa-computer",
  };

  // --- Aviso flutuante -------------------------------------------------------------------
  let toastTimer = 0;
  function toast(text, kind = "ok") {
    const box = $("toast");
    box.className = "toast show " + kind;
    box.replaceChildren(
      icon(kind === "error" ? "fa-triangle-exclamation" : "fa-circle-check"),
      el("span", text),
    );
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (box.className = "toast"), 3600);
  }

  // --- Esqueleto enquanto os dados chegam --------------------------------------------------
  function skeleton() {
    document.querySelector(".admin-main").classList.add("is-skeleton");
    // Nada dos dados anteriores fica à vista enquanto a nova origem carrega.
    $("area-chart").replaceChildren(
      ...[0, 1, 2, 3].map(() => el("div", undefined, "skeleton-line")),
    );
    $("selfhelp-bar").style.width = "0%";
    $("kanban").replaceChildren();
    for (let c = 0; c < 4; c++) {
      const column = el("section", undefined, "kanban-column skeleton-column");
      column.append(el("div", undefined, "skeleton-line short"));
      for (let i = 0; i < 2; i++) {
        const card = el("div", undefined, "skeleton-card");
        card.append(
          el("div", undefined, "skeleton-line tiny"),
          el("div", undefined, "skeleton-line"),
          el("div", undefined, "skeleton-line short"),
        );
        column.append(card);
      }
      $("kanban").append(column);
    }
  }

  function render() {
    document.querySelector(".admin-main").classList.remove("is-skeleton");
    const total = tickets.length,
      closed = tickets.filter((t) => ["Finalizado", "Cancelado"].includes(t.status)).length;
    $("metric-total").textContent = total;
    $("metric-open").textContent = total - closed;
    $("metric-active").textContent = tickets.filter((t) => t.status === "Em atendimento").length;
    $("metric-done").textContent = tickets.filter((t) => t.status === "Finalizado").length;
    $("queue-insight").textContent = total
      ? `${plural(total - closed, "chamado segue", "chamados seguem")} em andamento. ${plural(tickets.filter((t) => t.status === "Aguardando terceiros").length, "aguarda", "aguardam")} terceiros e ${plural(tickets.filter((t) => t.status === "Agendado").length, "está agendado", "estão agendados")}.`
      : "Nenhum chamado nesta origem. Crie simulações ou carregue os dados do Google.";
    renderSelfHelp();
    $("area-chart").replaceChildren();
    for (const area of ["Audiovisual", "Impressora", "Google", "TI"]) {
      const count = tickets.filter((t) => t.area === area).length,
        row = el("div", undefined, "chart-row"),
        track = el("div", undefined, "chart-track"),
        bar = el("div", undefined, "chart-bar");
      bar.style.width = (total ? (count / total) * 100 : 0) + "%";
      track.append(bar);
      row.append(el("span", area), track, el("span", String(count)));
      $("area-chart").append(row);
    }
    const prev = $("sector-filter").value,
      sectors = [...new Set(tickets.map((t) => t.sector))].sort();
    $("sector-filter").replaceChildren(el("option", "Todos os setores"));
    $("sector-filter").firstChild.value = "";
    for (const s of sectors) {
      const opt = el("option", s);
      opt.value = s;
      $("sector-filter").append(opt);
    }
    $("sector-filter").value = sectors.includes(prev) ? prev : "";
    renderBoard(true);
  }
  function renderSelfHelp() {
    const box = $("selfhelp-insight");
    if (!selfHelp) {
      box.textContent = "Os registros de autoatendimento aparecem com os dados do Google.";
      $("selfhelp-bar").style.width = "0%";
      return;
    }
    const total = selfHelp.resolved + selfHelp.continued,
      rate = total ? Math.round((selfHelp.resolved / total) * 100) : 0;
    box.textContent = total
      ? `${plural(selfHelp.resolved, "atendimento resolvido", "atendimentos resolvidos")} com as dicas da IA, sem abrir chamado; ${plural(selfHelp.continued, "seguiu", "seguiram")} para o chamado (${rate}% resolvidos).` +
        (selfHelp.simulation ? " Valores de demonstração." : "")
      : "Ainda não há atendimentos com dicas da IA registrados.";
    $("selfhelp-bar").style.width = rate + "%";
  }
  function cardTags(t) {
    const tags = [];
    const scheduled = Object.entries(t.answers || {}).find(
      ([key, value]) => fieldType(key) === "date" && isoDate(value),
    );
    if (scheduled) tags.push(["fa-calendar-day", brDate(scheduled[1]).slice(0, 5), "date"]);
    if (t.attachments?.length) tags.push(["fa-paperclip", String(t.attachments.length), "files"]);
    if (t.authorization?.status === "pending")
      tags.push(["fa-hourglass-half", "Autorização pendente", "auth"]);
    if (t.simulation) tags.push(["fa-flask", "Simulação", "sim"]);
    return tags;
  }
  function renderBoard(animate = false) {
    const search = $("search").value.toLocaleLowerCase("pt-BR"),
      area = $("area-filter").value,
      sector = $("sector-filter").value;
    const filtered = tickets.filter(
      (t) =>
        (!area || area === t.area) &&
        (!sector || sector === t.sector) &&
        [t.number, t.subject, t.name, t.sector, t.email]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(search),
    );
    $("kanban").replaceChildren();
    for (const stage of [
      ...stages,
      ...new Set(filtered.map((t) => t.status).filter((s) => !stages.includes(s))),
    ]) {
      const column = el("section", undefined, "kanban-column"),
        head = el("header", undefined, "column-head"),
        list = filtered.filter((t) => t.status === stage);
      column.dataset.stage = stage;
      column.dataset.tone = stageKey(stage);
      const title = el("h3");
      title.append(el("span", undefined, "stage-dot"), document.createTextNode(stage));
      head.append(title, el("span", String(list.length), "column-count"));
      column.append(head);
      for (const t of list) column.append(card(t, animate, list.indexOf(t)));
      if (!list.length) column.append(el("p", "Solte um cartão aqui", "empty-column"));
      $("kanban").append(column);
    }
  }
  function card(t, animate, index) {
    const node = el("button", undefined, "ticket-card");
    node.type = "button";
    node.dataset.requestId = t.requestId;
    node.dataset.tone = stageKey(t.status);
    if (animate) {
      node.classList.add("motion-enter");
      node.style.setProperty("--option-delay", Math.min(index, 4) * 35 + "ms");
    }
    if (t.requestId === lastMoved) node.classList.add("just-moved");
    node.setAttribute("aria-label", `${t.number}: ${t.subject}. Etapa ${t.status}. Ver detalhes`);
    const top = el("div", undefined, "ticket-top"),
      tag = el("span", undefined, "area-tag");
    tag.dataset.area = t.area;
    tag.append(icon(AREA_ICONS[t.area] || "fa-circle"), document.createTextNode(" " + t.area));
    top.append(el("span", t.number, "ticket-number"), tag);
    const meta = el("p", [t.name, t.sector].filter(Boolean).join(" · "), "ticket-meta");
    node.append(top, el("h4", t.subject), meta);
    const tags = cardTags(t);
    if (tags.length) {
      const row = el("div", undefined, "ticket-tags");
      for (const [glyph, text, kind] of tags) {
        const chip = el("span", undefined, "ticket-tag " + kind);
        chip.append(icon(glyph), document.createTextNode(" " + text));
        row.append(chip);
      }
      node.append(row);
    }
    const opened = Date.parse(t.createdAt);
    node.append(
      el(
        "p",
        Number.isNaN(opened) ? "Data não informada" : new Date(opened).toLocaleDateString("pt-BR"),
        "ticket-date",
      ),
    );
    return node;
  }

  // --- Arrastar e soltar (mouse e caneta); toque abre os detalhes ---------------------------
  let drag = null,
    lastMoved = "";
  $("kanban").addEventListener("pointerdown", (event) => {
    const node = event.target.closest(".ticket-card");
    if (!node || event.button !== 0 || busy) return;
    drag = { node, x: event.clientX, y: event.clientY, active: false, pointer: event.pointerType };
  });
  window.addEventListener("pointermove", (event) => {
    if (!drag || drag.pointer === "touch") return;
    if (!drag.active) {
      if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return;
      drag.active = true;
      const box = drag.node.getBoundingClientRect();
      drag.offsetX = drag.x - box.left;
      drag.offsetY = drag.y - box.top;
      drag.ghost = drag.node.cloneNode(true);
      drag.ghost.classList.remove("motion-enter", "just-moved", "dragging");
      drag.ghost.classList.add("drag-ghost");
      drag.ghost.style.width = box.width + "px";
      drag.ghost.setAttribute("aria-hidden", "true");
      document.body.append(drag.ghost);
      drag.node.classList.add("dragging");
      document.body.classList.add("is-dragging");
    }
    drag.ghost.style.transform =
      "translate(" +
      (event.clientX - drag.offsetX) +
      "px," +
      (event.clientY - drag.offsetY) +
      "px) rotate(-2deg)";
    const over = document.elementFromPoint(event.clientX, event.clientY)?.closest(".kanban-column");
    document.querySelectorAll(".kanban-column.drop-active").forEach((column) => {
      if (column !== over) column.classList.remove("drop-active");
    });
    if (over && stages.includes(over.dataset.stage)) over.classList.add("drop-active");
    // Rola a página perto das bordas para alcançar colunas fora da tela.
    if (event.clientY > innerHeight - 60) scrollBy(0, 14);
    else if (event.clientY < 60) scrollBy(0, -14);
  });
  window.addEventListener("pointerup", (event) => {
    if (!drag) return;
    const state = drag;
    drag = null;
    if (!state.active) return; // clique simples: o evento click abre os detalhes
    state.ghost.remove();
    state.node.classList.remove("dragging");
    document.body.classList.remove("is-dragging");
    const over = document.elementFromPoint(event.clientX, event.clientY)?.closest(".kanban-column");
    document
      .querySelectorAll(".kanban-column.drop-active")
      .forEach((column) => column.classList.remove("drop-active"));
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 0);
    const t = tickets.find((entry) => entry.requestId === state.node.dataset.requestId);
    if (t && over && stages.includes(over.dataset.stage) && over.dataset.stage !== t.status)
      update(t, over.dataset.stage);
  });
  window.addEventListener("pointercancel", () => {
    if (!drag) return;
    drag.ghost?.remove();
    drag.node.classList.remove("dragging");
    document.body.classList.remove("is-dragging");
    drag = null;
  });
  let suppressClick = false;
  $("kanban").addEventListener("click", (event) => {
    const node = event.target.closest(".ticket-card");
    if (!node || suppressClick) return;
    const t = tickets.find((entry) => entry.requestId === node.dataset.requestId);
    if (t) open(t);
  });

  async function load() {
    const id = ++loadId,
      selected = mode;
    $("refresh").disabled = true;
    $("refresh").classList.add("is-loading");
    $("kanban").setAttribute("aria-busy", "true");
    $("admin-error").textContent = "";
    $("sync-status").textContent = "Carregando chamados…";
    if (!loaded) skeleton();
    try {
      const result = await api("/api/admin/tickets?mode=" + selected);
      if (id !== loadId) return;
      tickets = Array.isArray(result.tickets) ? result.tickets : [];
      stages = Array.isArray(result.stages) ? result.stages : [];
      selfHelp =
        result.selfHelp && Number.isFinite(result.selfHelp.resolved) ? result.selfHelp : null;
      // Demonstração vazia ganha as simulações sozinha: o avaliador já vê o quadro preenchido.
      if (selected === "demo" && !tickets.length && !autoSeeded) {
        autoSeeded = true;
        await api("/api/admin/seed", { mode: "demo" });
        if (id === loadId) return load();
      }
      loaded = true;
      render();
      $("sync-status").textContent =
        "Atualizado às " +
        new Date().toLocaleTimeString("pt-BR") +
        " · " +
        (mode === "demo" ? "Demonstração" : "Google Planilhas");
    } catch (e) {
      if (id !== loadId) return;
      tickets = [];
      loaded = true;
      render();
      $("admin-error").textContent = e.message;
      $("sync-status").textContent = "Conexão não confirmada";
    } finally {
      if (id === loadId) {
        $("refresh").disabled = false;
        $("refresh").classList.remove("is-loading");
        $("kanban").setAttribute("aria-busy", "false");
      }
    }
  }
  function open(t) {
    current = t;
    $("detail-number").textContent = t.number + (t.simulation ? " · SIMULAÇÃO" : "");
    $("detail-title").textContent = t.subject;
    $("detail-data").replaceChildren();
    for (const [label, value] of [
      ["Solicitante", t.name],
      ["E-mail", t.email || "Não informado"],
      ["Setor", t.sector],
      ["Área", t.area],
      ["Necessidade", t.need],
      ["Descrição", t.description],
      ...(t.authorization
        ? [
            [
              "Autorização da liderança",
              t.authorization.status === "reported"
                ? "Declarada pelo solicitante — " + t.authorization.by
                : "Pendente de autorização",
            ],
          ]
        : []),
      ...Object.entries(t.answers || {}).map(([key, value]) => [
        fieldLabel(key),
        fieldType(key) === "date" && isoDate(value)
          ? brDate(value)
          : value === "Ainda não informado"
            ? "Envio depois"
            : value,
      ]),
    ])
      $("detail-data").append(el("dt", label), el("dd", value));
    $("detail-files").replaceChildren();
    for (const [i, url] of (t.attachments || []).entries()) {
      try {
        const u = new URL(url);
        if (u.protocol !== "https:" || u.hostname !== "drive.google.com") continue;
        const link = el("a", "Abrir anexo " + (i + 1));
        link.href = u.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        $("detail-files").append(link);
      } catch {}
    }
    $("detail-stage").replaceChildren();
    for (const stage of stages) {
      const o = el("option", stage);
      o.value = stage;
      $("detail-stage").append(o);
    }
    $("detail-stage").value = t.status;
    $("save-stage").disabled = t.status === "Recebendo";
    $("detail-error").textContent = "";
    $("ticket-dialog").showModal();
    $("close-dialog").focus();
  }
  async function update(t, status) {
    if (busy || status === t.status) return;
    busy = true;
    const previous = t.status;
    // Movimento otimista: o cartão muda de coluna na hora e volta se o Google recusar.
    t.status = status;
    lastMoved = t.requestId;
    renderBoard(false);
    $("save-stage").disabled = true;
    $("save-stage").classList.add("is-loading");
    $("save-stage").querySelector("span").textContent = "Salvando…";
    $("ticket-dialog").setAttribute("aria-busy", "true");
    $("sync-status").textContent = "Salvando " + t.number + "…";
    try {
      await api("/api/admin/status", {
        mode,
        requestId: t.requestId,
        status,
        expectedStatus: previous,
      });
      render();
      if ($("ticket-dialog").open) $("ticket-dialog").close();
      toast(t.number + " movido para " + status + ".");
      $("sync-status").textContent =
        "Etapa salva " +
        (mode === "demo"
          ? window.smartdeskRemote
            ? "na demonstração desta sessão."
            : "na demonstração local."
          : "no Google Planilhas.");
    } catch (e) {
      t.status = previous;
      render();
      toast("Não consegui mover " + t.number + ": " + e.message, "error");
      $("detail-error").textContent = e.message;
      $("admin-error").textContent = e.message;
      $("sync-status").textContent = "Etapa não salva";
    } finally {
      busy = false;
      setTimeout(() => {
        lastMoved = "";
        document.querySelector(".ticket-card.just-moved")?.classList.remove("just-moved");
      }, 1600);
      $("save-stage").disabled = current?.status === "Recebendo";
      $("save-stage").classList.remove("is-loading");
      $("save-stage").querySelector("span").textContent = "Salvar etapa";
      $("ticket-dialog").setAttribute("aria-busy", "false");
    }
  }
  $("ticket-dialog").addEventListener("click", (event) => {
    const box = $("ticket-dialog").getBoundingClientRect();
    if (
      event.target === $("ticket-dialog") &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      $("ticket-dialog").close();
  });
  $("save-stage").addEventListener(
    "click",
    () => current && update(current, $("detail-stage").value),
  );
  $("close-dialog").addEventListener("click", () => $("ticket-dialog").close());
  $("refresh").addEventListener("click", load);
  for (const id of ["search", "area-filter", "sector-filter"])
    $(id).addEventListener("input", () => renderBoard(false));
  function showMode(value) {
    mode = value;
    $("data-mode").value = value;
    $("seed").hidden = mode !== "demo";
    $("source-note").textContent =
      mode === "demo"
        ? "Simulações separadas dos chamados reais."
        : window.smartdeskRemote
          ? "Somente chamados enviados nesta sessão de avaliação."
          : "Leitura e atualização da planilha conectada ao SmartDesk.";
  }
  $("data-mode").addEventListener("change", () => {
    showMode($("data-mode").value);
    loaded = false;
    load();
  });
  $("seed").addEventListener("click", async () => {
    $("seed").disabled = true;
    try {
      await api("/api/admin/seed", { mode: "demo" });
      await load();
    } catch (e) {
      $("admin-error").textContent = e.message;
    } finally {
      $("seed").disabled = false;
    }
  });
  // Quem acabou de enviar um chamado nesta aba abre o painel direto nele.
  try {
    if (sessionStorage.getItem("smartdesk-sent")) showMode("google");
  } catch {}
  load();
})();
