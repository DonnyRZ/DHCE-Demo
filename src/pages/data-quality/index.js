import { state } from "../../state/store.js";
import { route } from "../../router.js";
import {
  qualityIssues,
  qualityMetrics,
  getCompany,
} from "../../services/portfolio.js";
import { header, metric, listActions } from "../../components/ui.js";
import {
  filters,
  selectQuery,
  searchFilter,
} from "../../components/filters.js";
import {
  qualityTable,
  companyOptions,
} from "../../components/entity-tables.js";
export default function () {
  const q = route().params;
  let rows = searchFilter(qualityIssues(state.scope, state.snapshot), q.q, [
    "object",
    "title",
    "impact",
    (r) => getCompany(r.companyId).name,
  ]);
  if (q.kind) rows = rows.filter((r) => r.kind === q.kind);
  if (q.company) rows = rows.filter((r) => r.companyId === q.company);
  return (
    header(
      "Data Quality",
      "Pastikan evidence cukup, terkini, dan dapat ditelusuri untuk analisis leadership.",
      listActions(),
      { compact: true },
    ) +
    `<div class="metrics">${qualityMetrics(state.scope, state.snapshot)
      .map((m) =>
        metric(
          m.label,
          m.total ? Math.round((m.count / m.total) * 100) + "%" : "—",
          `${m.count} dari ${m.total} role`,
          "shield",
          m.tone,
        ),
      )
      .join("")}</div>` +
    filters({
      placeholder: "Cari isu, role, atau BUMN…",
      selects: [
        selectQuery("kind", "Jenis isu", [
          ["Missing", "Evidence belum cukup"],
          ["Conflict", "Konflik"],
          ["Stale", "Data stale"],
        ]),
        selectQuery("company", "BUMN", companyOptions),
      ],
    }) +
    qualityTable(rows)
  );
}
