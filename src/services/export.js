import { state } from "../state/store.js";
import { tables } from "../components/data-table.js";
import { showDialog, toast } from "../components/dialog.js";
import { e, date, action } from "../components/ui.js";
import { getCompany } from "./portfolio.js";
import { route } from "../router.js";
const filterContext = () =>
  JSON.stringify(
    Object.fromEntries(
      Object.entries(route().params).filter(
        ([key]) =>
          !["scope", "snapshot", "page", "size", "tab", "viewCols"].includes(
            key,
          ),
      ),
    ),
  );
export const csvCell = (value) =>
  '"' +
  String(value ?? "")
    .replace(/^[=+@-]/, "'$&")
    .replaceAll('"', '""') +
  '"';
export function exportCSV() {
  if (state.access === "reader") {
    toast("Ekspor assessment memerlukan mode Analyst.");
    return;
  }
  const active = document.querySelector("main table[data-table]")?.dataset
      .table,
    table = tables.get(active);
  if (!table) {
    toast("Gunakan Ekspor ringkasan untuk halaman ini.");
    return;
  }
  const columns = table.columns.filter(
    (c) => !["select", "action", "evidence"].includes(c.key),
  );
  const text = (html) => {
    const t = document.createElement("div");
    t.innerHTML = html;
    return t.textContent.replace(/\s+/g, " ").trim();
  };
  const rows = [
    ["DHCE · " + document.querySelector("h1").textContent],
    [
      "Scope",
      state.scope === "all"
        ? "Seluruh BUMN"
        : getCompany(state.scope)?.name || state.scope,
    ],
    ["Snapshot", state.snapshot],
    ["Filter / target context", filterContext()],
    ["Sumber", "Dataset ilustratif; bukan assessment resmi"],
    [],
    columns.map((c) => c.label),
    ...table.rows.map((r) =>
      columns.map((c) =>
        c.value ? c.value(r) : c.render ? text(c.render(r)) : r[c.key],
      ),
    ),
  ];
  const blob = new Blob(
    ["\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n")],
    { type: "text/csv;charset=utf-8" },
  );
  const address = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = address;
  a.download = "DHCE-" + active + "-" + state.snapshot + ".csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(address), 1000);
  toast("CSV berhasil diekspor.");
}
export function printPreview() {
  if (state.access === "reader") {
    toast("Ekspor penilaian memerlukan mode Analyst.");
    return;
  }
  const title = document.querySelector("h1").textContent;
  const clone = document.querySelector("#main").cloneNode(true);
  clone
    .querySelectorAll(
      "button,input,select,.filter-panel,.page-actions,.tabs,.compare-tray,.pagination,.segmented,.preset-row,.chart-data",
    )
    .forEach((x) => x.remove());
  clone.querySelectorAll("a").forEach((a) => {
    const span = document.createElement("span");
    span.innerHTML = a.innerHTML;
    a.replaceWith(span);
  });
  showDialog(
    "Ekspor ringkasan",
    `<div class="print-content"><span class="eyebrow">DHCE · Leadership Portfolio</span><h2>${e(title)}</h2><p>Snapshot ${date(state.snapshot)} · Scope ${e(getCompany(state.scope)?.name || (state.scope === "all" && "Seluruh BUMN") || state.scope)}</p><p class="small-text">Filter / target context: ${e(filterContext())}</p>${clone.innerHTML}<footer>Data ilustratif. Ringkasan analisis, bukan keputusan pengangkatan. Role Fit bukan probabilitas sukses. Evidence yang tidak cukup tetap ditampilkan terpisah.</footer></div><div class="dialog-footer">${action("do-print", "Cetak / Simpan PDF", "printer", "btn primary")}${action("close", "Tutup", "", "btn")}</div>`,
    { wide: true },
  );
}
