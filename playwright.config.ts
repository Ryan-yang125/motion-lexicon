import { defineConfig, devices } from "@playwright/test";

const performanceSmoke = /Three\.js previews wait for intent before their first long task/;
const crossBrowserSmoke = /landing page presents live components|component detail keeps preview|primitive directory and workbench|global search opens immediately|English routes and the shadcn registry/;
const port = process.env.PLAYWRIGHT_PORT ?? "4173";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000
  },
  projects: [
    {
      name: "desktop-chromium",
      grepInvert: performanceSmoke,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1100 } }
    },
    {
      name: "mobile-chromium",
      grepInvert: performanceSmoke,
      use: { ...devices["Pixel 5"], viewport: { width: 390, height: 900 } }
    },
    {
      name: "performance-chromium",
      dependencies: ["desktop-chromium", "mobile-chromium"],
      grep: performanceSmoke,
      fullyParallel: false,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1100 } }
    },
    {
      name: "webkit-smoke",
      grep: crossBrowserSmoke,
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 1100 } }
    }
  ]
});
