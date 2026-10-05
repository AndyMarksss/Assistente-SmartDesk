"use strict";
(function () {
  let session = "";
  try {
    session = sessionStorage.getItem("smartdesk-portal-session") || "";
  } catch {}
  let resolveSession;
  window.smartdeskPortalSession = session
    ? Promise.resolve(session)
    : new Promise((resolve) => {
        resolveSession = resolve;
      });
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("portal-access");
    const error = document.getElementById("portal-access-error");
    const input = document.getElementById("portal-password");
    const form = document.getElementById("portal-access-form");
    const button = form.querySelector("button");
    if (session) overlay.remove();
    else {
      overlay.showModal();
      input.focus();
    }
    window.smartdeskPortalExpired = () => {
      try {
        sessionStorage.removeItem("smartdesk-portal-session");
      } catch {}
      error.textContent = "Seu acesso expirou. Atualize a página e entre novamente.";
      if (!overlay.isConnected) document.body.append(overlay);
      overlay.showModal();
      button.disabled = true;
    };
    overlay.addEventListener("cancel", (event) => event.preventDefault());
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      button.disabled = true;
      error.textContent = "Conferindo acesso…";
      window
        .smartdeskRemote("/auth/login", { password: input.value })
        .then(({ body: result }) => {
          button.disabled = false;
          input.value = "";
          if (!result?.session) {
            error.textContent = result?.error || "Não foi possível entrar.";
            input.focus();
            return;
          }
          try {
            sessionStorage.setItem("smartdesk-portal-session", result.session);
          } catch {}
          resolveSession(result.session);
          overlay.close();
          overlay.remove();
        })
        .catch(() => {
          button.disabled = false;
          input.value = "";
          error.textContent = "Não consegui verificar o acesso. Tente novamente.";
        });
    });
  });
})();
