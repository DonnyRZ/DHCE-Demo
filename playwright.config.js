import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  timeout: 45000,
  fullyParallel: false,
  workers: 2,
  expect: { timeout: 8000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    channel: process.env.DHCE_BROWSER_CHANNEL || undefined,
    baseURL: process.env.BASE_URL || "http://127.0.0.1:4174/DHCE-Demo/",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      ...(process.env.CI || process.env.DHCE_BROWSER_CHANNEL
        ? {}
        : existsSync("/usr/bin/chromium")
          ? { executablePath: "/usr/bin/chromium" }
          : {}),
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "node scripts/serve.mjs",
        port: 4174,
        env: { PORT: "4174", SERVE_DIR: "dist" },
        reuseExistingServer: !process.env.CI,
      },
});
