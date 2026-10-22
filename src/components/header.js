import { companies, sectors, snapshots } from "../data/companies.js";
import { state } from "../state/store.js";
import { e, icon, avatar, date, action } from "./ui.js";
import { notifications } from "./workspace-panels.js";
export function appHeader() {
  const unread = notifications().filter(
    (n) => !state.read.includes(n.id),
  ).length;
  return `<header class="app-header">${action("menu", icon("menu"), "", "icon-btn mobile-menu", 'aria-label="Buka navigasi" aria-expanded="false"')}<button class="global-search" data-action="search">${icon("search")}<span>Cari BUMN, jabatan, talent…</span><kbd>Ctrl K</kbd></button><div class="header-context"><label><span>Scope</span><select id="global-scope" aria-label="Scope portofolio"><option value="all">Seluruh BUMN</option><optgroup label="Sektor">${sectors.map((s) => `<option value="sector:${e(s)}" ${state.scope === "sector:" + s ? "selected" : ""}>${e(s)}</option>`).join("")}</optgroup><optgroup label="BUMN">${companies.map((c) => `<option value="${c.id}" ${state.scope === c.id ? "selected" : ""}>${e(c.name)}</option>`).join("")}</optgroup></select></label><label><span>Snapshot</span><select id="global-snapshot" aria-label="Snapshot">${snapshots.map((s) => `<option value="${s}" ${state.snapshot === s ? "selected" : ""}>${date(s)}</option>`).join("")}</select></label></div><button class="icon-btn notifications-button" data-action="notifications" aria-label="Notifikasi${unread ? ", " + unread + " belum dibaca" : ""}">${icon("bell")}${unread ? "<i></i>" : ""}</button><button class="header-avatar" data-action="profile" aria-label="Profil dan preferensi">${avatar("Aditya Pratama", true)}</button></header>`;
}
