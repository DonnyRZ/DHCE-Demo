import { loadState, persist } from "./storage.js";
const saved = loadState();
export const state = {
  scope: "all",
  snapshot: "2026-09-30",
  access: "analyst",
  views: [],
  favorites: [],
  read: [],
  columns: {},
  selection: { role: null, snapshot: null, ids: [] },
  recent: [],
  ...saved,
};
for (const key of ["views", "favorites", "read", "recent"])
  if (!Array.isArray(state[key])) state[key] = [];
if (!state.columns || typeof state.columns !== "object") state.columns = {};
if (!state.selection || !Array.isArray(state.selection.ids))
  state.selection = { role: null, snapshot: null, ids: [] };
state.views = state.views.filter(
  (v) =>
    v &&
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.hash === "string" &&
    v.hash.startsWith("#/"),
);
state.favorites = state.favorites.filter((v) => typeof v === "string");
state.read = state.read.filter((v) => typeof v === "string");
state.recent = state.recent.filter(
  (v) =>
    v &&
    typeof v.hash === "string" &&
    v.hash.startsWith("#/") &&
    typeof v.title === "string",
);
state.selection.ids = state.selection.ids
  .filter((v) => typeof v === "string")
  .slice(0, 4);
export function save() {
  state.storageAvailable = true;
  const ok = persist(state);
  if (!ok) {
    state.storageAvailable = false;
    window.dispatchEvent(new CustomEvent("storage-error"));
  }
  return ok;
}
export function patch(values) {
  Object.assign(state, values);
  return save();
}
