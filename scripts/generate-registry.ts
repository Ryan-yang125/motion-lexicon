import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { transform } from "esbuild";
import path from "node:path";
import ts from "typescript";
import { registryBlocks } from "../src/data/block-registry";
import {
  registryComponentDependencies,
  registryComponentDevDependencies,
  registryComponentEngines,
  registryComponentRuntimeCost,
  registryComponentSignature,
  registryComponents
} from "../src/data/component-registry";
import { installablePrimitiveEntries } from "../src/data/primitive-registry";

const schema = "https://ui.shadcn.com/schema/registry.json";
const itemSchema = "https://ui.shadcn.com/schema/registry-item.json";
const outputDir = path.resolve("public/r");
const site = "https://motion-lexicon.pages.dev";

function dependencyName(dependency: string) {
  const versionSeparator = dependency.lastIndexOf("@");
  return versionSeparator > dependency.indexOf("/") ? dependency.slice(0, versionSeparator) : dependency;
}

function packageName(specifier: string) {
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/", 1)[0];
}

const blockComponentImportPrefix = "@/registry/components/";

function blockComponentImports(source: string, sourcePath: string) {
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const componentIds = new Set<string>();
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const specifier = statement.moduleSpecifier.text;
    if (!specifier.startsWith(blockComponentImportPrefix)) continue;
    const componentId = specifier.slice(blockComponentImportPrefix.length);
    if (!registryComponents.some((entry) => entry.id === componentId)) {
      throw new Error(`${sourcePath} imports an unknown registry component: ${specifier}`);
    }
    componentIds.add(componentId);
  }
  return [...componentIds].sort();
}

function externalImports(source: string, sourcePath: string, allowedBlockComponents: readonly string[] = []) {
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const imports = new Set<string>();
  const allowedComponents = new Set(allowedBlockComponents);
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const specifier = statement.moduleSpecifier.text;
    if (specifier.startsWith(blockComponentImportPrefix)) {
      const componentId = specifier.slice(blockComponentImportPrefix.length);
      if (!allowedComponents.has(componentId)) {
        throw new Error(`${sourcePath} imports an undeclared registry component: ${specifier}`);
      }
      continue;
    }
    if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      throw new Error(`Registry source must be independently copyable: ${sourcePath} imports ${specifier}`);
    }
    const dependency = packageName(specifier);
    if (dependency !== "react" && dependency !== "react-dom") imports.add(dependency);
  }
  return imports;
}

function assertDependencies(source: string, sourcePath: string, dependencies: readonly string[], allowedBlockComponents: readonly string[] = []) {
  const declared = new Set(dependencies.map(dependencyName));
  for (const dependency of externalImports(source, sourcePath, allowedBlockComponents)) {
    if (!declared.has(dependency)) {
      throw new Error(`${sourcePath} imports ${dependency}, but its registry dependencies do not declare it`);
    }
  }
}

