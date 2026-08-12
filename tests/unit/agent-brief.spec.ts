import { describe, expect, it } from "vitest";
import { buildAgentBrief } from "@/data/agent-brief";

describe("Copy for Agent brief", () => {
  it("packages the Chinese preview, source, goal, behavior, and acceptance contract", () => {
    const brief = buildAgentBrief({
      locale: "zh",
      kind: "component",
      id: "agent-thinking-trace",
      name: "Agent 思考轨迹",
      description: "展示推理阶段。",
      behavior: "阶段沿信号轨逐步出现。",
      previewUrl: "https://motion-lexicon.pages.dev/zh/components/agent-thinking-trace/",
      registryUrl: "https://motion-lexicon.pages.dev/r/agent-thinking-trace.json",
    });

    expect(brief).toContain("Agent 思考轨迹");
    expect(brief).toContain("预览：https://motion-lexicon.pages.dev/zh/components/agent-thinking-trace/");
    expect(brief).toContain("源码：https://motion-lexicon.pages.dev/r/agent-thinking-trace.json");
    expect(brief).toContain("核心行为：阶段沿信号轨逐步出现。");
    expect(brief).toContain("prefers-reduced-motion");
    expect(brief).toContain("完成浏览器验收");
  });

  it("keeps editorial primitive briefs useful without a registry source", () => {
    const brief = buildAgentBrief({
      locale: "en",
      kind: "primitive",
      id: "anticipation",
      name: "Anticipation",
      description: "Prepare the user for a change.",
      previewUrl: "https://motion-lexicon.pages.dev/en/primitives/anticipation/",
    });

    expect(brief).toContain("Preview: https://motion-lexicon.pages.dev/en/primitives/anticipation/");
    expect(brief).not.toContain("Source:");
    expect(brief).toContain("verify it in a browser");
  });
});
