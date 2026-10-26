import { companies, sectors } from "../../data/companies.js";
import { state } from "../../state/store.js";
import { inScope, scopedRoles, summary } from "../../services/portfolio.js";
import { route } from "../../router.js";
import { header, listActions } from "../../components/ui.js";
import {
  filters,
  selectQuery,
  searchFilter,
} from "../../components/filters.js";
import { companyTable } from "../../components/entity-tables.js";
export default function () {
  const q = route().params;
  let rows = companies
    .filter((c) => inScope(c.id, state.scope))
    .map((c) => ({ ...c, stats: summary(scopedRoles(c.id), state.snapshot) }));
  rows = searchFilter(rows, q.q, ["name", "legal", "sector"]);
  if (q.sector) rows = rows.filter((c) => c.sector === q.sector);
  if (q.coverage)
    rows = rows.filter((c) =>
      q.coverage === "unknown"
        ? c.stats.unknown > 0
        : q.coverage === "low"
          ? (c.stats.coverage ?? 101) < 50
          : (c.stats.coverage ?? 0) >= 50,
    );
  return (
    header(
      "Companies",
      "Temukan dan bandingkan kondisi leadership lintas BUMN.",
      listActions(),
      { compact: true },
    ) +
    filters({
      placeholder: "Cari BUMN atau sektor…",
      selects: [
        selectQuery("sector", "Sektor", sectors),
        selectQuery("coverage", "Coverage", [
          ["low", "Di bawah 50%"],
          ["high", "50% ke atas"],
          ["unknown", "Ada unknown readiness"],
        ]),
      ],
    }) +
    companyTable(rows)
  );
}