function rewriteBlockComponentImports(source: string) {
  return source.replace(/(["'])@\/registry\/components\/([a-z0-9-]+)\1/g, "$1@/components/motion-lexicon/$2$1");
}

function blockRuntimeCost(componentIds: readonly string[]) {
  const costs = componentIds.map((componentId) => {
    const component = registryComponents.find((entry) => entry.id === componentId);
    if (!component) throw new Error(`Unknown block component ${componentId}`);
    return registryComponentRuntimeCost(component);
  });
  if (costs.includes("heavy")) return "heavy";
  if (costs.includes("medium")) return "medium";
  return "light";
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

const componentBuilds = await Promise.all(registryComponents.map(async (entry) => {
  const sourcePath = `src/registry/components/${entry.id}.tsx`;
  const source = await readFile(sourcePath, "utf8");
  try {
    await transform(source, { loader: "tsx", jsx: "automatic", target: "es2023" });
  } catch (error) {
    throw new Error(`Component source failed to compile: ${entry.id}`, { cause: error });
  }
  if (!new RegExp(`export\\s+(?:(?:async|default)\\s+)?(?:function|const|class)\\s+${entry.exportName}\\b`).test(source)) {
    throw new Error(`${entry.id} must export ${entry.exportName}`);
  }
  const dependencies = registryComponentDependencies(entry);
  const devDependencies = registryComponentDevDependencies(entry);
  assertDependencies(source, sourcePath, dependencies);
  const meta = {
    name: entry.id,
    type: "registry:ui" as const,
    title: entry.name.en,
    description: entry.description.en,
    dependencies,
    ...(devDependencies.length > 0 ? { devDependencies } : {}),
    categories: [entry.category],
    docs: `${site}/en/components/${entry.id}/`,
    meta: {
      engines: registryComponentEngines(entry),
      runtimeCost: registryComponentRuntimeCost(entry),
      signature: registryComponentSignature(entry).en,
      sceneFamily: entry.sceneFamily,
      motionRole: entry.motionRole,
      primaryState: entry.primaryState.en,
      assetProvenance: entry.assetProvenance
    },
    files: [{
      path: sourcePath,
      type: "registry:ui" as const,
      target: `components/motion-lexicon/${entry.id}.tsx`
    }]
  };

  await writeFile(
    path.join(outputDir, `${entry.id}.json`),
    `${JSON.stringify({
      $schema: itemSchema,
      ...meta,
      files: [{ ...meta.files[0], content: source }]
    }, null, 2)}\n`,
    "utf8"
  );

  return { meta, source, sourcePath };
}));
const componentItems = componentBuilds.map(({ meta }) => meta);

const primitiveBuilds = await Promise.all(installablePrimitiveEntries.map(async (entry) => {
  const sourcePath = `src/registry/primitives/${entry.id}.tsx`;
  const source = await readFile(sourcePath, "utf8");
  try {
    await transform(source, { loader: "tsx", jsx: "automatic", target: "es2023" });
  } catch (error) {
    throw new Error(`Primitive source failed to compile: ${entry.id}`, { cause: error });
  }
  const meta = {
    name: entry.registryId,
    type: "registry:ui" as const,
    title: entry.recipe.name.en,
    description: entry.recipe.shortDescription.en,
    dependencies: ["motion"],
    categories: ["primitive", entry.recipe.categoryId],
    docs: `${site}/en/primitives/${entry.id}/`,
    files: [{
      path: sourcePath,
      type: "registry:ui" as const,
      target: `components/motion-lexicon/primitives/${entry.id}.tsx`
    }]
  };

  await writeFile(
    path.join(outputDir, `${entry.registryId}.json`),
    `${JSON.stringify({
      $schema: itemSchema,
      ...meta,
      files: [{ ...meta.files[0], content: source }]
    }, null, 2)}\n`,
    "utf8"
  );

  return { meta, source, sourcePath };
}));
const primitiveItems = primitiveBuilds.map(({ meta }) => meta);

const blockBuilds = await Promise.all(registryBlocks.map(async (entry) => {
  const sourcePath = `src/registry/blocks/${entry.id}.tsx`;
  const source = await readFile(sourcePath, "utf8");
  try {
    await transform(source, { loader: "tsx", jsx: "automatic", target: "es2023" });
  } catch (error) {
    throw new Error(`Block source failed to compile: ${entry.id}`, { cause: error });
  }
  if (!new RegExp(`export\\s+(?:(?:async|default)\\s+)?(?:function|const|class)\\s+${entry.exportName}\\b`).test(source)) {
    throw new Error(`${entry.id} must export ${entry.exportName}`);
  }
  const importedComponentIds = blockComponentImports(source, sourcePath);
  const declaredComponentIds = [...entry.componentIds].sort();
  if (JSON.stringify(importedComponentIds) !== JSON.stringify(declaredComponentIds)) {
    throw new Error(`${entry.id} componentIds must exactly match its registry component imports`);
  }
  assertDependencies(source, sourcePath, entry.dependencies, importedComponentIds);
  const installSource = rewriteBlockComponentImports(source);
  const registryDependencies = importedComponentIds.map((componentId) => `${site}/r/${componentId}.json`);
  const runtimeCost = blockRuntimeCost(importedComponentIds);
  const meta = {
    name: entry.id,
    type: "registry:block" as const,
    title: entry.name.en,
    description: entry.description.en,
    dependencies: entry.dependencies,
    ...(registryDependencies.length > 0 ? { registryDependencies } : {}),
    categories: ["page-block"],
    docs: `${site}/en/blocks/${entry.id}/`,
    meta: {
      engines: ["motion"],
      runtimeCost,
      signature: entry.signature.en,
      sceneFamily: entry.sceneFamily,
      primaryState: entry.primaryState.en,
      componentIds: entry.componentIds
    },
    files: [{
      path: sourcePath,
      type: "registry:component" as const,
      target: `components/motion-lexicon/blocks/${entry.id}.tsx`
    }]
  };

  await writeFile(
    path.join(outputDir, `${entry.id}.json`),
    `${JSON.stringify({
      $schema: itemSchema,
      ...meta,
      files: [{ ...meta.files[0], content: installSource }]
    }, null, 2)}\n`,
    "utf8"
  );

  return { meta, source, sourcePath };
}));
const blockItems = blockBuilds.map(({ meta }) => meta);

const compilerOptions: ts.CompilerOptions = {
  allowSyntheticDefaultImports: true,
  baseUrl: ".",
  esModuleInterop: true,
  jsx: ts.JsxEmit.ReactJSX,
  lib: ["lib.es2023.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  noEmit: true,
  paths: { "@/*": ["src/*"] },
  skipLibCheck: true,
  strict: true,
  target: ts.ScriptTarget.ES2023
};
const virtualSources = new Map(
  [...componentBuilds, ...blockBuilds, ...primitiveBuilds].map(({ source, sourcePath }) => [path.resolve(sourcePath), source])
);
const compilerHost = ts.createCompilerHost(compilerOptions);
const readFileFromDisk = compilerHost.readFile.bind(compilerHost);
const fileExistsOnDisk = compilerHost.fileExists.bind(compilerHost);
compilerHost.fileExists = (fileName) => virtualSources.has(path.resolve(fileName)) || fileExistsOnDisk(fileName);
compilerHost.readFile = (fileName) => virtualSources.get(path.resolve(fileName)) ?? readFileFromDisk(fileName);
compilerHost.getSourceFile = (fileName, languageVersion) => {
  const source = compilerHost.readFile(fileName);
  return source === undefined ? undefined : ts.createSourceFile(fileName, source, languageVersion, true);
};
const registryProgram = ts.createProgram([...virtualSources.keys()], compilerOptions, compilerHost);
const registryDiagnostics = ts.getPreEmitDiagnostics(registryProgram);
if (registryDiagnostics.length > 0) {
    throw new Error(`Registry source failed type checking:\n${ts.formatDiagnosticsWithColorAndContext(registryDiagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => "\n"
  })}`);
}

const items = [...blockItems, ...componentItems, ...primitiveItems];

const registry = {
  $schema: schema,
  name: "motion-lexicon",
  homepage: site,
  items
};

await writeFile(
  path.join(outputDir, "registry.json"),
  `${JSON.stringify(registry, null, 2)}\n`,
  "utf8"
);

await writeFile(path.resolve("registry.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8");

console.log(`Registry generated: ${blockItems.length} blocks, ${componentItems.length} components, and ${primitiveItems.length} primitives`);
