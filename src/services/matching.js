import { assessmentRecords, bands } from "../data/assessments.js";
import { getTalent } from "./portfolio.js";
import { competencies } from "../data/roles.js";
export function matches(role, snapshot) {
  return assessmentRecords(role, snapshot)
    .map((a) => ({ ...a, talent: getTalent(a.talentId) }))
    .sort(
      (a, b) =>
        ["Eligible", "Under review", "Not eligible"].indexOf(a.eligible) -
          ["Eligible", "Under review", "Not eligible"].indexOf(b.eligible) ||
        bands.indexOf(a.readiness) - bands.indexOf(b.readiness) ||
        (b.fit ?? -1) - (a.fit ?? -1),
    );
}
export function gaps(role, assessment) {
  return assessment.actual
    ? competencies
        .map((name, i) => ({
          name,
          required: role.required[i],
          actual: assessment.actual[i],
          gap: Math.max(0, role.required[i] - assessment.actual[i]),
        }))
        .filter((g) => g.gap > 0)
    : null;
}
export function recommendations(role, assessment) {
  const g = gaps(role, assessment);
  if (g === null) return [];
  return g.map((x, i) => ({
    ...x,
    title:
      i === 0
        ? "Proyek alokasi modal lintas entitas"
        : "Forum stakeholder & strategic exposure",
    exposure:
      i === 0
        ? "Memimpin business case investasi lintas perusahaan."
        : "Penugasan sebagai project lead pada forum lintas fungsi.",
    evidence:
      "Business case, sponsor feedback, dan observasi kompetensi terstruktur.",
    window: "Maret 2027",
    status: "Usulan · belum menjadi penugasan resmi",
  }));
}
