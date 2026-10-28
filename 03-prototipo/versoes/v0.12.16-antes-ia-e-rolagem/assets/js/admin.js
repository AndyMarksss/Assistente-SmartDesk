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
  // Mesma forma da tela pronta: números pequenos, linhas do gráfico, sete colunas com cartões.
  function skeleton() {
    document.querySelector(".admin-main").classList.add("is-skeleton");
    const line = (kind = "") => el("span", undefined, "skeleton-line" + (kind ? " " + kind : "")),
      row = (cls, ...parts) => {
        const node = el(cls === "queue" ? "li" : "div", undefined, "skeleton-row " + cls);
        node.append(...parts);
        return node;
      };
    // Nada dos dados anteriores fica à vista enquanto a nova origem carrega.
    for (const id of ["metric-total", "metric-open", "metric-active", "metric-done"])
      $(id).textContent = "";
    for (const key of ["open", "active", "done"]) share(key, 0, 0);
    for (const button of document.querySelectorAll(".metric-filter"))
      button.closest("article").classList.remove("is-selected");
    $("area-headline").replaceChildren(line("title"));
    $("area-trail").replaceChildren();
    $("area-chart").replaceChildren(
      ...[0, 1, 2, 3].map(() =>
        row("chart", el("span", undefined, "skeleton-dot"), line("label"), line("bar")),
      ),
    );
    $("pulse-headline").replaceChildren(line("title"));
    $("pulse-action").hidden = true;
    $("queue-insight").replaceChildren(line(), line("short"));
    $("selfhelp-rate").replaceChildren(line("rate"));
    $("selfhelp-bar").style.width = "0%";
    $("selfhelp-insight").replaceChildren(line(), line("short"));
    $("queue-list").replaceChildren(
      ...Array.from({ length: 7 }, () =>
        row("queue", el("span", undefined, "skeleton-dot small"), line("label")),
      ),
    );
    $("kanban").replaceChildren();
    for (let c = 0; c < 7; c++) {
      const column = el("section", undefined, "kanban-column skeleton-column");
      column.append(line("cap"));
      for (let i = 0; i < (c % 3 === 1 ? 1 : 2); i++) {
        const card = el("div", undefined, "skeleton-card");
        card.append(line("tiny"), line(), line("short"));
        column.append(card);
      }
      $("kanban").append(column);
    }
  }

  // Parte de cada indicador no total: barra fina e porcentagem ao lado da descrição.
  function share(key, value, total) {
    const rate = total ? Math.round((value / total) * 100) : 0;
    $("meter-" + key).style.width = rate + "%";
    $("share-" + key).textContent = total ? " · " + rate + "% do total" : "";
  }
  const joinNames = (names) =>
    names.length > 1 ? names.slice(0, -1).join(", ") + " e " + names.at(-1) : names[0];

  // --- Filtros do painel ------------------------------------------------------------------
  // Indicadores, áreas e categorias filtram tudo (indicadores, pulso, fila e quadro); a faixa
  // abaixo da origem mostra o que está ativo e Esc volta um nível.
  const view = { stage: "", area: "", need: "" };
  const CLOSED = ["Finalizado", "Cancelado"];
  const STAGE_GROUPS = {
    open: { label: "Abertos", test: (status) => !CLOSED.includes(status) },
    active: { label: "Em atendimento", test: (status) => status === "Em atendimento" },
    done: { label: "Finalizados", test: (status) => status === "Finalizado" },
  };
  // Categoria = primeiro nível da necessidade ("COMPUTADOR > Troca de Mouse" → Computador).
  const category = (need) => {
    const head =
      String(need || "")
        .split(">")[0]
        .trim() || "Sem categoria";
    return head === head.toLocaleUpperCase("pt-BR") && /\p{L}{3}/u.test(head)
      ? head.charAt(0) + head.slice(1).toLocaleLowerCase("pt-BR")
      : head;
  };
  const query = () => $("search").value.trim().toLocaleLowerCase("pt-BR");
  // Contexto (setor e busca): o gráfico de áreas parte dele para permitir trocar de área.
  const inContext = (t) =>
    (!$("sector-filter").value || $("sector-filter").value === t.sector) &&
    (!query() ||
      [t.number, t.subject, t.need, t.name, t.sector, t.email, t.participant]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(query()));
  const inScope = (t) =>
    inContext(t) &&
    (!view.area || t.area === view.area) &&
    (!view.need || category(t.need) === view.need);
  const stageShown = (status) => !view.stage || STAGE_GROUPS[view.stage].test(status);

  function render() {
    document.querySelector(".admin-main").classList.remove("is-skeleton");
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
    if (view.area && !tickets.some((t) => t.area === view.area)) view.area = view.need = "";
    renderSelfHelp();
    refresh(true);
  }
  // Recalcula tudo o que depende dos filtros.
  function refresh(animate = false) {
    const context = tickets.filter(inContext),
      scoped = context.filter(inScope),
      total = scoped.length,
      count = (stage) => scoped.filter((t) => t.status === stage).length,
      closed = scoped.filter((t) => CLOSED.includes(t.status)).length,
      active = count("Em atendimento"),
      done = count("Finalizado"),
      freshStage = stages.find((stage) => stageKey(stage) === "new") || "Novos chamados",
      fresh = stageShown(freshStage) ? count(freshStage) : 0,
      filtered = Boolean(view.area || view.need || $("sector-filter").value || query());
    $("metric-total").textContent = total;
    $("metric-open").textContent = total - closed;
    $("metric-active").textContent = active;
    $("metric-done").textContent = done;
    share("open", total - closed, total);
    share("active", active, total);
    share("done", done, total);
    document.querySelector('[data-metric="total"] .metric-foot small').textContent = filtered
      ? "Com os filtros ativos"
      : "Na origem selecionada";
    for (const button of document.querySelectorAll(".metric-filter")) {
      const on = (button.dataset.filter === "total" ? "" : button.dataset.filter) === view.stage;
      button.setAttribute("aria-pressed", String(on));
      // Anel só quando há filtro de etapa ("Total" sem filtro é o estado normal).
      button.closest("article").classList.toggle("is-selected", on && Boolean(view.stage));
    }
    // Pulso: a conclusão primeiro (o que pede ação agora) e o detalhe logo abaixo.
    const sheetEmpty = mode === "google" && !tickets.length;
    $("pulse-headline").textContent = !total
      ? filtered
        ? "Nenhum chamado com estes filtros"
        : sheetEmpty
          ? "Nenhum chamado na planilha ainda"
          : "Nenhum chamado nesta origem"
      : fresh
        ? fresh === 1
          ? "1 chamado novo espera a primeira resposta"
          : fresh + " chamados novos esperam a primeira resposta"
        : total - closed
          ? "Nenhum chamado novo parado na fila"
          : "Todos os chamados foram encerrados";
    $("pulse-action").hidden = !fresh;
    $("pulse-action").dataset.stage = freshStage;
    // Só cita o que existe: "0 aguardam terceiros" não informa nada.
    const waiting = count("Aguardando terceiros"),
      scheduled = count("Agendado"),
      extras = [
        waiting && plural(waiting, "aguarda", "aguardam") + " terceiros",
        scheduled && plural(scheduled, "está agendado", "estão agendados"),
      ].filter(Boolean);
    $("queue-insight").textContent = total
      ? `${plural(total - closed, "chamado segue", "chamados seguem")} em andamento.` +
        (extras.length ? " " + joinNames(extras).replace(/^./, (c) => c.toUpperCase()) + "." : "")
      : filtered
        ? "Limpe os filtros para ver todos os chamados."
        : sheetEmpty
          ? "Os chamados enviados pelo chat aparecem aqui."
          : "Crie simulações ou carregue os dados do Google.";
    $("area-filter").value = view.area;
    renderAreas(context);
    renderQueue(scoped);
    renderViewBar();
    renderBoard(animate, scoped);
    // O aviso flutuante diz quantos chamados esperam no quadro (com os filtros).
    const onBoard = scoped.filter((t) => stageShown(t.status)).length;
    $("board-cue-text").textContent = onBoard
      ? plural(onBoard, "chamado", "chamados") + " no quadro"
      : "Quadro de atendimento";
  }

  // Áreas em ordem (maior no topo); tocar numa área desce para as categorias dela.
  function renderAreas(context) {
    // A trilha (ou a dica) fica na linha do título do cartão, para o gráfico caber mais baixo.
    const box = $("area-chart"),
      trail = $("area-trail");
    box.replaceChildren();
    trail.replaceChildren();
    trail.className = "chart-trail";
    box.dataset.level = view.area ? "category" : "area";
    let rows;
    if (!view.area) {
      rows = Object.keys(AREA_ICONS)
        .map((area) => ({
          key: area,
          glyph: AREA_ICONS[area],
          count: context.filter((t) => t.area === area).length,
        }))
        .sort((a, b) => b.count - a.count);
      trail.classList.add("is-hint");
      trail.append(
        icon("fa-hand-pointer"),
        document.createTextNode(" Toque numa área para ver as categorias"),
      );
    } else {
      const groups = new Map();
      for (const t of context.filter((ticket) => ticket.area === view.area))
        groups.set(category(t.need), (groups.get(category(t.need)) || 0) + 1);
      rows = [...groups]
        .map(([key, count]) => ({ key, glyph: "fa-tag", count }))
        .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key, "pt-BR"));
      // Até quatro linhas: as três maiores e "Outras" (a selecionada nunca some no agrupamento).
      if (rows.length > 4) {
        const keep = rows.slice(0, 3),
          chosen = rows.find((row) => row.key === view.need);
        if (chosen && !keep.includes(chosen)) keep[2] = chosen;
        const rest = rows.filter((row) => !keep.includes(row));
        rows = [
          ...keep,
          {
            key: "",
            glyph: "fa-ellipsis",
            count: rest.reduce((sum, row) => sum + row.count, 0),
            label: "Outras (" + rest.length + ")",
            rest: true,
          },
        ];
      }
      const up = el("button", "Todas as áreas", "chart-up");
      up.type = "button";
      up.dataset.up = "1";
      up.prepend(icon("fa-arrow-left"), document.createTextNode(" "));
      trail.append(up, el("span", "›", "chart-sep"), el("strong", view.area));
    }
    const ranked = rows.filter((row) => !row.rest),
      top = ranked.reduce((max, row) => Math.max(max, row.count), 0),
      leaders = top ? ranked.filter((row) => row.count === top).map((row) => row.key) : [],
      prefix = view.area ? view.area + ": " : "";
    $("area-headline").textContent = !top
      ? view.area
        ? "Nenhum chamado de " + view.area
        : "Nenhum chamado por área ainda"
      : leaders.length === 1
        ? `${prefix}${leaders[0]} lidera com ${plural(top, "chamado", "chamados")}`
        : leaders.length === ranked.length && !view.area
          ? `Áreas empatadas, com ${plural(top, "chamado", "chamados")} cada`
          : `${prefix}${joinNames(leaders)} empatam com ${plural(top, "chamado", "chamados")}`;
    const max = rows.reduce((m, row) => Math.max(m, row.count), 0);
    for (const entry of rows) {
      const row = el(entry.rest ? "div" : "button", undefined, "chart-row"),
        label = el("span", undefined, "chart-label"),
        track = el("div", undefined, "chart-track"),
        bar = el("div", undefined, "chart-bar"),
        name = entry.label || entry.key,
        selected = Boolean(view.area) && entry.key === view.need && !entry.rest;
      if (!entry.rest) {
        row.type = "button";
        row.dataset[view.area ? "need" : "area"] = entry.key;
        row.setAttribute(
          "aria-label",
          `${name}: ${plural(entry.count, "chamado", "chamados")}. ` +
            (view.area
              ? selected
                ? "Remover este filtro"
                : "Filtrar o quadro"
              : "Ver categorias"),
        );
        if (view.area) row.setAttribute("aria-pressed", String(selected));
      } else row.classList.add("is-rest");
      // Cor só no que importa: a categoria escolhida ou, sem escolha, a líder.
      if (view.need ? selected : leaders.includes(entry.key) && !entry.rest)
        row.classList.add("is-lead");
      if (selected) row.classList.add("is-selected");
      label.append(icon(entry.glyph), el("span", name, "chart-name"));
      bar.style.width = (max ? (entry.count / max) * 100 : 0) + "%";
      track.append(bar);
      row.append(
        label,
        track,
        el("strong", String(entry.count), "chart-count"),
        entry.rest
          ? el("span")
          : icon(view.area ? (selected ? "fa-xmark" : "fa-filter") : "fa-chevron-right"),
      );
      box.append(row);
    }
  }
  const onChart = (event) => {
    const target = event.target.closest("[data-up], .chart-row[data-area], .chart-row[data-need]");
    if (!target) return;
    if (target.dataset.up) view.area = view.need = "";
    else if (target.dataset.area) {
      view.area = target.dataset.area;
      view.need = "";
    } else view.need = view.need === target.dataset.need ? "" : target.dataset.need;
    refresh(false);
    // O foco continua no gráfico depois de redesenhar (teclado e leitor de tela).
    (
      document.querySelector("#area-chart .is-selected") ||
      document.querySelector("#area-chart .chart-row, #area-trail .chart-up")
    )?.focus({ preventScroll: true });
  };
  $("area-chart").addEventListener("click", onChart);
  $("area-trail").addEventListener("click", onChart);
  // Indicadores: "Total" mostra todas as etapas; os outros acendem só as etapas deles.
  document.querySelector(".metrics").addEventListener("click", (event) => {
    const button = event.target.closest(".metric-filter");
    if (!button) return;
    const key = button.dataset.filter === "total" ? "" : button.dataset.filter;
    view.stage = view.stage === key ? "" : key;
    refresh(false);
  });
  // Faixa dos filtros ativos: cada filtro sai no "×"; sem filtro, diz o que dá para fazer.
  function renderViewBar() {
    const bar = $("view-bar"),
      chips = [];
    if (view.stage) chips.push(["Etapas", STAGE_GROUPS[view.stage].label, () => (view.stage = "")]);
    if (view.area) chips.push(["Área", view.area, () => (view.area = view.need = "")]);
    if (view.need) chips.push(["Categoria", view.need, () => (view.need = "")]);
    if ($("sector-filter").value)
      chips.push(["Setor", $("sector-filter").value, () => ($("sector-filter").value = "")]);
    if (query())
      chips.push(["Busca", "“" + $("search").value.trim() + "”", () => ($("search").value = "")]);
    bar.replaceChildren();
    bar.classList.toggle("has-filters", chips.length > 0);
    if (!chips.length) {
      bar.append(
        icon("fa-filter"),
        el(
          "span",
          "Sem filtros. Toque num indicador, numa área ou numa categoria para filtrar.",
          "view-empty",
        ),
      );
      return;
    }
    bar.append(el("span", "Filtros:", "view-label"));
    for (const [kind, value, clear] of chips) {
      const chip = el("button", undefined, "view-chip");
      chip.type = "button";
      chip.setAttribute("aria-label", `Remover filtro ${kind}: ${value}`);
      chip.append(el("span", kind + ": ", "view-kind"), el("strong", value), icon("fa-xmark"));
      chip.addEventListener("click", () => {
        clear();
        refresh(false);
      });
      bar.append(chip);
    }
    const all = el("button", "Limpar tudo", "view-clear");
    all.type = "button";
    all.addEventListener("click", () => {
      view.stage = view.area = view.need = "";
      $("sector-filter").value = $("search").value = "";
      refresh(false);
    });
    bar.append(all);
  }
  // Esc volta um nível: categoria → área → etapas → setor → busca.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || $("ticket-dialog").open) return;
    if (view.need) view.need = "";
    else if (view.area) view.area = "";
    else if (view.stage) view.stage = "";
    else if ($("sector-filter").value) $("sector-filter").value = "";
    else if (query() && document.activeElement !== $("search")) $("search").value = "";
    else return;
    refresh(false);
  });
  // Fila por etapa na barra lateral: cada linha leva à coluna do quadro.
  function renderQueue(scoped) {
    const list = $("queue-list"),
      extra = [...new Set(scoped.map((t) => t.status))].filter((s) => !stages.includes(s));
    list.replaceChildren();
    for (const stage of [...stages, ...extra]) {
      const n = scoped.filter((t) => t.status === stage).length,
        item = el("button", undefined, "queue-item" + (n ? "" : " is-empty"));
      item.type = "button";
      item.dataset.stage = stage;
      item.dataset.tone = stageKey(stage);
      item.setAttribute(
        "aria-label",
        `${stage}: ${plural(n, "chamado", "chamados")}. Ir para a coluna`,
      );
      item.append(
        el("span", undefined, "stage-dot"),
        el("span", stage, "queue-name"),
        el("strong", String(n), "queue-count"),
      );
      const li = el("li");
      li.append(item);
      list.append(li);
    }
  }
  function goToStage(stage) {
    const column = [...document.querySelectorAll(".kanban-column")].find(
      (node) => node.dataset.stage === stage,
    );
    if (!column) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    column.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
    column.setAttribute("tabindex", "-1");
    column.focus({ preventScroll: true });
    column.classList.remove("is-spotlit");
    void column.offsetWidth;
    column.classList.add("is-spotlit");
    setTimeout(() => column.classList.remove("is-spotlit"), 1800);
  }
  $("queue-list").addEventListener("click", (event) => {
    const item = event.target.closest(".queue-item");
    if (item) goToStage(item.dataset.stage);
  });
  $("pulse-action").addEventListener("click", () => goToStage($("pulse-action").dataset.stage));
  // Aviso de que há mais abaixo: aparece só enquanto o quadro está abaixo da tela.
  const cue = $("board-cue");
  // Os 140 px de baixo contam como "fora": só uma beirada do quadro à vista ainda mostra o aviso.
  new IntersectionObserver(
    ([entry]) => {
      cue.hidden = entry.isIntersecting || entry.boundingClientRect.top < 0;
    },
    { rootMargin: "0px 0px -140px 0px" },
  ).observe($("kanban"));
  cue.addEventListener("click", () =>
    document.querySelector(".board-shell").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    }),
  );
  function renderSelfHelp() {
    const box = $("selfhelp-insight");
    if (!selfHelp) {
      box.textContent = "Os registros de autoatendimento aparecem com os dados do Google.";
      $("selfhelp-bar").style.width = "0%";
      $("selfhelp-rate").textContent = "—";
      return;
    }
    const total = selfHelp.resolved + selfHelp.continued,
      rate = total ? Math.round((selfHelp.resolved / total) * 100) : 0;
    box.textContent = total
      ? `${plural(selfHelp.resolved, "resolvido", "resolvidos")} com as dicas da IA, sem abrir chamado; ${plural(selfHelp.continued, "seguiu", "seguiram")} para o chamado.` +
        (selfHelp.simulation ? " Valores de demonstração." : "")
      : "Ainda não há atendimentos com dicas da IA registrados.";
    $("selfhelp-bar").style.width = rate + "%";
    $("selfhelp-rate").textContent = total ? rate + "%" : "—";
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
    if (t.participant) tags.push(["fa-user-check", "Teste " + t.participant, "test"]);
    return tags;
  }
  // Todos os cartões do quadro com a altura do mais alto (rodapés alinhados); refeito quando o
  // quadro muda de largura.
  let boardWidth = 0;
  function equalizeCards() {
    const board = $("kanban"),
      cards = [...board.querySelectorAll(".ticket-card")];
    board.style.removeProperty("--card-h");
    if (cards.length)
      board.style.setProperty("--card-h", Math.max(...cards.map((c) => c.offsetHeight)) + "px");
  }
  new ResizeObserver(([entry]) => {
    if (Math.round(entry.contentRect.width) === boardWidth) return;
    boardWidth = Math.round(entry.contentRect.width);
    equalizeCards();
  }).observe($("kanban"));
  function renderBoard(animate = false, scoped = tickets.filter(inScope)) {
    $("kanban").replaceChildren();
    for (const stage of [
      ...stages,
      ...new Set(scoped.map((t) => t.status).filter((s) => !stages.includes(s))),
    ]) {
      const column = el("section", undefined, "kanban-column"),
        head = el("header", undefined, "column-head"),
        out = !stageShown(stage),
        list = out ? [] : scoped.filter((t) => t.status === stage);
      column.dataset.stage = stage;
      column.dataset.tone = stageKey(stage);
      // Etapa fora do filtro de indicadores: a coluna fica apagada e vazia.
      column.classList.toggle("is-out", out);
      const title = el("h3");
      title.append(el("span", undefined, "stage-dot"), document.createTextNode(stage));
      head.append(title, el("span", String(list.length), "column-count"));
      column.append(head);
      for (const t of list) column.append(card(t, animate, list.indexOf(t)));
      if (out) column.append(el("p", "Fora do filtro", "empty-column out-note"));
      else if (!list.length) column.append(el("p", "Solte um cartão aqui", "empty-column"));
      $("kanban").append(column);
    }
    equalizeCards();
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
    const id = el("span", undefined, "ticket-number");
    id.append(el("span", undefined, "stage-dot"), document.createTextNode(t.number));
    top.append(id, tag);
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
    const opened = Date.parse(t.createdAt),
      foot = el("div", undefined, "ticket-foot");
    foot.append(
      el(
        "span",
        Number.isNaN(opened) ? "Data não informada" : new Date(opened).toLocaleDateString("pt-BR"),
        "ticket-date",
      ),
    );
    if (t.simulation) {
      const sim = el("span", undefined, "ticket-sim");
      sim.append(icon("fa-flask"), document.createTextNode(" Simulação"));
      foot.append(sim);
    }
    node.append(foot);
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
    skeleton();
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
    const dialog = $("ticket-dialog"),
      opened = Date.parse(t.createdAt);
    dialog.dataset.tone = stageKey(t.status);
    $("detail-number").textContent = t.number;
    $("detail-stage-badge").replaceChildren(
      el("span", undefined, "stage-dot"),
      document.createTextNode(t.status),
    );
    $("detail-area").dataset.area = t.area;
    $("detail-area").replaceChildren(
      icon(AREA_ICONS[t.area] || "fa-circle"),
      document.createTextNode(" " + t.area),
    );
    $("detail-sim").hidden = !t.simulation;
    $("detail-title").textContent = t.subject;
    $("detail-opened").textContent = Number.isNaN(opened)
      ? "Data de abertura não informada"
      : "Aberto em " +
        new Date(opened).toLocaleDateString("pt-BR") +
        " às " +
        new Date(opened).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    $("detail-person").replaceChildren();
    for (const [label, value] of [
      ["Nome", t.name],
      ["E-mail", t.email || "Não informado"],
      ["Setor", t.sector],
      ...(t.participant ? [["Participante do teste", t.participant]] : []),
    ])
      $("detail-person").append(el("dt", label), el("dd", value));
    $("detail-masked").hidden = !t.masked;
    $("detail-data").replaceChildren();
    for (const [label, value] of [
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
      $("detail-data").append(
        el("dt", label),
        el("dd", value, label === "Descrição" ? "detail-text" : undefined),
      );
    $("detail-files").replaceChildren();
    for (const [i, url] of (t.attachments || []).entries()) {
      try {
        const u = new URL(url);
        if (u.protocol !== "https:" || u.hostname !== "drive.google.com") continue;
        const link = el("a", undefined, "detail-file");
        link.append(icon("fa-paperclip"), document.createTextNode(" Abrir anexo " + (i + 1)));
        link.href = u.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        $("detail-files").append(link);
      } catch {}
    }
    // Etapas como opções com a cor de cada coluna; a atual vem marcada.
    $("detail-stages").replaceChildren();
    for (const stage of stages) {
      const option = el("label", undefined, "stage-option"),
        radio = el("input");
      option.dataset.tone = stageKey(stage);
      radio.type = "radio";
      radio.name = "detail-stage";
      radio.value = stage;
      radio.checked = stage === t.status;
      option.append(radio, el("span", undefined, "stage-dot"), el("span", stage));
      if (stage === t.status) option.append(el("small", "atual"));
      $("detail-stages").append(option);
    }
    chooseStage();
    $("detail-error").textContent = "";
    dialog.showModal();
    // Foco no título (o leitor de tela anuncia o chamado) e sem anel no botão de fechar.
    $("detail-title").focus();
  }
  const chosenStage = () =>
    document.querySelector('#detail-stages input[name="detail-stage"]:checked')?.value || "";
  // O botão diz para onde o chamado vai e só libera quando a etapa muda.
  function chooseStage() {
    const stage = chosenStage(),
      changed = !!current && !!stage && stage !== current.status;
    $("save-stage").disabled = !changed || current.status === "Recebendo";
    $("save-stage").querySelector("span").textContent = changed
      ? "Mover para " + stage
      : "Salvar etapa";
  }
  $("detail-stages").addEventListener("change", chooseStage);
  async function update(t, status) {
    if (busy || status === t.status) return;
    busy = true;
    const previous = t.status;
    // Movimento otimista: o cartão muda de coluna na hora e volta se o Google recusar.
    t.status = status;
    lastMoved = t.requestId;
    refresh(false);
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
      $("save-stage").classList.remove("is-loading");
      chooseStage();
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
    () => current && chosenStage() && update(current, chosenStage()),
  );
  $("close-dialog").addEventListener("click", () => $("ticket-dialog").close());
  $("cancel-dialog").addEventListener("click", () => $("ticket-dialog").close());
  $("refresh").addEventListener("click", load);
  $("area-filter").addEventListener("input", () => {
    view.area = $("area-filter").value;
    view.need = "";
    refresh(false);
  });
  for (const id of ["search", "sector-filter"])
    $(id).addEventListener("input", () => refresh(false));
  function showMode(value) {
    mode = value;
    $("data-mode").value = value;
    $("seed").hidden = mode !== "demo";
    $("source-note").textContent =
      mode === "demo"
        ? "Simulações separadas dos chamados reais."
        : window.smartdeskRemote
          ? "Todos os chamados da planilha; nomes e e-mails de outras pessoas abreviados."
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
    // No Pages o painel abre nos chamados reais; localmente, depois de enviar um chamado.
    if (window.smartdeskRemote || sessionStorage.getItem("smartdesk-sent")) showMode("google");
  } catch {}
  load();
})();
