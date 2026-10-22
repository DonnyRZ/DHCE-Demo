# DHCE — Keputusan Struktur Halaman MVP

Tanggal: 22 Oktober 2026
Status: keputusan desain kerja untuk MVP; belum diuji melalui prototype atau pengguna.
Sumber: `DHCE_UI_UX_Blueprint_Danantara_v1.md`, versi 1.0, dokumen unggahan pengguna.
Lingkup: arsitektur informasi, halaman, interaksi, batas fitur, dan kriteria validasi UX.

## 1. Keputusan

MVP menggunakan **10 halaman utama, 6 tujuan sidebar, dan 4 fitur global**. Seluruh 17 layar/template Tier A dipetakan ke struktur ini. Sebagian menjadi tab atau panel kontekstual; cakupan informasi intinya dipertahankan.

Alur produk yang diprioritaskan:

**Kenali risiko → buka role → pahami successor dan kandidat → bandingkan → periksa evidence → lihat kebutuhan development → simpan analisis.**

Appointment Review, pencatatan keputusan final, development tracking, outcomes, report builder, dan restructuring berada di luar MVP. Ringkasan perbandingan boleh dibagikan atau diekspor sesuai akses, tetapi bukan decision case formal.

Jumlah 10 adalah keputusan berdasarkan kebutuhan informasi saat ini, bukan kuota yang harus dipertahankan jika pengujian menunjukkan masalah. Pengguna tidak perlu menyetujui ulang pilihan rutin ini sebelum wireframe dibuat.

## 2. Dasar audit dan batas kesimpulan

Audit dilakukan terhadap blueprint, terutama bagian 0–8, 12–19, serta pemetaan metodologi. Penilaian mengikuti tugas P2/P3 sebagai pengguna aktif, dengan Executive Overview untuk kebutuhan P1 dan Data Quality untuk P5.

Repositori saat audit belum memiliki antarmuka atau kode aplikasi. Karena itu, ini adalah audit rancangan: belum ada pengukuran waktu tugas, evaluasi performa, pengujian aksesibilitas implementasi, atau usability test. PDF metodologi dan dokumen transformasi yang dirujuk blueprint tidak tersedia sebagai sumber terpisah dalam audit ini; aturan engine tidak divalidasi ulang. Referensi eksternal dalam blueprint tidak diklaim telah ditinjau ulang.

Label kewenangan, akses data, definisi KPI, dan readiness mengikuti status usulan dalam blueprint. Data demo harus diberi label simulasi dan tidak merepresentasikan fakta atau otorisasi resmi Danantara.

## 3. Kriteria pemisahan halaman

Halaman mandiri diberikan jika pengguna membutuhkan salah satu konteks berikut secara substansial:

1. Ruang kerja berulang dengan banyak objek, filter, dan keputusan navigasi sendiri.
2. Identitas objek stabil yang perlu dibuka langsung, dibagikan, atau dikunjungi kembali.
3. Ruang analisis besar yang tidak nyaman ditampilkan dalam drawer atau tab kecil.

Tab digunakan untuk sudut pandang berbeda dari objek yang sama. Drawer digunakan untuk pemeriksaan bukti tanpa meninggalkan pekerjaan. Overlay digunakan untuk navigasi lintas objek. Aksi menyimpan, menyaring, atau mengekspor tidak otomatis membutuhkan halaman baru.

Tab dan overlay tetap dapat memiliki deep link atau state navigasi. Jumlah halaman di dokumen ini menghitung template halaman penuh, bukan setiap URL, variasi data, breakpoint, atau state.

## 4. Temuan audit

### 4.1 Jumlah layar dalam blueprint bercampur dengan jumlah halaman

Blueprint sendiri menyebut screen/template. H02, G02, X01, dan V01 tidak memiliki kebutuhan yang sama dengan Company Detail atau Candidate Comparison. Memperlakukan semuanya sebagai halaman akan menambah perpindahan dan pekerjaan desain shell tanpa memberi manfaat setara.

### 4.2 Role Detail perlu menjadi pusat investigasi

