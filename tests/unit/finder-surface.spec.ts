import { describe, expect, it } from "vitest";
import { resources } from "../../src/i18n/resources";
import { getStaticPaths, pathFor, sitemapPaths } from "../../src/data/site";
import { recommendMotions } from "../../src/lib/motion-finder";

describe("Motion Finder public surface", () => {
  it("publishes localized, indexable Finder routes", () => {
    expect(getStaticPaths()).toContain(pathFor("zh", ["finder"]));
    expect(getStaticPaths()).toContain(pathFor("en", ["finder"]));
    expect(sitemapPaths()).toContain("/zh/finder/");
    expect(sitemapPaths()).toContain("/en/finder/");
    expect(resources.zh.translation.seo.finderTitle).not.toBe(
      resources.en.translation.seo.finderTitle
    );
  });

  it("creates a Finder URL that the web interface can restore", () => {
    const result = recommendMotions(
      "卡片弹出来要有重量，最后收得住",
      "zh"
    );
    const url = new URL(result.comparePath, "https://motion-lexicon.pages.dev");

    expect(url.pathname).toBe("/zh/finder/");
    expect(url.searchParams.get("q")).toBe("卡片弹出来要有重量，最后收得住");
    expect(url.searchParams.get("compare")?.split(",")).toEqual(
      result.candidates.map((candidate) => candidate.variantId)
    );
    expect(result.candidates).toHaveLength(3);
  });
});
