import { state } from "../../state/store.js";
import { route } from "../../router.js";
import { scopedRoles, summary, roleStats } from "../../services/portfolio.js";
import {
  header,
  listActions,
  metric,
  link,
  note,
} from "../../components/ui.js";
import { filters, selectQuery } from "../../components/filters.js";
import { roleTable, companyOptions } from "../../components/entity-tables.js";
import { filterRoles } from "../role-directory/index.js";
export default function () {
  const q = route().params;
  const all = scopedRoles(state.scope).filter((r) => r.critical),
    s = summary(all, state.snapshot);
  let rows = filterRoles(all, q);
  if (q.preset)
    rows = rows.filter((r) => {
      const x = roleStats(r, state.snapshot);
      return (
        {
          gap: !x.unknown && x.now === 0,
          covered: x.now > 0,
          unknown: x.unknown,
          nosuccessor: !x.unknown && !x.slate.length,
          stale: r.stale,
          critical: r.criticality === "Critical",
          vacancy: !!r.vacancy,
        }[q.preset] ?? true
      );
    });
  if (q.confidence)
    rows = rows.filter(
      (r) =>
        (roleStats(r, state.snapshot).unknown ? "Insufficient" : "High") ===
        q.confidence,
    );
  return (
    header(
      "Succession Risks",
      "Prioritaskan critical roles yang membutuhkan perhatian.",
      listActions(),
      { compact: true },
    ) +
    `<div class="metrics">${metric("Total Critical Roles", s.total, "Dalam scope saat ini", "users")}${metric("Confirmed gaps", s.gaps, "Role tanpa successor Ready Now", "alert", "red")}${metric("Belum dapat dinilai", s.unknown, "Evidence belum mencukupi", "info", "neutral")}${metric("Dengan Ready Now", s.covered, "Minimal satu successor Ready Now", "check", "green")}</div><nav class="preset-row" aria-label="Preset risiko">${[
      ["", "Semua"],
      ["gap", "No Ready Now"],
      ["nosuccessor", "No Successor"],
      ["critical", "High Criticality"],
      ["stale", "Stale Evidence"],
      ["unknown", "Belum Dapat Dinilai"],
      ["vacancy", "Upcoming Vacancy"],
    ]
      .map(([v, l]) =>
        link(
          "/risks",
          l,
          { ...q, preset: v, page: "1" },
          "preset " + ((q.preset || "") === v ? "active" : ""),
        ),
      )
      .join("")}</nav>` +
    filters({
      placeholder: "Cari role atau BUMN…",
      selects: [
        selectQuery("company", "BUMN", companyOptions),
        selectQuery("confidence", "Confidence", ["High", "Insufficient"]),
      ],
    }) +
    (q.preset === "unknown"
      ? note(
          "Evidence belum cukup. Belum dapat menyimpulkan ketersediaan successor; nilai kosong tidak dihitung sebagai nol.",
          "amber",
        )
      : "") +
    roleTable(rows, "risks", true)
  );
}
