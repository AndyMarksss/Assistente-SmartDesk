"use strict";
window.SmartDesk.flows = {
  version: "0.2.0",
  stages: ["context", "report", "classification", "summary"],
  areas: ["Audiovisual", "Impressora", "Google", "TI"],
  locationTypes: ["Sala de aula", "Área administrativa", "Outro local"],
  sectors: ["Secretaria", "Financeiro", "Marketing", "Coordenação EI"],
  // Sector choices are examples until the full matrix is imported.
  planned: ["officialMatrix", "aiProvider", "triage", "evaluation"]
};
