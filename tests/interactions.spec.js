import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  page.__errors = [];
  page.on("pageerror", (e) => page.__errors.push(e.message));
});
test.afterEach(async ({ page }) => expect(page.__errors).toEqual([]));
test("all Company Detail tabs connect to real entity tables", async ({
  page,
}) => {
  await page.goto("#/companies/pertamina");
  for (const [label, expected] of [
    ["Roles", "Daftar jabatan"],
    ["Talent", "Direktori talent"],
    ["Succession", "Leadership risks"],
    ["Data Quality", "Isu kualitas data"],
    ["Overview", "Informasi Perusahaan"],
  ]) {
    await page
      .locator(".tabs")
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page.locator("main")).toContainText(expected);
    await expect(page.locator("main")).not.toContainText(
      "Halaman belum dapat dimuat",
    );
  }
});
test("all Role Detail tabs and candidate filters function", async ({
  page,
}) => {
  await page.goto("#/roles/pertamina-cfo");
  for (const [label, expected] of [
    ["Requirements", "Role Success Profile"],
    ["Evidence & History", "Policy reference"],
    ["Succession", "Successor slate tercatat"],
    ["Candidates", "Eligibility"],
  ]) {
    await page
      .locator(".tabs")
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page.locator("main")).toContainText(expected);
  }
  await page
    .getByLabel("Eligibility", { exact: true })
    .selectOption("Not eligible");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Not eligible");
  await page.getByRole("button", { name: "Hapus semua", exact: true }).click();
  await page.getByLabel("Candidate pool").selectOption("mandiri");
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await expect(page.locator("tbody")).toContainText("Bank Mandiri");
});
test("Talent Profile tabs never invent a target role, can select any role", async ({
  page,
}) => {
  await page.goto("#/talent/talent-2");
  for (const [label, expected] of [
    ["Competency", "Competency Evidence"],
    ["Assessments", "Assessment History"],
    ["Evidence", "Evidence Profesional"],
    ["Target Role", "Pilih target role"],
  ]) {
    await page
      .locator(".tabs")
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page.locator("main")).toContainText(expected);
  }
  await expect(page.locator(".evaluation")).toHaveCount(0);
  await page
    .getByLabel("Target role", { exact: true })
    .selectOption("pertamina-cfo");
  await expect(page.locator(".evaluation")).toContainText("82%");
});
test("candidate dialog rejects five selections without losing form state", async ({
  page,
}) => {
  await page.goto("#/compare?role=pertamina-cfo&ids=talent-1,talent-2");
  await page.getByRole("button", { name: "Ganti kandidat" }).click();
  for (const id of ["talent-3", "talent-4", "talent-5"])
    await page.locator(`input[name=candidate][value="${id}"]`).check();
  await page.getByRole("button", { name: "Bandingkan pilihan" }).click();
  await expect(page.locator("#candidate-error")).toContainText("maksimal 4");
  await page.locator('input[name=candidate][value="talent-5"]').uncheck();
  await page.getByRole("button", { name: "Bandingkan pilihan" }).click();
  await expect(page.locator(".comparison thead th")).toHaveCount(5);
});
test("evidence source copying and escape return keyboard focus correctly", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("#/roles/pertamina-cfo?tab=requirements");
  const trigger = page.getByRole("button", { name: "Why / Evidence" }).first();
  await trigger.click();
  await page.getByRole("button", { name: "Salin referensi" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("Chief Financial Officer");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
test("quality filters and source conflicts retain affected-role context", async ({
  page,
}) => {
  await page.goto("#/quality");
  await page.getByLabel("Jenis isu").selectOption("Conflict");
  const rows = page.locator("tbody tr");
  expect(await rows.count()).toBeGreaterThan(0);
  await expect(page.locator("tbody")).not.toContainText(
    "Evidence perlu diperbarui",
  );
  await rows.first().getByRole("button", { name: "Tinjau evidence" }).click();
  await expect(page.getByRole("dialog")).toContainText("Conflict");
  await page
    .getByRole("button", { name: "Buka detail sumber" })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toContainText("Facts & observations");
});
test("saved view link restores filters and columns in a separate browser context", async ({
  page,
  browser,
}) => {
  await page.goto("#/roles?company=pertamina");
  await page.getByRole("button", { name: "Kolom", exact: true }).click();
  await page.getByLabel("Job Value", { exact: true }).uncheck();
  await page.getByRole("button", { name: "Terapkan kolom" }).click();
  await page.getByRole("button", { name: "Simpan view", exact: true }).click();
  await page.getByLabel("Nama view").fill("Shareable role view");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Simpan view" })
    .click();
  await page.getByRole("button", { name: "My Views", exact: true }).click();
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (text) => (window.shared = text) },
      configurable: true,
    }),
  );
  await page
    .locator(".view-card")
    .filter({ hasText: "Shareable role view" })
    .getByRole("button", { name: "Salin link" })
    .click();
  const shared = await page.evaluate(() => window.shared);
  expect(shared).toContain("viewCols");
  const context = await browser.newContext();
  const guest = await context.newPage();
  await guest.goto(shared);
  await expect(guest.locator("h1")).toHaveText("Role Directory");
  await expect(
    guest.getByRole("columnheader", { name: "Job Value" }),
  ).toHaveCount(0);
  await expect(guest.locator("tbody tr")).toHaveCount(14);
  await context.close();
});
test("mobile menu, skip navigation and reset remain functional", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("#/overview");
  await page.getByRole("button", { name: "Buka navigasi" }).click();
  await page
    .locator(".sidebar")
    .getByRole("link", { name: "Companies", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Companies");
  await expect(page.locator("body")).not.toHaveClass(/nav-open/);
  await page.locator(".skip-link").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await expect(page.locator("h1")).toHaveText("Companies");
  await page.getByRole("button", { name: "Buka navigasi" }).click();
  await page.locator(".profile-button").click();
  await page.getByRole("button", { name: "Reset data browser" }).click();
  await page.getByRole("button", { name: "Reset sekarang" }).click();
  await expect(page.locator("h1")).toHaveText("Executive Overview");
});
test("blocked local storage shows a persistent-session limitation without crashing", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page.goto("#/companies/pertamina");
  await page.getByRole("button", { name: "Favorit", exact: true }).click();
  await expect(page.locator("#toast")).toContainText(
    "perubahan hanya untuk sesi ini",
  );
  await expect(page.getByRole("button", { name: "Tersimpan" })).toBeVisible();
});
test("print stylesheet produces a real PDF from the selected comparison", async ({
  page,
}) => {
  await page.goto("#/compare?role=pertamina-cfo&ids=talent-1,talent-2");
  await page.getByRole("button", { name: "Ekspor ringkasan" }).click();
  await page.emulateMedia({ media: "print" });
  const pdf = await page.pdf({
    format: "A4",
    landscape: true,
    printBackground: true,
  });
  expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  expect(pdf.length).toBeGreaterThan(5000);
});
