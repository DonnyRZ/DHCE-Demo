export function evidenceFor(role, talent, record, snapshot) {
  const person = talent?.name || role.title;
  const missing = record?.confidence === "Insufficient" || record?.fit === null;
  return [
    {
      id: "assessment",
      title: `Leadership assessment · ${person}`,
      section: "Bagian 4 · Kompetensi dan exposure",
      date: snapshot,
      status: role.conflict
        ? "Conflict"
        : missing
          ? "Insufficient"
          : "Verified",
      why: role.conflict
        ? "Dua sumber memuat level kompetensi yang berbeda. Penilaian ditahan sampai evidence direkonsiliasi."
        : missing
          ? "Evidence assessment wajib belum tersedia untuk menetapkan hasil pada target role ini."
          : "Kesimpulan didukung exercise kepemimpinan, wawancara terstruktur, dan rekam pengalaman terhadap requirement jabatan.",
      facts: role.conflict
        ? [
            "Assessment center, bagian 4: exposure lintas entitas dinilai Level 4.",
            "Rekam penugasan, bagian 2: exposure yang terverifikasi baru mendukung Level 3.",
            "Hasil rekonsiliasi material belum tersedia.",
          ]
        : missing
          ? [
              "Hasil competency exercise belum tersedia.",
              "Verifikasi exposure lintas entitas belum selesai.",
            ]
          : [
              "Pengalaman alokasi modal dan pengelolaan pemangku kepentingan terdokumentasi.",
              "Level aktual dibandingkan dengan required level pada target role.",
              "Readiness ditinjau terpisah dari persentase Role Fit.",
            ],
    },
    {
      id: "experience",
      title: `Rekam pengalaman · ${person}`,
      section: "Bagian 2 · Penugasan dan capaian",
      date: role.stale ? "2025-06-30" : snapshot,
      status: role.stale ? "Stale" : "Verified",
      why: "Riwayat penugasan memberi konteks skala tanggung jawab dan critical experience.",
      facts: [
        "Memimpin penyusunan business case investasi lintas fungsi.",
        "Presentasi kepada komite investasi dan pengawasan implementasi.",
        "Sumber pengalaman masih perlu direkonsiliasi bila terdapat konflik material.",
      ],
    },
    {
      id: "requirements",
      title: `Role Success Profile · ${role.canonical}`,
      section: "Bagian 3 · Requirement jabatan",
      date: snapshot,
      status: role.unresolved ? "Conflict" : "Verified",
      why: "Requirement menggunakan konteks jabatan, grade, dan kompetensi yang berlaku pada snapshot.",
      facts: [
        role.purpose,
        role.unresolved
          ? "Canonical mapping belum terselesaikan; Grade dan Job Value belum dapat ditetapkan."
          : "Grade " + role.grade + " · Job Value " + role.jobValue,
        "Policy reference: DHCE-RSP-2026.3 · Skala kompetensi 1–5.",
      ],
    },
  ];
}
