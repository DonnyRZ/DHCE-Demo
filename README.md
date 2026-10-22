# DHCE · Leadership Workspace

Aplikasi frontend untuk menjelajahi portofolio leadership, role–talent matching, succession, development, dan evidence. Sepuluh halaman mengikuti mockup di `mockup/`, dengan HTML, CSS, dan vanilla JavaScript ES Modules. Tidak memerlukan backend atau layanan eksternal saat digunakan.

## Menjalankan

Prasyarat pengembangan: Node.js 24 dan npm.

```sh
npm ci
npm start
```

Server pengembangan menggunakan port 4173. Sajikan melalui HTTP; membuka `index.html` langsung dengan protokol `file:` tidak mendukung pemuatan ES Modules.

```sh
npm run build
```

Hasil produksi berada di `dist/`. Hanya HTML, source aplikasi, dan aset yang disalin; gambar mockup, dokumentasi, dependencies pengembangan, dan hasil pengujian tidak ikut dipublikasikan sebagai aplikasi.

## Halaman dan alur

| Halaman              | Route                                                |
| -------------------- | ---------------------------------------------------- |
| Executive Overview   | `#/overview`                                         |
| Company Directory    | `#/companies`                                        |
| Company Detail       | `#/companies/pertamina`                              |
| Role Directory       | `#/roles`                                            |
| Role Detail          | `#/roles/pertamina-cfo`                              |
| Talent Directory     | `#/talent`                                           |
| Talent Profile       | `#/talent/talent-2`                                  |
| Candidate Comparison | `#/compare?role=pertamina-cfo&ids=talent-1,talent-2` |
| Succession Risks     | `#/risks`                                            |
| Data Quality         | `#/quality`                                          |

Alur utama: Overview → Succession Risks → Role Detail/Succession → Candidates → pilih 2–4 kandidat → Comparison → Evidence. Dari profil kandidat, pilih target role untuk melihat gap dan rekomendasi development.

- `Ctrl/Cmd + K` membuka universal search; panah atas/bawah dan Enter menavigasi hasil.
- Scope dan snapshot memengaruhi record dan angka portofolio. Candidate pool dapat diperluas lintas BUMN secara terpisah dari perusahaan pemilik role.
- Tabel mendukung search, filter gabungan, sorting tiga keadaan, pagination 25/50/100, dan pilihan kolom. Filter tersimpan dalam URL; Back/Forward mempertahankan konteks.
- Matching pool terpisah dari slate yang tercatat. Readiness dan confidence bukan turunan persentase fit.
- Evidence drawer memuat alasan, sumber, policy reference, missing/conflict/stale status, serta cuplikan sumber yang dapat disalin.
- Saved views mendukung private/team label, latest/fixed snapshot, rename, duplicate, delete, dan share link. Link dapat membawa konfigurasi kolom ke browser lain.
- Ekspor CSV memakai semua record hasil filter, dengan metadata scope dan snapshot. Ringkasan cetak menampilkan record pada halaman aktif; gunakan **Cetak / Simpan PDF** dan pilih **Save as PDF** pada dialog cetak browser.

## Data dan penyimpanan

Dataset mencakup 10 BUMN, 140 jabatan (120 critical roles), 60 profil talent fiktif, serta assessment per pasangan person–role. Metadata perusahaan memberi konteks yang familiar. Semua profil, nilai assessment, status succession, riwayat penugasan, dan dokumen sumber merupakan ilustrasi, bukan informasi atau keputusan resmi perusahaan tersebut. Penjelasan tersedia melalui **Tentang workspace** tanpa badge demo yang mendominasi layar.

KPI dihitung dari data yang juga digunakan dalam detail. Coverage = role dengan successor Ready Now / role yang dapat dinilai. Missing/conflicting evidence ditahan dan dipisahkan dari confirmed gaps, tidak diubah menjadi nol. Snapshot historis menggunakan outcome assessment tersendiri. Dataset adalah fixture pengalaman produk, bukan implementasi engine metodologi atau probabilitas keberhasilan pengangkatan.

