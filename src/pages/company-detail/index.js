import { state } from "../../state/store.js";
import { route, url } from "../../router.js";
import { talents } from "../../data/talents.js";
import {
  getCompany,
  scopedRoles,
  summary,
  qualityIssues,
} from "../../services/portfolio.js";
import {
  header,
  metric,
  tabs,
  panel,
  link,
  action,
  e,
  avatar,
  favorite,
  note,
} from "../../components/ui.js";
import {
  roleTable,
  talentTable,
  qualityTable,
} from "../../components/entity-tables.js";
export default function () {
  const r = route(),
    c = getCompany(r.parts[1]);
  if (!c)
    return note(
      "Perusahaan tidak ditemukan. " +
        link("/companies", "Kembali ke Companies"),
      "amber",
    );
  const tab = r.params.tab || "overview",
    list = scopedRoles(c.id),
    s = summary(list, state.snapshot);
  let body = "";
  if (tab === "roles") body = roleTable(list, "company-roles");
  else if (tab === "talent")
    body = talentTable(
      talents.filter((t) => t.companyId === c.id),
      "company-talents",
    );
  else if (tab === "succession")
    body = roleTable(
      list.filter((r) => r.critical),
      "company-succession",
      true,
    );
  else if (tab === "quality")
    body = qualityTable(qualityIssues(c.id, state.snapshot), "company-quality");
  else
    body = `<div class="metrics">${metric("Critical roles", s.total, "Dalam perusahaan ini", "users")}${metric("Ready Now coverage", s.coverage === null ? "—" : s.coverage + "%", `${s.covered} dari ${s.assessed} role yang dapat dinilai`, "chart")}${metric("Confirmed gaps", s.gaps, "Tidak memiliki successor Ready Now", "alert", "red")}${metric("Readiness Unknown", s.unknown, "Evidence belum mencukupi", "info", "neutral")}</div><div class="detail-grid">${roleTable(list.filter((r) => r.critical).slice(0, 6), "company-overview")}${panel("Informasi Perusahaan", `<div class="panel-pad"><div class="company-mark">${avatar(c.initials)}<strong>${e(c.name)}</strong></div><dl class="facts"><dt>Nama badan usaha</dt><dd>${e(c.legal)}</dd><dt>Sektor</dt><dd>${e(c.sector)}</dd><dt>Lokasi</dt><dd>${e(c.city)}</dd><dt>Talent terpetakan</dt><dd>${talents.filter((t) => t.companyId === c.id).length} profil profesional</dd></dl>${link("/roles", "Lihat seluruh jabatan →", { company: c.id }, "btn primary full")}${link("/quality", "Tinjau kualitas data", { company: c.id }, "btn full")}</div>`)}</div>`;
  return (
    header(
      c.name,
      c.legal + " · " + c.sector + " · " + c.city,
      favorite("company", c.id),
    ) +
    tabs(
      [
        ["overview", "Overview"],
        ["roles", "Roles"],
        ["talent", "Talent"],
        ["succession", "Succession"],
        ["quality", "Data Quality"],
      ],
      tab,
    ) +
    body
  );
}
