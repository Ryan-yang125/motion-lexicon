// @vitest-environment node

import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

type RegistryItem = {
  dependencies: string[];
  devDependencies?: string[];
  files: Array<{ content: string; path: string }>;
};

const packageName = (specifier: string) =>
  specifier.startsWith("@")
    ? specifier.split("/").slice(0, 2).join("/")
    : specifier.split("/", 1)[0];

const dependencyName = (dependency: string) => {
  const versionSeparator = dependency.lastIndexOf("@");
  return versionSeparator > dependency.indexOf("/")
    ? dependency.slice(0, versionSeparator)
    : dependency;
};

function typecheckRegistrySource(item: RegistryItem) {
  const file = item.files[0];
  const sourcePath = path.resolve(file.path);
  const compilerOptions: ts.CompilerOptions = {
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    jsx: ts.JsxEmit.ReactJSX,
    lib: ["lib.es2023.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ES2023,
    types: ["react", "react-dom"],
  };
  const host = ts.createCompilerHost(compilerOptions);
  const diskRead = host.readFile.bind(host);
  const diskExists = host.fileExists.bind(host);
  host.fileExists = (fileName) => path.resolve(fileName) === sourcePath || diskExists(fileName);
  host.readFile = (fileName) => path.resolve(fileName) === sourcePath ? file.content : diskRead(fileName);
  host.getSourceFile = (fileName, languageVersion) => {
    const source = host.readFile(fileName);
    return source === undefined
      ? undefined
      : ts.createSourceFile(fileName, source, languageVersion, true);
  };
  return ts.getPreEmitDiagnostics(ts.createProgram([sourcePath], compilerOptions, host));
}

describe("Three.js registry type dependencies", () => {
  it.each(["procedural-product-viewer", "network-globe"])(
    "%s installs and typechecks from its published dependency contract",
    (id) => {
      const item = JSON.parse(
        readFileSync(`public/r/${id}.json`, "utf8"),
      ) as RegistryItem;
      expect(item.dependencies.map(dependencyName)).toEqual(expect.arrayContaining(["motion", "three"]));
      expect(item.devDependencies?.map(dependencyName)).toContain("@types/three");
      expect(item.files).toHaveLength(1);

      const declaredRuntime = new Set(item.dependencies.map(dependencyName));
      const sourceFile = ts.createSourceFile(
        item.files[0].path,
        item.files[0].content,
        ts.ScriptTarget.ES2022,
        true,
        ts.ScriptKind.TSX,
      );
      for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
        const specifier = statement.moduleSpecifier.text;
        expect(specifier, `${id} must remain independently installable`).not.toMatch(/^(?:@\/|\.{1,2}\/)/);
        const importedPackage = packageName(specifier);
        if (importedPackage === "react" || importedPackage === "react-dom") continue;
        expect(declaredRuntime, `${id} must declare ${importedPackage}`).toContain(importedPackage);
      }

      const diagnostics = typecheckRegistrySource(item);
      expect(
        diagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
      ).toEqual([]);
    },
  );
});
