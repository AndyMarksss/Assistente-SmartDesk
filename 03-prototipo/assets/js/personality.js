(() => {
  const root = document.documentElement,
    button = document.getElementById("motion-toggle");
  if (!button) return;
  let paused = false;
  try {
    paused = localStorage.getItem("smartdesk-motion") === "paused";
  } catch {}
  function render() {
    root.dataset.motion = paused ? "paused" : "on";
    button.setAttribute("aria-pressed", String(paused));
    button.setAttribute("aria-label", paused ? "Ativar efeitos visuais" : "Pausar efeitos visuais");
    button.title = paused ? "Ativar efeitos visuais" : "Pausar efeitos visuais";
    button.querySelector("i").className = "fa-solid " + (paused ? "fa-play" : "fa-pause");
  }
  button.addEventListener("click", () => {
    paused = !paused;
    render();
    try {
      localStorage.setItem("smartdesk-motion", paused ? "paused" : "on");
    } catch {}
  });
  render();
})();