Requirement, matching, dan succession membahas satu target jabatan. Memisahkan ketiganya ke halaman setara membuat identitas role, snapshot, dan filter lebih mudah hilang. J02, M01, dan S02 disatukan dalam satu halaman dengan tab yang jelas; tabel panjang tetap mendapat lebar konten penuh.

**Batas penting:** matching pool dan successor slate bukan kumpulan data yang otomatis identik. Matching menampilkan hasil evaluasi kandidat untuk target role. Slate menampilkan daftar successor yang tercatat pada snapshot tersebut. Jika status pencatatan/review tidak tersedia, UI tidak boleh menyatakan kandidat sudah disepakati atau disahkan. Tidak ada aksi otomatis untuk mengangkat kandidat atau membuat slate resmi di MVP.

### 4.3 Development membutuhkan konteks person–role

Halaman rekomendasi development terpisah terlalu mudah menjadi katalog generik. D01 ditempatkan di Talent Profile, di dalam area Target Role. Kandidat, target role, gap, dan snapshot harus tetap terlihat. Dari succession atau comparison tersedia tautan langsung ke area tersebut.

### 4.4 Saved Views penting; halaman library belum diperlukan

Pengguna perlu menyimpan dan membuka kembali investigasi, bukan mengelola perpustakaan laporan besar. MVP menyediakan daftar My Views/Team Views melalui panel global serta pinned views di sidebar. Pencarian, rename, duplicate, dan pembukaan view tersedia di sana. Ini mengurangi satu halaman dari usulan awal 11 halaman.

Bagian Recent Reports hanya menampilkan laporan yang benar-benar tersedia bagi pengguna. Jika belum ada, tampilkan empty state. Tidak dibuat generator laporan atau workflow approval untuk mengisi panel.

### 4.5 Risk List dan Role Directory tetap dipisahkan

Keduanya dapat menggunakan komponen tabel yang sama, tetapi pekerjaannya berbeda:

- Role Directory menjawab “jabatan apa yang ada dan apa requirement-nya?” dengan canonical role, family, grade, dan job value.
- Succession Risks menjawab “jabatan mana yang perlu ditinjau dahulu dan mengapa?” dengan coverage, urgency, successor count, confidence, dan alasan risiko.

Memaksa keduanya menjadi satu daftar membutuhkan pergantian kolom dan sort berulang. Risk List dipertahankan sebagai tujuan kerja utama dengan preset yang dapat disimpan. Tidak dibuat salinan role detail atau data role tersendiri.

### 4.6 Company Detail dan Comparison layak menjadi halaman penuh

Company Detail memberi konteks satu BUMN, subtab lintas objek, dan identitas yang dapat dibuka langsung. Comparison memerlukan ruang untuk 2–4 kandidat, required vs actual, gap, serta evidence. Menempatkan salah satunya dalam modal panjang akan menyulitkan pemindaian dan navigasi keyboard.

### 4.7 Alur prototype blueprint melewati batas Tier A

Alur contoh memasukkan A01 dan D02, padahal keduanya Tier B. MVP mengganti endpoint itu dengan ringkasan perbandingan, rekomendasi development, dan saved view. Tombol “Prepare Decision Review” atau “Track Plan” yang belum berfungsi tidak dipasang sebagai CTA utama.

### 4.8 Readiness dan kualitas data perlu konsistensi istilah

Blueprint menggunakan variasi “Not Ready”, “Development Required”, dan bentuk singkat readiness band. UI menggunakan glosarium konsisten, tetapi tidak menganggap dua kategori itu identik tanpa pemetaan domain yang sah. Unknown, insufficient evidence, conflicting evidence, not eligible, no Ready Now, dan no successor harus tetap dapat dibedakan.

## 5. Daftar 10 halaman MVP

