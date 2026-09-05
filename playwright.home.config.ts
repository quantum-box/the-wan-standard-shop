import { defineConfig, devices } from '@playwright/test'

// Exercise the static export. Commerce APIs are isolated fixtures; home images are real.
export default defineConfig({
  testDir: './tests',
  testMatch: ['homepage-ui.spec.ts', 'storefront-ui.spec.ts'],
  timeout: 45_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'homepage-report', open: 'never' }]],
  outputDir: 'homepage-test-results',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1 --directory out',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
})
