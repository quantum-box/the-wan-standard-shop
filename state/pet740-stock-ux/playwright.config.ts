import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "evidence/logs/playwright-report.json" }]],
  use: {
    viewport: { width: 1280, height: 800 },
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
});
