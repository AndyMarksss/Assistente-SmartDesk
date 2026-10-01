"use strict";
(function () {
  const root = document.documentElement;
  let theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  try { const saved = localStorage.getItem("smartdesk-theme"); if (["dark", "light"].includes(saved)) theme = saved; } catch {}
  root.dataset.theme = theme;
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("theme-toggle");
    function update() {
      const dark = root.dataset.theme === "dark";
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
      button.querySelector("i").className = "fa-solid " + (dark ? "fa-sun" : "fa-moon");
      button.querySelector("span").textContent = dark ? "Tema claro" : "Tema escuro";
    }
    button.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("smartdesk-theme", root.dataset.theme); } catch {}
      update();
    });
    update();
  });
})();
