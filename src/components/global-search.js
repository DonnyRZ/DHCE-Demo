import { companies } from "../data/companies.js";
import { roles } from "../data/roles.js";
import { talents } from "../data/talents.js";
import { getCompany, inScope } from "../services/portfolio.js";
import { state } from "../state/store.js";
import { viewHash } from "../services/saved-views.js";
import { showDialog } from "./dialog.js";
import { e, icon, avatar, empty } from "./ui.js";
import { url } from "../router.js";
let category = "all";
export function openSearch() {
  category = "all";
  showDialog(
    "Universal Search",
    `<label class="command-input">${icon("search")}<span class="sr-only">Pencarian global</span><input id="global-query" placeholder="Cari perusahaan, jabatan, atau talent…" autofocus autocomplete="off"></label><div class="search-categories">${[
      ["all", "Semua"],
      ["companies", "Companies"],
      ["roles", "Roles"],
      ["talent", "Talent"],
      ["views", "Saved Views"],
    ]
      .map(
        ([id, l]) =>
          `<button data-action="search-kind" data-kind="${id}" class="chip ${id === "all" ? "active" : ""}">${l}</button>`,
      )
      .join(
        "",
      )}</div><p class="muted small-text">Cari dalam scope aktif · ↑ ↓ untuk memilih · Enter untuk membuka</p><div id="search-results" aria-live="polite"></div>`,
    { wide: true },
  );
  searchResults();
}
export function setSearchKind(kind) {
  category = kind;
  document
    .querySelectorAll("[data-kind]")
    .forEach((x) => x.classList.toggle("active", x.dataset.kind === kind));
  searchResults();
}
export function searchResults() {
  const input = document.querySelector("#global-query");
  if (!input) return;
  const q = input.value.toLowerCase().trim(),
    terms = q.split(/\s+/).filter(Boolean),
    items = [];
  const match = (s) => terms.every((t) => s.toLowerCase().includes(t));
  if (category === "all" || category === "companies")
    for (const c of companies.filter((c) => inScope(c.id, state.scope)))
      if (match(c.name + " " + c.legal + " " + c.sector))
        items.push({
          label: c.name,
          detail: c.sector,
          type: "Company",
          href: url("/companies/" + c.id),
          icon: "building",
        });
  if (category === "all" || category === "roles")
    for (const r of roles.filter((r) => inScope(r.companyId, state.scope)))
      if (
        match(
          r.title +
            " " +
            r.canonical +
            " " +
            r.key +
            " " +
            getCompany(r.companyId).name,
        )
      )
        items.push({
          label: r.title,
          detail: getCompany(r.companyId).name + " · Grade " + r.grade,
          type: "Role",
          href: url("/roles/" + r.id),
          icon: "briefcase",
        });
  if (category === "all" || category === "talent")
    for (const t of talents.filter((t) => inScope(t.companyId, state.scope)))
      if (match(t.name + " " + t.title + " " + getCompany(t.companyId).name))
        items.push({
          label: t.name,
          detail: t.title + " · " + getCompany(t.companyId).name,
          type: "Talent",
          href: url("/talent/" + t.id),
          icon: "users",
        });
  if (category === "all" || category === "views")
    for (const v of state.views)
      if (match(v.name))
        items.push({
          label: v.name,
          detail: v.visibility === "team" ? "Team view" : "My view",
          type: "Saved view",
          href: viewHash(v),
          icon: "bookmark",
        });
  const recent = q
    ? ""
    : state.recent
        .slice(0, 4)
        .map(
          (x) =>
            `<a class="search-result" href="${e(x.hash)}">${icon("clock")}<span><strong>${e(x.title)}</strong><small>Recently viewed</small></span>${icon("arrow")}</a>`,
        )
        .join("");
  document.querySelector("#search-results").innerHTML =
    recent +
      items
        .slice(0, 18)
        .map(
          (x) =>
            `<a class="search-result" href="${e(x.href)}">${icon(x.icon)}<span><strong>${e(x.label)}</strong><small>${e(x.detail)}</small></span><span class="search-type">${x.type}</span>${icon("arrow")}</a>`,
        )
        .join("") ||
    empty(
      "Tidak ada hasil",
      "Coba kata kunci lain atau perluas scope perusahaan.",
      "",
    );
}
