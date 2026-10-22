import { state, save, patch } from "../state/store.js";
import { resetStorage } from "../state/storage.js";
import { route, navigate, updateQuery, url } from "../router.js";
import { getRole, getTalent, getCompany } from "./portfolio.js";
import { saveView, viewHash } from "./saved-views.js";
import { exportCSV, printPreview } from "./export.js";
import { tables } from "../components/data-table.js";
import { showDialog, closeDialog, toast } from "../components/dialog.js";
import { e, action, note } from "../components/ui.js";
import {
  openSearch,
  searchResults,
  setSearchKind,
} from "../components/global-search.js";
import {
  evidenceDrawer,
  sourceDetail,
  developmentDetail,
} from "../components/evidence-drawer.js";
import {
  notifications,
  notificationsPanel,
  viewsPanel,
  viewForm,
  columnsPanel,
  candidatesPanel,
  profilePanel,
  aboutPanel,
  favoritesPanel,
} from "../components/workspace-panels.js";
export function setupActions(render) {
  const select = (role, id, checked) => {
    if (state.access === "reader") {
      toast("Akses kandidat memerlukan mode Analyst.");
      render();
      return;
    }
    const current = state.selection;
    const change =
      current.ids.length &&
      (current.role !== role || current.snapshot !== state.snapshot);
    if (change) {
      showDialog(
        "Ganti konteks perbandingan?",
        `<p>Pilihan sebelumnya menggunakan target role atau snapshot berbeda. Pilihan tersebut perlu dikosongkan.</p><form data-form="selection-context"><input type="hidden" name="role" value="${e(role)}"><input type="hidden" name="id" value="${e(id)}"><div class="dialog-footer">${action("close", "Batal", "", "btn")}<button class="btn primary">Ganti konteks & pilih</button></div></form>`,
      );
      render();
      return;
    }
    if (current.role !== role || current.snapshot !== state.snapshot)
      state.selection = { role, snapshot: state.snapshot, ids: [] };
    if (checked && !state.selection.ids.includes(id)) {
      if (state.selection.ids.length === 4) {
        toast("Maksimal 4 kandidat. Hapus satu pilihan terlebih dahulu.");
        render();
        return;
      }
      state.selection.ids.push(id);
    } else if (!checked)
      state.selection.ids = state.selection.ids.filter((x) => x !== id);
    save();
    render();
  };
  document.addEventListener("click", async (event) => {
    if (event.target.closest(".skip-link")) {
      event.preventDefault();
      document.querySelector("#main").focus();
      return;
    }
    if (
      document.body.classList.contains("nav-open") &&
      !event.target.closest(".sidebar") &&
      !event.target.closest("[data-action=menu]")
    ) {
      document.body.classList.remove("nav-open");
      document
        .querySelector("[data-action=menu]")
        ?.setAttribute("aria-expanded", "false");
    }
    const anchor = event.target.closest('a[href^="#/"]');
    if (anchor) {
      if (anchor.dataset.notification) {
        state.read.push(anchor.dataset.notification);
        save();
      }
      if (document.querySelector("#overlay").open) closeDialog();
      document.body.classList.remove("nav-open");
    }
    const b = event.target.closest("[data-action]");
    if (!b) return;
    const d = b.dataset,
      r = route();
    switch (d.action) {
      case "close":
        closeDialog();
        break;
      case "menu":
        document.body.classList.toggle("nav-open");
        b.setAttribute(
          "aria-expanded",
          String(document.body.classList.contains("nav-open")),
        );
        break;
      case "search":
        openSearch();
        break;
      case "search-kind":
        setSearchKind(d.kind);
        break;
      case "evidence":
        evidenceDrawer(d.role, d.talent);
        break;
      case "source":
        sourceDetail(d.role, d.talent, d.index);
        break;
      case "development":
        developmentDetail(d.role, d.talent, d.index);
        break;
      case "compliance":
        showDialog(
          "Compliance · " + getTalent(d.talent).name,
          note("Compliance terpisah dari Role Fit dan Readiness.") +
            "<p>Checklist ilustratif: verifikasi dokumen profesional, declaration of interest, dan review pihak berwenang.</p><p>Status: perlu review sesuai kewenangan. Tidak ada hasil compliance yang digabungkan menjadi skor talent.</p>",
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(d.text);
          toast("Referensi disalin.");
        } catch {
          showDialog(
            "Salin referensi",
            `<label>Referensi<textarea readonly autofocus>${e(d.text)}</textarea></label><p>Gunakan Ctrl/Cmd+C untuk menyalin.</p>`,
          );
        }
        break;
      case "sort": {
        const same = r.params.sort === d.key;
        updateQuery({
          sort: same && r.params.dir === "desc" ? null : d.key,
          dir: !same ? "asc" : r.params.dir === "asc" ? "desc" : null,
          page: "1",
        });
        break;
      }
      case "paginate":
        updateQuery({ page: d.page });
        break;
      case "columns":
        columnsPanel(d.table);
        break;
      case "clear-filters":
        navigate(r.path, { tab: r.params.tab, target: r.params.target });
        break;
      case "remove-filter":
        updateQuery({ [d.key]: null, page: "1" });
        break;
      case "critical-toggle":
        updateQuery({ critical: d.value, page: "1" });
        break;
      case "save-view":
        viewForm();
        break;
      case "edit-view":
        viewForm(d.id);
        break;
      case "views":
        viewsPanel();
        break;
      case "open-view": {
        const v = state.views.find((v) => v.id === d.id);
        if (v) {
          if (
            v.columns &&
            typeof v.columns === "object" &&
            !Array.isArray(v.columns)
          )
            state.columns = structuredClone(v.columns);
          save();
          closeDialog();
          location.hash = viewHash(v);
          render();
        }
        break;
      }
      case "duplicate-view": {
        const v = state.views.find((v) => v.id === d.id);
        state.views.push({
          ...structuredClone(v),
          id: crypto.randomUUID(),
          name: v.name + " · Salinan",
          visibility: "private",
          owner: "Aditya Pratama",
        });
        save();
        viewsPanel();
        toast("View diduplikasi.");
        break;
      }
      case "share-view": {
        const v = state.views.find((v) => v.id === d.id);
        const address = new URL(location.href);
        address.hash = viewHash(v);
        try {
          await navigator.clipboard.writeText(address.href);
          toast("Link view disalin. Penerima menggunakan data lokalnya.");
        } catch {
          showDialog(
            "Link view",
            `<label>Salin link<input readonly value="${e(address.href)}" autofocus></label>`,
          );
        }
        break;
      }
      case "delete-view":
        showDialog(
          "Hapus saved view?",
          `<p>Hapus ${e(state.views.find((v) => v.id === d.id)?.name)} dari browser ini?</p><form data-form="delete-view"><input type="hidden" name="id" value="${e(d.id)}"><div class="dialog-footer">${action("close", "Batal", "", "btn")}<button class="btn danger">Hapus view</button></div></form>`,
        );
        break;
      case "notifications":
        notificationsPanel();
        break;
      case "read-all":
        state.read = [
          ...new Set([...state.read, ...notifications().map((n) => n.id)]),
        ];
        save();
        render();
        notificationsPanel();
        break;
      case "read-one":
        state.read = [...new Set([...state.read, d.id])];
        save();
        render();
        notificationsPanel();
        break;
      case "profile":
        profilePanel();
        break;
      case "about":
        aboutPanel();
        break;
      case "favorites":
        favoritesPanel();
        break;
      case "favorite": {
        const k = d.type + ":" + d.id;
        state.favorites = state.favorites.includes(k)
          ? state.favorites.filter((x) => x !== k)
          : [...state.favorites, k];
        save();
        render();
        toast("Favorit diperbarui.");
        break;
      }
      case "remove-selection":
        state.selection.ids = state.selection.ids.filter((x) => x !== d.id);
        save();
        render();
        break;
      case "clear-selection":
        state.selection = { role: null, snapshot: null, ids: [] };
        save();
        render();
        break;
      case "compare":
        if (state.selection.ids.length < 2) {
          toast("Pilih minimal 2 kandidat untuk dibandingkan.");
          break;
        }
        navigate("/compare", {
          role: d.role,
          ids: state.selection.ids.join(","),
        });
        break;
      case "change-candidates":
        candidatesPanel(d.role);
        break;
      case "remove-compare": {
        const ids = (r.params.ids || "").split(",").filter((x) => x !== d.id);
        state.selection = {
          role: r.params.role,
          snapshot: state.snapshot,
          ids,
        };
        save();
        if (ids.length < 2)
          navigate("/roles/" + r.params.role, { tab: "candidates" });
        else updateQuery({ ids: ids.join(",") });
        break;
      }
      case "export-csv":
        exportCSV();
        break;
      case "print":
        printPreview();
        break;
      case "do-print":
        window.print();
        break;
      case "latest":
        changeContext("snapshot", "2026-09-30");
        break;
      case "reset":
        showDialog(
          "Reset data browser?",
          `<p>Saved views, favorit, notifikasi, dan preferensi akan kembali ke kondisi awal. Dataset utama tetap tersedia.</p><form data-form="reset"><div class="dialog-footer">${action("close", "Batal", "", "btn")}<button class="btn danger">Reset sekarang</button></div></form>`,
        );
        break;
      case "retry":
        render();
        break;
    }
  });
  const changeContext = (key, value) => {
    if (
      key === "snapshot" &&
      value !== state.snapshot &&
      state.selection.ids.length
    ) {
      showDialog(
        "Ganti snapshot?",
        `<p>Pilihan comparison akan dikosongkan agar evidence dari dua snapshot tidak tercampur.</p><form data-form="snapshot"><input type="hidden" name="value" value="${e(value)}"><div class="dialog-footer">${action("close", "Batal", "", "btn")}<button class="btn primary">Ganti snapshot</button></div></form>`,
      );
      document.querySelector("#global-snapshot").value = state.snapshot;
      return;
    }
    patch({ [key]: value });
    navigate(
      route().path,
      { ...route().params, [key]: value, page: "1" },
      true,
    );
  };
  document.addEventListener("change", (event) => {
    const el = event.target;
    if (el.id === "global-scope") {
      changeContext("scope", el.value);
      return;
    }
    if (el.id === "global-snapshot") {
      changeContext("snapshot", el.value);
      return;
    }
    if (el.dataset.selectCandidate) {
      select(el.dataset.role, el.dataset.selectCandidate, el.checked);
      return;
    }
    if (el.matches("[data-query]") && el.tagName !== "INPUT")
      updateQuery({ [el.dataset.query]: el.value, page: "1" });
    else if (el.matches("input[type=checkbox][data-query]"))
      updateQuery({ [el.dataset.query]: el.checked ? "1" : null });
  });
  let searchTimer;
  document.addEventListener("input", (event) => {
    const el = event.target;
    if (el.id === "global-query") {
      searchResults();
      return;
    }
    if (el.id === "view-search") {
      const q = el.value.toLowerCase();
      document
        .querySelectorAll(".view-card")
        .forEach(
          (x) =>
            (x.hidden = !x
              .querySelector("h3")
              .textContent.toLowerCase()
              .includes(q)),
        );
      return;
    }
    if (el.matches("input[data-query]:not([type=checkbox])")) {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(
        () => updateQuery({ [el.dataset.query]: el.value, page: "1" }),
        180,
      );
    }
  });
  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!form.dataset.form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const f = new FormData(form);
    switch (form.dataset.form) {
      case "view":
        if (!f.get("name").trim()) {
          form.elements.name.setCustomValidity("Nama tidak boleh hanya spasi.");
          form.elements.name.reportValidity();
          form.elements.name.addEventListener(
            "input",
            () => form.elements.name.setCustomValidity(""),
            { once: true },
          );
          return;
        }
        saveView({
          id: f.get("id"),
          name: f.get("name"),
          visibility: f.get("visibility"),
          mode: f.get("mode"),
        });
        closeDialog();
        render();
        toast("View berhasil disimpan.");
        break;
      case "delete-view":
        state.views = state.views.filter((v) => v.id !== f.get("id"));
        save();
        render();
        viewsPanel();
        break;
      case "columns": {
        const t = tables.get(f.get("table"));
        state.columns[f.get("table")] = [
          ...new Set([
            ...f.getAll("column"),
            ...t.columns.filter((c) => c.required).map((c) => c.key),
          ]),
        ];
        save();
        closeDialog();
        render();
        break;
      }
      case "candidates": {
        const ids = f.getAll("candidate");
        if (ids.length < 2 || ids.length > 4) {
          form.querySelector("#candidate-error").textContent =
            "Pilih minimal 2 dan maksimal 4 kandidat.";
          return;
        }
        state.selection = {
          role: f.get("role"),
          snapshot: state.snapshot,
          ids,
        };
        save();
        closeDialog();
        navigate("/compare", { role: f.get("role"), ids: ids.join(",") });
        break;
      }
      case "preferences":
        patch({ access: f.get("access"), density: f.get("density") });
        closeDialog();
        render();
        toast("Preferensi disimpan.");
        break;
      case "selection-context":
        state.selection = {
          role: f.get("role"),
          snapshot: state.snapshot,
          ids: [f.get("id")],
        };
        save();
        closeDialog();
        render();
        break;
      case "snapshot": {
        state.selection = { role: null, snapshot: null, ids: [] };
        const value = f.get("value");
        patch({ snapshot: value });
        closeDialog();
        const r = route();
        navigate(
          r.parts[0] === "compare" ? "/roles/" + r.params.role : r.path,
          {
            ...r.params,
            snapshot: value,
            tab: r.parts[0] === "compare" ? "candidates" : r.params.tab,
            ids: null,
          },
          true,
        );
        break;
      }
      case "reset":
        resetStorage();
        location.hash = "#/overview";
        location.reload();
        break;
    }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape") document.body.classList.remove("nav-open");
    const results = document.querySelector("#search-results");
    if (
      results &&
      document.querySelector("#overlay").open &&
      ["ArrowDown", "ArrowUp", "Enter"].includes(event.key)
    ) {
      const links = [...results.querySelectorAll("a")],
        index = links.indexOf(document.activeElement);
      if (
        event.key === "Enter" &&
        document.activeElement.id === "global-query"
      ) {
        event.preventDefault();
        links[0]?.click();
      } else if (event.key !== "Enter") {
        event.preventDefault();
        links[
          (index + (event.key === "ArrowDown" ? 1 : -1) + links.length) %
            links.length
        ]?.focus();
      }
    }
  });
  window.addEventListener("storage-error", () =>
    toast(
      "Penyimpanan browser tidak tersedia. Perubahan hanya bertahan selama sesi ini.",
    ),
  );
}
