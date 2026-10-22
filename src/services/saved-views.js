import { state, save } from "../state/store.js";
export function initializeViews() {
  if (state.viewsInitialized) return;
  state.views = [
    {
      id: "weekly-risk",
      name: "Critical roles · Weekly review",
      hash: "#/risks?preset=gap&scope=all&snapshot=2026-09-30",
      visibility: "team",
      mode: "latest",
      columns: [],
      owner: "Portfolio HC",
    },
    {
      id: "finance-pipeline",
      name: "CFO pipeline · Pertamina",
      hash: "#/roles/pertamina-cfo?tab=succession&scope=all&snapshot=2026-09-30",
      visibility: "team",
      mode: "fixed",
      columns: [],
      owner: "Talent Strategy",
    },
  ];
  state.viewsInitialized = true;
  save();
}
export function saveView({
  id,
  name,
  visibility = "private",
  mode = "latest",
}) {
  const old = state.views.find((v) => v.id === id);
  if (old) {
    old.name = name.trim();
    old.visibility = visibility;
    old.mode = mode;
  } else
    state.views.push({
      id: crypto.randomUUID(),
      name: name.trim(),
      visibility,
      mode,
      hash: location.hash || "#/overview",
      columns: structuredClone(state.columns),
      owner: "Aditya Pratama",
    });
  save();
}
export function viewHash(view) {
  const [path, query = ""] = view.hash.split("?");
  const q = new URLSearchParams(query);
  if (view.mode === "latest") q.set("snapshot", "2026-09-30");
  if (
    view.columns &&
    !Array.isArray(view.columns) &&
    Object.keys(view.columns).length
  )
    q.set("viewCols", JSON.stringify(view.columns));
  return path + "?" + q;
}
