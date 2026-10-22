const names = [
  "Nara Putri",
  "Bayu Pratama",
  "Citra Lestari",
  "Dimas Raharjo",
  "Sari Anggraini",
  "Raka Kurniawan",
  "Amalia Safitri",
  "Arief Nugraha",
  "Intan Permata",
  "Reza Mahendra",
  "Nadia Kusuma",
  "Fajar Wicaksono",
  "Rani Puspita",
  "Aditya Saputra",
  "Maya Kartika",
  "Dewi Larasati",
  "Bima Wardhana",
  "Putra Hidayat",
  "Ayu Maharani",
  "Rizky Ramadhan",
  "Laras Wulandari",
  "Andra Prakoso",
  "Gita Saraswati",
  "Yudha Santosa",
  "Ratna Utami",
  "Yoga Firmansyah",
  "Tiara Febriani",
  "Bagas Adinata",
  "Vina Paramita",
  "Danu Wiratama",
];
const cids = [
  "mandiri",
  "bri",
  "telkom",
  "pertamina",
  "pln",
  "bni",
  "pelindo",
  "kai",
  "inalum",
  "pgn",
];
export const talents = Array.from({ length: 60 }, (_, i) => ({
  id: `talent-${i + 1}`,
  name:
    i < 30
      ? names[i]
      : [
          "Hana",
          "Surya",
          "Naufal",
          "Nisa",
          "Galih",
          "Alif",
          "Melati",
          "Farhan",
          "Anisa",
          "Damar",
        ][i % 10] +
        " " +
        ["Wibowo", "Prasetyo", "Santoso"][Math.floor((i - 30) / 10)],
  companyId: cids[i % 10],
  title:
    i < 2
      ? "Direktur Keuangan"
      : i === 2
        ? "SVP Keuangan"
        : [
            "Head of Corporate Finance",
            "VP Financial Planning",
            "GM Treasury",
            "Head of Risk Management",
            "Director Operations",
          ][i % 5],
  family:
    i < 6
      ? "Finance"
      : ["Operations", "Risk", "Technology", "People", "Finance"][i % 5],
  grade: i === 0 ? 15 : 14 - (i % 3 === 2 ? 1 : 0),
  years: i === 0 ? 12 : i === 1 ? 10 : i === 2 ? 8 : 9 + (i % 12),
  confidence: i === 2 ? "Insufficient" : i % 11 === 0 ? "Medium" : "High",
  updated:
    i % 11 === 0
      ? "2025-11-14"
      : "2026-09-" + String(5 + (i % 23)).padStart(2, "0"),
  education: [
    "Magister Manajemen · Universitas Indonesia",
    "MBA · Institut Teknologi Bandung",
    "Magister Akuntansi · Universitas Gadjah Mada",
  ][i % 3],
  experience: [
    "Corporate finance, M&A, treasury",
    "Strategic planning, investor relations",
    "Financial planning, risk management",
  ][i % 3],
  levels: [5 - (i % 3), 4 - (i % 2), 4, 4, 4],
  trajectory: [
    {
      year: "2022–sekarang",
      role: i < 2 ? "Direktur Keuangan" : "Pimpinan fungsi strategis",
    },
    { year: "2018–2022", role: "Vice President · Corporate Strategy" },
    { year: "2014–2018", role: "Senior Manager · Finance & Planning" },
  ],
}));
