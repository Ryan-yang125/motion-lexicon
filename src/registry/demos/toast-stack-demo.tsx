"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { ToastStack, type ToastItem } from "@/registry/components/toast-stack";

export function ToastStackDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [items, setItems] = useState<ToastItem[]>(() => locale === "zh" ? [
    { id: "sync", title: "更改已同步", description: "Atlas 工作区 · 刚刚", tone: "success" },
    { id: "comment", title: "新评审意见", description: "Mira 在页眉中提到了你", tone: "neutral" },
    { id: "export", title: "导出需要处理", description: "缺少一张图片", tone: "warning" },
  ] : [
    { id: "sync", title: "Changes synced", description: "Atlas workspace · just now", tone: "success" },
    { id: "comment", title: "New review note", description: "Mira mentioned you in Header", tone: "neutral" },
    { id: "export", title: "Export needs attention", description: "One image is missing", tone: "warning" },
  ]);
  const [count, setCount] = useState(1);

  const add = () => {
    setItems((current) => [
      {
        id: `new-${count}`,
        title: demoValue(locale, `构建 ${count} 已完成`, `Build ${count} finished`),
        description: demoValue(locale, "预览可以检查了", "Preview is ready to inspect"),
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
        {demoValue(locale, "添加通知", "Add notification")}
      </button>
      <ToastStack
        items={items}
        label={demoValue(locale, "通知", "Notifications")}
        dismissLabel={(title) => demoValue(locale, `关闭${title}`, `Dismiss ${title}`)}
        depthLabel={(depth) => demoValue(locale, `堆栈第 ${depth} 层`, `Stack depth ${depth}`)}
        maxVisible={3}
        onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
      />
    </div>
  );
}
