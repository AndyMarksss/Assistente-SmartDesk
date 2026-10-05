"use strict";
// O Live Server entrega arquivos, mas não executa a API do SmartDesk.
(function () {
  const local = ["127.0.0.1", "localhost", ""].includes(location.hostname);
  const wrong = local && (location.protocol === "file:" || location.port === "5500");
  window.smartdeskWrongRuntime = wrong;
  if (wrong) {
    const page = location.pathname.endsWith("/admin.html") ? "admin.html" : "";
    location.replace("http://127.0.0.1:4173/" + page);
  }
})();
