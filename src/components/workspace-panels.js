import { state } from "../state/store.js";
import { route, url } from "../router.js";
import {
  scopedRoles,
  roleStats,
  getCompany,
  getRole,
  getTalent,
  qualityIssues,
} from "../services/portfolio.js";
import { matches } from "../services/matching.js";
import { viewHash } from "../services/saved-views.js";
import { tables } from "./data-table.js";
import { showDialog } from "./dialog.js";
import { e, action, icon, note, badge, link, empty, date } from "./ui.js";
export function notifications() {
  return [
    ...scopedRoles(state.scope)
      .filter(
        (r) =>
          r.critical &&
          !roleStats(r, state.snapshot).unknown &&
          roleStats(r, state.snapshot).now === 0,
      )
      .slice(0, 3)
      .map((r) => ({
        id: "risk-" + r.id,
        title: "Tidak ada Ready Now · " + r.title,
        detail: getCompany(r.companyId).name,
        hash: url("/roles/" + r.id, { tab: "succession" }),
        tone: "red",
      })),
    ...qualityIssues(state.scope, state.snapshot)
      .slice(0, 3)
      .map((i) => ({
        id: "issue-" + i.id,
        title: i.title,
        detail: i.object + " · " + getCompany(i.companyId).name,
        hash: url("/quality", { q: i.object }),
        tone: "amber",
      })),
  ];
}
export function notificationsPanel() {
  showDialog(
    "Attention & Notifications",
    `<div class="inline-actions">${action("read-all", "Tandai semua dibaca", "check", "btn")}</div><div class="notification-list">${
      notifications()
        .map(
          (n) =>
            `<article class="notification ${state.read.includes(n.id) ? "read" : ""}"><span class="metric-icon ${n.tone}">${icon("alert")}</span><div><a href="${e(n.hash)}" data-notification="${e(n.id)}"><strong>${e(n.title)}</strong><small>${e(n.detail)}</small></a><span>${state.read.includes(n.id) ? "Sudah dibaca" : action("read-one", "Tandai dibaca", "", "text-btn", `data-id="${e(n.id)}"`)}</span></div></article>`,
        )
        .join("") ||
      empty("Tidak ada perhatian baru", "Tidak ada item pada scope ini.", "")
    }</div>${note("Menandai notifikasi dibaca tidak menyelesaikan risiko leadership.")}`,
    { drawer: true },
  );
}
export function viewsPanel(filter = "") {
  const list = state.views.filter((v) =>
    v.name.toLowerCase().includes(filter.toLowerCase()),
  );
  showDialog(
    "Saved Views",
    `<p class="muted">Buka kembali investigasi dengan scope, filter, kolom, dan snapshot yang tersimpan.</p><label class="search-input">${icon("search")}<span class="sr-only">Cari saved view</span><input id="view-search" placeholder="Cari saved view…" value="${e(filter)}" data-focus="view-search"></label><div id="views-list">${list.map((v) => `<article class="view-card"><div><span class="eyebrow">${v.visibility === "team" ? "Team View" : "My View"} · ${e(v.owner)}</span><h3>${e(v.name)}</h3><small>${v.mode === "latest" ? "Snapshot terbaru" : "Snapshot tetap"} · ${e(v.hash.split("?")[0].slice(2))}</small></div><div class="inline-actions">${action("open-view", "Buka", "arrow", "btn primary", `data-id="${e(v.id)}"`)}${action("edit-view", "Ubah", "settings", "btn", `data-id="${e(v.id)}"`)}${action("duplicate-view", "Duplikasi", "copy", "btn", `data-id="${e(v.id)}"`)}${action("share-view", "Salin link", "copy", "btn", `data-id="${e(v.id)}"`)}${action("delete-view", "Hapus", "", "btn danger", `data-id="${e(v.id)}"`)}</div></article>`).join("") || empty("Belum ada view", "Simpan filter dari halaman yang sedang Anda gunakan.", "")}</div><div class="dialog-footer">${action("save-view", "Simpan tampilan saat ini", "bookmark", "btn primary")}</div><details class="report-empty"><summary>Recent Reports</summary><p>Belum ada laporan tersimpan. Ekspor ringkasan tersedia dari halaman analisis.</p></details><p class="small-text muted">Team View adalah contoh tampilan tim. Perubahan tersimpan pada browser ini; link membagikan konfigurasi tampilan, bukan akses atau perubahan lintas pengguna.</p>`,
    { wide: true },
  );
}
export function viewForm(id) {
  const v = state.views.find((v) => v.id === id);
  showDialog(
    v ? "Ubah Saved View" : "Simpan View",
    `<form data-form="view"><input type="hidden" name="id" value="${e(v?.id || "")}"><label>Nama view<input name="name" required maxlength="90" value="${e(v?.name || document.querySelector("h1")?.textContent || "Leadership review")}" autofocus></label><label>Visibilitas<select name="visibility"><option value="private" ${v?.visibility === "private" ? "selected" : ""}>Private · browser ini</option><option value="team" ${v?.visibility === "team" ? "selected" : ""}>Team · konfigurasi dapat dibagikan</option></select></label><label>Snapshot mode<select name="mode"><option value="latest" ${v?.mode === "latest" ? "selected" : ""}>Terbaru</option><option value="fixed" ${v?.mode === "fixed" ? "selected" : ""}>Tetap · ${date(state.snapshot)}</option></select></label><div class="dialog-footer">${action("close", "Batal", "", "btn")}<button type="submit" class="btn primary">${icon("bookmark")}Simpan view</button></div></form>`,
  );
}
export function columnsPanel(id) {
  const table = tables.get(id);
  if (!table) return;
  const cols = state.columns[id] || table.columns.map((c) => c.key);
  showDialog(
    "Kolom yang ditampilkan",
    `<form data-form="columns"><input type="hidden" name="table" value="${e(id)}"><div class="column-options">${table.columns.map((c) => `<label><input type="checkbox" name="column" value="${e(c.key)}" ${c.required || cols.includes(c.key) ? "checked" : ""} ${c.required ? "disabled" : ""}><span>${e(c.label)}${c.required ? " <small>· wajib</small>" : ""}</span></label>`).join("")}</div><div class="dialog-footer"><button type="submit" class="btn primary">Terapkan kolom</button></div></form>`,
  );
}
export function candidatesPanel(roleId) {
  const role = getRole(roleId);
  if (!role) return;
  const r = route();
  const current =
    r.parts[0] === "compare"
      ? (r.params.ids || "").split(",")
      : state.selection.ids;
  showDialog(
    "Pilih 2–4 kandidat",
    `<form data-form="candidates"><input type="hidden" name="role" value="${role.id}"><p>${e(role.canonical)} · ${e(getCompany(role.companyId).name)}</p><div class="candidate-options">${matches(
      role,
      state.snapshot,
    )
      .map(
        (a) =>
          `<label><input type="checkbox" name="candidate" value="${a.talentId}" ${current.includes(a.talentId) ? "checked" : ""}><span><strong>${e(a.talent.name)}</strong><small>${e(getCompany(a.talent.companyId).name)} · ${e(a.readiness)}</small></span>${a.fit === null ? "—" : a.fit + "%"}</label>`,
      )
      .join(
        "",
      )}</div><p id="candidate-error" class="form-error" role="alert"></p><div class="dialog-footer"><button type="submit" class="btn primary">Bandingkan pilihan</button></div></form>`,
    { wide: true },
  );
}
export function profilePanel() {
  showDialog(
    "Profil & Preferensi",
    `<div class="profile-intro"><strong>Aditya Pratama</strong><p>Portfolio Human Capital</p></div><form data-form="preferences"><label>Mode akses<select name="access"><option value="analyst" ${state.access === "analyst" ? "selected" : ""}>Portfolio HC Analyst</option><option value="reader" ${state.access === "reader" ? "selected" : ""}>Portfolio Reader</option></select></label><label>Kepadatan tabel<select name="density"><option value="normal" ${state.density !== "compact" ? "selected" : ""}>Normal</option><option value="compact" ${state.density === "compact" ? "selected" : ""}>Compact</option></select></label><button type="submit" class="btn primary">Simpan preferensi</button></form><hr>${action("about", "Tentang workspace", "info", "btn full")}${action("reset", "Reset data browser", "refresh", "btn full danger")}`,
    { drawer: true },
  );
}
export function aboutPanel() {
  showDialog(
    "Tentang DHCE",
    `<span class="eyebrow">Leadership intelligence workspace</span><h3>Portofolio yang terhubung. Keputusan yang dapat ditelusuri.</h3><p>DHCE menghubungkan konteks jabatan, talent, succession, development, dan kualitas evidence dalam satu workspace.</p><h4>Transparansi data</h4><p>Nama perusahaan digunakan sebagai konteks ilustratif. Semua nama talent, jabatan yang dikaitkan, assessment, nilai, dan dokumen pada aplikasi ini fiktif dan tidak merepresentasikan keadaan atau keputusan resmi perusahaan tersebut.</p><p>Ini aplikasi frontend tanpa backend. Mode akses merupakan simulasi UX, bukan pengamanan data. Saved views, favorit, dan preferensi tersimpan pada browser masing-masing.</p>${note("Role Fit bukan probabilitas sukses. Readiness dan Data Confidence terpisah. Keputusan pengangkatan tetap merupakan kewenangan manusia.")}<p class="muted">Versi 1.0 · Data snapshot September 2026</p>`,
  );
}
export function favoritesPanel() {
  showDialog(
    "Favorit",
    state.favorites
      .map((key) => {
        const [type, id] = key.split(":"),
          object =
            type === "company"
              ? getCompany(id)
              : type === "role"
                ? getRole(id)
                : getTalent(id);
        if (!object) return "";
        const href = url(
          (type === "company"
            ? "/companies/"
            : type === "role"
              ? "/roles/"
              : "/talent/") + id,
        );
        return `<a class="search-result" href="${e(href)}">${icon("star")}<span><strong>${e(object.name || object.title)}</strong><small>${e(type)}</small></span>${icon("chevron")}</a>`;
      })
      .join("") ||
      empty(
        "Belum ada favorit",
        "Gunakan tombol Favorit pada halaman detail.",
        "",
      ),
    { drawer: true },
  );
}
