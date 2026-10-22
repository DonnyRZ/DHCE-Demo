import { e, action, icon } from "./ui.js";
import { state } from "../state/store.js";
let previous;
export function closeDialog() {
  document.querySelector("#overlay").close();
}
export function showDialog(title, body, { drawer = false, wide = false } = {}) {
  const d = document.querySelector("#overlay");
  if (!d.open) previous = document.activeElement;
  d.className = drawer ? "drawer" : wide ? "wide" : "";
  d.innerHTML = `<div class="dialog-header"><h2 id="overlay-title">${e(title)}</h2>${action("close", icon("close"), "", "icon-btn", 'aria-label="Tutup dialog"')}</div><div class="dialog-body">${body}</div>`;
  if (!d.open) d.showModal();
  requestAnimationFrame(() => {
    (
      d.querySelector("[autofocus]") ||
      d.querySelector("input:not([type=hidden]),select,button,a")
    )?.focus();
  });
}
export function initializeDialog() {
  const d = document.querySelector("#overlay");
  d.addEventListener("click", (event) => {
    if (event.target === d) {
      const rect = d.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        d.close();
    }
  });
  d.addEventListener("close", () => {
    if (previous?.isConnected) previous.focus();
    else document.querySelector("#main")?.focus({ preventScroll: true });
  });
}
let timer;
export function toast(message) {
  const target = document.querySelector("#toast");
  target.textContent =
    message +
    (state.storageAvailable === false &&
    !message.includes("Penyimpanan browser")
      ? " Penyimpanan browser tidak tersedia; perubahan hanya untuk sesi ini."
      : "");
  target.classList.add("visible");
  clearTimeout(timer);
  timer = setTimeout(() => target.classList.remove("visible"), 4200);
}
