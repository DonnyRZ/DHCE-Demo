const KEY = "dhce-workspace-v1";
export function loadState() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch {
    return {};
  }
}
export function persist(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
export function resetStorage() {
  localStorage.removeItem(KEY);
}
