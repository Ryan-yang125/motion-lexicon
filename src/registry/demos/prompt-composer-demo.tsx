"use client";

import { PromptComposer } from "@/registry/components/prompt-composer";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function PromptComposerDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <div role="group" aria-label={demoText("prompt-composer", locale)} className="mx-auto w-full max-w-[520px]"><PromptComposer placeholder={demoValue(locale, "让 Agent 设计并实现…", "Ask the agent to design and build…")} sendLabel={demoValue(locale, "发送", "Send")} addSourcesLabel={demoValue(locale, "添加来源", "Add sources")} dictationLabel={demoValue(locale, "开始语音输入", "Start dictation")} model="Codex" sources={[{ id: "figma", label: "Figma", type: "app", connected: true }, { id: "brief", label: demoValue(locale, "产品需求", "Product brief"), type: "file", connected: true }, { id: "web", label: demoValue(locale, "网页搜索", "Web search"), type: "web" }]} /></div>;
}
