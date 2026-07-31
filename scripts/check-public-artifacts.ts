import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPublicArtifacts } from "./generate-public-artifacts";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");

async function listFiles(directory: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const relativePath = path.posix.join(prefix, entry.name);
      if (entry.isDirectory()) {
        return listFiles(path.join(directory, entry.name), relativePath);
      }
      return entry.isFile() ? [relativePath] : [];
    })
  );
  return files.flat().sort();
}

async function main() {
  const expectedArtifacts = buildPublicArtifacts();
  const expectedDataFiles = expectedArtifacts
    .map((artifact) => artifact.relativePath)
    .filter((relativePath) => relativePath.startsWith("data/v1/"))
    .sort();
  const actualDataFiles = (await listFiles(path.join(publicDir, "data", "v1")))
    .map((relativePath) => `data/v1/${relativePath}`);
  const problems: string[] = [];

  const expectedDataSet = new Set(expectedDataFiles);
  const actualDataSet = new Set(actualDataFiles);
  for (const relativePath of expectedDataFiles) {
    if (!actualDataSet.has(relativePath)) problems.push(`Missing ${relativePath}`);
  }
  for (const relativePath of actualDataFiles) {
    if (!expectedDataSet.has(relativePath)) problems.push(`Unexpected ${relativePath}`);
  }

  for (const artifact of expectedArtifacts) {
    try {
      const current = await readFile(path.join(publicDir, artifact.relativePath), "utf8");
      if (current !== artifact.content) problems.push(`Outdated ${artifact.relativePath}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      if (!problems.includes(`Missing ${artifact.relativePath}`)) {
        problems.push(`Missing ${artifact.relativePath}`);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(`Public artifact check failed:\n${problems.map((problem) => `- ${problem}`).join("\n")}`);
  }

  console.log(`Public artifact check passed: ${expectedArtifacts.length} generated files match source data.`);
}

await main();
