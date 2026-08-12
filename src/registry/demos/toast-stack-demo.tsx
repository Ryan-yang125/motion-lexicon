"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { ToastStack, type ToastItem } from "@/registry/components/toast-stack";

export function ToastStackDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [items, setItems] = useState<ToastItem[]>(() => locale === "zh" ? [
    { id: "sync", title: "Agent 已完成实现", description: "14 个文件 · 38 项检查", tone: "success" },
    { id: "comment", title: "新运行证据", description: "移动端截图已附加", tone: "neutral" },
    { id: "export", title: "等待发布确认", description: "生产环境将更新 59 个组件", tone: "warning" },
  ] : [
    { id: "sync", title: "Agent finished implementation", description: "14 files · 38 checks", tone: "success" },
    { id: "comment", title: "New run evidence", description: "Mobile screenshot attached", tone: "neutral" },
    { id: "export", title: "Release approval pending", description: "Production will update 59 components", tone: "warning" },
  ]);
  const [count, setCount] = useState(1);

  const add = () => {
    setItems((current) => [
      {
        id: `new-${count}`,
        title: demoValue(locale, `Agent 任务 ${count} 已完成`, `Agent task ${count} finished`),
        description: demoValue(locale, "交付预览可以检查了", "Delivery preview is ready to inspect"),
        tone: "success",
      },
      ...current,
    ]);
    setCount((value) => value + 1);
  };

  return (
    <div role="group" aria-label={demoText("toast-stack", locale)} className="mx-auto flex h-[250px] w-full max-w-[440px] flex-col items-center gap-3">
      <button
        type="button"
        onClick={add}
        className="mat-cap press h-11 rounded-[9px] px-4 text-[13px] font-medium text-ink"
      >
        {demoValue(locale, "模拟 Agent 通知", "Simulate agent notification")}
      </button>
      <ToastStack
        items={items}
        label={demoValue(locale, "Agent 通知", "Agent notifications")}
        dismissLabel={(title) => demoValue(locale, `关闭${title}`, `Dismiss ${title}`)}
        depthLabel={(depth) => demoValue(locale, `堆栈第 ${depth} 层`, `Stack depth ${depth}`)}
        maxVisible={3}
        onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
      />
    </div>
  );
}
