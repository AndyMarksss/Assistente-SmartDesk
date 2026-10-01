"use strict";
// Service selection was explicitly deferred by the user on 2026-10-01.
// Replace this adapter when a provider is selected. Never put API keys in assets/js.
module.exports = {
  name: "not-configured",
  ready: () => false,
  async analyze(_request, _allowedItems) {
    throw new Error("Serviço de IA ainda não definido.");
  }
};
