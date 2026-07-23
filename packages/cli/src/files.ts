import { access, mkdir, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { RecipeExportDocument } from "./types.js";
import { MotionLexiconError } from "./types.js";

function standaloneHtml(document: RecipeExportDocument) {
  const script = document.js ? "\n    <script src=\"./motion.js\"></script>" : "";
  return `<!doctype html>
<html lang="${document.locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${document.id} · Motion Lexicon</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    ${document.html}${script}
  </body>
</html>
`;
}

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function writeRecipeFiles(
  document: RecipeExportDocument,
  outputDirectory: string,
  options: { force?: boolean } = {}
) {
  const directory = resolve(outputDirectory);
  if (await exists(directory)) {
    const entries = await readdir(directory);
    if (entries.length && !options.force) {
      throw new MotionLexiconError(
        `Output directory is not empty: ${directory}. Add --force to replace generated files.`
      );
    }
  }
  await mkdir(directory, { recursive: true });
  const generated: Array<[string, string]> = [
    ["index.html", standaloneHtml(document)],
    ["styles.css", `${document.css}\n`],
    ["prompt.md", `${document.prompt}\n`],
    ["recipe.json", `${JSON.stringify(document, null, 2)}\n`]
  ];
  if (document.js) generated.push(["motion.js", `${document.js}\n`]);
  await Promise.all(
    generated.map(([name, content]) => writeFile(resolve(directory, name), content, "utf8"))
  );
  return {
    directory,
    files: generated.map(([name]) => resolve(directory, name))
  };
}
