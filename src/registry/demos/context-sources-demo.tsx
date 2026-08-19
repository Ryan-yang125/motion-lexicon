"use client";

import { ContextSources } from "@/registry/components/context-sources";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function ContextSourcesDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const zh = locale === "zh";
  return <div role="group" aria-label={demoText("context-sources", locale)} className="mx-auto w-full max-w-[520px] rounded-[18px] bg-[#f3f5f8] p-3 dark:bg-[#101318]"><div className="mb-3 flex items-center justify-between px-2 font-mono text-[9px] uppercase tracking-[.14em] text-neutral-500"><span>{demoValue(locale, "研究包 / 04", "Research pack / 04")}</span><span className="text-emerald-600">96% grounded</span></div><ContextSources label={demoValue(locale, "已检索上下文", "Retrieved context")} countLabel={(count) => demoValue(locale, `${count} 个来源`, `${count} sources`)} sources={[
    { id: "1", title: zh ? "Agent 界面设计规范" : "Agent interface guidelines", excerpt: zh ? "执行状态需要保持可见，并为等待、审批和失败提供明确下一步。" : "Keep execution state visible and provide a clear next action for waiting, approval, and failure.", kind: "DOC", origin: "product.md", relevance: 96 },
    { id: "2", title: zh ? "组件使用数据" : "Component usage data", excerpt: zh ? "思考状态、工具调用和输入器是 Agent 产品中复用频率最高的三个界面区域。" : "Thinking states, tool calls, and composers are the three most frequently reused agent surfaces.", kind: "CSV", origin: "events.csv", relevance: 91 },
    { id: "3", title: zh ? "视觉评审记录" : "Visual review notes", excerpt: zh ? "将视觉强调集中在当前运行状态和关键决策，首帧需要独立成立。" : "Focus emphasis on live state and key decisions; the first frame needs to stand on its own.", kind: "NOTE", origin: "review-17", relevance: 84 },
  ]} /></div>;
}
