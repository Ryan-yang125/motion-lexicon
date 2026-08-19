"use client";

import { ToolCallStack } from "@/registry/components/tool-call-stack";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function ToolCallStackDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <div role="group" aria-label={demoText("tool-call-stack", locale)} className="mx-auto w-full max-w-[460px] rounded-[16px] bg-[#eef2ef] p-3 shadow-[0_18px_38px_-30px_rgba(26,48,37,.5)]"><ToolCallStack label={demoValue(locale, "执行记录", "Execution log")} calls={locale === "zh" ? [
    { id: "1", name: "搜索组件目录", summary: "找到 7 个相关条目", status: "complete", duration: "0.8s", kind: "search" },
    { id: "2", name: "更新 Agent 工作台", summary: "写入 146 行", status: "running", duration: "2.4s", kind: "code", detail: "+ Agent workspace\n+ approval rail\n+ responsive state" },
    { id: "3", name: "运行视觉检查", summary: "等待构建完成", status: "running", kind: "command", detail: "npm run test:visual" },
  ] : [
    { id: "1", name: "Search component catalog", summary: "Found 7 relevant entries", status: "complete", duration: "0.8s", kind: "search" },
    { id: "2", name: "Update agent workspace", summary: "Writing 146 lines", status: "running", duration: "2.4s", kind: "code", detail: "+ Agent workspace\n+ approval rail\n+ responsive state" },
    { id: "3", name: "Run visual checks", summary: "Waiting for build", status: "running", kind: "command", detail: "npm run test:visual" },
  ]} /></div>;
}
