import { url } from "../router.js";
import { e } from "./ui.js";

export function brand({ compact = false } = {}) {
  return `<a class="${compact ? "mobile-brand" : "brand"}" href="${e(url("/overview"))}" aria-label="DHCE Overview"><img class="brand-mark" src="./assets/dhce-logo.png" width="${compact ? 28 : 44}" height="${compact ? 28 : 44}" alt="" decoding="async">${compact ? "" : '<span class="brand-copy"><strong class="brand-title">DHCE</strong><span class="brand-caption">LEADERSHIP WORKSPACE</span></span>'}</a>`;
}
