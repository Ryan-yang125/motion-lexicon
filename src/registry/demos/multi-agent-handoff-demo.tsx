"use client";

import { MultiAgentHandoff } from "@/registry/components/multi-agent-handoff";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function MultiAgentHandoffDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const zh = locale === "zh";
  return <div role="group" aria-label={demoText("multi-agent-handoff", locale)} className="mx-auto w-full max-w-[500px] rounded-[18px] bg-[#f3f5f8] p-3 dark:bg-[#101318]"><div className="mb-3 flex items-center justify-between px-2 font-mono text-[9px] uppercase tracking-[.14em] text-neutral-500"><span>{demoValue(locale, "发布列车 / 周四", "Release train / Thu")}</span><span>3/3</span></div><MultiAgentHandoff eyebrow={demoValue(locale, "Agent 交接", "Agent relay")} task={zh ? "完成 Agent 工作台视觉发布" : "Finish the agent workspace visual release"} artifact="agent-workspace.tsx" handoffLabel={demoValue(locale, "交接给", "Hand off to")} ownerLabel={(name) => demoValue(locale, `${name} 负责下一步`, `${name} owns the next action`)} agents={[{ id: "r", name: zh ? "研究" : "Research", role: zh ? "参考与约束" : "References", initials: "R", tone: "blue" }, { id: "d", name: zh ? "设计" : "Design", role: zh ? "视觉与动效" : "Visual motion", initials: "D", tone: "amber" }, { id: "q", name: zh ? "验收" : "Review", role: zh ? "浏览器检查" : "Browser QA", initials: "Q", tone: "green" }]} /></div>;
}
