import { state } from "../../state/store.js";
import { route, url } from "../../router.js";
import { competencies } from "../../data/roles.js";
import { bands } from "../../data/assessments.js";
import {
  getRole,
  getCompany,
  roleStats,
  inScope,
} from "../../services/portfolio.js";
import { matches } from "../../services/matching.js";
import {
  header,
  metric,
  tabs,
  panel,
  link,
  action,
  e,
  badge,
  favorite,
  note,
  empty,
  evidenceButton,
  date,
} from "../../components/ui.js";
import {
  filters,
  selectQuery,
  searchFilter,
} from "../../components/filters.js";
import {
  candidateTable,
  companyOptions,
} from "../../components/entity-tables.js";
export function comparisonTray(role) {
  const s = state.selection;
  if (s.role !== role.id || s.snapshot !== state.snapshot || !s.ids.length)
    return "";
  const all = matches(role, state.snapshot);
  return `<div class="compare-tray"><strong>${s.ids.length} kandidat dipilih</strong><div class="tray-people">${s.ids
    .map((id) => {
      const a = all.find((a) => a.talentId === id);
      return a
        ? action(
            "remove-selection",
            e(a.talent.name) + " ×",
            "",
            "chip",
            `data-id="${id}"`,
          )
        : "";
    })
    .join(
      "",
    )}</div>${action("clear-selection", "Bersihkan", "", "text-btn")}${action("compare", "Bandingkan kandidat", "arrow", "btn primary", `data-role="${role.id}"`)}</div>`;
}
export default function () {
  const r = route(),
    role = getRole(r.parts[1]);
  if (!role)
    return note(
      "Jabatan tidak ditemukan. " + link("/roles", "Kembali ke Roles"),
      "amber",
    );
  const c = getCompany(role.companyId),
    tab = r.params.tab || "overview",
    s = roleStats(role, state.snapshot),
    all = matches(role, state.snapshot);
  let body = "";
  const requirements = `<table><caption class="sr-only">Requirement ${e(role.canonical)}</caption><thead><tr><th>Kompetensi</th><th>Required level</th><th>Evidence</th></tr></thead><tbody>${competencies.map((n, i) => `<tr><td>${e(n)}</td><td>${role.unresolved ? "—" : role.required[i] + " / 5"}</td><td>${evidenceButton(role.id, "", "Why / Evidence")}</td></tr>`).join("")}</tbody></table>`;
  const identity = `<div class="panel-pad"><dl class="facts"><dt>Jabatan</dt><dd>${e(role.canonical)}</dd><dt>BUMN</dt><dd>${link("/companies/" + c.id, e(c.name))}</dd><dt>Grade</dt><dd>${role.unresolved ? "Belum terselesaikan" : role.grade}</dd><dt>Job Value</dt><dd>${role.unresolved ? "—" : role.jobValue}</dd><dt>Snapshot</dt><dd>${date(state.snapshot)}</dd><dt>Slate tercatat</dt><dd>${s.slate.length} kandidat</dd></dl>${link("/roles/" + role.id, "Lihat matching candidates", { tab: "candidates" }, "btn primary full")}</div>`;
  if (["candidates", "succession"].includes(tab) && state.access === "reader")
    body = note(
      "Akses penilaian kandidat terbatas untuk Portfolio Reader. Gunakan menu profil untuk memilih mode Analyst pada workspace ilustratif ini.",
      "amber",
    );
  else if (tab === "candidates") {
    let candidates = searchFilter(all, r.params.q, [
      (a) => a.talent.name,
      (a) => getCompany(a.talent.companyId).name,
    ]);
    for (const [key, field] of [
      ["band", "readiness"],
      ["confidence", "confidence"],
      ["eligibility", "eligible"],
    ])
      if (r.params[key])
        candidates = candidates.filter((a) => a[field] === r.params[key]);
    if (r.params.pool)
      candidates = candidates.filter(
        (a) => a.talent.companyId === r.params.pool,
      );
    body =
      note(
        "Target role: " +
          e(role.canonical) +
          " · " +
          e(c.name) +
          ". Urutan awal: eligibility → readiness → fit dalam readiness band. Role Fit bukan probabilitas sukses.",
      ) +
      filters({
        placeholder: "Cari nama kandidat atau BUMN…",
        selects: [
          selectQuery("eligibility", "Eligibility", [
            "Eligible",
            "Under review",
            "Not eligible",
          ]),
          selectQuery("band", "Readiness", bands),
          selectQuery("confidence", "Confidence", [
            "High",
            "Medium",
            "Insufficient",
            "Conflict",
          ]),
          selectQuery("pool", "Candidate pool", companyOptions),
        ],
      }) +
      candidateTable(role, candidates) +
      comparisonTray(role);
  } else if (tab === "succession") {
    body =
      `<div class="metrics">${metric("Slate tercatat", s.slate.length, "Kandidat pada snapshot", "users")}${metric("Ready Now", s.now ?? "—", s.unknown ? "Belum dapat ditentukan" : "Successor untuk target role", "check", "green")}${metric("Near-term", s.near ?? "—", "Ready in 1–2 years", "clock")}${metric("Criticality", role.criticality, "Prioritas role", "target", "red")}</div>` +
      (s.unknown
        ? note(
            "Readiness belum dapat ditentukan. Evidence belum cukup untuk menyimpulkan ketersediaan successor.",
            "amber",
          )
        : s.now === 0
          ? note(
              "Tidak ada successor Ready Now pada snapshot ini. Tinjau kandidat near-term dan development yang diperlukan.",
              "amber",
            )
          : "") +
      `<div class="detail-grid reverse">${panel("Ringkasan Role", identity) + panel("Required Competencies", requirements)}<div>${note("Successor slate tercatat pada snapshot ini; bukan seluruh matching pool.")}<div class="stack">${
        bands
          .slice(0, 4)
          .map((b) => {
            const group = all.filter((a) => a.slate && a.readiness === b);
            return group.length
              ? `<section class="slate-group"><h2>${badge(b)} <span>${group.length} kandidat</span></h2>${candidateTable(role, group, "slate-" + bands.indexOf(b))}</section>`
              : "";
          })
          .join("") ||
        empty(
          s.unknown
            ? "Slate belum dapat ditentukan"
            : "Belum ada successor tercatat",
          "Lihat matching pool untuk memeriksa kandidat dan evidence.",
          link(
            "/roles/" + role.id,
            "Lihat candidates",
            { tab: "candidates" },
            "btn primary",
          ),
        )
      }</div></div></div>` +
      comparisonTray(role);
  } else if (tab === "requirements")
    body = panel(
      "Role Success Profile",
      `<div class="panel-pad"><p>${e(role.purpose)}</p>${note("Skala kompetensi 1–5. Nilai aktual kandidat ditampilkan terpisah pada evaluasi target role.")}</div>` +
        requirements,
    );
  else if (tab === "evidence")
    body = panel(
      "Evidence & Snapshot",
      `<div class="panel-pad"><p>Requirement, job value, dan assessment menggunakan snapshot ${date(state.snapshot)}.</p>${evidenceButton(role.id)}<dl class="facts"><dt>Policy reference</dt><dd>DHCE-RSP-2026.3</dd><dt>Last review</dt><dd>${date(role.review)}</dd><dt>Kualitas sumber</dt><dd>${badge(role.conflict ? "Conflict" : s.unknown ? "Insufficient" : "Verified")}</dd></dl>${link("/quality", "Lihat isu kualitas data terkait", { q: role.title, company: role.companyId }, "btn")}</div>`,
    );
  else
    body = `<div class="detail-grid">${panel("Mandat & Konteks Jabatan", `<div class="panel-pad"><p class="lead">${e(role.purpose)}</p><h3>Prioritas kepemimpinan</h3><ul class="readable-list"><li>Menghubungkan strategi fungsi dengan agenda transformasi perusahaan.</li><li>Mengelola skala tanggung jawab dan stakeholder lintas entitas.</li><li>Memastikan tata kelola, evidence, dan kesinambungan leadership.</li></ul><div class="inline-actions">${link("/roles/" + role.id, "Tinjau succession", { tab: "succession" }, "btn primary")}${link("/roles/" + role.id, "Lihat candidates", { tab: "candidates" }, "btn")}</div></div>`)}${panel("Identitas Role", identity)}</div>${panel("Required Competencies", requirements)}`;
  return (
    header(
      role.title + " · " + c.name,
      role.canonical +
        " · " +
        (role.unresolved ? "Grade belum ditetapkan" : "Grade " + role.grade) +
        " · " +
        role.family,
      favorite("role", role.id),
    ) +
    (role.conflict
      ? note(
          "Terdapat konflik material pada evidence. Penilaian yang belum dapat didukung ditahan sampai sumber direkonsiliasi.",
          "red",
        )
      : "") +
    (!inScope(role.companyId, state.scope)
      ? note(
          "Objek ini berada di luar scope header. Identitas role tetap; " +
            link("/roles", "kembali ke daftar dalam scope aktif") +
            ".",
        )
      : "") +
    tabs(
      [
        ["overview", "Overview"],
        ["requirements", "Requirements"],
        ["succession", "Succession"],
        ["candidates", "Candidates"],
        ["evidence", "Evidence & History"],
      ],
      tab,
    ) +
    body
  );
}
