"use strict";
(function (desk) {
  function create({ policy, byId, lock, readyControls, message, scroll }) {
    function structured(label, type, options, callback) {
      const temporal = ["date", "time"].includes(type);
      lock(temporal ? "PREENCHA PARA CONTINUAR" : "ESCOLHA NA LISTA PARA CONTINUAR");
      readyControls(() => {
        const box = byId("structured-field"),
          caption = document.createElement("label");
        caption.textContent = label;
        caption.htmlFor = "structured-input";
        const field = document.createElement(type === "select" ? "select" : "input");
        field.id = "structured-input";
        field.required = true;
        byId("frozen-label").hidden = true;
        if (type === "select") {
          const empty = document.createElement("option");
          empty.value = "";
          empty.textContent = "Selecione uma opção";
          field.append(empty);
          for (const value of options) {
            const opt = document.createElement("option");
            opt.value = value;
            opt.textContent = value;
            field.append(opt);
          }
        } else {
          field.type = "text";
          field.inputMode = "numeric";
          field.placeholder = type === "date" ? "DD/MM/AAAA" : "HH:MM";
          field.maxLength = type === "date" ? 10 : 5;
          field.autocomplete = "off";
        }
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice primary";
        button.textContent = "Continuar";
        button.disabled = true;
        const note = document.createElement("small");
        note.id = "structured-help";
        note.className = "structured-help";
        note.textContent = temporal
          ? type === "date"
            ? "Digite dia, mês e ano. Ex.: 05/10/2026."
            : "Digite o horário de 00:00 a 23:59. Ex.: 09:30."
          : "Escolha seu setor e toque em Continuar.";
        const error = document.createElement("p");
        error.id = "structured-error";
        error.className = "structured-error";
        error.setAttribute("role", "alert");
        field.setAttribute("aria-describedby", "structured-help structured-error");
        const read = () =>
          type === "date"
            ? policy.dateValue(field.value)
            : type === "time"
              ? policy.timeValue(field.value)
              : field.value;
        const problem = () =>
          type === "date"
            ? !read()
              ? "Essa data não existe. Use dia/mês/ano."
              : read() < policy.localDay()
                ? "Escolha hoje ou uma data futura para o atendimento."
                : ""
            : type === "time"
              ? !read()
                ? "Confira o horário. Use horas e minutos, como 09:30."
                : ""
              : !field.value
                ? "Escolha uma opção da lista."
                : "";
        let touched = false;
        const validate = () => {
          const msg = problem();
          button.disabled = !field.value;
          error.textContent = touched ? msg : "";
          field.setAttribute("aria-invalid", String(touched && !!msg));
          return msg;
        };
        field.addEventListener("input", () => {
          if (temporal && field.type === "text" && /^[\d/:]*$/.test(field.value)) {
            const digits = field.value.replace(/\D/g, "");
            field.value =
              type === "date"
                ? digits.slice(0, 2) +
                  (digits.length > 2 ? "/" + digits.slice(2, 4) : "") +
                  (digits.length > 4 ? "/" + digits.slice(4, 8) : "")
                : digits.slice(0, 2) + (digits.length > 2 ? ":" + digits.slice(2, 4) : "");
          }
          validate();
        });
        const submit = () => {
          touched = true;
          if (validate()) {
            field.focus();
            return;
          }
          const value = read();
          message(type === "date" ? value.split("-").reverse().join("/") : value, "user");
          callback(value);
        };
        button.addEventListener("click", submit);
        field.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submit();
          }
        });
        box.append(caption, field, button, note, error);
        if (temporal) {
          box.classList.add("structured-temporal");
          let picking = false;
          const toggle = document.createElement("button");
          toggle.type = "button";
          toggle.className = "small-action picker-toggle";
          const update = () => {
            toggle.textContent = picking
              ? type === "date"
                ? "Digitar data"
                : "Digitar horário"
              : type === "date"
                ? "Usar calendário"
                : "Usar relógio";
            toggle.setAttribute("aria-pressed", String(picking));
            note.textContent = picking
              ? type === "date"
                ? "Escolha a data no calendário ou volte para digitar."
                : "Escolha o horário no relógio ou volte para digitar."
              : type === "date"
                ? "Digite dia, mês e ano. Ex.: 05/10/2026."
                : "Digite o horário de 00:00 a 23:59. Ex.: 09:30.";
          };
          toggle.addEventListener("click", () => {
            const value = read();
            picking = !picking;
            field.type = picking ? type : "text";
            field.value = value
              ? type === "date" && !picking
                ? value.split("-").reverse().join("/")
                : value
              : "";
            if (type === "date" && picking) field.min = policy.localDay();
            else field.removeAttribute("min");
            update();
            validate();
            field.focus();
            if (picking) {
              try {
                field.showPicker();
              } catch {}
            }
          });
          update();
          box.append(toggle);
        }

        field.focus();
        requestAnimationFrame(scroll);
      });
    }

    return { structured };
  }
  desk.formControls = { create };
})(window.SmartDesk);
