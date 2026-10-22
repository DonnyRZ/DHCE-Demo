import { state } from "../../state/store.js";
import { route } from "../../router.js";
import { getRole, getCompany } from "../../services/portfolio.js";
import { competencies } from "../../data/roles.js";
import { matches, gaps } from "../../services/matching.js";
import {
  header,
  link,
  action,
  e,
  badge,
  avatar,
  note,
  empty,
  evidenceButton,
  progress,
  date,
} from "../../components/ui.js";
export default function () {
  const r = route(),
    role = getRole(r.params.role);
  if (!role)
    return (
      header("Candidate Comparison") +
      empty(
        "Pilih role terlebih dahulu",
        "Perbandingan menggunakan satu target role dan snapshot yang sama.",
        link("/roles", "Buka Roles", {}, "btn primary"),
      )
    );
  if (state.access === "reader")
    return (
      header("Candidate Comparison") +
      note("Akses penilaian kandidat memerlukan mode Analyst.", "amber")
    );
  const ids = [...new Set((r.params.ids || "").split(",").filter(Boolean))],
    all = matches(role, state.snapshot),
    candidates = ids
      .map((id) => all.find((a) => a.talentId === id))
      .filter(Boolean);
  if (
    candidates.length < 2 ||
    candidates.length > 4 ||
    candidates.length !== ids.length
  )
    return (
      header("Candidate Comparison") +
      empty(
        "Pilih 2–4 kandidat yang valid",
        "Semua kandidat harus berasal dari matching pool target role ini.",
        link(
          "/roles/" + role.id,
          "Pilih candidates",
          { tab: "candidates" },
          "btn primary",
        ),
      )
    );
  const rows = [
    ["Eligibility", (a) => badge(a.eligible), (a) => a.eligible],
    ["Readiness", (a) => badge(a.readiness), (a) => a.readiness],
    ["Role Fit", (a) => (a.fit === null ? "—" : progress(a.fit)), (a) => a.fit],
    ["Data Confidence", (a) => badge(a.confidence), (a) => a.confidence],
    ...[
      "Competency Fit",
      "Critical Experience Fit",
      "Responsibility Scale Fit",
      "Leadership Evidence Fit",
      "Job Context Fit",
    ].map((name, i) => [
      name,
      (a) => (a.componentFit === null ? "—" : progress(a.componentFit[i])),
      (a) => a.componentFit?.[i] ?? null,
    ]),
    ...competencies.map((n, i) => [
      n + " · Required " + role.required[i],
      (a) =>
        a.actual === null
          ? "—"
          : `${a.actual[i]} / ${role.required[i]} ${a.actual[i] < role.required[i] ? badge("Gap " + (role.required[i] - a.actual[i]), "red") : ""}`,
      (a) => a.actual?.[i] ?? null,
    ]),
    [
      "Critical Experience",
      (a) =>
        `<strong>${a.talent.years} tahun</strong><small>${e(a.talent.experience)}</small>`,
      (a) => a.talent.years,
    ],
    [
      "Key Gaps",
      (a) => {
        const g = gaps(role, a);
        return g === null
          ? "Evidence belum cukup"
          : g.length
            ? g.map((x) => e(x.name)).join("<br>")
            : "Tidak ada gap material";
      },
      (a) => JSON.stringify(gaps(role, a)),
    ],
    [
      "Development Focus",
      (a) =>
        link("/talent/" + a.talentId, "Lihat rekomendasi →", {
          tab: "target",
          target: role.id,
        }),
      (a) => JSON.stringify(gaps(role, a)),
    ],
    ["Evidence", (a) => evidenceButton(role.id, a.talentId), (a) => a.talentId],
    [
      "Compliance",
      (a) =>
        action(
          "compliance",
          "Lihat status terpisah",
          "shield",
          "text-btn",
          `data-talent="${a.talentId}"`,
        ),
      (a) => a.eligible,
    ],
  ];
  const diff = r.params.diff === "1";
  const visible = diff
    ? rows.filter(
        ([, render, val]) => new Set(candidates.map((a) => val(a))).size > 1,
      )
    : rows;
  return (
    header(
      "Perbandingan Kandidat — " + role.canonical,
      getCompany(role.companyId).name +
        " · Grade " +
        role.grade +
        " · " +
        date(state.snapshot),
      action(
        "change-candidates",
        "Ganti kandidat",
        "users",
        "btn",
        `data-role="${role.id}"`,
      ) + action("print", "Ekspor ringkasan", "download", "btn primary"),
    ) +
    note(
      "Role Fit adalah kesesuaian requirement, bukan probabilitas sukses. Penilaian sistem bukan keputusan pengangkatan.",
    ) +
    `<div class="compare-controls">${link("/roles/" + role.id, "← Kembali ke candidates", { tab: "candidates" })}<label class="switch"><input type="checkbox" data-query="diff" ${diff ? "checked" : ""}> Hanya perbedaan</label></div><div class="comparison-scroll" tabindex="0" role="region" aria-label="Perbandingan kandidat"><table class="comparison"><caption class="sr-only">Perbandingan untuk ${e(role.canonical)} · ${e(getCompany(role.companyId).name)}</caption><thead><tr><th scope="col">Aspek Penilaian</th>${candidates.map((a) => `<th scope="col"><div class="comparison-person">${avatar(a.talent.name, true)}<span>${link("/talent/" + a.talentId, e(a.talent.name), { target: role.id, tab: "target" })}<small>${e(getCompany(a.talent.companyId).name)}</small></span>${action("remove-compare", "×", "", "icon-btn", `data-id="${a.talentId}" aria-label="Hapus ${e(a.talent.name)} dari comparison"`)}</div></th>`).join("")}</tr></thead><tbody>${visible.map(([label, render]) => `<tr><th scope="row">${e(label)}</th>${candidates.map((a) => `<td data-candidate="${e(a.talent.name)}">${render(a)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
  );
}
