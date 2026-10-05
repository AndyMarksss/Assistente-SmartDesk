"use strict";
(() => {
  if (window.smartdeskWrongRuntime) return;
  const $ = (id) => document.getElementById(id);
  let tickets = [],
    stages = [],
    mode = "demo",
    current = null,
    busy = false,
    loadId = 0;
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  const api = (route, body) => window.SmartDesk.api.request(route, { body, timeout: 60000 });
  function render() {
    const total = tickets.length,
      closed = tickets.filter((t) => ["Finalizado", "Cancelado"].includes(t.status)).length;
    $("metric-total").textContent = total;
    $("metric-open").textContent = total - closed;
    $("metric-active").textContent = tickets.filter((t) => t.status === "Em atendimento").length;
    $("metric-done").textContent = tickets.filter((t) => t.status === "Finalizado").length;
    $("queue-insight").textContent = total
      ? `${total - closed} chamados seguem em andamento. ${tickets.filter((t) => t.status === "Aguardando terceiros").length} aguardam terceiros e ${tickets.filter((t) => t.status === "Agendado").length} estão agendados.`
      : "Nenhum chamado nesta origem. Crie simulações ou carregue os dados do Google.";
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
        items = filtered.filter((t) => t.status === stage);
      head.append(el("h3", stage), el("span", String(items.length), "column-count"));
      column.append(head);
      column.addEventListener("dragover", (e) => {
        if (!stages.includes(stage)) return;
        e.preventDefault();
        column.classList.add("drop-active");
      });
      column.addEventListener("dragleave", () => column.classList.remove("drop-active"));
      column.addEventListener("drop", (e) => {
        e.preventDefault();
        column.classList.remove("drop-active");
        const t = tickets.find((t) => t.requestId === e.dataTransfer.getData("text/plain"));
        if (t && stages.includes(stage)) update(t, stage);
      });
      for (const t of items) {
        const card = el("button", undefined, "ticket-card");
        card.type = "button";
        if (animate) {
          card.classList.add("motion-enter");
          card.style.setProperty("--option-delay", Math.min(items.indexOf(t), 4) * 35 + "ms");
        }
        card.draggable = stages.includes(t.status);
        card.setAttribute("aria-label", `${t.number}: ${t.subject}. Ver detalhes`);
        card.addEventListener("dragstart", (e) =>
          e.dataTransfer.setData("text/plain", t.requestId),
        );
        card.addEventListener("click", () => open(t));
        const top = el("div", undefined, "ticket-top");
        top.append(el("span", t.number), el("span", t.area, "area-tag"));
        card.append(top, el("h4", t.subject), el("p", t.name), el("p", t.sector));
        const bottom = el("div", undefined, "ticket-bottom");
        bottom.append(
          el(
            "span",
            Number.isNaN(Date.parse(t.createdAt))
              ? "Data não informada"
              : new Date(t.createdAt).toLocaleDateString("pt-BR"),
          ),
          el("span", t.attachments?.length ? `${t.attachments.length} anexo(s)` : "Sem anexo"),
        );
        card.append(bottom);
        if (t.simulation) card.append(el("p", "SIMULAÇÃO", "simulation-label"));
        column.append(card);
      }
      if (!items.length) column.append(el("p", "Nenhum chamado por aqui", "empty-column"));
      $("kanban").append(column);
    }
  }
  async function load() {
    const id = ++loadId,
      selected = mode;
    $("refresh").disabled = true;
    $("refresh").classList.add("is-loading");
    $("kanban").setAttribute("aria-busy", "true");
    $("admin-error").textContent = "";
    $("sync-status").textContent = "Carregando chamados…";
    try {
      const result = await api("/api/admin/tickets?mode=" + selected);
      if (id !== loadId) return;
      tickets = result.tickets;
      stages = result.stages;
      render();
      $("sync-status").textContent =
        "Atualizado às " +
        new Date().toLocaleTimeString("pt-BR") +
        " · " +
        (mode === "demo" ? "Demonstração" : "Google Planilhas");
    } catch (e) {
      if (id !== loadId) return;
      tickets = [];
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
        key === "computador" ? "Quem utiliza o computador" : key,
        value,
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
    $("save-stage").disabled = true;
    $("save-stage").classList.add("is-loading");
    $("save-stage").querySelector("span").textContent = "Salvando…";
    $("ticket-dialog").setAttribute("aria-busy", "true");
    try {
      await api("/api/admin/status", {
        mode,
        requestId: t.requestId,
        status,
        expectedStatus: t.status,
      });
      t.status = status;
      render();
      $("ticket-dialog").close();
      $("sync-status").textContent =
        "Etapa salva " + (mode === "demo" ? "na demonstração local." : "no Google Planilhas.");
    } catch (e) {
      $("detail-error").textContent = e.message;
      $("admin-error").textContent = e.message;
    } finally {
      busy = false;
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
  $("data-mode").addEventListener("change", () => {
    mode = $("data-mode").value;
    $("seed").hidden = mode !== "demo";
    $("source-note").textContent =
      mode === "demo"
        ? "Simulações separadas dos chamados reais."
        : "Leitura e atualização da planilha conectada ao SmartDesk.";
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
  load();
})();