| No. | Halaman | ID asal | Alasan mandiri | Aksi utama |
|---|---|---|---|---|
| 1 | Executive Overview | H01 | Titik masuk monitoring lintas portofolio | Buka risiko atau record yang perlu ditinjau |
| 2 | Company Directory | P01 | Pencarian dan perbandingan banyak BUMN | Buka perusahaan |
| 3 | Company Detail | P02 | Identitas satu BUMN dan konteks lintas role/talent | Buka critical role terkait |
| 4 | Role Directory | J01 | Eksplorasi arsitektur jabatan lintas perusahaan | Buka role |
| 5 | Role Detail | J02 + M01 + S02 | Pusat analisis satu target role | Tinjau successor atau kandidat |
| 6 | Talent Directory | T01 | Penemuan talent berdasarkan informasi profesional | Buka profil |
| 7 | Talent Profile | T02 + D01 | Identitas talent dan evaluasi terhadap target role | Evaluasi target role / lihat development |
| 8 | Candidate Comparison | M02 | Perbandingan mendalam 2–4 kandidat | Periksa perbedaan dan evidence |
| 9 | Succession Risks | S01 | Antrian investigasi risiko leadership | Buka role pada tab Succession |
| 10 | Data Quality | G01 | Investigasi kualitas data lintas banyak objek | Buka isu dan evidence terdampak |

### 5.1 Executive Overview

- Maksimum empat KPI, attention rows, portfolio comparison, dan tren bila data cukup.
- KPI memiliki definisi, scope, snapshot, denominator yang relevan, dan drill-down.
- Attention rows menyerap bagian terpenting H02; tidak ada duplikasi dashboard kedua.
- CTA utama mengarah ke Succession Risks dengan filter yang diwariskan.
- Jika data belum memadai, jangan memberi kesimpulan aman atau menampilkan angka nol sementara.

### 5.2 Company Directory

- Table-first: BUMN, sektor, critical roles, Ready Now coverage, evidence coverage, snapshot.
- Search, filter sektor/coverage, sort, columns, pagination, dan save view.
- Row membuka Company Detail; nilai coverage dapat membuka risk list terfilter.
- Pencarian dan hasil yang dibatasi akses mengikuti kebijakan visibilitas.

### 5.3 Company Detail

- Header identitas BUMN dan snapshot; tabs Overview, Roles, Talent, Succession, Data Quality.
- Tab berisi ringkasan dan daftar terkait, memakai komponen yang sama dengan direktori.
- Daftar besar memiliki tautan ke direktori dengan company filter; tidak membuat versi tabel dengan perilaku berbeda.
- Buka role atau talent tanpa menghilangkan asal daftar dan posisi kembali.

### 5.4 Role Directory

- Kolom role lokal/canonical, BUMN, family, grade, job value, criticality, successor status.
- Filter arsitektur jabatan, toggle critical only, search, sort, save view.
- Status yang belum terselesaikan ditampilkan sebagai unresolved/conflict, bukan angka perkiraan.
- Job comparison khusus belum menjadi fitur MVP baru; Candidate Comparison hanya untuk talent pada satu target role.

### 5.5 Role Detail — pusat workflow

Header tetap menampilkan role, BUMN, grade, criticality, dan snapshot.

| Tab | Isi | Perilaku |
|---|---|---|
| Overview | Tujuan role, identitas, criticality, ringkasan coverage | Jalur cepat ke Succession dan Candidates |
| Requirements | Role success profile, kompetensi wajib, experience | Required level eksplisit; evidence dapat diperiksa |
| Succession | Slate yang tercatat, dikelompokkan berdasarkan readiness | Tidak dicampur dengan seluruh matching pool |
| Candidates | Hasil matching terhadap role ini | Filter eligibility/readiness/confidence; pilih 2–4 kandidat |
| Evidence & History | Sumber requirement, assessment yang relevan, snapshot tersedia | Read-only; bukan Policy History workspace Tier B |

