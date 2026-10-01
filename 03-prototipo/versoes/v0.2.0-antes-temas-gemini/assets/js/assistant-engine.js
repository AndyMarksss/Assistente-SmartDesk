"use strict";
(function (desk) {
  function local(description, sector) {
    return { ...desk.classifier.classify(description, sector), source: "local" };
  }
  async function analyze(request) {
    // No identity, email or attachments are sent to the analysis endpoint.
    if (!/^https?:$/.test(location.protocol)) return local(request.description, request.sector);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: request.description, sector: request.sector, unit: request.unit }),
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error("Analysis unavailable");
      const result = await response.json();
      if (!Array.isArray(result.candidates) || !["suggested", "ambiguous", "unknown"].includes(result.status)) throw new Error("Invalid result");
      const allowed = desk.knowledgeBase.items.filter((item) => desk.classifier.isAllowed(item, request.sector));
      const candidates = result.candidates.map((candidate) => ({ ...candidate, item: allowed.find((item) => item.id === candidate.item?.id) })).filter((candidate) => candidate.item);
      return { ...result, candidates, status: candidates.length === 0 ? "unknown" : candidates.length === 1 ? "suggested" : "ambiguous", source: result.source === "ai" ? "ai" : "local" };
    } catch {
      return { ...local(request.description, request.sector), fallback: true };
    }
  }
  desk.assistantEngine = { analyze };
})(window.SmartDesk);
