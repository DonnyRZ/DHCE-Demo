import { state } from "../state/store.js";
import { route } from "../router.js";
import { e, icon, action, empty } from "./ui.js";
export const tables = new Map();
export function dataTable({
  id,
  rows,
  columns,
  rowHref = null,
  caption = "Daftar record",
  defaultSort = null,
}) {
  tables.set(id, { rows, columns });
  const q = route().params;
  const chosen = Array.isArray(state.columns[id])
    ? state.columns[id]
    : columns.map((c) => c.key);
  const visible = columns.filter((c) => c.required || chosen.includes(c.key));
  let sorted = [...rows];
  const col = columns.find((c) => c.key === q.sort);
  if (col && q.dir) {
    const get = col.value || ((r) => r[col.key]);
    sorted.sort((a, b) => {
      const x = get(a) ?? "",
        y = get(b) ?? "";
      return (
        (typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y), "id", { numeric: true })) *
        (q.dir === "desc" ? -1 : 1)
      );
    });
  } else if (defaultSort) sorted.sort(defaultSort);
  const size = [25, 50, 100].includes(Number(q.size)) ? Number(q.size) : 25;
  const pages = Math.max(1, Math.ceil(sorted.length / size));
  const page = Math.min(pages, Math.max(1, Number(q.page) || 1));
  const start = (page - 1) * size;
  const list = sorted.slice(start, start + size);
  return `<section class="table-panel"><div class="table-title"><h2>${e(caption)} <span class="count">${rows.length}</span></h2>${action("columns", "Kolom", "columns", "btn small", `data-table="${id}"`)}</div>${!rows.length ? empty() : `<div class="table-scroll" tabindex="0" role="region" aria-label="${e(caption)}"><table data-table="${id}"><caption class="sr-only">${e(caption)}</caption><thead><tr>${visible.map((c) => `<th scope="col" ${q.sort === c.key ? `aria-sort="${q.dir === "asc" ? "ascending" : "descending"}"` : ""}>${c.sort === false ? e(c.label) : action("sort", e(c.label) + icon("sort"), "", "sort-btn", `data-key="${c.key}"`)}</th>`).join("")}${rowHref ? '<th scope="col"><span class="sr-only">Buka detail</span></th>' : ""}</tr></thead><tbody>${list.map((r) => `<tr>${visible.map((c) => `<td>${c.render ? c.render(r) : e((c.value || ((r) => r[c.key]))(r))}</td>`).join("")}${rowHref ? `<td><a class="icon-btn" href="${e(rowHref(r))}" aria-label="Buka detail ${e(r.name || r.title || r.object || "record")}">${icon("chevron")}</a></td>` : ""}</tr>`).join("")}</tbody></table></div><div class="pagination"><span>Menampilkan ${start + 1}–${Math.min(start + size, sorted.length)} dari ${sorted.length}</span><div><label>Baris per halaman <select data-query="size" aria-label="Baris per halaman">${[25, 50, 100].map((n) => `<option ${size === n ? "selected" : ""}>${n}</option>`).join("")}</select></label>${action("paginate", icon("back"), "", "icon-btn", `data-page="${page - 1}" ${page <= 1 ? "disabled" : ""} aria-label="Halaman sebelumnya"`)}<span class="page-current">${page} / ${pages}</span>${action("paginate", icon("arrow"), "", "icon-btn", `data-page="${page + 1}" ${page >= pages ? "disabled" : ""} aria-label="Halaman berikutnya"`)}</div></div>`}</section>`;
}