- Tab default Overview untuk direct entry; entry dari risk list membuka Succession, dari pencarian kandidat membuka Candidates.
- Sort kandidat mengikuti aturan domain yang tersedia; tidak menyusun leaderboard dari Role Fit saja.
- Detail cepat kandidat boleh menggunakan preview drawer, dengan tautan ke profil kanonis.
- Tray compare hanya berlaku untuk target role dan snapshot yang sama. Mengganti salah satunya meminta pengguna mengosongkan atau meninjau ulang pilihan.
- Pemilihan scope kandidat lintas BUMN terpisah dari perusahaan pemilik role. Scope perusahaan tidak boleh diam-diam menghalangi pencarian successor lintas portofolio; candidate pool yang sedang digunakan selalu terlihat dan tetap tunduk akses.

### 5.6 Talent Directory

- Kolom identitas profesional, current role/BUMN, pengalaman, grade/scope yang tersedia, confidence, last updated.
- Tidak menampilkan skor fit atau readiness global tanpa target role.
- Search/filter untuk menemukan talent, lalu buka Talent Profile.
- Tidak menampilkan atribut pribadi yang tidak relevan bagi pekerjaan.

### 5.7 Talent Profile — termasuk development

- Header profesional stabil; tabs Experience, Competency, Assessments, Target Role, Evidence.
- Jika datang dari matching/compare, target role dan snapshot dipertahankan.
- Jika belum ada target, tab Target Role meminta pemilihan role sebelum menampilkan fit/readiness/development.
- Dalam Target Role: ringkasan eligibility/fit/readiness/confidence, gap breakdown, lalu Development Recommendations pada section yang dapat ditautkan langsung.
- Development menampilkan gap yang dituju, exposure/assignment usulan, feasibility bila tersedia, expected evidence, dan reassessment window.
- “Review recommendation” membuka rincian rekomendasi; bukan pendaftaran pelatihan, assignment resmi, atau tracking plan baru.
- Selesai assignment tidak otomatis menaikkan readiness. D02 tetap di luar MVP.

### 5.8 Candidate Comparison

- Dedicated page, masuk dari role/slate; bukan item sidebar.
- Satu target role dan snapshot untuk 2–4 kandidat; sticky identity dan row labels.
- Urutan: eligibility, readiness, Role Fit dan komponen, data confidence, required vs actual/gaps, critical experience, development, evidence.
- “Differences only”, ganti/hapus kandidat, evidence drawer, dan kembali ke daftar sumber dengan filter/selection dipertahankan.
- Ringkasan perbandingan yang diekspor harus menyertakan scope, target role, snapshot, batas evidence, dan label simulasi jika relevan. Tidak mengubah status kandidat.
- Tidak ada label pemenang, keputusan AI, atau tombol pengangkatan.

### 5.9 Succession Risks

- Default: critical roles; preset No Ready Now, No Successor, High Criticality/Low Coverage, Stale Evidence, Upcoming Vacancy bila ada sumber valid.
- Kolom risk reason, criticality, Ready Now count, near-term count, confidence, snapshot/last review.
- Pisahkan confirmed coverage gap dari readiness undetermined. Summary tidak menghitung undetermined sebagai nol successor tanpa penjelasan.
- Klik row membuka Role Detail → Succession; risk ke kandidat maksimum tiga perpindahan utama sebagai target desain.
- Tidak ada penyelesaian risiko hanya dengan “mark reviewed”.

### 5.10 Data Quality

- Ringkasan freshness, mandatory evidence missing, material conflicts, traceability, affected roles/talent.
- Tabel isu dengan dampak terhadap penilaian dan link ke objek/evidence terkait.
- Detail isu menggunakan drawer bersama dengan akses yang sesuai.
- Tidak mencakup input assessment manual, ETL console, edit engine, atau policy editor.

## 6. Empat fitur global

| Fitur | Blueprint | Bentuk | Kemampuan MVP |
|---|---|---|---|
| Universal Search | X01 | Overlay dari header dan Ctrl/Cmd+K | Grouped results, recent objects, konteks BUMN/role, no-results yang membantu |
| Evidence Inspector | G02 | Drawer; full-screen pada viewport sempit | Claim, why, source/section, timestamp, policy label, confidence, missing/conflict, copy reference |
| Attention / Notifications | H02 | Attention section di Overview + panel dari header | Leadership risks, data issues, review items yang benar-benar ada; tautan ke objek |
| Saved Views / Available Reports | V01 | Panel dari My Views; pinned items di sidebar | My/Team Views, open, save, rename, duplicate, scope/filter/sort/columns/snapshot mode; recent reports bila tersedia |

