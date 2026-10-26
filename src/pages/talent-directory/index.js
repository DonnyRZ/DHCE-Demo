import { talents } from "../../data/talents.js";
import { state } from "../../state/store.js";
import { inScope, getCompany } from "../../services/portfolio.js";
import { route } from "../../router.js";
import { header, listActions } from "../../components/ui.js";
import {
  filters,
  selectQuery,
  searchFilter,
} from "../../components/filters.js";
import { talentTable, companyOptions } from "../../components/entity-tables.js";
export default function () {
  const q = route().params;
  let rows = searchFilter(
    talents.filter((t) => inScope(t.companyId, state.scope)),
    q.q,
    ["name", "title", "experience", (t) => getCompany(t.companyId).name],
  );
  if (q.company) rows = rows.filter((t) => t.companyId === q.company);
  if (q.family) rows = rows.filter((t) => t.family === q.family);
  if (q.experience) rows = rows.filter((t) => t.years >= Number(q.experience));
  if (q.confidence) rows = rows.filter((t) => t.confidence === q.confidence);
  return (
    header(
      "Talent Directory",
      "Profil profesional, pengalaman, dan kualitas evidence lintas BUMN.",
      listActions(),
      { compact: true },
    ) +
    filters({
      placeholder: "Cari nama, jabatan, atau BUMN…",
      selects: [
        selectQuery("company", "BUMN", companyOptions),
        selectQuery("family", "Job Family", [
          ...new Set(talents.map((t) => t.family)),
        ]),
        selectQuery("experience", "Pengalaman", [
          ["10", "10 tahun+"],
          ["15", "15 tahun+"],
        ]),
        selectQuery("confidence", "Confidence", [
          "High",
          "Medium",
          "Insufficient",
        ]),
      ],
    }) +
    talentTable(rows)
  );
}
