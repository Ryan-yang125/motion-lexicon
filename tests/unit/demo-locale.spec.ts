import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { registryComponents } from "@/data/component-registry";
import { demoIds, demoLabels, demoText } from "@/registry/demo-locale";

describe("component demo locale contract", () => {
  it("enumerates every component demo with distinct Chinese and English labels", () => {
    expect(demoIds).toHaveLength(59);
    expect(new Set(demoIds)).toEqual(new Set(registryComponents.map((entry) => entry.id)));
    for (const id of demoIds) {
      expect(demoLabels[id].zh.trim()).not.toBe("");
      expect(demoLabels[id].en.trim()).not.toBe("");
      expect(demoText(id, "zh")).not.toBe(demoText(id, "en"));
    }
  });

  it("makes every demo accept locale and consume typed visible or accessible copy", () => {
    const files = readdirSync("src/registry/demos").filter((file) => file.endsWith("-demo.tsx"));
    expect(files).toHaveLength(demoIds.length);
    for (const id of demoIds) {
      const source = readFileSync(`src/registry/demos/${id}-demo.tsx`, "utf8");
      expect(source).toContain('locale = "en"');
      expect(source).toContain(`demoText("${id}", locale)`);
      expect(source).toContain("demoValue(locale");
    }
  });
});