Empat fitur ini bukan empat halaman penuh tambahan. Dialog kecil Save/Rename View dan kandidat preview drawer adalah interaksi pendukung, bukan template produk baru.

Status read/review pada notifikasi hanya menandai item telah ditinjau, tidak mengubah risiko bisnis. Jika tidak ada review workflow, jangan membuat approval task simulatif.

Saved view menyimpan apakah snapshot latest atau fixed date. View dari pengguna lain tidak memberi akses baru. Panel juga memiliki search dan tampilan semua view yang dapat diakses, sehingga pinned list bukan satu-satunya jalur penemuan.

## 7. Navigasi MVP

```text
Overview

Portfolio
  Companies
  Roles
  Talent

Succession
  Succession Risks

Governance
  Data Quality

My Views [membuka panel; pinned views di bawahnya]
```

Enam tujuan halaman di sidebar: Overview, Companies, Roles, Talent, Succession Risks, Data Quality. Empat halaman lainnya adalah tiga object detail dan satu comparison yang dibuka sesuai konteks.

My Views adalah kontrol fitur, bukan tujuan halaman ketujuh. Global header menyediakan search, scope, snapshot/periode yang sesuai halaman, attention, dan profil/help. Tidak ada section kosong Decisions, Development, Intelligence, atau Restructuring di MVP. Kebutuhan development ditemukan melalui profil talent dan tautan dari slate/compare.

Breadcrumb dan tombol Back menunjukkan asal investigasi. Identitas objek tidak berubah mengikuti scope header yang bertentangan: UI harus menjelaskan objek di luar scope atau menawarkan kembali ke hasil, bukan mengganti objek diam-diam.

## 8. Pemetaan lengkap 17 layar Tier A

| ID asal | Tempat di MVP | Status |
|---|---|---|
| H01 | Executive Overview | Halaman penuh |
| H02 | Overview attention + header panel | Digabung; tugas investigasi tetap tersedia |
| P01 | Company Directory | Halaman penuh |
| P02 | Company Detail | Halaman penuh |
| J01 | Role Directory | Halaman penuh |
| J02 | Role Detail | Halaman penuh |
| T01 | Talent Directory | Halaman penuh |
| T02 | Talent Profile | Halaman penuh |
| M01 | Role Detail → Candidates | Tab, lebar konten penuh |
| M02 | Candidate Comparison | Halaman penuh |
| S01 | Succession Risks | Halaman penuh |
| S02 | Role Detail → Succession | Tab, slate dibedakan dari matching pool |
| D01 | Talent Profile → Target Role → Development | Section kontekstual dengan deep link |
| G01 | Data Quality | Halaman penuh |
| G02 | Evidence Inspector global | Drawer/full-screen sesuai viewport |
| X01 | Universal Search global | Overlay |
| V01 | My Views / available reports panel | Panel global, bukan report builder |

Perubahan dari usulan percakapan sebelumnya: 11 menjadi 10 halaman karena V01 tidak lagi memerlukan library page. Perubahan lain mengubah bentuk penyajian, bukan menghilangkan fungsi inti Tier A.

## 9. Perbandingan alternatif yang ditolak

| Alternatif | Kelebihan | Alasan tidak dipilih |
|---|---|---|
| 17 halaman penuh | Inventaris sama dengan daftar blueprint | Banyak perpindahan untuk satu role, memisahkan evidence/search dari konteks |
| 11 halaman, Saved Views mandiri | Cocok untuk library besar | Belum ada kebutuhan pengelolaan laporan yang memerlukan halaman tersendiri |
| 9 halaman, gabungkan Risk dan Role Directory | Satu daftar role | Tujuan, kolom utama, dan prioritas investigasi berbeda; entry rutin analyst menjadi tersembunyi |
| Sangat sedikit halaman dengan modal untuk detail/compare | Navigasi dangkal | Ruang baca, deep link, back behavior, dan aksesibilitas analisis panjang memburuk |

