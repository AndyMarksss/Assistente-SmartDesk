"use strict";
// Decorative light that follows the cursor, the robot's gaze and a press ripple. The opening scene
// itself stays still (0.12.4: the 3D tilt was removed at the user's request; only the eyes follow).
// Mouse only; nothing here changes content, focus or the conversation state.
(function () {
  const fine = matchMedia("(hover: hover) and (pointer: fine)"),
    still = matchMedia("(prefers-reduced-motion: reduce)");
  const LIT =
    ".choice, .picker-option, .panel-link, .new-conversation, .metrics article, .ticket-card";
  let frame = 0,
    last = null;
  function relative(element, event, x, y) {
    const box = element.getBoundingClientRect();
    element.style.setProperty(x, Math.round(event.clientX - box.left) + "px");
    element.style.setProperty(y, Math.round(event.clientY - box.top) + "px");
    return box;
  }
  // O robô da abertura olha para o cursor em qualquer ponto da página.
  function look(event) {
    const robot = document.querySelector(".desk-mascot .robot");
    if (!robot || !robot.getClientRects().length) return;
    if (still.matches) return center(robot);
    const box = robot.getBoundingClientRect(),
      dx = event.clientX - (box.left + box.width / 2),
      dy = event.clientY - (box.top + box.height * 0.46),
      distance = Math.hypot(dx, dy) || 1,
      reach = Math.min(distance / 240, 1);
    robot.style.setProperty("--gaze-x", ((dx / distance) * reach * 8).toFixed(2) + "px");
    robot.style.setProperty("--gaze-y", ((dy / distance) * reach * 7).toFixed(2) + "px");
  }
  function center(robot) {
    robot.style.setProperty("--gaze-x", "0px");
    robot.style.setProperty("--gaze-y", "0px");
  }
  function paint() {
    frame = 0;
    const event = last;
    if (!event) return;
    const lit = event.target.closest?.(LIT);
    if (lit) relative(lit, event, "--mx", "--my");
    const shell = document.querySelector(".chat-shell");
    if (shell) {
      const box = relative(shell, event, "--sx", "--sy");
      shell.classList.toggle(
        "is-lit",
        event.clientX >= box.left &&
          event.clientX <= box.right &&
          event.clientY >= box.top &&
          event.clientY <= box.bottom,
      );
    }
    look(event);
  }
  document.addEventListener(
    "pointermove",
    (event) => {
      if (!fine.matches || event.pointerType !== "mouse") return;
      last = event;
      if (!frame) frame = requestAnimationFrame(paint);
    },
    { passive: true },
  );
  // Cursor saiu da janela: a luz apaga e o robô volta a olhar para frente.
  document.addEventListener("mouseout", (event) => {
    if (event.relatedTarget) return;
    document.querySelector(".chat-shell")?.classList.remove("is-lit");
    const robot = document.querySelector(".desk-mascot .robot");
    if (robot) center(robot);
  });
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (still.matches || event.button !== 0) return;
      const target = event.target.closest?.(".choice, .picker-option, .new-conversation");
      if (!target || target.disabled) return;
      const box = target.getBoundingClientRect(),
        dot = document.createElement("span");
      dot.className = "ripple";
      dot.setAttribute("aria-hidden", "true");
      dot.style.left = event.clientX - box.left + "px";
      dot.style.top = event.clientY - box.top + "px";
      target.append(dot);
      setTimeout(() => dot.remove(), 700);
    },
    { passive: true },
  );
  // Linhas da cena da abertura: o desenho fixo (380 × 280) só encaixava num formato de quadro.
  // Aqui elas são refeitas no tamanho real, saindo da borda de cada cartão até o círculo do
  // robô, para os sinais animados chegarem aos aparelhos em qualquer tela. Usa a posição de
  // layout (offset), que ignora a animação de entrada dos cartões.
  const WIRES = [
    ["from-computer", "computer"],
    ["from-printer", "printer"],
    ["from-network", "network"],
    ["from-audio", "audio"],
  ];
  function wire(scene) {
    const svg = scene.querySelector(".scene-connections"),
      halo = scene.querySelector(".scene-halo"),
      width = scene.clientWidth,
      height = scene.clientHeight;
    if (!svg || !halo || !width || !height) return;
    const shift = new DOMMatrixReadOnly(getComputedStyle(halo).transform),
      radius = halo.offsetWidth / 2,
      cx = halo.offsetLeft + shift.m41 + radius,
      cy = halo.offsetTop + shift.m42 + halo.offsetHeight / 2;
    const paths = WIRES.map(([, name]) => {
      const card = scene.querySelector(".scene-device." + name);
      if (!card) return "";
      const left = card.offsetLeft + card.offsetWidth / 2 < cx,
        x0 = left ? card.offsetLeft + card.offsetWidth : card.offsetLeft,
        y0 = card.offsetTop + card.offsetHeight / 2;
      let ex = x0 + (cx - x0) * 0.45;
      if (Math.hypot(cx - ex, cy - y0) <= radius + 4) ex = x0;
      const distance = Math.hypot(cx - ex, cy - y0);
      if (distance <= radius) return "";
      const tx = cx - ((cx - ex) / distance) * radius,
        ty = cy - ((cy - y0) / distance) * radius,
        round = (n) => Math.round(n * 10) / 10;
      return (
        "M" + round(x0) + " " + round(y0) + "H" + round(ex) + "L" + round(tx) + " " + round(ty)
      );
    });
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.querySelector("path:not(.connection-signal)")?.setAttribute("d", paths.join(""));
    WIRES.forEach(([signal], index) =>
      svg.querySelector(".connection-signal." + signal)?.setAttribute("d", paths[index]),
    );
  }
  const scene = document.querySelector(".support-scene");
  if (scene && window.ResizeObserver) {
    const observer = new ResizeObserver(() => wire(scene));
    observer.observe(scene);
    scene.querySelectorAll(".scene-device, .scene-halo").forEach((node) => observer.observe(node));
  }
  // Fundo do chat (0.12.5): ocupa só a faixa da conversa, sem passar por trás do topo, das
  // etapas e da área de botões, que mudam de altura conforme a etapa e a tela.
  const backdrop = document.querySelector(".chat-backdrop"),
    conversation = document.getElementById("conversation");
  if (backdrop && conversation && window.ResizeObserver) {
    const column = document.getElementById("messages");
    const place = () => {
      backdrop.style.top = conversation.offsetTop + "px";
      backdrop.style.bottom = "auto";
      backdrop.style.height = conversation.offsetHeight + "px";
      // 0.12.9: os ícones ficam nas laterais livres, fora da coluna das mensagens, para não
      // aparecerem atrás do robozinho das mensagens. Lateral estreita: só os do lado direito.
      const gutter = column ? Math.max(0, (conversation.clientWidth - column.offsetWidth) / 2) : 0;
      backdrop.style.setProperty("--gutter", Math.round(gutter) + "px");
      backdrop.classList.toggle("is-narrow", gutter < 96);
    };
    const follow = new ResizeObserver(place);
    [
      conversation,
      column,
      document.querySelector(".chat-header"),
      document.querySelector(".journey-bar"),
    ]
      .filter(Boolean)
      .forEach((node) => follow.observe(node));
    place();
  }
  // Dicas da barra lateral: três dicas que se revezam a cada 9 s (0.12.6). Desde a 0.12.10 dá
  // para navegar com as setas, os pontinhos ou arrastando para o lado; quando a pessoa navega,
  // a troca automática para — quem está lendo decide. Pausa com o mouse em cima; com movimento
  // reduzido não troca sozinha.
  const tip = document.querySelector(".sidebar-tip"),
    slides = tip ? [...tip.querySelectorAll(".tip-slide")] : [],
    dots = tip ? [...tip.querySelectorAll(".tip-dots button")] : [],
    track = tip?.querySelector(".tip-slides");
  if (slides.length > 1 && track) {
    let index = 0,
      paused = false,
      manual = false;
    const show = (next, direction = 1) => {
      index = (next + slides.length) % slides.length;
      tip.dataset.direction = direction > 0 ? "next" : "prev";
      // Ponto de partida da dica nova: do lado da navegação, aplicado sem transição.
      const incoming = slides[index];
      incoming.style.transition = "none";
      incoming.style.transform = "translateX(" + (direction > 0 ? 14 : -14) + "px)";
      void incoming.offsetWidth;
      incoming.style.transition = "";
      incoming.style.transform = "";
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      dots.forEach((dot, i) => dot.setAttribute("aria-current", i === index ? "true" : "false"));
    };
    const take = (next, direction) => {
      manual = true;
      track.setAttribute("aria-live", "polite");
      show(next, direction);
    };
    show(0);
    tip.querySelectorAll(".tip-arrow").forEach((arrow) =>
      arrow.addEventListener("click", () => {
        const step = arrow.dataset.tip === "prev" ? -1 : 1;
        take(index + step, step);
      }),
    );
    dots.forEach((dot, i) => dot.addEventListener("click", () => take(i, i >= index ? 1 : -1)));
    // Arrastar (dedo ou mouse): mais de 40 px para o lado troca a dica.
    let startX = null;
    track.addEventListener("pointerdown", (event) => {
      startX = event.clientX;
    });
    track.addEventListener("pointerup", (event) => {
      if (startX === null) return;
      const dx = event.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) take(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    track.addEventListener("pointercancel", () => (startX = null));
    tip.addEventListener("pointerenter", () => (paused = true));
    tip.addEventListener("pointerleave", () => (paused = false));
    setInterval(() => {
      if (manual || paused || still.matches || document.hidden || !tip.offsetParent) return;
      show(index + 1, 1);
    }, 9000);
  }
})();
