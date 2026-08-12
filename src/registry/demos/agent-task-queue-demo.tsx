"use client";

import { AgentTaskQueue } from "@/registry/components/agent-task-queue";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function AgentTaskQueueDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const zh = locale === "zh";
  return <div role="group" aria-label={demoText("agent-task-queue", locale)} className="mx-auto w-full max-w-[470px]"><AgentTaskQueue label={demoValue(locale, "界面改版任务", "Interface revision tasks")} runningLabel={(count) => demoValue(locale, `${count} 个执行中`, `${count} running`)} clearLabel={demoValue(locale, "队列已清空", "Queue clear")} rowsLabel={demoValue(locale, "列表", "Rows")} compactLabel={demoValue(locale, "紧凑", "Compact")} tasks={[
    { id: "1", title: zh ? "分析参考组件" : "Analyze reference components", detail: zh ? "交互、视觉与状态机" : "Interaction, visuals, and state machines", status: "complete", meta: "18" },
    { id: "2", title: zh ? "构建 Agent 组件" : "Build agent components", detail: zh ? "正在实现审批流程" : "Implementing approval flow", status: "running", progress: 68, meta: "8/11" },
    { id: "3", title: zh ? "浏览器视觉验收" : "Browser visual review", status: "queued", meta: zh ? "排队中" : "queued" },
  ]} /></div>;
}