Trade-off keputusan 10 halaman: Role Detail dan Talent Profile lebih kaya. Mitigasinya adalah tab yang stabil, tidak menumpuk semua section dalam satu halaman panjang, entry point yang kontekstual, dan URL/state yang bisa dipulihkan. Jika evaluasi pengguna menunjukkan analisis development rutin lintas banyak talent, barulah workspace development mandiri dipertimbangkan pada fase berikutnya.

## 10. Kontrak interaksi bersama

1. Global scope, local filters, target role, candidate pool, dan snapshot dibedakan. Snapshot keadaan tidak sama dengan rentang tren.
2. Filter, sort, visible columns, pagination, dan posisi scroll dipulihkan ketika kembali ke daftar. Scope/view baru tidak boleh diam-diam menampilkan seluruh data setelah nol hasil.
3. Pagination konsisten 25/50/100; gunakan komponen dasar tabel bersama. Jangan mencampur infinite scroll pada direktori lain tanpa kebutuhan yang terbukti.
4. Quick filters sederhana langsung diterapkan; advanced multi-filter memakai Apply. Active chips dan Clear all selalu jelas.
5. Row click membuka detail; checkbox memilih. Aksi keduanya tidak saling memicu. Default tidak menjalankan bulk action yang mengubah status talent.
6. Semua metrik material punya Why/Evidence. Drawer mempertahankan konteks, dapat ditutup dengan Esc, dan mengembalikan fokus ke pemicu.
7. Deep link membawa identitas/view state yang diizinkan, bukan isi profil sensitif atau kredensial. Akses diperiksa kembali; shared view tidak membypass izin.
8. Perubahan snapshot saat compare tidak mencampur hasil lama dan baru. Tampilkan perubahan konteks sebelum membangun perbandingan baru.
9. Setiap halaman memiliki state normal, loading, empty, filtered-empty, error, restricted, stale, serta insufficient/conflict jika relevan. Bukan setiap state membutuhkan halaman baru.
10. Keyboard, visible focus, semantik tabel, text labels untuk status, dan alternatif data chart ditargetkan WCAG 2.2 AA. Compliance aktual hanya dapat diklaim setelah pengujian.
11. Desktop 1280/1440/1920 menjadi fokus. Pada tablet/mobile, detail dan evidence tetap terbaca; comparison memakai stacked/aligned candidates, tidak mengecilkan empat kolom hingga tak terbaca. Tidak mendesain workflow keputusan lengkap di mobile pada MVP.

## 11. Batas MVP yang tegas

### Masuk

- Monitoring portfolio dan succession risk yang dapat ditindaklanjuti.
- Penemuan BUMN, role, talent, dan detail kanonis masing-masing.
- Matching dan slate untuk target role, beserta perbedaannya.
- Candidate comparison, evidence traceability, dan data quality.
- Rekomendasi development spesifik person–role.
- Search, attention, saved views, serta ringkasan/export yang diizinkan pada konteks analisis.

### Ditunda

- A01/A02: case review formal, workflow approval, pencatatan pengangkatan, immutable decision history.
- D02: assignment plan aktif, submission evidence, milestone tracking dan reassessment workflow.
- O01/O02: leadership outcomes dan analisis longitudinal setelah pengangkatan.
- G03: workspace policy/snapshot history lintas versi; melihat label sumber/snapshot pada evidence tetap masuk MVP.
- V02: report builder, template laporan eksekutif, report approval.
- R01/R02: restructuring, NewCo, placement scenario computation.
- HRIS operasional, payroll/cuti/absensi, rekrutmen, LMS, input assessment manual, policy/model editor.

Snapshot selector hanya menawarkan tanggal yang datanya memang tersedia. Bila demo hanya memiliki satu snapshot, UI menyatakannya dan tidak membuat histori fiktif. Hal yang sama berlaku untuk tren, review items, dan recent reports.

## 12. Alur prototype MVP yang direvisi

