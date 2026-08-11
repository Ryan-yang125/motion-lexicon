import { defineConfig } from "@playwright/test";

declare const process: { env: Record<string, string | undefined> };

const port = Number(process.env.ML_EVAL_PORT ?? "4173");

export default defineConfig({
  testDir: "./tests",
  use: { baseURL: `http://127.0.0.1:${port}`, channel: "chrome" },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${port}`,
    port,
    reuseExistingServer: false,
  },
});
