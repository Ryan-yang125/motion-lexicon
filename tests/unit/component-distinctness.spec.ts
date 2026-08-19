import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  registryComponentEngines,
  registryComponentDevDependencies,
  registryComponentRuntimeCost,
  registryComponentSignature,
  registryComponents
} from "../../src/data/component-registry";

const digest = (source: string) => createHash("sha256").update(source).digest("hex");

describe("component distinctness contract", () => {
  it("publishes one hundred individually identifiable components", () => {
    expect(registryComponents).toHaveLength(100);
    expect(new Set(registryComponents.map((entry) => entry.id)).size).toBe(100);
    expect(new Set(registryComponents.map((entry) => entry.exportName)).size).toBe(100);
    expect(new Set(registryComponents.map((entry) => entry.name.zh.trim())).size).toBe(100);
    expect(new Set(registryComponents.map((entry) => entry.name.en.trim().toLowerCase())).size).toBe(100);
  });

  it("gives every component a distinct design signature and implementation", () => {
    const signaturesZh = registryComponents.map((entry) => registryComponentSignature(entry).zh.trim());
    const signaturesEn = registryComponents.map((entry) => registryComponentSignature(entry).en.trim().toLowerCase());
    const sourceHashes = registryComponents.map((entry) => digest(readFileSync(`src/registry/components/${entry.id}.tsx`, "utf8")));
    const demoHashes = registryComponents.map((entry) => digest(readFileSync(`src/registry/demos/${entry.id}-demo.tsx`, "utf8")));

    expect(new Set(signaturesZh).size).toBe(100);
    expect(new Set(signaturesEn).size).toBe(100);
    expect(new Set(sourceHashes).size).toBe(100);
    expect(new Set(demoHashes).size).toBe(100);
  });

  it("keeps runtime metadata coherent for lazy preview scheduling", () => {
    for (const entry of registryComponents) {
      const engines = registryComponentEngines(entry);
      expect(engines.length, entry.id).toBeGreaterThan(0);
      expect(new Set(engines).size, entry.id).toBe(engines.length);
      expect(["light", "medium", "heavy"]).toContain(registryComponentRuntimeCost(entry));
      expect(entry.primitiveIds.length, entry.id).toBeGreaterThan(0);
    }
  });

  it("declares Three.js type packages as installable development dependencies", () => {
    for (const id of ["procedural-product-viewer", "network-globe"]) {
      const entry = registryComponents.find((component) => component.id === id);
      expect(entry, id).toBeDefined();
      if (!entry) continue;
      expect(registryComponentDevDependencies(entry)).toContain("@types/three");
    }
  });
});
