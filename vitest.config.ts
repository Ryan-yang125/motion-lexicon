import { mergeConfig, defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./tests/setup.ts",
      exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
      coverage: {
        reporter: ["text", "json", "html"]
      }
    }
  })
);
