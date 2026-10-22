import { companies } from "../data/companies.js";
import { roles } from "../data/roles.js";
import { talents } from "../data/talents.js";
import { assessmentRecords } from "../data/assessments.js";
export const getCompany = (id) => companies.find((c) => c.id === id);
export const getRole = (id) => roles.find((r) => r.id === id);
export const getTalent = (id) => talents.find((t) => t.id === id);
export function inScope(companyId, scope = "all") {
  return (
    scope === "all" ||
    companyId === scope ||
    getCompany(companyId)?.sector === scope.replace("sector:", "")
  );
}
export function roleStats(role, snapshot) {
  const all = assessmentRecords(role, snapshot),
    slate = all.filter((a) => a.slate);
  const unknown = all.every((a) => a.fit === null);
  return {
    all,
    slate,
    unknown,
    now: unknown
      ? null
      : slate.filter((a) => a.readiness === "Ready Now").length,
    near: unknown
      ? null
      : slate.filter((a) => a.readiness === "Ready in 1–2 years").length,
  };
}
export function summary(list, snapshot) {
  const critical = list.filter((r) => r.critical),
    stats = critical.map((r) => roleStats(r, snapshot));
  const unknown = stats.filter((s) => s.unknown).length,
    covered = stats.filter((s) => s.now > 0).length,
    assessed = critical.length - unknown;
  return {
    total: critical.length,
    unknown,
    covered,
    gaps: assessed - covered,
    assessed,
    coverage: assessed ? Math.round((covered / assessed) * 100) : null,
  };
}
export function scopedRoles(scope) {
  return roles.filter((r) => inScope(r.companyId, scope));
}
export function qualityIssues(scope = "all", snapshot = "2026-09-30") {
  return scopedRoles(scope).flatMap((r) => {
    const s = roleStats(r, snapshot),
      items = [];
    if (s.unknown)
      items.push({
        kind: "Missing",
        title: "Assessment wajib belum lengkap",
        impact: "Readiness belum dapat ditentukan",
        status: "Insufficient",
        severity: "Critical",
      });
    if (r.conflict || r.unresolved)
      items.push({
        kind: "Conflict",
        title: "Evidence material bertentangan",
        impact: "Role requirement perlu direkonsiliasi",
        status: "Conflict",
        severity: "Critical",
      });
    if (r.stale)
      items.push({
        kind: "Stale",
        title: "Evidence perlu diperbarui",
        impact: "Exposure terbaru belum tercermin",
        status: "Stale",
        severity: "High",
      });
    return items.map((x, i) => ({
      ...x,
      id: r.id + "-" + i,
      roleId: r.id,
      companyId: r.companyId,
      object: r.title,
      updated: r.stale ? "2025-06-30" : snapshot,
    }));
  });
}
export function qualityMetrics(scope, snapshot) {
  const list = scopedRoles(scope),
    issues = qualityIssues(scope, snapshot);
  return [
    {
      label: "Data Freshness",
      count: list.filter((r) => !r.stale).length,
      total: list.length,
      tone: "blue",
    },
    {
      label: "Mandatory Evidence Missing",
      count: list.filter((r) => roleStats(r, snapshot).unknown).length,
      total: list.length,
      tone: "red",
    },
    {
      label: "Material Conflicts",
      count: list.filter((r) => r.conflict || r.unresolved).length,
      total: list.length,
      tone: "amber",
    },
    {
      label: "Source Traceability",
      count: list.filter((r) => !r.unresolved).length,
      total: list.length,
      tone: "green",
    },
  ];
}
