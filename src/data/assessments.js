import { talents } from "./talents.js";
export const bands = [
  "Ready Now",
  "Ready in 1–2 years",
  "Ready in 3–5 years",
  "Development required",
  "Belum dapat ditentukan",
];
export function assessmentRecords(role, snapshot = "2026-09-30") {
  const monthsAgo = Math.max(
    0,
    (2026 - Number(snapshot.slice(0, 4))) * 12 +
      9 -
      Number(snapshot.slice(5, 7)),
  );
  const status =
    role.status === "covered" &&
    role.index % 12 < Math.min(7, Math.ceil(monthsAgo / 2))
      ? "gap"
      : role.status;
  const ids =
    role.id === "pertamina-cfo"
      ? Array.from({ length: talents.length }, (_, i) => i)
      : Array.from(
          { length: talents.length },
          (_, i) => (role.index * 3 + i * 7) % talents.length,
        );
  return ids.map((n, i) => {
    const talent = talents[n];
    const unknown =
      status === "unknown" || i === 2 || role.unresolved || role.conflict;
    const eligible =
      i === 7 ? "Not eligible" : unknown ? "Under review" : "Eligible";
    let readiness = unknown
      ? bands[4]
      : status === "covered" && i === 0
        ? bands[0]
        : i < 4
          ? bands[1]
          : i < 6
            ? bands[2]
            : bands[3];
    if (eligible === "Not eligible" && !unknown) readiness = bands[3];
    const fit = unknown
      ? null
      : role.id === "pertamina-cfo" && i === 0
        ? 88
        : role.id === "pertamina-cfo" && i === 1
          ? 82
          : Math.max(61, 90 - i * 3 - (role.index % 8));
    const actual = unknown
      ? null
      : role.required.map((r, k) =>
          Math.max(
            1,
            r - (readiness === bands[0] ? 0 : k < 2 ? 1 : i >= 3 ? i % 2 : 0),
          ),
        );
    return {
      id: `${role.id}:${talent.id}`,
      roleId: role.id,
      talentId: talent.id,
      eligible,
      readiness,
      fit,
      actual,
      confidence: role.conflict
        ? "Conflict"
        : unknown
          ? "Insufficient"
          : i === 5
            ? "Medium"
            : "High",
      slate:
        !unknown &&
        eligible === "Eligible" &&
        i < 2 &&
        !(status === "gap" && role.index % 7 === 0),
      componentFit: unknown
        ? null
        : [
            fit,
            Math.min(100, fit + 4),
            Math.max(0, fit - 3),
            Math.min(100, fit + 2),
            fit,
          ],
      snapshot,
    };
  });
}
