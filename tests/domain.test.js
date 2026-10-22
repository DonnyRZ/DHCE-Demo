import test from "node:test";
import assert from "node:assert/strict";
import { companies, snapshots } from "../src/data/companies.js";
import { roles } from "../src/data/roles.js";
import { talents } from "../src/data/talents.js";
import {
  summary,
  roleStats,
  scopedRoles,
  getRole,
  qualityIssues,
  qualityMetrics,
} from "../src/services/portfolio.js";
import { matches, gaps, recommendations } from "../src/services/matching.js";
import { csvCell } from "../src/services/export.js";
test("portfolio totals are computed and reconcile for every scope and snapshot", () => {
  for (const snapshot of snapshots)
    for (const scope of ["all", ...companies.map((c) => c.id)]) {
      const s = summary(scopedRoles(scope), snapshot);
      assert.equal(s.total, s.covered + s.gaps + s.unknown);
      assert.equal(s.assessed, s.covered + s.gaps);
      assert.equal(
        s.coverage,
        s.assessed ? Math.round((s.covered / s.assessed) * 100) : null,
      );
    }
  assert.equal(roles.filter((r) => r.critical).length, 120);
});
test("every object reference, matching candidate and slate is valid", () => {
  const ids = new Set(talents.map((t) => t.id));
  for (const r of roles) {
    assert(companies.some((c) => c.id === r.companyId));
    const pool = matches(r, snapshots[0]);
    assert.equal(new Set(pool.map((a) => a.talentId)).size, 60);
    assert(pool.every((a) => ids.has(a.talentId)));
    for (const a of pool.filter((a) => a.slate)) {
      assert.equal(a.eligible, "Eligible");
      assert.notEqual(a.fit, null);
    }
  }
});
test("unknown and conflicts never produce zero-fit or a confirmed successor gap", () => {
  const r = getRole("pertamina-chro"),
    s = roleStats(r, snapshots[0]);
  assert(s.unknown);
  assert.equal(s.now, null);
  assert.equal(s.near, null);
  assert(s.all.every((a) => a.fit === null));
  assert(s.all.every((a) => a.readiness === "Belum dapat ditentukan"));
  assert.equal(gaps(r, s.all[0]), null);
  assert.deepEqual(recommendations(r, s.all[0]), []);
});
test("reference investigation has separate matching pool and slate with specific gaps", () => {
  const r = getRole("pertamina-cfo"),
    pool = matches(r, snapshots[0]);
  assert.equal(pool.length, 60);
  assert.equal(pool.filter((a) => a.slate).length, 2);
  const n = pool.find((a) => a.talentId === "talent-1"),
    b = pool.find((a) => a.talentId === "talent-2");
  assert.equal(n.readiness, "Ready Now");
  assert.equal(n.fit, 88);
  assert.equal(b.fit, 82);
  assert.equal(b.readiness, "Ready in 1–2 years");
  assert.deepEqual(
    gaps(r, b).map((g) => g.name),
    ["Financial Strategy", "Stakeholder Management"],
  );
  assert(recommendations(r, b).every((x) => x.status.includes("Usulan")));
});
test("historical snapshots use their own assessment outcomes", () => {
  const r = getRole("pertamina-cfo");
  assert.equal(roleStats(r, snapshots[0]).now, 1);
  assert.equal(roleStats(r, snapshots[2]).now, 0);
});
test("quality metrics reconcile, issue references exist, no-successor fixture exists", () => {
  const issues = qualityIssues();
  assert(issues.length > 0);
  assert(issues.every((i) => getRole(i.roleId)));
  assert(qualityMetrics("all", snapshots[0]).every((m) => m.count <= m.total));
  assert(
    roles.some((r) => {
      const s = roleStats(r, snapshots[0]);
      return !s.unknown && !s.slate.length;
    }),
  );
});
test("CSV quotes user text and neutralizes spreadsheet formula prefixes", () => {
  assert.equal(csvCell('A,"B"'), '"A,""B"""');
  assert.equal(csvCell("=SUM(A1)"), '"\'=SUM(A1)"');
  assert.equal(csvCell(null), '""');
});
