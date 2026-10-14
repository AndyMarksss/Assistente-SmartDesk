"use strict";
// Decorative light that follows the cursor, a gentle 3D tilt and a press ripple.
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
  function paint() {
    frame = 0;
    const event = last;
    if (!event) return;
    const lit = event.target.closest?.(LIT);
    if (lit) relative(lit, event, "--mx", "--my");
    const shell = document.querySelector(".chat-shell");
    if (shell) relative(shell, event, "--sx", "--sy");
    const scene = document.querySelector(".support-scene");
    if (!scene || still.matches || !scene.offsetParent) return;
    const box = scene.getBoundingClientRect(),
      near =
        event.clientX > box.left - 80 &&
        event.clientX < box.right + 80 &&
        event.clientY > box.top - 80 &&
        event.clientY < box.bottom + 80,
      x = near ? (event.clientX - box.left) / box.width - 0.5 : 0,
      y = near ? (event.clientY - box.top) / box.height - 0.5 : 0;
    scene.style.setProperty("--tilt-y", (x * 10).toFixed(2) + "deg");
    scene.style.setProperty("--tilt-x", (-y * 8).toFixed(2) + "deg");
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
})();
