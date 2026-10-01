"use strict";
(function (desk) {
  const byId = (id) => document.getElementById(id);
  const form = byId("request-form");
  const state = { request: null, result: null, selected: null, analyzing: false };
  const option = (value, text) => { const element = document.createElement("option"); element.value = value; element.textContent = text; return element; };
  desk.knowledgeBase.units.forEach((unit) => byId("unit").append(option(unit, unit)));
  desk.knowledgeBase.sectorExamples.forEach((sector) => byId("sector-options").append(option(sector, sector)));
  function show(screen) {
    desk.flows.implemented.forEach((name) => {
      byId(name + "-screen").hidden = name !== screen;
      const step = byId("step-" + name);
      if (name === screen) step.setAttribute("aria-current", "step"); else step.removeAttribute("aria-current");
    });
    byId(screen === "entry" ? "entry-title" : screen === "analysis" ? "analysis-title" : "result-title").focus();
  }
  function validate() {
    const messages = {
      name: "Informe seu nome para continuar.",
      email: "Informe um e-mail válido para continuar.",
      unit: "Selecione sua unidade.",
      sector: "Informe seu setor.",
      description: "Conte brevemente o que está acontecendo."
    };
    let first = null;
    Object.keys(messages).forEach((id) => {
      const element = byId(id);
      const invalid = !element.value.trim() || !element.checkValidity();
      byId(id + "-error").textContent = invalid ? messages[id] : "";
      if (invalid) { element.setAttribute("aria-invalid", "true"); first = first || element; }
      else element.removeAttribute("aria-invalid");
    });
    if (first) { first.focus(); byId("status").textContent = "Confira os campos indicados para continuar."; }
    return !first;
  }
  function showChoices(items, label) {
    byId("confirmation").hidden = true;
    byId("status").textContent = "Escolha uma necessidade e confirme a classificação.";
    byId("choices").hidden = false;
    byId("choice-label").textContent = label;
    const select = byId("classification-choice");
    select.replaceChildren(option("", "Selecione uma opção"));
    items.forEach((item) => select.append(option(item.id, item.area + " — " + item.need)));
    select.value = state.selected ? state.selected.id : "";
    byId("confirm").textContent = "Confirmar classificação";
    byId("confirm").disabled = !select.value;
    byId("correct").hidden = true;
    byId("suggestion").hidden = true;
  }
  function renderResult() {
    state.selected = null;
    byId("choices").hidden = true;
    byId("confirmation").hidden = true;
    byId("confirm").disabled = false;
    byId("correct").hidden = false;
    byId("confirm").textContent = "Sim, está correta";
    const result = state.result;
    if (result.status === "suggested") {
      state.selected = result.candidates[0].item;
      byId("suggested-area").textContent = state.selected.area;
      byId("suggested-need").textContent = state.selected.need;
      byId("suggestion").hidden = false;
      byId("result-description").textContent = "Pelo seu relato, esta parece ser a necessidade. Você pode confirmar ou corrigir.";
    } else {
      byId("result-description").textContent = result.status === "ambiguous"
        ? "Seu relato combina com mais de uma necessidade. Escolha a que melhor descreve o que você precisa."
        : "Ainda não encontrei uma correspondência segura na base inicial. Você pode escolher uma necessidade ou editar o relato.";
      const items = result.status === "ambiguous" ? result.candidates.map((candidate) => candidate.item) : desk.knowledgeBase.items.filter((item) => desk.classifier.isAllowed(item, state.request.sector));
      showChoices(items, "Qual necessidade corresponde ao seu problema?");
      // Allow broadening the choices after an ambiguous result.
      if (result.status === "ambiguous") byId("correct").hidden = false;
    }
    byId("status").textContent = result.status === "suggested" ? "Classificação sugerida. Confira antes de confirmar." : "Sua confirmação é necessária.";
    show("result");
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (state.analyzing || !validate()) return;
    state.request = {
      name: byId("name").value.trim(), email: byId("email").value.trim(),
      unit: byId("unit").value, sector: byId("sector").value.trim(),
      description: byId("description").value.trim(),
      attachmentName: byId("attachment").files[0]?.name || null
    };
    state.analyzing = true;
    byId("status").textContent = "Analisando o relato com a base inicial.";
    show("analysis");
    await new Promise((resolve) => setTimeout(resolve, desk.flows.analysisDelayMs));
    state.result = desk.classifier.classify(state.request.description, state.request.sector);
    state.analyzing = false;
    renderResult();
  });
  byId("classification-choice").addEventListener("change", (event) => {
    state.selected = desk.knowledgeBase.items.find((item) => item.id === event.target.value && desk.classifier.isAllowed(item, state.request.sector)) || null;
    byId("confirm").disabled = !state.selected;
  });
  byId("correct").addEventListener("click", () => {
    showChoices(desk.knowledgeBase.items.filter((item) => desk.classifier.isAllowed(item, state.request.sector)), "Escolha a classificação correta");
    byId("classification-choice").focus();
  });
  byId("confirm").addEventListener("click", () => {
    if (!state.selected) return;
    byId("confirmation").textContent = state.selected.area + " — " + state.selected.need + ". " + desk.flows.confirmationMessage;
    byId("confirmation").hidden = false;
    byId("confirm").disabled = true;
    byId("status").textContent = "Classificação confirmada. Esta versão termina aqui.";
  });
  byId("back").addEventListener("click", () => {
    state.selected = null;
    byId("status").textContent = "Você pode editar os dados e analisar novamente.";
    show("entry");
  });
})(window.SmartDesk);
