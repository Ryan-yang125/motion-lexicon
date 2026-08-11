"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { ReorderList } from "@/registry/components/reorder-list";

type Track = { id: string; title: string; length: string };

export function ReorderListDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [agenda, setAgenda] = useState<Track[]>(() => locale === "zh" ? [
    { id: "a", title: "开场", length: "5 分钟" }, { id: "b", title: "路线图回顾", length: "15 分钟" },
    { id: "c", title: "设计评审", length: "20 分钟" }, { id: "d", title: "开放问题", length: "10 分钟" },
  ] : [
    { id: "a", title: "Opening remarks", length: "5 min" }, { id: "b", title: "Roadmap review", length: "15 min" },
    { id: "c", title: "Design critique", length: "20 min" }, { id: "d", title: "Open questions", length: "10 min" },
  ]);

  return (
    <div role="group" aria-label={demoText("reorder-list", locale)} className="grid w-full place-items-center">
      <div className="w-full max-w-[320px]">
        <ReorderList
        items={agenda}
        getId={(t) => t.id}
        getLabel={(t) => t.title}
        onReorder={setAgenda}
        label={demoValue(locale, "会议议程", "Meeting agenda")}
        copy={locale === "zh" ? {
          instructions: "拖动排序。使用键盘时，按空格抓取，按方向键移动，再按空格放下；按 Escape 恢复原顺序。",
          grabbed: (label, position, total) => `已抓取${label}，当前位置 ${position} / ${total}。`,
          dropped: (label, position) => `${label}已放到第 ${position} 位。`,
          moved: (label, position, total) => `${label}，当前位置 ${position} / ${total}。`,
          cancelled: "已取消排序并恢复原顺序。",
        } : undefined}
      >
        {(t) => (
          <div className="flex items-baseline justify-between gap-3">
            <p className="truncate text-[13px] font-medium text-stone-700 dark:text-stone-200">
              {t.title}
            </p>
            <p className="shrink-0 font-mono text-[10.5px] tabular-nums text-stone-500 dark:text-stone-400">
              {t.length}
            </p>
          </div>
        )}
        </ReorderList>
      </div>
    </div>
  );
}
