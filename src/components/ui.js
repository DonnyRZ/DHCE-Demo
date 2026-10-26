import { icon } from "./icons.js";
import { url, route } from "../router.js";
import { state } from "../state/store.js";
export { icon };
export const e = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const date = (v) =>
  v
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(v + "T12:00:00Z"))
    : "—";
export const pct = (n, d) => (d ? Math.round((n / d) * 100) + "%" : "—");
export function link(path, label, params = {}, cls = "") {
  return `<a class="${cls}" href="${e(url(path, params))}">${label}</a>`;
}
export function action(name, label, ico = "", cls = "btn", attrs = "") {
  return `<button type="button" class="${cls}" data-action="${name}" ${attrs}>${ico ? icon(ico) : ""}${label}</button>`;
}
export function avatar(name, small = false) {
  const hue = [218, 262, 161, 32, 342][String(name).charCodeAt(0) % 5];
  return `<span class="avatar ${small ? "small" : ""}" style="--avatar-hue:${hue}" aria-hidden="true">${e(
    name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join(""),
  )}</span>`;
}
const tones = {
  "Ready Now": "green",
  "Ready in 1–2 years": "blue",
  "Ready in 3–5 years": "amber",
  "Development required": "neutral",
  "Belum dapat ditentukan": "neutral",
  High: "green",
  Medium: "amber",
  Insufficient: "red",
  Critical: "red",
  Conflict: "red",
  Stale: "amber",
  Verified: "green",
  Eligible: "green",
  "Under review": "amber",
  "Not eligible": "red",
};
export function badge(text, tone) {
  return `<span class="badge ${tone || tones[text] || "neutral"}"><span class="status-dot"></span>${e(text)}</span>`;
}
export function progress(value, denominator = 100, tone = "blue") {
  const n = value == null ? null : Math.round((value / denominator) * 100);
  return n == null
    ? "—"
    : `<span class="progress-value"><span>${e(value)}${denominator === 100 ? "%" : " / " + e(denominator)}</span><span class="meter ${tone}"><i style="width:${Math.min(100, Math.max(0, n))}%"></i></span>${denominator !== 100 ? `<strong>${n}%</strong>` : ""}</span>`;
}
export function metric(
  label,
  value,
  description,
  ico = "users",
  tone = "blue",
  href = "",
) {
  const tag = href ? "a" : "div";
  return `<${tag} ${href ? `href="${e(href)}"` : ""} class="metric"><div><span class="metric-label">${e(label)}</span><strong>${e(value)}</strong><span class="metric-sub">${e(description)}</span></div><span class="metric-icon ${tone}">${icon(ico)}</span></${tag}>`;
}
export function header(
  title,
  subtitle = "",
  actions = "",
  { compact = false } = {},
) {
  if (compact) {
    return `<div class="page-toolbar"><h1 class="sr-only">${e(title)}</h1><div class="page-actions">${actions}</div></div>`;
  }
  return `<div class="page-header"><div><h1>${e(title)}</h1>${subtitle ? `<p>${e(subtitle)}</p>` : ""}</div><div class="page-actions">${actions}</div></div>`;
}
export function tabs(items, active) {
  const r = route();
  return `<nav class="tabs" aria-label="Bagian halaman">${items.map(([id, label]) => link(r.path, e(label), { ...r.params, tab: id }, id === active ? "active" : "")).join("")}</nav>`;
}
export function panel(title, body, more = "", cls = "") {
  return `<section class="panel ${cls}"><div class="panel-heading"><h2>${e(title)}</h2>${more}</div>${body}</section>`;
}
export function empty(
  title = "Tidak ada hasil sesuai filter",
  body = "Coba perluas scope atau sesuaikan filter pencarian.",
  cta = action("clear-filters", "Hapus filter", "refresh"),
) {
  return `<div class="empty">${icon("search")}<h3>${e(title)}</h3><p>${e(body)}</p>${cta}</div>`;
}
export function note(text, tone = "blue") {
  return `<div class="notice ${tone}">${icon(tone === "red" || tone === "amber" ? "alert" : "info")}<span>${text}</span></div>`;
}
export function evidenceButton(
  roleId,
  talentId = "",
  label = "Lihat evidence",
) {
  return action(
    "evidence",
    label,
    "file",
    "text-btn",
    `data-role="${e(roleId)}" data-talent="${e(talentId)}"`,
  );
}
export function favorite(type, id) {
  const checked = state.favorites.includes(type + ":" + id);
  return action(
    "favorite",
    checked ? "Tersimpan" : "Favorit",
    "star",
    `btn ${checked ? "selected" : ""}`,
    `data-type="${type}" data-id="${e(id)}" aria-pressed="${checked}"`,
  );
}
export function listActions() {
  return (
    action("export-csv", "Ekspor", "download") +
    action("save-view", "Simpan view", "bookmark", "btn primary")
  );
}
