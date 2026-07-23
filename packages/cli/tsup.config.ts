import { defineConfig, type Options } from "tsup";

const shared: Options = {
  bundle: true,
  format: ["esm"],
  platform: "node",
  target: "node20",
  sourcemap: true,
  splitting: false,
  treeshake: true
};

export default defineConfig([
  {
    ...shared,
    entry: { index: "src/index.ts" },
    clean: true,
    dts: true
  },
  {
    ...shared,
    entry: { "motion-lexicon": "src/bin.ts" },
    clean: false,
    dts: false,
    sourcemap: false,
    banner: { js: "#!/usr/bin/env node" },
    outExtension: () => ({ js: ".mjs" })
  }
]);
