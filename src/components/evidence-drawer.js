import { state } from "../state/store.js";
import {
  getRole,
  getTalent,
  getCompany,
  roleStats,
} from "../services/portfolio.js";
import { matches, gaps, recommendations } from "../services/matching.js";
import { evidenceFor } from "../data/evidence.js";
import { showDialog } from "./dialog.js";
import { e, date, badge, note, action, link } from "./ui.js";
function context(roleId, talentId) {
  const role = getRole(roleId);
  if (!role) return null;
  const talent = getTalent(talentId),
    record = talent
      ? matches(role, state.snapshot).find((a) => a.talentId === talent.id)
      : roleStats(role, state.snapshot).unknown
        ? {
            confidence: role.conflict ? "Conflict" : "Insufficient",
            fit: null,
            readiness: "Belum dapat ditentukan",
          }
        : null;
  return {
    role,
    talent,
    record,
    sources: evidenceFor(role, talent, record, state.snapshot),
  };
}
export function evidenceDrawer(roleId, talentId = "") {
  const c = context(roleId, talentId);
  if (!c) return;
  if (state.access === "reader") {
    showDialog(
      "Akses evidence terbatas",
      note(
        "Mode Portfolio Reader hanya menampilkan ringkasan profesional. Detail assessment tersedia pada mode Analyst.",
        "amber",
      ),
      { drawer: true },
    );
    return;
  }
  const { role, talent, record, sources } = c;
  const reference = `${talent?.name || role.title} → ${role.canonical} · ${getCompany(role.companyId).name} · ${state.snapshot} · DHCE-RSP-2026.3`;
  showDialog(
    "Evidence Inspector",
    `<span class="eyebrow">${e(role.canonical)} · ${e(getCompany(role.companyId).name)}</span><h3>${e(talent?.name || role.title)}</h3><p class="muted">As of ${date(state.snapshot)}</p>${note(sources[0].why, record?.fit === null ? "amber" : "blue")}<dl class="facts"><dt>Claim / value</dt><dd>${talent ? "Role Fit " + (record?.fit === null ? "belum dapat ditentukan" : record.fit + "%") : role.unresolved ? "Canonical mapping belum terselesaikan" : "Role requirement · Grade " + role.grade}</dd><dt>Readiness</dt><dd>${record ? badge(record.readiness) : "Tidak berlaku untuk requirement jabatan"}</dd><dt>Data Confidence</dt><dd>${badge(record?.confidence || sources[0].status)}</dd><dt>Policy</dt><dd>DHCE-RSP-2026.3</dd></dl><h3>Sumber pendukung</h3><div class="stack">${sources
      .map(
        (s, i) =>
          `<article class="source-card"><div>${badge(s.status)}<small>${date(s.date)}</small></div><h4>${e(s.title)}</h4><p>${e(s.section)}</p><ul>${s.facts
            .slice(0, 2)
            .map((f) => `<li>${e(f)}</li>`)
            .join(
              "",
            )}</ul>${action("source", "Buka detail sumber", "file", "text-btn", `data-role="${role.id}" data-talent="${talent?.id || ""}" data-index="${i}"`)}</article>`,
      )
      .join(
        "",
      )}</div><div class="dialog-footer">${action("copy", "Salin referensi", "copy", "btn primary", `data-text="${e(reference)}"`)}${link("/quality", "Lihat data quality", { company: role.companyId }, "btn")}</div>`,
    { drawer: true },
  );
}
export function sourceDetail(roleId, talentId, index) {
  const c = context(roleId, talentId);
  if (!c || state.access === "reader") return evidenceDrawer(roleId, talentId);
  const s = c.sources[Number(index)] || c.sources[0];
  showDialog(
    "Source Detail",
    `<div class="document"><span class="eyebrow">Evidence reference · ${e(s.id)}</span><h3>${e(s.title)}</h3><p>${e(s.section)} · ${date(s.date)}</p>${badge(s.status)}<hr><h4>Ringkasan sumber</h4><p>${e(s.why)}</p><h4>Facts & observations</h4>${s.facts.map((f, i) => `<p><strong>${i + 1}.</strong> ${e(f)}</p>`).join("")}<hr><small>Dokumen ilustratif untuk eksplorasi workspace. Bukan dokumen assessment resmi atau penilaian individu nyata.</small></div><div class="dialog-footer">${action("evidence", "Kembali ke evidence", "back", "btn", `data-role="${roleId}" data-talent="${talentId}"`)}${action("copy", "Salin cuplikan", "copy", "btn primary", `data-text="${e(s.title + " · " + s.facts.join(" "))}"`)}</div>`,
    { drawer: true },
  );
}
export function developmentDetail(roleId, talentId, index) {
  const role = getRole(roleId),
    talent = getTalent(talentId);
  if (!role || !talent || state.access === "reader")
    return evidenceDrawer(roleId, talentId);
  const a = matches(role, state.snapshot).find((a) => a.talentId === talentId),
    x = recommendations(role, a)[Number(index)];
  if (!x) return;
  showDialog(
    "Development Recommendation",
    `<span class="eyebrow">${e(talent.name)} → ${e(role.canonical)} · ${e(getCompany(role.companyId).name)}</span><h3>${e(x.title)}</h3><dl class="facts"><dt>Targeted gap</dt><dd>${e(x.name)} · ${x.actual} → ${x.required}</dd><dt>Proposed exposure</dt><dd>${e(x.exposure)}</dd><dt>Expected evidence</dt><dd>${e(x.evidence)}</dd><dt>Feasibility</dt><dd>Perlu review sponsor dan ketersediaan exposure lintas entitas.</dd><dt>Reassessment window</dt><dd>${e(x.window)}</dd><dt>Status</dt><dd>${e(x.status)}</dd></dl>${note("Selesai assignment tidak otomatis mengubah readiness. Assessment ulang tetap diperlukan.")}${action("evidence", "Tinjau evidence pendukung", "file", "btn primary", `data-role="${role.id}" data-talent="${talent.id}"`)}`,
    { drawer: true },
  );
}
