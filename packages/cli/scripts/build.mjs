import { execFile } from "node:child_process";
import { chmod, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { build } from "esbuild";

const run = promisify(execFile);
const require = createRequire(import.meta.url);
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(packageRoot, "dist");
const shared = {
  absWorkingDir: packageRoot,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  treeShaking: true
};

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });

await Promise.all([
  build({
    ...shared,
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    sourcemap: true
  }),
  build({
    ...shared,
    banner: { js: "#!/usr/bin/env node" },
    entryPoints: ["src/bin.ts"],
    outfile: "dist/motion-lexicon.mjs"
  })
]);

const tscPath = require.resolve("typescript/bin/tsc");
await run(process.execPath, [tscPath, "-p", "tsconfig.build.json"], {
  cwd: packageRoot
});
await chmod(join(distDir, "motion-lexicon.mjs"), 0o755);
