"use strict";
(function (desk) {
  function create({ policy, byId, lock, readyControls, message, scroll }) {
    const el = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    };
    const icon = (name) => {
      const i = el("i", "fa-solid " + name);
      i.setAttribute("aria-hidden", "true");
      return i;
    };
    const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
    // Atalhos de data: hoje, amanhã e os próximos dias úteis, sempre no futuro.
    function dateShortcuts() {
      const today = policy.localDay(),
        list = [],
        base = new Date(today + "T12:00:00Z");
      for (let offset = 0; list.length < 5 && offset < 10; offset++) {
        const day = new Date(base.getTime() + offset * 864e5),
          iso = day.toISOString().slice(0, 10),
          weekday = day.getUTCDay();
        if (offset > 1 && (weekday === 0 || weekday === 6)) continue;
        list.push({
          iso,
          label:
            offset === 0
              ? "Hoje"
              : offset === 1
                ? "Amanhã"
                : WEEKDAYS[weekday] + " " + iso.slice(8, 10) + "/" + iso.slice(5, 7),
        });
      }
      return list;
    }
    // notBefore: horário mínimo (HH:MM) quando a data escolhida é hoje.
    function structured(label, type, options, callback, { prefill = "", notBefore = "" } = {}) {
      const temporal = ["date", "time"].includes(type);
      lock(temporal ? "PREENCHA PARA CONTINUAR" : "ESCOLHA NA LISTA PARA CONTINUAR");
      readyControls(() => {
        const box = byId("structured-field"),
          caption = el("label", "", label);
        caption.htmlFor = "structured-input";
        const field = el(type === "select" ? "select" : "input");
        field.id = "structured-input";
        field.required = true;
        byId("frozen-label").hidden = true;
        if (type === "select") {
          const empty = el("option", "", "Selecione uma opção");
          empty.value = "";
          field.append(empty);
          for (const value of options) {
            const opt = el("option", "", value);
            opt.value = value;
            field.append(opt);
          }
        } else {
          field.type = "text";
          field.inputMode = "numeric";
          field.placeholder = type === "date" ? "DD/MM/AAAA" : "HH:MM";
          field.maxLength = type === "date" ? 10 : 5;
          field.autocomplete = "off";
          if (prefill)
            field.value = type === "date" ? prefill.split("-").reverse().join("/") : prefill;
        }
        const button = el("button", "choice primary", "Continuar");
        button.type = "button";
        button.disabled = !field.value;
        const note = el(
          "small",
          "structured-help",
          temporal
            ? type === "date"
              ? "Digite dia, mês e ano (ex.: 05/10/2026) ou toque no calendário."
              : "Digite de 00:00 a 23:59 (ex.: 09:30) ou toque no relógio."
            : "Escolha na lista e toque em Continuar.",
        );
        note.id = "structured-help";
        const error = el("p", "structured-error");
        error.id = "structured-error";
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
                : notBefore && read() < notBefore
                  ? "Esse horário já passou hoje. Escolha um horário a partir de " + notBefore + "."
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
          if (temporal && /^[\d/:]*$/.test(field.value)) {
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
        let done = false;
        const submit = () => {
          if (done) return;
          touched = true;
          if (validate()) {
            field.focus();
            return;
          }
          done = true;
          const value = read();
          message(type === "date" ? desk.chatFormat.shortDate(value) : value, "user");
          callback(value);
        };
        button.addEventListener("click", submit);
        field.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submit();
          }
        });
        if (!temporal) {
          box.append(caption, field, button, note, error);
        } else {
          // Campo com botão visível de calendário/relógio; o seletor nativo fica por baixo.
          box.classList.add("structured-temporal");
          const group = el("div", "temporal-group"),
            native = el("input", "temporal-native"),
            open = el("button", "temporal-open");
          native.type = type;
          native.tabIndex = -1;
          native.setAttribute("aria-hidden", "true");
          if (type === "date") native.min = policy.localDay();
          open.type = "button";
          open.setAttribute("aria-label", type === "date" ? "Abrir calendário" : "Abrir relógio");
          open.append(
            icon(type === "date" ? "fa-calendar-days" : "fa-clock"),
            el("span", "", type === "date" ? "Calendário" : "Relógio"),
          );
          open.addEventListener("click", () => {
            const value = read();
            if (value) native.value = value;
            try {
              native.showPicker();
            } catch {
              native.focus();
              native.click();
            }
          });
          native.addEventListener("change", () => {
            if (!native.value) return;
            field.value =
              type === "date" ? native.value.split("-").reverse().join("/") : native.value;
            touched = true;
            validate();
            field.focus();
          });
          group.append(field, open, native);
          box.append(caption, group, button, note, error);
          if (type === "date") {
            const chips = el("div", "date-shortcuts");
            chips.setAttribute("role", "group");
            chips.setAttribute("aria-label", "Datas rápidas");
            for (const option of dateShortcuts()) {
              const chip = el("button", "date-chip", option.label);
              chip.type = "button";
              chip.addEventListener("click", () => {
                field.value = option.iso.split("-").reverse().join("/");
                submit();
              });
              chips.append(chip);
            }
            box.insertBefore(chips, group);
          }
        }
        validate();
        if (matchMedia("(hover: hover) and (pointer: fine)").matches || !temporal) field.focus();
        requestAnimationFrame(scroll);
      });
    }

    // Combobox acessível: um campo com busca e uma lista curta logo acima.
    function comboBox(label, options, callback, { placeholder = "Digite para buscar…" } = {}) {
      lock("ESCOLHA UMA OPÇÃO PARA CONTINUAR");
      readyControls(() => {
        byId("frozen-label").hidden = true;
        const box = byId("structured-field"),
          caption = el("label", "", label),
          wrap = el("div", "combo"),
          search = el("input", "combo-input"),
          list = el("ul", "combo-list"),
          empty = el("p", "combo-empty", "Nada encontrado. Tente outra palavra."),
          help = el("small", "structured-help", "Digite parte do nome e escolha na lista.");
        const normalize = (value) =>
          String(value).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
        caption.htmlFor = "combo-input";
        caption.id = "combo-label";
        search.id = "combo-input";
        search.type = "text";
        search.autocomplete = "off";
        search.placeholder = placeholder;
        search.setAttribute("role", "combobox");
        search.setAttribute("aria-controls", "combo-list");
        search.setAttribute("aria-expanded", "true");
        search.setAttribute("aria-autocomplete", "list");
        list.id = "combo-list";
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-labelledby", "combo-label");
        empty.hidden = true;
        let active = 0,
          visible = [],
          done = false;
        const pick = (value) => {
          if (done) return;
          done = true;
          search.disabled = true;
          message(value, "user");
          callback(value);
        };
        options.forEach((option, index) => {
          const li = el("li", "combo-option");
          li.id = "combo-option-" + index;
          li.setAttribute("role", "option");
          li.dataset.value = option.value;
          li.dataset.search = normalize(option.value + " " + (option.hint || ""));
          li.append(icon(option.icon || "fa-circle-dot"), el("span", "", option.value));
          li.addEventListener("pointerdown", (event) => event.preventDefault());
          li.addEventListener("click", () => pick(option.value));
          list.append(li);
        });
        const highlight = (index) => {
          visible.forEach((li, i) => li.setAttribute("aria-selected", String(i === index)));
          active = index;
          const current = visible[index];
          if (current) {
            search.setAttribute("aria-activedescendant", current.id);
            current.scrollIntoView({ block: "nearest" });
          } else search.removeAttribute("aria-activedescendant");
        };
        const filter = () => {
          const query = normalize(search.value.trim());
          visible = [];
          list.querySelectorAll(".combo-option").forEach((li) => {
            const show = !query || li.dataset.search.includes(query);
            li.hidden = !show;
            if (show) visible.push(li);
          });
          empty.hidden = visible.length > 0;
          highlight(query && visible.length ? 0 : -1);
        };
        search.addEventListener("input", filter);
        search.addEventListener("keydown", (event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!visible.length) return;
            const step = event.key === "ArrowDown" ? 1 : -1;
            highlight((active + step + visible.length) % visible.length);
          } else if (event.key === "Enter") {
            event.preventDefault();
            const chosen = visible[active] || (visible.length === 1 ? visible[0] : null);
            if (chosen) pick(chosen.dataset.value);
          } else if (event.key === "Escape") {
            search.value = "";
            filter();
          }
        });
        wrap.append(list, empty, el("span", "combo-search-icon"), search);
        wrap.querySelector(".combo-search-icon").append(icon("fa-magnifying-glass"));
        box.classList.add("structured-picker");
        box.append(caption, wrap, help);
        filter();
        if (matchMedia("(hover: hover) and (pointer: fine)").matches) search.focus();
        requestAnimationFrame(scroll);
      });
    }

    return { structured, comboBox };
  }
  desk.formControls = { create };
})(window.SmartDesk);
