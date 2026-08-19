"use client";

import { TaskProgress } from "@/registry/components/task-progress";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function TaskProgressDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const zh = locale === "zh";
  return <div role="group" aria-label={demoText("task-progress", locale)} className="mx-auto w-full max-w-[480px]">
    <TaskProgress
      label={demoValue(locale, "界面改版任务", "Interface revision tasks")}
      expandedLabel={demoValue(locale, "展开", "Expanded")}
      compactLabel={demoValue(locale, "紧凑", "Compact")}
      statusLabels={zh ? { queued: "排队", active: "执行中", blocked: "已阻塞", failed: "失败", recovered: "已恢复", complete: "已完成" } : undefined}
      tasks={[
        { id: "brief", title: zh ? "读取产品规格" : "Read product specification", detail: zh ? "目标与状态已确认" : "Goal and states confirmed", status: "complete", meta: "0.8s" },
        { id: "build", title: zh ? "实现交互组件" : "Build interaction components", detail: zh ? "正在组织状态与源文件" : "Organizing states and source files", status: "active", progress: 68, meta: "8/11" },
        { id: "review", title: zh ? "处理验收意见" : "Address review feedback", detail: zh ? "依赖视觉稿更新" : "Waiting on the visual brief", status: "blocked" },
        { id: "retry", title: zh ? "恢复资源加载" : "Recover asset loading", status: "recovered", meta: "retry" },
        { id: "publish", title: zh ? "发布目录" : "Publish directory", status: "queued" },
      ]}
    />
  </div>;
}
