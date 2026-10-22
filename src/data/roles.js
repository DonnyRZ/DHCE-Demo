import { companies } from "./companies.js";
export const competencies = [
  "Financial Strategy",
  "Stakeholder Management",
  "Leadership & People",
  "Business Acumen",
  "Risk & Compliance",
];
const titles = [
  ["cfo", "Direktur Keuangan", "Chief Financial Officer", "Finance"],
  ["coo", "Direktur Operasi", "Chief Operating Officer", "Operations"],
  ["ceo", "Direktur Utama", "Chief Executive Officer", "Leadership"],
  ["chro", "Direktur SDM", "Chief Human Resources Officer", "People"],
  ["cto", "Direktur Teknologi", "Chief Technology Officer", "Technology"],
  ["risk", "Direktur Manajemen Risiko", "Chief Risk Officer", "Risk"],
  ["strategy", "Direktur Strategi", "Chief Strategy Officer", "Strategy"],
  [
    "commercial",
    "Direktur Komersial",
    "Chief Commercial Officer",
    "Commercial",
  ],
  ["legal", "Kepala Legal", "Head of Legal", "Legal"],
  ["audit", "Kepala Audit Internal", "Head of Internal Audit", "Risk"],
  [
    "transformation",
    "Direktur Transformasi",
    "Chief Transformation Officer",
    "Strategy",
  ],
  ["investment", "Direktur Investasi", "Chief Investment Officer", "Finance"],
  ["treasury", "Kepala Treasury", "Head of Treasury", "Finance"],
  ["procurement", "Kepala Pengadaan", "Head of Procurement", "Operations"],
];
export const roles = companies.flatMap((company, ci) =>
  titles.map(([key, title, canonical, family], j) => {
    const slot = ((ci * 12 + j) * 37) % 120;
    return {
      id: `${company.id}-${key}`,
      key,
      title,
      canonical,
      family,
      companyId: company.id,
      index: ci * 14 + j,
      grade: j < 8 ? 15 : j < 12 ? 14 : 13,
      jobValue: 720 - j * 13 + (ci % 3) * 7,
      critical: j < 12,
      criticality: j < 8 ? "Critical" : "High",
      status: slot < 68 ? "covered" : slot < 100 ? "gap" : "unknown",
      required: [j === 0 ? 5 : 4, 4, j < 4 ? 5 : 4, 4, 4],
      stale: (ci * 14 + j) % 9 === 0,
      conflict: (ci * 14 + j) % 23 === 5,
      unresolved: j === 13 && ci === 8,
      review: "2026-09-" + String(10 + ((ci + j) % 18)).padStart(2, "0"),
      vacancy: j % 5 === 1 ? "2026-12-31" : null,
      purpose: `Memimpin fungsi ${family.toLowerCase()} dan memastikan pencapaian strategi, tata kelola, serta keberlanjutan kinerja ${company.name}.`,
    };
  }),
);
// Preserve portfolio totals when setting the primary investigation's reference cases.
function setStatus(id, status) {
  const r = roles.find((x) => x.id === id);
  if (r.status !== status) {
    const swap = roles.find(
      (x) =>
        x.critical &&
        x.status === status &&
        x.id !== id &&
        x.companyId !== "pertamina",
    );
    swap.status = r.status;
    r.status = status;
  }
}
setStatus("pertamina-cfo", "covered");
setStatus("pertamina-coo", "gap");
setStatus("pertamina-chro", "unknown");
