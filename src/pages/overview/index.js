import { companies } from "../../data/companies.js";
import { state } from "../../state/store.js";
import {
  scopedRoles,
  summary,
  inScope,
  getCompany,
  roleStats,
} from "../../services/portfolio.js";
import {
  header,
  metric,
  panel,
  link,
  action,
  icon,
  e,
  badge,
  date,
} from "../../components/ui.js";
import { companyTable } from "../../components/entity-tables.js";
import { coverageChart } from "../../components/charts.js";
import { url } from "../../router.js";
export default function () {
  const list = scopedRoles(state.scope),
    s = summary(list, state.snapshot);
  const attention = list
    .filter(
      (r) =>
        r.critical &&
        (roleStats(r, state.snapshot).unknown ||
          roleStats(r, state.snapshot).now === 0),
    )
    .slice(0, 5);
  return (
    header(
      "Executive Overview",
      "Ringkasan kondisi leadership dan suksesi untuk portofolio BUMN.",
      action("save-view", "Simpan view", "bookmark") +
        action("print", "Ringkasan", "download", "btn primary"),
      { compact: true },
    ) +
    `<div class="metrics">${metric("Total Critical Roles", s.total, "Peran kritikal dalam scope", "users", "blue", url("/roles", { critical: "1" }))}${metric("Tanpa Ready Now", s.gaps, `Dari ${s.assessed} role yang dapat dinilai`, "alert", "red", url("/risks", { preset: "gap" }))}${metric("Ready Now coverage", s.coverage === null ? "—" : s.coverage + "%", `${s.covered} / ${s.assessed} role yang dapat dinilai`, "chart", "blue", url("/risks", { preset: "covered" }))}${metric("Readiness Unknown", s.unknown, "Evidence belum mencukupi", "info", "neutral", url("/risks", { preset: "unknown" }))}</div>` +
    `<div class="overview-grid">${panel("Tren Ready Now Coverage", coverageChart(list, state.snapshot), `<span class="muted">12 bulan · ${date(state.snapshot)}</span>`)}${panel("Perhatian Utama", `<div class="attention-list">${attention.map((r) => link("/roles/" + r.id, `<span class="attention-icon ${roleStats(r, state.snapshot).unknown ? "neutral" : "red"}">${icon("alert")}</span><span><strong>${e(r.title)}</strong><small>${e(getCompany(r.companyId).name)}</small></span>${badge(roleStats(r, state.snapshot).unknown ? "Belum dapat ditentukan" : "No Ready Now", roleStats(r, state.snapshot).unknown ? "neutral" : "red")}${icon("chevron")}`, { tab: "succession" }, "attention-row")).join("") || '<p class="panel-pad">Tidak ada gap terkonfirmasi dalam scope ini.</p>'}</div>`, link("/risks", "Lihat semua " + icon("arrow")))}</div>` +
    `<div class="overview-grid lower">${companyTable(
      companies
        .filter((c) => inScope(c.id, state.scope))
        .map((c) => ({
          ...c,
          stats: summary(
            list.filter((r) => r.companyId === c.id),
            state.snapshot,
          ),
        })),
      "overview-companies",
    )}${panel("Saved Views", `<div class="saved-shortcuts">${link("/risks", icon("bookmark") + "<span><strong>Critical roles tanpa Ready Now</strong><small>Prioritas review mingguan</small></span>" + icon("chevron"), { preset: "gap" })}${link("/roles/pertamina-cfo", icon("bookmark") + "<span><strong>Succession · CFO Pertamina</strong><small>Role, kandidat, dan evidence</small></span>" + icon("chevron"), { tab: "succession" })}${link("/risks", icon("bookmark") + "<span><strong>Evidence belum cukup</strong><small>Role yang perlu dilengkapi</small></span>" + icon("chevron"), { preset: "unknown" })}${action("favorites", "Favorit saya", "star", "shortcut-btn")}</div>`, action("views", "Lihat semua", "", "text-btn"))}</div>`
  );
}
