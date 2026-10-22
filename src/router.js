import { state } from "./state/store.js";
export function route() {
  const raw = location.hash.slice(1) || "/overview";
  const [path, query = ""] = raw.split("?");
  return {
    path: path.replace(/\/$/, "") || "/overview",
    parts: path.split("/").filter(Boolean),
    params: Object.fromEntries(new URLSearchParams(query)),
  };
}
export function url(path, params = {}) {
  const q = new URLSearchParams({
    scope: state.scope,
    snapshot: state.snapshot,
    ...Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== null && v !== undefined && v !== "",
      ),
    ),
  });
  return "#" + path + (q.size ? "?" + q : "");
}
export function navigate(path, params = {}, replace = false) {
  const hash = url(path, params);
  if (replace) {
    history.replaceState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else if (location.hash !== hash) location.hash = hash;
}
export function updateQuery(values) {
  const r = route(),
    q = { ...r.params, ...values };
  for (const k of Object.keys(q)) if (q[k] === null || q[k] === "") delete q[k];
  navigate(r.path, q, true);
}
