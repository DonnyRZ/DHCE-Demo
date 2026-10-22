import { state, save } from "./state/store.js";
import { route, url } from "./router.js";
import { companies, sectors, snapshots } from "./data/companies.js";
import { sidebar } from "./components/sidebar.js";
import { appHeader } from "./components/header.js";
import { initializeDialog, toast } from "./components/dialog.js";
import { tables } from "./components/data-table.js";
import { e, link, note, action } from "./components/ui.js";
import { initializeViews } from "./services/saved-views.js";
import { setupActions } from "./services/actions.js";
import overview from "./pages/overview/index.js";
import companiesPage from "./pages/company-directory/index.js";
import companyPage from "./pages/company-detail/index.js";
import rolesPage from "./pages/role-directory/index.js";
import rolePage from "./pages/role-detail/index.js";
import talentsPage from "./pages/talent-directory/index.js";
import talentPage from "./pages/talent-profile/index.js";
import comparePage from "./pages/candidate-comparison/index.js";
import risksPage from "./pages/succession-risks/index.js";
import qualityPage from "./pages/data-quality/index.js";
const destinations = {
  overview,
  companies: companiesPage,
  roles: rolesPage,
  talent: talentsPage,
  compare: comparePage,
  risks: risksPage,
  quality: qualityPage,
};
const labels = {
  overview: "Overview",
  companies: "Companies",
  roles: "Roles",
  talent: "Talent",
  compare: "Candidate Comparison",
  risks: "Succession Risks",
  quality: "Data Quality",
};
let previousPath = "",
  previousHash = "",
  scrolls = new Map();
function render() {
  const active = document.activeElement,
    focus = active?.dataset.focus,
    selection = focus ? [active.selectionStart, active.selectionEnd] : null;
  const r = route();
  if (previousHash) scrolls.set(previousHash, window.scrollY);
  if (r.params.viewCols) {
    try {
      const incoming = JSON.parse(r.params.viewCols);
      if (incoming && typeof incoming === "object" && !Array.isArray(incoming))
        for (const [key, values] of Object.entries(incoming))
          if (
            /^[\w-]+$/.test(key) &&
            Array.isArray(values) &&
            values.every((v) => typeof v === "string" && /^[\w-]+$/.test(v))
          )
            state.columns[key] = values;
    } catch {
      /* Invalid shared preferences use local defaults. */
    }
    const q = new URLSearchParams(r.params);
    q.delete("viewCols");
    history.replaceState(null, "", "#" + r.path + "?" + q);
  }
  const allowed = [
    "all",
    ...companies.map((c) => c.id),
    ...sectors.map((s) => "sector:" + s),
  ];
  if (r.params.scope && allowed.includes(r.params.scope))
    state.scope = r.params.scope;
  if (r.params.snapshot && snapshots.includes(r.params.snapshot))
    state.snapshot = r.params.snapshot;
  if (!allowed.includes(state.scope)) state.scope = "all";
  if (!snapshots.includes(state.snapshot)) state.snapshot = snapshots[0];
  if (!["analyst", "reader"].includes(state.access)) state.access = "analyst";
  const kind = r.parts[0] || "overview";
  const page =
    kind === "companies" && r.parts[1]
      ? companyPage
      : kind === "roles" && r.parts[1]
        ? rolePage
        : kind === "talent" && r.parts[1]
          ? talentPage
          : destinations[kind];
  tables.clear();
  let content;
  try {
    content = page
      ? page()
      : `<div class="empty"><h1>Halaman tidak ditemukan</h1><p>Gunakan navigasi utama untuk kembali ke workspace.</p>${link("/overview", "Kembali ke Overview", {}, "btn primary")}</div>`;
  } catch (error) {
    console.error(error);
    content = `<h1>Halaman belum dapat dimuat</h1>${note("Terjadi kesalahan saat menampilkan data. Coba muat kembali halaman.", "red")}${action("retry", "Coba lagi", "refresh", "btn primary")}`;
  }
  document.title = (labels[kind] || "Workspace") + " · DHCE";
  document.body.classList.toggle("compact", state.density === "compact");
  document.querySelector("#app").innerHTML =
    sidebar() +
    `<div class="workspace">${appHeader()}<main id="main" tabindex="-1"><div class="breadcrumb">${link("/overview", "Home")}<span>/</span>${r.parts[1] ? link("/" + kind, labels[kind] || "Workspace") + "<span>/</span><span>Detail</span>" : `<span>${e(labels[kind] || "Workspace")}</span>`}<span class="as-of">As of ${e(state.snapshot)}</span></div>${state.snapshot !== snapshots[0] ? note("Anda melihat snapshot historis. " + action("latest", "Kembali ke terbaru", "", "text-btn")) : ""}${content}<footer class="workspace-footer"><span>DHCE · Leadership intelligence</span>${action("about", "Tentang workspace", "info", "text-btn")}</footer></main></div>`;
  if (focus && r.path === previousPath) {
    const input = document.querySelector(`[data-focus="${CSS.escape(focus)}"]`);
    input?.focus({ preventScroll: true });
    if (input && selection && typeof input.setSelectionRange === "function")
      input.setSelectionRange(...selection);
  } else if (previousPath && r.path !== previousPath) {
    document.querySelector("main").focus({ preventScroll: true });
    window.scrollTo(0, scrolls.get(location.hash) || 0);
  }
  previousPath = r.path;
  previousHash = location.hash;
  const h = document.querySelector("h1");
  if (h) {
    state.recent = [
      { hash: location.hash || "#/overview", title: h.textContent },
      ...state.recent.filter((x) => x.hash !== location.hash),
    ].slice(0, 8);
    save();
  }
}
initializeViews();
initializeDialog();
setupActions(render);
window.addEventListener("hashchange", () => {
  const overlay = document.querySelector("#overlay");
  if (overlay.open) overlay.close();
  render();
});
render();
