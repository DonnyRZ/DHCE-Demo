# DHCE MVP — Cakupan dan verifikasi

Dokumen ini menjadi inventaris fitur, bukan klaim bahwa seluruh kemungkinan input atau seluruh standar aksesibilitas sudah diuji. Hasil aktual diperiksa melalui `npm run check` dan workflow GitHub Actions.

## Halaman

| ID  | Implementasi                 | Interaksi utama                                                                 | Verifikasi                                    |
| --- | ---------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------- |
| H01 | `pages/overview`             | KPI drill-down, scope/snapshot, chart data, attention, saved views, PDF         | Domain totals; risk journey; viewport/refresh |
| P01 | `pages/company-directory`    | Search, sektor/coverage, sort, columns, pagination, saved view, CSV             | Filter zero results; clear; export            |
| P02 | `pages/company-detail`       | Overview/Roles/Talent/Succession/Data Quality, favorites, deep links            | Semua tab; persistence                        |
| J01 | `pages/role-directory`       | Search canonical/local title, family/grade/BUMN, critical only, table controls  | Sort/pagination/columns; shared view          |
| J02 | `pages/role-detail`          | Overview/Requirements/Succession/Candidates/Evidence, compare tray              | Semua tab; selection; context protection      |
| T01 | `pages/talent-directory`     | Professional search, company/family/experience/confidence                       | Viewport/refresh; company/talent links        |
| T02 | `pages/talent-profile`       | Experience/Competency/Assessments/Target Role/Evidence                          | Semua tab; explicit target; unknown evidence  |
| M02 | `pages/candidate-comparison` | 2–4 candidates, differences, replacement/removal, evidence, separate compliance | Bounds, refresh, CSV/print/PDF context        |
| S01 | `pages/succession-risks`     | Gap/covered/unknown/stale/no successor/vacancy presets, filter, role drill-down | Domain status reconciliation; weekly journey  |
| G01 | `pages/data-quality`         | Freshness/missing/conflict/traceability, affected objects, evidence             | Quality metrics; conflict filter/source       |

## Gabungan Tier A

- H02: Attention section dan notification drawer; mark read tidak mengubah underlying risk.
- M01: Role Detail/Candidates; urutan default eligibility, readiness, kemudian fit dalam band.
- S02: Role Detail/Succession; slate tercatat terpisah dari matching pool.
- D01: Talent Profile/Target Role; recommendation terhubung gap, exposure, evidence, reassessment.
- G02: Evidence drawer dan source detail, keyboard close serta focus return.
- X01: Search overlay dengan kategori, konteks, recently viewed, keyboard, dan no-results.
- V01: Saved views panel, CRUD, private/team label, fixed/latest, columns, share link. Recent Reports mempunyai empty state; report builder tidak ditambahkan.

## Kontrak bersama

- Satu sumber dataset; referensi company/role/talent divalidasi.
- Unknown/conflict dipisahkan dari no Ready Now dan no successor.
- Fit bukan probabilitas; readiness dan assurance terpisah; compliance tidak masuk fit.
- Global scope dan local candidate pool dibedakan; snapshot tidak dicampur dalam comparison.
- Filter, sort, pagination berada pada URL; preferensi disimpan lokal.
- Mandatory identity/selection columns tidak dapat disembunyikan.
- Form validation: nama view wajib, 2–4 kandidat, maksimal 4 selection pada tray, invalid detail/comparison routes.
- Progressive disclosure melalui tab/drawer; dialogs memakai native modal focus trap dan Esc.
- Desktop/laptop/mobile; tabel lebar mempunyai area scroll lokal, comparison mobile menggunakan field dan kandidat bertumpuk.
- CSV meliputi hasil filter; print/PDF merupakan ringkasan record aktif dengan scope/snapshot dan label data ilustratif.
- Save/rename/duplicate/delete views, notification read, favorites, density, columns, dan reset bekerja pada localStorage.
- Saat localStorage diblokir, perubahan tetap berfungsi dalam sesi dengan keterangan persistensi.
- Reader mode membatasi assessment/evidence/export sebagai simulasi UX, bukan security backend.
- Initial loading, empty, filtered-empty, missing/conflict, stale, historical, restricted, invalid route/object, dan page error recovery memiliki tampilan.

## Deployment

Workflow harus lolos unit/domain, browser, dan build sebelum deploy. Mockup dan dokumentasi tidak disertakan dalam artifact aplikasi. Selesaikan pengaktifan Pages oleh pemilik bila integrasi GitHub menolak operasi tersebut, kemudian verifikasi URL publik dengan suite browser yang sama.
