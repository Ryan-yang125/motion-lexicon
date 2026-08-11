import { describe, expect, it } from "vitest";
import { loadSeoGuideArticle } from "@/data/load-seo-guide-article";

describe("loadSeoGuideArticle", () => {
  it("loads only the requested article contract", async () => {
    const article = await loadSeoGuideArticle("css-motion-jank");
    expect(article?.guideId).toBe("css-motion-jank");
    expect(article?.sections).toHaveLength(5);
    expect(article?.diagrams).toHaveLength(3);
  });

  it("loads the current component-level selection guide", async () => {
    const article = await loadSeoGuideArticle("component-or-primitive");
    expect(article?.guideId).toBe("component-or-primitive");
    expect(article?.caseStudy.code).toContain("Start registry item: filter-grid");
  });

  it("returns undefined for an unknown guide", async () => {
    await expect(loadSeoGuideArticle("unknown-guide")).resolves.toBeUndefined();
    await expect(loadSeoGuideArticle("pack-or-primitive")).resolves.toBeUndefined();
  });
});
