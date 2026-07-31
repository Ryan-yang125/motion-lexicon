import { describe, expect, it } from "vitest";
import { motionPackGroups, motionPacks } from "../../src/data/motion-packs";

describe("Motion Pack V1 data", () => {
  it("ships sixteen uniquely identified, grouped real product moments", () => {
    expect(motionPacks).toHaveLength(16);
    expect(new Set(motionPacks.map((pack) => pack.id)).size).toBe(16);
    expect(motionPackGroups).toHaveLength(4);

    for (const pack of motionPacks) {
      expect(pack.kind).toBe(pack.id);
      expect(motionPackGroups.some((group) => group.id === pack.groupId)).toBe(true);
      expect(pack.name.zh).not.toHaveLength(0);
      expect(pack.name.en).not.toHaveLength(0);
      expect(pack.prompt.zh).not.toHaveLength(0);
      expect(pack.prompt.en).not.toHaveLength(0);
    }
  });

  it("keeps every portable output complete, parsable, and reduced-motion aware", () => {
    for (const pack of motionPacks) {
      expect(pack.source.html, pack.id).toContain("data-motion-pack");
      expect(pack.source.css, pack.id).toContain("prefers-reduced-motion");
      expect(pack.source.css, pack.id).toContain("animation-duration: 1ms");
      expect(pack.source.js.trim(), pack.id).not.toHaveLength(0);
      expect(() => new Function(pack.source.js), pack.id).not.toThrow();
    }
  });
});