| Alur | Jalur | Bukti keberhasilan yang diuji |
|---|---|---|
| Review risiko mingguan | Overview → Succession Risks → Role/Succession → Compare → Evidence | Role/BUMN/snapshot tidak hilang; alasan risiko dapat dijelaskan |
| Vacancy response | Search → Role/Candidates → Compare → ringkasan | Pengguna memahami shortlist belum merupakan keputusan pengangkatan |
| Development | Talent → Target Role → Gap → Development → Evidence | Rekomendasi terkait gap; reassessment dibedakan dari checklist selesai |
| Portfolio review | Overview → Company → Roles/Succession → Save View → reopen | Scope, sort, kolom, dan mode snapshot kembali sesuai yang disimpan |
| Evidence belum cukup | Insight → Evidence → Data Quality/affected record → back | Unknown tidak dianggap nol, Not Ready, atau tidak ada successor |

Prototype tidak berakhir pada halaman Tier B yang kosong. Ekspor/ringkasan bukan pengganti governance keputusan final; alur pengangkatan memang belum masuk MVP.

## 13. Kriteria kelulusan desain dan pengujian

Sebelum implementasi dianggap memenuhi MVP, evaluasi hal berikut dengan data simulasi konsisten:

- Semua 17 ID Tier A mempunyai entry point dan tujuan yang berfungsi sesuai pemetaan; tidak ada dead-end CTA ke Tier B/C.
- Dari risk list, pengguna dapat mencapai perbandingan kandidat tanpa mengulang pencarian role.
- Kandidat dapat muncul di matching pool tanpa dinyatakan sebagai anggota slate yang sudah tercatat.
- Dua role pada talent yang sama dapat memiliki hasil fit/readiness berbeda; target role selalu terlihat.
- Dataset mencakup Ready Now, near-term, insufficient, conflict, not eligible, stale, dan restricted; satu missing score tidak dirender sebagai 0%.
- No Ready Now dan readiness undetermined tampil berbeda pada KPI, tabel, dan detail.
- Pengguna dapat membuka evidence, menutupnya, dan melanjutkan dari lokasi semula dengan keyboard.
- Browser Back mengembalikan filter, sort, halaman, scroll, dan pilihan compare bila konteks masih sama.
- Shared/fixed snapshot view tidak berubah menjadi latest tanpa penjelasan, dan tidak membocorkan objek di luar akses.
- Save, open, rename, dan duplicate view dapat dilakukan tanpa halaman library.
- Compare mendukung 2–4 kandidat tanpa scroll horizontal ekstrem pada desktop dan tetap terbaca pada viewport sempit.
- Hasil ekspor mempertahankan target role, tanggal, scope, evidence limitation, serta label simulasi.

Gunakan U1–U8 dari blueprint sebagai tugas usability, termasuk pemahaman perbedaan Role Fit/Readiness/Confidence dan recommendation/final decision. Target waktu dan persentase blueprint adalah hipotesis desain, bukan hasil audit ini. Kegagalan pengujian dipakai untuk memperbaiki struktur, bukan ditutupi dengan menambah halaman tanpa diagnosis.

## 14. Urutan desain berikutnya

1. Shell dan tiga pola bersama: tabel/filter, object detail, evidence drawer; tentukan glosarium serta state.
2. Vertical slice utama: Succession Risks → Role Detail/Succession → Candidates → Compare → Evidence.
3. Overview dan Company Directory/Detail sebagai jalur masuk ke slice utama.
4. Talent Directory/Profile, target role, dan development kontekstual; Role Directory menggunakan komponen yang sama.
5. Data Quality, search, attention, saved views; fitur ini dirancang sejak shell tetapi diselesaikan bersama data/state lintas alur.
6. Uji back/context, aksesibilitas, responsive, dan skenario evidence buruk sebelum memperluas scope.

Tidak ada kode aplikasi yang dibuat dalam audit ini. Dokumen ini menetapkan acuan halaman dan batas MVP untuk tahap wireframe serta implementasi selanjutnya.
