import { state } from "../state/store.js";
import { route, url } from "../router.js";
import { icon, avatar, e, action } from "./ui.js";
import { brand } from "./brand.js";
export function sidebar() {
  const p = route().parts[0] || "overview",
    active = p === "compare" ? "roles" : p;
  const item = (id, label, ico) =>
    `<a href="${e(url("/" + id))}" class="nav-item ${active === id ? "active" : ""}" ${active === id ? 'aria-current="page"' : ""}>${icon(ico)}<span>${label}</span></a>`;
  return `<aside class="sidebar" aria-label="Navigasi utama">${brand()}<nav>${item("overview", "Overview", "home")}<span class="nav-heading">Portfolio</span>${item("companies", "Companies", "building")}${item("roles", "Roles", "briefcase")}${item("talent", "Talent", "users")}<span class="nav-heading">Succession</span>${item("risks", "Succession Risks", "chart")}<span class="nav-heading">Governance</span>${item("quality", "Data Quality", "shield")}</nav><div class="sidebar-bottom">${action("views", "My Views", "bookmark", "nav-item")}${state.views
    .slice(0, 2)
    .map(
      (v) =>
        `<button class="pinned-view" data-action="open-view" data-id="${e(v.id)}">${icon("bookmark")}<span>${e(v.name)}</span></button>`,
    )
    .join(
      "",
    )}<button class="profile-button" data-action="profile">${avatar("Aditya Pratama", true)}<span><strong>Aditya Pratama</strong><small>${state.access === "reader" ? "Portfolio Reader" : "Portfolio HC Analyst"}</small></span>${icon("chevron")}</button></div></aside>`;
}
