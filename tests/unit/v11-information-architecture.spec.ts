import { describe, expect, it } from "vitest";
import { canonicalMotionCatalog } from "../../src/data/motion-catalog";
import {
  getMotionPackFoundations,
  getMotionPacksForFoundation,
  motionPacks
} from "../../src/data/motion-packs";
import { pathFor, sitemapPaths } from "../../src/data/site";
import { locales } from "../../src/data/types";
import { recommendMotions } from "../../src/lib/motion-finder";

describe("V1.2 dual-directory information architecture", () => {
  it("keeps Product Moments and Motion Foundations as independently canonical directories", () => {
    expect(motionPacks).toHaveLength(28);
    expect(canonicalMotionCatalog).toHaveLength(44);

    const paths = sitemapPaths();
    for (const locale of locales) {
      expect(paths).toContain(pathFor(locale, ["packs"]));
      expect(paths).toContain(pathFor(locale, ["catalog"]));
      expect(paths).toContain(pathFor(locale, ["finder"]));
    }
  });

  it("records an explicit, duplicate-free many-to-many Pack-to-foundation relationship", () => {
    const canonicalIds = new Set(canonicalMotionCatalog.map((motion) => motion.id));

    for (const pack of motionPacks) {
      const foundations = getMotionPackFoundations(pack);
      expect(foundations.length, pack.id).toBeGreaterThanOrEqual(3);
      expect(new Set(foundations.map((foundation) => foundation.foundationId)).size, pack.id).toBe(
        foundations.length
      );
      for (const foundation of foundations) {
        expect(canonicalIds.has(foundation.foundationId), `${pack.id}:${foundation.foundationId}`).toBe(true);
        expect(foundation.roleLabel.zh).not.toHaveLength(0);
        expect(foundation.roleLabel.en).not.toHaveLength(0);
        expect(foundation.note.zh).not.toHaveLength(0);
        expect(foundation.note.en).not.toHaveLength(0);
      }
    }
  });

  it("keeps every declared foundation relation reachable from both directories", () => {
    const referencedIds = new Set(
      motionPacks.flatMap((pack) => getMotionPackFoundations(pack).map((foundation) => foundation.foundationId))
    );
    expect(referencedIds.size).toBeGreaterThanOrEqual(16);

    for (const foundationId of referencedIds) {
      expect(getMotionPacksForFoundation(foundationId).length, foundationId).toBeGreaterThan(0);
    }
  });

  it("returns Product Moments and Motion Foundations together for Finder intents", () => {
    const queries = [
      { locale: "zh" as const, query: "卡片先切入进来，然后慢慢停下来" },
      { locale: "en" as const, query: "move the same element smoothly between two screens" }
    ];

    for (const { locale, query } of queries) {
      const result = recommendMotions(query, locale, 3);
      expect(result.candidates.length).toBeGreaterThan(0);
      const relatedPacks = result.candidates.flatMap((candidate) =>
        getMotionPacksForFoundation(candidate.recipe.id)
      );
      expect(new Set(relatedPacks.map((pack) => pack.id)).size).toBeGreaterThan(0);
    }
  });
});