`localStorage`, key `dhce-workspace-v1`, menyimpan saved views, preferensi kolom/density, favorit, selection, recently viewed, dan status notifikasi. Perubahan tidak disinkronkan antar pengguna. Salin link view hanya membagikan konfigurasi; tidak membagikan state browser atau memberikan akses baru. Saat penyimpanan browser diblokir, aplikasi tetap berjalan dalam sesi dan memberi keterangan bahwa perubahan tidak persisten.

Menu profil menyediakan mode **Analyst / Portfolio Reader** untuk mengeksplorasi permission-aware UX. Pembatasan ini simulasi antarmuka, bukan autentikasi atau pengamanan data. Jangan memasukkan data kandidat nyata ke aplikasi statis ini.

Untuk mengembalikan kondisi awal, buka **Profil & Preferensi → Reset data browser → Reset sekarang**. Hanya state aplikasi pada browser tersebut yang dihapus.

## Struktur

```text
src/
  app.js                 bootstrap dan render
  router.js              hash routing dan query state
  pages/                 10 modul halaman
  components/            shell, tabel, filter, chart, search, drawer, dialog
  data/                  perusahaan, role, talent, assessment, evidence
  services/              portfolio, matching, actions, saved views, export
  state/                 state aplikasi dan localStorage
  styles/                tokens, base, layout, komponen, halaman, responsive, print
assets/                  aset lokal
scripts/                 server lokal dan build statis
tests/                   domain, browser, dan aksesibilitas
mockup/                  10 PNG core mockup acuan; tidak diubah oleh build
```

## Pengujian

```sh
npm test
npx playwright install chromium
npm run test:e2e
npm run check
```

Pada cloud machine yang sudah menyediakan Chromium, konfigurasi lokal memakai `/usr/bin/chromium`. CI memakai browser dari Playwright. Jika Linux lokal memerlukan library tambahan, gunakan `npx playwright install --with-deps chromium`.

Browser tests mencakup sepuluh halaman pada viewport 1440, 1280, dan 390 px, refresh, alur utama, state persistence, filter/sort/pagination/columns, comparison, evidence, keyboard/focus, ekspor CSV dan PDF, permission mode, reset, invalid routes, serta local storage yang diblokir. Axe memeriksa aturan WCAG A/AA yang dapat diautomasi pada empat halaman representatif. Ini tidak menggantikan audit aksesibilitas manual atau usability test bersama pengguna.

Untuk menjalankan suite yang sama pada deployment:

```sh
BASE_URL=https://donnyrz.github.io/DHCE-Demo/ npm run test:e2e
```

## GitHub Pages

Workflow `.github/workflows/deploy.yml` menjalankan dependency installation, domain tests, browser checks, dan build sebelum deployment dari `main`. Setelah deployment, job `public-verification` memeriksa HTTPS, revisi commit yang dilayani CDN, dan mengulangi browser suite pada alamat publik dengan TLS verification tetap aktif. Pull request menjalankan verifikasi tanpa deployment.

Pemilik repository perlu mengatur **Settings → Pages → Build and deployment → Source: GitHub Actions** bila belum aktif. Membuat file workflow saja tidak mengaktifkan layanan Pages. Setelah aktif, commit yang lolos checks akan dipublikasikan ke:

`https://donnyrz.github.io/DHCE-Demo/`

Semua path aset relatif dan routing memakai hash, sehingga subpath repository dan refresh route didukung. URL belum dapat disebut live sampai deployment GitHub berhasil dan akses publik sudah diverifikasi.

## Batas MVP

Tidak mencakup pengangkatan/approval nyata, decision case formal, tracking assignment, leadership outcomes longitudinal, report builder, atau restructuring. Tidak ada klaim AI menetapkan keputusan final. Fitur yang ditampilkan dalam cakupan Tier A menggunakan interaksi lokal yang berfungsi.
