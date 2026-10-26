import { roles } from "../../data/roles.js";
import { state } from "../../state/store.js";
import { scopedRoles, getCompany } from "../../services/portfolio.js";
import { route } from "../../router.js";
import { header, listActions, action } from "../../components/ui.js";
import {
  filters,
  selectQuery,
  searchFilter,
} from "../../components/filters.js";
import { roleTable, companyOptions } from "../../components/entity-tables.js";
export function filterRoles(rows, q) {
  rows = searchFilter(rows, q.q, [
    "title",
    "canonical",
    "family",
    (r) => getCompany(r.companyId).name,
  ]);
  if (q.company) rows = rows.filter((r) => r.companyId === q.company);
  if (q.grade) rows = rows.filter((r) => r.grade >= Number(q.grade));
  if (q.critical) rows = rows.filter((r) => r.critical);
  if (q.family) rows = rows.filter((r) => r.family === q.family);
  return rows;
}
export default function () {
  const q = route().params;
  const rows = filterRoles(scopedRoles(state.scope), q);
  return (
    header(
      "Role Directory",
      "Arsitektur jabatan, requirement, dan ketersediaan successor.",
      listActions(),
      { compact: true },
    ) +
    `<div class="segmented">${action("critical-toggle", "Semua Jabatan", "", "btn " + (!q.critical ? "selected" : ""), 'data-value=""')}${action("critical-toggle", "Critical Only", "", "btn " + (q.critical ? "selected" : ""), 'data-value="1"')}</div>` +
    filters({
      placeholder: "Cari jabatan, canonical role, atau BUMN…",
      selects: [
        selectQuery("family", "Job Family", [
          ...new Set(roles.map((r) => r.family)),
        ]),
        selectQuery("grade", "Grade", [
          ["15", "Grade 15+"],
          ["14", "Grade 14+"],
        ]),
        selectQuery("company", "BUMN", companyOptions),
      ],
    }) +
    roleTable(rows)
  );
}
