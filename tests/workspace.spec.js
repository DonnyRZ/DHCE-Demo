import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const paths = [
  ["overview", "Executive Overview"],
  ["companies", "Companies"],
  ["companies/pertamina", "Pertamina"],
  ["roles", "Role Directory"],
  ["roles/pertamina-cfo?tab=succession", "Direktur Keuangan"],
  ["talent", "Talent Directory"],
  ["talent/talent-2?tab=target&target=pertamina-cfo", "Bayu Pratama"],
  ["compare?role=pertamina-cfo&ids=talent-1,talent-2", "Perbandingan Kandidat"],
  ["risks", "Succession Risks"],
  ["quality", "Data Quality"],
];
test.beforeEach(async ({ page }) => {
  page.__errors = [];
  page.on("pageerror", (e) => page.__errors.push(e.message));
});
test.afterEach(async ({ page }) => {
  expect(page.__errors).toEqual([]);
});
for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
])
  for (const [path, title] of paths)
    test(`${viewport.width}px ${path} renders, refreshes and stays within viewport`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("#/" + path);
      await expect(page.locator("h1")).toContainText(title);
      await expect(page.locator(".breadcrumb, .as-of")).toHaveCount(0);
      if (
        [
          "overview",
          "companies",
          "roles",
          "talent",
          "risks",
          "quality",
        ].includes(path)
      ) {
        await expect(page.locator(".page-header")).toHaveCount(0);
        await expect(page.locator("h1")).toHaveClass("sr-only");
        const toolbar = await page.locator(".page-toolbar").boundingBox();
        const topbar = await page.locator(".app-header").boundingBox();
        expect(toolbar.y - (topbar.y + topbar.height)).toBeLessThanOrEqual(20);
      } else {
        await expect(page.locator("h1")).not.toHaveClass("sr-only");
      }
      await expect(page.locator("main")).not.toContainText(
        "Halaman belum dapat dimuat",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBeTruthy();
      await page.reload();
      await expect(page.locator("h1")).toContainText(title);
    });
