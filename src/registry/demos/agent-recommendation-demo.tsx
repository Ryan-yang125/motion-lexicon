"use client";

import { AgentRecommendation } from "@/registry/components/agent-recommendation";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function AgentRecommendationDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const zh = locale === "zh";
  return <div role="group" aria-label={demoText("agent-recommendation", locale)} className="mx-auto w-full max-w-[450px]"><AgentRecommendation eyebrow={demoValue(locale, "Agent 建议", "Agent recommendation")} confidenceLabel={demoValue(locale, "置信度", "Confidence")} title={zh ? "发布 Agent 组件组" : "Ship the agent component group"} description={zh ? "现有 Registry 和 Skill 已覆盖交付链路，这一轮集中提高人看到组件时的选择欲望。" : "The registry and Skill already cover delivery, so this release can focus on making the visible component quality irresistible."} confidence={92} acceptLabel={demoValue(locale, "采用建议", "Use recommendation")} acceptedLabel={demoValue(locale, "已采用 ✓", "Accepted ✓")} alternativesLabel={demoValue(locale, "其他方案", "Alternatives")} alternatives={[{ id: "a", title: zh ? "优化现有组件" : "Polish existing components", signal: zh ? "影响较小" : "Lower impact" }, { id: "b", title: zh ? "增加更多页面 Block" : "Add more page blocks", signal: zh ? "范围较大" : "Larger scope" }]} /></div>;
}
