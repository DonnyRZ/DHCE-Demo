import { e, action, icon } from "./ui.js";
import { route } from "../router.js";
export function selectQuery(key, label, options, value) {
  const q = route().params;
  const current = value ?? q[key] ?? "";
  return `<label class="filter-select"><span>${e(label)}</span><select data-query="${key}" aria-label="${e(label)}"><option value="">Semua ${e(label)}</option>${options
    .map((o) => {
      const [v, t] = Array.isArray(o) ? o : [o, o];
      return `<option value="${e(v)}" ${String(current) === String(v) ? "selected" : ""}>${e(t)}</option>`;
    })
    .join("")}</select></label>`;
}
export function filters({
  placeholder = "Cari dalam daftar…",
  selects = [],
  extra = "",
  search = true,
} = {}) {
  const q = route().params;
  const names = {
    sector: "Sektor",
    company: "BUMN",
    grade: "Grade",
    family: "Family",
    critical: "Critical only",
    band: "Readiness",
    confidence: "Confidence",
    eligibility: "Eligibility",
    kind: "Jenis isu",
    coverage: "Coverage",
    experience: "Pengalaman",
    preset: "View",
    pool: "Candidate pool",
  };
  const chips = Object.entries(q).filter(
    ([k, v]) => v && ["q", ...Object.keys(names)].includes(k),
  );
  return `<div class="filter-panel"><div class="filter-row">${search ? `<label class="search-input">${icon("search")}<span class="sr-only">Cari dalam daftar</span><input data-query="q" data-focus="list-search" placeholder="${e(placeholder)}" value="${e(q.q || "")}"></label>` : ""}${selects.join("")}${extra}</div>${chips.length ? `<div class="filter-chips"><span>Filter aktif</span>${chips.map(([k, v]) => action("remove-filter", e((names[k] || "Cari") + ": " + v) + " " + icon("close"), "", "chip", `data-key="${e(k)}"`)).join("")}${action("clear-filters", "Hapus semua", "", "text-btn")}</div>` : ""}</div>`;
}
export function searchFilter(rows, q, fields) {
  if (!q) return rows;
  const norm = (s) =>
    String(s)
      .toLocaleLowerCase("id")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const terms = norm(q).split(/\s+/).filter(Boolean);
  return rows.filter((r) =>
    terms.every((t) =>
      fields.some((f) =>
        norm(typeof f === "function" ? f(r) : r[f]).includes(t),
      ),
    ),
  );
}
