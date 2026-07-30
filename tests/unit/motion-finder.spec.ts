import { describe, expect, it } from "vitest";
import { recommendMotions } from "../../src/lib/motion-finder";

describe("Motion Finder", () => {
  it("maps a Chinese weighted entrance description to the entrance trio", () => {
    const result = recommendMotions(
      "卡片弹出来要有重量、最后收得住",
      "zh"
    );

    expect(result).toMatchObject({
      groupId: "entrance-feel",
      confidence: "high"
    });
    expect(result.candidates.map((item) => item.variantId)).toEqual([
      "spring",
      "pop-in",
      "scale-in"
    ]);
    expect(result.comparePath).toContain("compare=spring%2Cpop-in%2Cscale-in");
  });

  it("preserves the Pop in alias identity and typed preset values", () => {
    const popIn = recommendMotions("轻快地弹出来", "zh").candidates.find(
      (item) => item.variantId === "pop-in"
    );

    expect(popIn).toMatchObject({
      canonicalId: "scale-in",
      presetQuery: "scale=86&overshoot=true",
      presetValues: { scale: 86, overshoot: true },
      values: { scale: 86, overshoot: true }
    });
  });

  it("recognizes state continuity language in English", () => {
    const result = recommendMotions(
      "The same thumbnail expands into the detail page",
      "en"
    );

    expect(result.groupId).toBe("state-continuity");
    expect(result.candidates[0]).toMatchObject({
      variantId: "shared-element-transition",
      canonicalId: "morph",
      presetValues: { mode: "shared" }
    });
    expect(result.candidates.map((item) => item.variantId).sort()).toEqual(
      ["crossfade", "morph", "shared-element-transition"].sort()
    );
  });

  it("distinguishes delay, stagger, and orchestration intent", () => {
    expect(recommendMotions("触发后等一下再开始", "zh").candidates[0]).toMatchObject({
      variantId: "delay",
      canonicalId: "duration",
      presetValues: { delay: 120 }
    });
    expect(recommendMotions("列表一个接一个出现", "zh").candidates[0].variantId).toBe(
      "stagger"
    );
    expect(
      recommendMotions("coordinate multiple motions on a timeline", "en").candidates[0]
        .variantId
    ).toBe("orchestration");
  });

  it("returns a deterministic low-confidence trio for an uncovered phrase", () => {
    const first = recommendMotions("make it delightful", "en");
    const second = recommendMotions("make it delightful", "en");

    expect(first.confidence).toBe("low");
    expect(first.candidates).toHaveLength(3);
    expect(second).toEqual(first);
  });
});
