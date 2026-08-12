"use client";

import { useEffect, useState } from "react";
import { AgentThinkingTrace, type ThinkingTraceStep } from "@/registry/components/agent-thinking-trace";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function AgentThinkingTraceDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [active, setActive] = useState(1);
  const labels = locale === "zh" ? [["读取产品上下文", "识别现有组件和设计约束"], ["比较交互方案", "评估状态连续性与实现成本"], ["形成实施建议", "输出组件、动效与验收要求"]] : [["Read product context", "Identify existing components and design constraints"], ["Compare interaction paths", "Evaluate continuity and implementation cost"], ["Form implementation brief", "Return components, motion, and acceptance criteria"]];
  useEffect(() => { const timer = window.setInterval(() => setActive((value) => (value + 1) % labels.length), 2200); return () => window.clearInterval(timer); }, [labels.length]);
  const steps: ThinkingTraceStep[] = labels.map(([label, detail], index) => ({ id: String(index), label, detail, status: index < active ? "complete" : index === active ? "active" : "queued" }));
  return <div role="group" aria-label={demoText("agent-thinking-trace", locale)} className="mx-auto w-full max-w-[430px]"><AgentThinkingTrace steps={steps} label={demoValue(locale, "正在规划界面", "Planning the interface")} duration={`${(active + 1) * 1.7}s`} /></div>;
}
