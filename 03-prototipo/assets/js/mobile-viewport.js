/* Keep the question and response inside the visible mobile viewport. */
(() => {
  const root = document.documentElement,
    viewport = window.visualViewport;
  const shell = document.querySelector(".chat-shell"),
    log = document.getElementById("conversation");
  if (!shell || !log) return;
  let normalHeight = window.innerHeight,
    lastWidth = window.innerWidth,
    frame = 0;
  const editable = () => {
    const el = document.activeElement;
    return (
      el &&
      !el.disabled &&
      (el.matches("textarea") ||
        el.matches("input:not([type=date]):not([type=time]):not([type=file]):not([type=hidden])"))
    );
  };
  function update() {
    frame = 0;
    if (window.innerWidth > 900) {
      root.classList.remove("mobile-keyboard");
      root.style.removeProperty("--chat-visible-height");
      root.style.removeProperty("--chat-visible-top");
      return;
    }
    const height = viewport?.height || window.innerHeight,
      width = window.innerWidth;
    if (Math.abs(width - lastWidth) > 80) {
      normalHeight = window.innerHeight;
      lastWidth = width;
    }
    const typing = editable(),
      unzoomed = !viewport || Math.abs(viewport.scale - 1) < 0.05;
    if (!typing) normalHeight = Math.max(height, window.innerHeight);
    const keyboard = typing && unzoomed && normalHeight - height > 120;
    root.classList.toggle("mobile-keyboard", !!keyboard);
    if (unzoomed) {
      root.style.setProperty("--chat-visible-height", Math.round(height) + "px");
      root.style.setProperty("--chat-visible-top", Math.round(viewport?.offsetTop || 0) + "px");
    }
    if (keyboard)
      requestAnimationFrame(() => {
        log.scrollTop = log.scrollHeight;
      });
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener("resize", schedule);
  viewport?.addEventListener("resize", schedule);
  viewport?.addEventListener("scroll", schedule);
  document.addEventListener("focusin", schedule);
  document.addEventListener("focusout", schedule);
  update();
})();
