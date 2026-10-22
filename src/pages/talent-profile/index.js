import { state } from "../../state/store.js";
import { route } from "../../router.js";
import { roles, competencies } from "../../data/roles.js";
import { getTalent, getRole, getCompany } from "../../services/portfolio.js";
import { matches, gaps, recommendations } from "../../services/matching.js";
import {
  header,
  tabs,
  panel,
  link,
  action,
  e,
  badge,
  avatar,
  favorite,
  note,
  date,
  evidenceButton,
  progress,
  empty,
} from "../../components/ui.js";
export default function () {
  const r = route(),
    t = getTalent(r.parts[1]);
  if (!t)
    return note(
      "Talent tidak ditemukan. " + link("/talent", "Kembali ke directory"),
      "amber",
    );
  const tab = r.params.tab || "experience",
    role = getRole(r.params.target),
    a = role
      ? matches(role, state.snapshot).find((a) => a.talentId === t.id)
      : null;
  let body = "";
  const roleSelector = `<label class="target-selector">Target role<select data-query="target" aria-label="Target role"><option value="">Pilih target role untuk evaluasi</option>${roles
    .filter((r) => r.critical)
    .map(
      (x) =>
        `<option value="${x.id}" ${role?.id === x.id ? "selected" : ""}>${e(x.title)} · ${e(getCompany(x.companyId).name)}</option>`,
    )
    .join("")}</select></label>`;
  if (state.access === "reader" && tab !== "experience")
    body = note(
      "Informasi assessment dan penilaian kandidat memerlukan akses Analyst. Profil profesional tetap tersedia.",
      "amber",
    );
  else if (tab === "target") {
    body = panel(
      "Evaluate against a role",
      `<div class="panel-pad">${roleSelector}</div>`,
    );
    if (a) {
      const g = gaps(role, a);
      body +=
        note(
          "Target: " +
            e(role.canonical) +
            " · " +
            e(getCompany(role.companyId).name) +
            " · Snapshot " +
            date(state.snapshot),
        ) +
        `<div class="evaluation">${[
          ["Eligibility", badge(a.eligible)],
          ["Readiness", badge(a.readiness)],
          ["Role Fit", a.fit === null ? "—" : progress(a.fit)],
          ["Data Confidence", badge(a.confidence)],
        ]
          .map(([l, v]) => `<div><span>${l}</span><strong>${v}</strong></div>`)
          .join("")}</div>` +
        (a.fit === null
          ? note(
              "Evidence belum cukup untuk menetapkan hasil. Unknown tidak berarti Not Ready. " +
                evidenceButton(role.id, t.id, "Tinjau evidence"),
              "amber",
            )
          : "") +
        `<div class="two-columns">${panel("Kesenjangan Kompetensi", g === null ? empty("Assessment belum mencukupi", "Periksa field evidence yang belum tersedia.", evidenceButton(role.id, t.id)) : g.length ? `<table><thead><tr><th>Kompetensi</th><th>Required</th><th>Actual</th><th>Gap</th></tr></thead><tbody>${g.map((x) => `<tr><td>${e(x.name)}</td><td>${x.required}</td><td>${x.actual}</td><td>${badge(String(x.gap), "red")}</td></tr>`).join("")}</tbody></table>` : '<p class="panel-pad">Tidak ada gap material pada kompetensi target role.</p>')}${panel(
          "Development Recommendations",
          `<div class="panel-pad">${
            recommendations(role, a)
              .map(
                (x, i) =>
                  `<article class="development-card"><span class="eyebrow">${e(x.name)} · Gap ${x.gap}</span><h3>${e(x.title)}</h3><p>${e(x.exposure)}</p><small>Expected evidence: ${e(x.evidence)}</small>${action("development", "Tinjau rekomendasi", "arrow", "text-btn", `data-role="${role.id}" data-talent="${t.id}" data-index="${i}"`)}</article>`,
              )
              .join("") ||
            "<p>Lengkapi evidence untuk menyusun intervensi yang terarah, atau pilih target role lain.</p>"
          }${note("Rekomendasi adalah usulan. Readiness ditinjau ulang setelah reassessment; selesai assignment tidak otomatis mengubah readiness.")}</div>`,
        )}</div>`;
    } else
      body += empty(
        "Pilih target role",
        "Fit, readiness, dan development selalu dinilai terhadap jabatan tertentu.",
        "",
      );
  } else if (tab === "competency")
    body = panel(
      "Competency Evidence",
      `<table><thead><tr><th>Kompetensi</th><th>Level evidence profesional</th></tr></thead><tbody>${competencies.map((n, i) => `<tr><td>${e(n)}</td><td>${t.confidence === "Insufficient" ? "Belum dapat ditentukan" : t.levels[i] + " / 5"}</td></tr>`).join("")}</tbody></table><div class="panel-pad">${link("/talent/" + t.id, "Evaluasi terhadap target role", { tab: "target" }, "btn primary")}</div>`,
    );
  else if (tab === "assessments" || tab === "evidence")
    body = panel(
      tab === "assessments" ? "Assessment History" : "Evidence Profesional",
      `<div class="panel-pad"><p>Assessment kepemimpinan, riwayat penugasan, dan reference pengalaman untuk ${e(t.name)}.</p><dl class="facts"><dt>Data Confidence</dt><dd>${badge(t.confidence)}</dd><dt>Updated</dt><dd>${date(t.updated)}</dd><dt>Education</dt><dd>${e(t.education)}</dd></dl>${role ? evidenceButton(role.id, t.id) : note("Pilih target role untuk menelusuri assessment dan evidence penilaian.")}${link("/talent/" + t.id, "Pilih target role", { tab: "target" }, "btn")}</div>`,
    );
  else
    body = `<div class="detail-grid">${panel("Career Experience", `<div class="timeline">${t.trajectory.map((x) => `<article><span>${e(x.year)}</span><h3>${e(x.role)}</h3><p>${e(getCompany(t.companyId).name)} · ${e(t.experience)}</p></article>`).join("")}</div>`)}${panel("Professional Profile", `<div class="panel-pad"><dl class="facts"><dt>Pengalaman</dt><dd>${t.years} tahun</dd><dt>Grade / Scope</dt><dd>Grade ${t.grade} · Enterprise</dd><dt>Education</dt><dd>${e(t.education)}</dd><dt>Evidence updated</dt><dd>${date(t.updated)}</dd><dt>Data Confidence</dt><dd>${badge(t.confidence)}</dd></dl>${link("/talent/" + t.id, "Evaluate against a role", { tab: "target" }, "btn primary full")}</div>`)}</div>`;
  return (
    `<div class="profile-header">${avatar(t.name)}<div>${header(t.name, t.title + " · " + getCompany(t.companyId).name + " · Grade " + t.grade, favorite("talent", t.id))}</div></div>` +
    tabs(
      [
        ["experience", "Experience"],
        ["competency", "Competency"],
        ["assessments", "Assessments"],
        ["target", "Target Role"],
        ["evidence", "Evidence"],
      ],
      tab,
    ) +
    body
  );
}
