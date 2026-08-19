"use client";

import { PromptComposer } from "@/registry/components/prompt-composer";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function PromptComposerDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <div role="group" aria-label={demoText("prompt-composer", locale)} className="mx-auto w-full max-w-[520px] rounded-[18px] bg-[#f3f5f8] p-3 dark:bg-[#101318]">
    <div className="mb-3 flex items-center gap-2 px-2 font-mono text-[9px] uppercase tracking-[.14em] text-neutral-500"><span className="size-2 rounded-full bg-emerald-500" />{demoValue(locale, "发布工作区 · 已同步", "Launch workspace · synced")}</div>
    <PromptComposer placeholder={demoValue(locale, "让 Agent 设计并实现…", "Ask the agent to design and build…")} sendLabel={demoValue(locale, "发送", "Send")} addSourcesLabel={demoValue(locale, "添加来源", "Add sources")} dictationLabel={demoValue(locale, "开始语音输入", "Start dictation")} model="Codex · Reasoning" sources={[{ id: "figma", label: "Figma / release board", type: "app", connected: true }, { id: "brief", label: demoValue(locale, "V6 发布需求", "V6 launch brief"), type: "file", connected: true }, { id: "web", label: demoValue(locale, "竞品评审", "Competitor review"), type: "web", connected: true }]} />
  </div>;
}
