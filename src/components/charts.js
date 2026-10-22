import { summary } from "../services/portfolio.js";
import { date, e } from "./ui.js";
export function coverageChart(roles, snapshot) {
  const end = new Date(snapshot + "T12:00:00Z");
  const points = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(
      Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 10 + i, 0, 12),
    );
    const iso = d.toISOString().slice(0, 10);
    return { date: iso, ...summary(roles, iso) };
  });
  const coords = points.map((p, i) => [
    45 + i * 56,
    220 - (p.coverage ?? 0) * 1.8,
  ]);
  const path = coords
    .map(([x, y], i) => (i ? "L" : "M") + x + " " + y)
    .join(" ");
  return `<div class="chart-wrap"><svg viewBox="0 0 700 265" role="img" aria-label="Tren coverage berdasarkan role yang dapat dinilai. Detail angka tersedia pada tabel tren.">${[0, 20, 40, 60, 80, 100].map((n) => `<line x1="45" x2="666" y1="${220 - n * 1.8}" y2="${220 - n * 1.8}" stroke="#e2e8f0"/><text x="30" y="${224 - n * 1.8}" text-anchor="end">${n}%</text>`).join("")}<path d="${path} L661 220 L45 220 Z" fill="#eff6ff"/><path d="${path}" stroke="#2563eb" stroke-width="2.5" fill="none"/>${coords.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#2563eb"><title>${date(points[i].date)}: ${points[i].covered}/${points[i].assessed} (${points[i].coverage ?? "—"}%)</title></circle>${i % 2 === 0 || i === 11 ? `<text x="${x}" y="245" text-anchor="middle">${e(date(points[i].date).split(" ").slice(1).join(" "))}</text>` : ""}`).join("")}</svg></div><details class="chart-data"><summary>Lihat tabel tren</summary><table><caption class="sr-only">Coverage setiap snapshot bulanan</caption><thead><tr><th>Bulan</th><th>Covered / dinilai</th><th>Coverage</th></tr></thead><tbody>${points.map((p) => `<tr><td>${date(p.date)}</td><td>${p.covered} / ${p.assessed}</td><td>${p.coverage ?? "—"}%</td></tr>`).join("")}</tbody></table></details>`;
}