test("weekly risk investigation preserves the filtered list through navigation", async ({
  page,
}) => {
  await page.goto("#/overview");
  await page.locator(".metric").filter({ hasText: "Tanpa Ready Now" }).click();
  await expect(page).toHaveURL(/preset=gap/);
  const hash = new URL(page.url()).hash;
  await page.locator("tbody tr").first().getByRole("link").first().click();
  await expect(page.locator(".tabs a.active")).toHaveText("Succession");
  await page.goBack();
  await expect(page).toHaveURL(new RegExp("preset=gap"));
  expect(new URL(page.url()).hash).toBe(hash);
});
test("company search, combined filters, no-results and clearing work", async ({
  page,
}) => {
  await page.goto("#/companies");
  await page
    .getByRole("textbox", { name: "Cari dalam daftar" })
    .fill("Pertamina");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page
    .getByLabel("Sektor", { exact: true })
    .selectOption("Jasa Keuangan");
  await expect(
    page.getByRole("heading", { name: "Tidak ada hasil sesuai filter" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hapus semua", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(10);
});
test("tables sort, paginate, change page size and persist column preferences", async ({
  page,
}) => {
  await page.goto("#/roles");
  await expect(page.locator("tbody tr")).toHaveCount(25);
  await page.getByRole("button", { name: "Halaman berikutnya" }).click();
  await expect(page).toHaveURL(/page=2/);
  await page.getByLabel("Baris per halaman").selectOption("50");
  await expect(page.locator("tbody tr")).toHaveCount(50);
  await page.getByRole("button", { name: "Grade", exact: true }).click();
  await expect(page.locator("th[aria-sort]")).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await page.getByRole("button", { name: "Grade", exact: true }).click();
  await expect(page.locator("th[aria-sort]")).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  await page.getByRole("button", { name: "Kolom", exact: true }).click();
  await page.getByLabel("Job Value", { exact: true }).uncheck();
  await page.getByRole("button", { name: "Terapkan kolom" }).click();
  await expect(
    page.getByRole("columnheader", { name: "Job Value" }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("columnheader", { name: "Job Value" }),
  ).toHaveCount(0);
});
test("matching selection, comparison differences, removal and evidence work", async ({
  page,
}) => {
  await page.goto("#/roles/pertamina-cfo?tab=candidates");
  await page.getByLabel("Pilih Nara Putri", { exact: true }).check();
  await page.getByLabel("Pilih Bayu Pratama", { exact: true }).check();
  await page
    .getByRole("button", { name: "Bandingkan kandidat", exact: true })
    .click();
  await expect(page.locator("h1")).toContainText("Perbandingan Kandidat");
  await expect(page.locator(".comparison thead th")).toHaveCount(3);
  const before = await page.locator(".comparison tbody tr").count();
  await page.getByLabel("Hanya perbedaan").check();
  expect(await page.locator(".comparison tbody tr").count()).toBeLessThan(
    before,
  );
  await page.getByLabel("Hanya perbedaan").uncheck();
  await page
    .getByRole("button", { name: "Lihat evidence", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toContainText("Evidence Inspector");
  await page
    .getByRole("button", { name: "Buka detail sumber" })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toContainText("Facts & observations");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Hapus Bayu Pratama dari comparison" })
    .click();
  await expect(page).toHaveURL(/tab=candidates/);
  await expect(page.locator(".compare-tray")).toContainText(
    "1 kandidat dipilih",
  );
});
test("comparison validates max-four and candidate replacement, persists selection", async ({
  page,
}) => {
  await page.goto("#/compare?role=pertamina-cfo&ids=talent-1,talent-2");
  await page.getByRole("button", { name: "Ganti kandidat" }).click();
  for (const id of ["talent-1", "talent-2"])
    await page.locator(`input[name=candidate][value="${id}"]`).uncheck();
  await page.getByRole("button", { name: "Bandingkan pilihan" }).click();
  await expect(page.locator("#candidate-error")).toContainText("minimal 2");
  for (const value of ["talent-1", "talent-2", "talent-3"])
    await page.locator(`input[value="${value}"][name=candidate]`).check();
  await page.getByRole("button", { name: "Bandingkan pilihan" }).click();
  await expect(page.locator(".comparison thead th")).toHaveCount(4);
  await page.reload();
  await expect(page.locator(".comparison thead th")).toHaveCount(4);
});
test("target-role development is contextual and unknown evidence is never zero", async ({
  page,
}) => {
  await page.goto("#/talent/talent-2?tab=target&target=pertamina-cfo");
  await expect(page.locator(".evaluation")).toContainText("82%");
  await page
    .getByRole("button", { name: "Tinjau rekomendasi" })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toContainText("Reassessment window");
  await page.keyboard.press("Escape");
  await page.goto("#/talent/talent-3?tab=target&target=pertamina-cfo");
  await expect(page.locator(".evaluation")).toContainText(
    "Belum dapat ditentukan",
  );
  await expect(page.locator(".evaluation")).not.toContainText("0%");
  await page.getByLabel("Target role", { exact: true }).selectOption("pln-cfo");
  await expect(page).toHaveURL(/target=pln-cfo/);
});
test("saved views CRUD, snapshot mode, columns and reload persistence", async ({
  page,
}) => {
  await page.goto("#/roles?company=pertamina&grade=15");
  await page.getByRole("button", { name: "Simpan view", exact: true }).click();
  await page.getByLabel("Nama view").fill("Finance review <Q3>");
  await page.getByLabel("Snapshot mode").selectOption("fixed");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Simpan view", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "My Views", exact: true }).click();
  const card = page
    .locator(".view-card")
    .filter({ hasText: "Finance review <Q3>" });
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "Duplikasi" }).click();
  await expect(
    page.locator(".view-card").filter({ hasText: "Finance review <Q3>" }),
  ).toHaveCount(2);
  await page
    .locator(".view-card")
    .filter({ hasText: "Finance review <Q3>" })
    .first()
    .getByRole("button", { name: "Ubah", exact: true })
    .click();
  await page.getByLabel("Nama view").fill("CFO review");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Simpan view", exact: true })
    .click();
  await page.goto("#/overview");
  await page.getByRole("button", { name: "My Views", exact: true }).click();
  await page
    .locator(".view-card")
    .filter({ hasText: "CFO review" })
    .getByRole("button", { name: "Buka", exact: true })
    .click();
  await expect(page).toHaveURL(/company=pertamina/);
  await expect(page.locator("tbody tr")).toHaveCount(8);
  await page.getByRole("button", { name: "My Views", exact: true }).click();
  await page
    .locator(".view-card")
    .filter({ hasText: "CFO review" })
    .getByRole("button", { name: "Hapus", exact: true })
    .click();
  await page.getByRole("button", { name: "Hapus view", exact: true }).click();
  await expect(
    page.locator(".view-card").filter({ hasText: "CFO review" }),
  ).toHaveCount(0);
});
test("global search keyboard navigation supports canonical titles and no-results", async ({
  page,
}) => {
  await page.goto("#/overview");
  await page.keyboard.press("Control+k");
  await page
    .getByRole("textbox", { name: "Pencarian global" })
    .fill("CFO Pertamina");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Roles", exact: true })
    .click();
  await expect(page.locator("#search-results a")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Pencarian global" }).focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator("h1")).toContainText("Direktur Keuangan");
  await page.getByRole("button", { name: /Cari BUMN/ }).click();
  await page
    .getByRole("textbox", { name: "Pencarian global" })
    .fill("zzzzmissing");
  await expect(page.getByRole("dialog")).toContainText("Tidak ada hasil");
  await page.keyboard.press("Escape");
});
test("notifications and favorites persist without changing underlying risk counts", async ({
  page,
}) => {
  await page.goto("#/overview");
  const before = await page.locator(".metric").nth(1).textContent();
  await page.getByRole("button", { name: /Notifikasi/ }).click();
  await page.getByRole("button", { name: "Tandai semua dibaca" }).click();
  await expect(page.getByRole("dialog")).toContainText("Sudah dibaca");
  await page.keyboard.press("Escape");
  expect(await page.locator(".metric").nth(1).textContent()).toBe(before);
  await page.goto("#/companies/pertamina");
  await page.getByRole("button", { name: "Favorit", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Tersimpan", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("global scope and historical snapshot recompute data and protect comparison context", async ({
  page,
}) => {
  await page.goto("#/overview");
  await page.getByLabel("Scope portofolio").selectOption("pertamina");
  await expect(page.locator(".metric").first()).toContainText("12");
  await page.getByLabel("Snapshot", { exact: true }).selectOption("2026-03-31");
  await expect(page.locator("main")).toContainText(
    "Anda melihat snapshot historis",
  );
  await page.reload();
  await expect(page.getByLabel("Scope portofolio")).toHaveValue("pertamina");
  await page.goto("#/roles/pertamina-cfo?tab=candidates&snapshot=2026-09-30");
  await page.getByLabel("Pilih Nara Putri", { exact: true }).check();
  await page.getByLabel("Snapshot", { exact: true }).selectOption("2026-06-30");
  await expect(page.getByRole("dialog")).toContainText(
    "Pilihan comparison akan dikosongkan",
  );
  await page
    .getByRole("button", { name: "Ganti snapshot", exact: true })
    .click();
  await expect(page.locator(".compare-tray")).toHaveCount(0);
});
test("CSV download contains context and printable report invokes browser printing", async ({
  page,
}) => {
  await page.goto("#/companies");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Ekspor", exact: true }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toContain("2026-09-30.csv");
  const stream = await download.createReadStream();
  let text = "";
  for await (const chunk of stream) text += chunk;
  expect(text).toContain("Snapshot");
  expect(text).toContain("Pertamina");
  expect(text).not.toContain("BUMN A");
  await page.goto("#/compare?role=pertamina-cfo&ids=talent-1,talent-2");
  await page.getByRole("button", { name: "Ekspor ringkasan" }).click();
  await expect(page.locator(".print-content")).toContainText(
    "bukan keputusan pengangkatan",
  );
  await page.evaluate(() => {
    window.print = () => (window.__printed = true);
  });
  await page.getByRole("button", { name: "Cetak / Simpan PDF" }).click();
  expect(await page.evaluate(() => window.__printed)).toBeTruthy();
});
test("reader mode restricts evidence and exports, preferences survive reload", async ({
  page,
}) => {
  await page.goto("#/roles/pertamina-cfo?tab=candidates");
  await page.getByRole("button", { name: "Profil dan preferensi" }).click();
  await page.getByLabel("Mode akses").selectOption("reader");
  await page.getByLabel("Kepadatan tabel").selectOption("compact");
  await page.getByRole("button", { name: "Simpan preferensi" }).click();
  await expect(page.locator("main")).toContainText(
    "Akses penilaian kandidat terbatas",
  );
  await page.reload();
  await expect(page.locator("main")).toContainText(
    "Akses penilaian kandidat terbatas",
  );
  await expect(page.locator("body")).toHaveClass(/compact/);
});
test("invalid routes, missing objects and corrupted storage recover safely", async ({
  page,
}) => {
  await page.goto("#/unknown");
  await expect(page.locator("h1")).toHaveText("Halaman tidak ditemukan");
  await page.goto("#/roles/missing");
  await expect(page.locator("main")).toContainText("Jabatan tidak ditemukan");
  await page.evaluate(() =>
    localStorage.setItem("dhce-workspace-v1", "not json"),
  );
  await page.goto("#/overview");
  await page.reload();
  await expect(page.locator("h1")).toHaveText("Executive Overview");
});
for (const path of [
  "overview",
  "roles/pertamina-cfo?tab=succession",
  "compare?role=pertamina-cfo&ids=talent-1,talent-2",
  "quality",
])
  test("WCAG automated checks " + path, async ({ page }) => {
    await page.goto("#/" + path);
    await expect(page.locator("h1")).toBeAttached();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
