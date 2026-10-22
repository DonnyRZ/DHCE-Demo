import { companies } from "../data/companies.js";
import { competencies } from "../data/roles.js";
import { getCompany, roleStats } from "../services/portfolio.js";
import { gaps } from "../services/matching.js";
import { dataTable } from "./data-table.js";
import { state } from "../state/store.js";
import { url } from "../router.js";
import {
  e,
  link,
  avatar,
  badge,
  progress,
  date,
  evidenceButton,
} from "./ui.js";
export const companyOptions = companies.map((c) => [c.id, c.name]);
export function companyTable(rows, id = "companies") {
  return dataTable({
    id,
    rows,
    caption: "Perbandingan portofolio BUMN",
    rowHref: (c) => url("/companies/" + c.id),
    columns: [
      {
        key: "name",
        label: "BUMN",
        required: true,
        render: (c) =>
          link(
            "/companies/" + c.id,
            `<span class="entity">${avatar(c.initials, true)}<span><strong>${e(c.name)}</strong><small>${e(c.legal)}</small></span></span>`,
          ),
      },
      { key: "sector", label: "Sektor" },
      {
        key: "critical",
        label: "Critical roles",
        value: (c) => c.stats.total,
        render: (c) =>
          link("/roles", c.stats.total, { company: c.id, critical: "1" }),
      },
      {
        key: "coverage",
        label: "Ready Now coverage",
        value: (c) => c.stats.coverage,
        render: (c) =>
          link("/risks", progress(c.stats.covered, c.stats.assessed || 1), {
            company: c.id,
          }) + `<small>${c.stats.unknown} role belum dapat dinilai</small>`,
      },
      {
        key: "evidence",
        label: "Evidence coverage",
        value: (c) => c.stats.assessed,
        render: (c) => progress(c.stats.assessed, c.stats.total || 1, "green"),
      },
      {
        key: "snapshot",
        label: "Snapshot",
        value: () => state.snapshot,
        render: () => date(state.snapshot),
      },
    ],
  });
}
export function roleTable(rows, id = "roles", risk = false) {
  const ready = (r) => roleStats(r, state.snapshot);
  return dataTable({
    id,
    rows,
    caption: risk ? "Leadership risks" : "Daftar jabatan",
    rowHref: (r) =>
      url("/roles/" + r.id, { tab: risk ? "succession" : "overview" }),
    columns: [
      {
        key: "title",
        label: "Jabatan / Canonical role",
        required: true,
        render: (r) =>
          link(
            "/roles/" + r.id,
            `<strong>${e(r.title)}</strong><small>${e(r.canonical)}</small>`,
            { tab: risk ? "succession" : "overview" },
          ),
      },
      {
        key: "company",
        label: "BUMN",
        value: (r) => getCompany(r.companyId).name,
        render: (r) =>
          link("/companies/" + r.companyId, e(getCompany(r.companyId).name)),
      },
      ...(risk
        ? []
        : [
            {
              key: "grade",
              label: "Grade",
              render: (r) =>
                r.unresolved ? "—" : `<span class="grade">${r.grade}</span>`,
            },
            {
              key: "jobValue",
              label: "Job Value",
              render: (r) =>
                r.unresolved
                  ? "—"
                  : evidenceButton(r.id, "", String(r.jobValue)),
            },
          ]),
      {
        key: "criticality",
        label: "Criticality",
        render: (r) =>
          badge(r.criticality, r.criticality === "Critical" ? "red" : "amber"),
      },
      {
        key: "now",
        label: "Ready Now",
        value: (r) => ready(r).now,
        render: (r) =>
          ready(r).unknown
            ? badge("Belum dapat ditentukan")
            : badge(
                String(ready(r).now) + " successor",
                ready(r).now ? "green" : "amber",
              ),
      },
      {
        key: "near",
        label: "Near-term",
        value: (r) => ready(r).near,
        render: (r) => ready(r).near ?? "—",
      },
      ...(risk
        ? [
            {
              key: "reason",
              label: "Risk reason",
              value: (r) =>
                ready(r).unknown
                  ? "Unknown"
                  : ready(r).now
                    ? "Bench depth"
                    : "No Ready Now",
              render: (r) =>
                ready(r).unknown
                  ? "Evidence belum cukup"
                  : ready(r).now
                    ? "Kedalaman kandidat terbatas"
                    : "Tidak ada successor Ready Now",
            },
          ]
        : []),
      {
        key: "confidence",
        label: "Data Confidence",
        value: (r) => (ready(r).unknown ? "Insufficient" : "High"),
        render: (r) =>
          badge(
            r.conflict
              ? "Conflict"
              : ready(r).unknown
                ? "Insufficient"
                : "High",
          ),
      },
      {
        key: "review",
        label: "Last review",
        render: (r) =>
          date(r.review) +
          (r.stale
            ? '<small class="warning-text">Evidence perlu diperbarui</small>'
            : ""),
      },
    ],
  });
}
export function talentTable(rows, id = "talents") {
  return dataTable({
    id,
    rows,
    caption: "Direktori talent",
    rowHref: (t) => url("/talent/" + t.id),
    columns: [
      {
        key: "name",
        label: "Nama",
        required: true,
        render: (t) =>
          link(
            "/talent/" + t.id,
            `<span class="entity">${avatar(t.name, true)}<strong>${e(t.name)}</strong></span>`,
          ),
      },
      { key: "title", label: "Current role" },
      {
        key: "company",
        label: "BUMN",
        value: (t) => getCompany(t.companyId).name,
        render: (t) =>
          link("/companies/" + t.companyId, e(getCompany(t.companyId).name)),
      },
      {
        key: "years",
        label: "Key experience",
        render: (t) =>
          `<strong>${t.years} tahun</strong><small>${e(t.experience)}</small>`,
      },
      {
        key: "grade",
        label: "Grade / Scope",
        render: (t) => `Grade ${t.grade}<small>Enterprise leadership</small>`,
      },
      {
        key: "confidence",
        label: "Data Confidence",
        render: (t) => badge(t.confidence),
      },
      { key: "updated", label: "Updated", render: (t) => date(t.updated) },
    ],
  });
}
export function candidateTable(role, rows, id = "candidates") {
  return dataTable({
    id,
    rows,
    caption: "Kandidat untuk " + role.canonical,
    columns: [
      {
        key: "select",
        label: "Pilih",
        required: true,
        sort: false,
        render: (a) =>
          `<input type="checkbox" data-select-candidate="${a.talentId}" data-role="${role.id}" aria-label="Pilih ${e(a.talent.name)}" ${state.selection.role === role.id && state.selection.snapshot === state.snapshot && state.selection.ids.includes(a.talentId) ? "checked" : ""}>`,
      },
      {
        key: "name",
        label: "Kandidat",
        required: true,
        value: (a) => a.talent.name,
        render: (a) =>
          link(
            "/talent/" + a.talentId,
            `<span class="entity">${avatar(a.talent.name, true)}<strong>${e(a.talent.name)}</strong></span>`,
            { target: role.id, tab: "target" },
          ),
      },
      {
        key: "company",
        label: "Current role / BUMN",
        value: (a) => getCompany(a.talent.companyId).name,
        render: (a) =>
          e(a.talent.title) +
          `<small>${e(getCompany(a.talent.companyId).name)}</small>`,
      },
      {
        key: "eligible",
        label: "Eligibility",
        render: (a) => badge(a.eligible),
      },
      {
        key: "readiness",
        label: "Readiness",
        render: (a) => badge(a.readiness),
      },
      {
        key: "fit",
        label: "Role Fit",
        render: (a) =>
          a.fit === null
            ? "—"
            : evidenceButton(role.id, a.talentId, progress(a.fit)),
      },
      {
        key: "confidence",
        label: "Data Confidence",
        render: (a) => badge(a.confidence),
      },
      {
        key: "gap",
        label: "Key gaps",
        value: (a) => gaps(role, a)?.length ?? null,
        render: (a) => {
          const g = gaps(role, a);
          return g === null
            ? "Evidence belum cukup"
            : g.length
              ? g
                  .slice(0, 2)
                  .map((x) => e(x.name))
                  .join("<br>")
              : "Tidak ada gap material";
        },
      },
      {
        key: "evidence",
        label: "Evidence",
        sort: false,
        render: (a) => evidenceButton(role.id, a.talentId),
      },
    ],
  });
}
export function qualityTable(rows, id = "quality") {
  return dataTable({
    id,
    rows,
    caption: "Isu kualitas data",
    columns: [
      {
        key: "object",
        label: "Objek / BUMN",
        required: true,
        render: (r) =>
          link(
            "/roles/" + r.roleId,
            `<strong>${e(r.object)}</strong><small>${e(getCompany(r.companyId).name)}</small>`,
            { tab: "evidence" },
          ),
      },
      { key: "title", label: "Jenis isu" },
      { key: "impact", label: "Decision impact" },
      {
        key: "kind",
        label: "Evidence gap",
        render: (r) =>
          r.kind === "Missing"
            ? "Assessment wajib belum tersedia"
            : r.kind === "Conflict"
              ? "Sumber perlu direkonsiliasi"
              : "Exposure terbaru belum tercermin",
      },
      { key: "status", label: "Status", render: (r) => badge(r.status) },
      { key: "updated", label: "As of", render: (r) => date(r.updated) },
      {
        key: "action",
        label: "Tindak lanjut",
        sort: false,
        render: (r) => evidenceButton(r.roleId, "", "Tinjau evidence"),
      },
    ],
  });
}
