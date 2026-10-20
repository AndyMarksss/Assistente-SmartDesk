"use strict";
(function (desk) {
  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  function isAllowed(item, sector) {
    return !item.sectors || item.sectors.some((name) => normalize(name) === normalize(sector));
  }
  function classify(description, sector) {
    const text = " " + normalize(description) + " ";
    const matched = desk.knowledgeBase.items
      .map((item) => {
        const signals = [...new Set(item.keywords.map(normalize))].filter((keyword) =>
          text.includes(" " + keyword + " "),
        );
        return {
          item,
          signals,
          score: signals.length
            ? Math.max(...signals.map((signal) => signal.split(" ").length))
            : 0,
        };
      })
      .filter((candidate) => candidate.score > 0);
    const blocked = matched.filter((candidate) => !isAllowed(candidate.item, sector));
    let candidates = matched.filter((candidate) => isAllowed(candidate.item, sector));
    // Within one area, use specific needs instead of the generic fallback.
    candidates = candidates.filter(
      (candidate) =>
        !candidate.item.generic ||
        !candidates.some((other) => !other.item.generic && other.item.area === candidate.item.area),
    );
    candidates.sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
    if (!candidates.length) return { status: "unknown", candidates: [], blocked };
    if (candidates.length > 1) return { status: "ambiguous", candidates, blocked };
    return { status: "suggested", candidates, blocked };
  }
  desk.classifier = { normalize, isAllowed, classify };
})(window.SmartDesk);
