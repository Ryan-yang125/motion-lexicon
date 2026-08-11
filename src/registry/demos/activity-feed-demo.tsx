"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { ActivityFeed, type ActivityItem } from "@/registry/components/activity-feed";

export function ActivityFeedDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [items, setItems] = useState<ActivityItem[]>(() => locale === "zh" ? [
    { id: "a", title: "Mira 通过了动效评审", description: "结账流程 · 已含减弱动效", time: "2 分钟", group: "今天", unread: true, tone: "success" },
    { id: "b", title: "预览已部署", description: "atlas-edge.pages.dev", time: "18 分钟", group: "今天", tone: "neutral" },
    { id: "c", title: "对比度需要处理", description: "一个辅助标签低于 AA", time: "1 小时", group: "今天", tone: "warning" },
  ] : [
    { id: "a", title: "Mira approved the motion pass", description: "Checkout · reduced motion included", time: "2m", group: "Today", unread: true, tone: "success" },
    { id: "b", title: "Preview deployed", description: "atlas-edge.pages.dev", time: "18m", group: "Today", tone: "neutral" },
    { id: "c", title: "Contrast check needs attention", description: "One muted label is below AA", time: "1h", group: "Today", tone: "warning" },
  ]);
  const [count, setCount] = useState(1);

  return (
    <div role="group" aria-label={demoText("activity-feed", locale)} className="mx-auto h-[250px] w-full max-w-[420px] overflow-y-auto pr-1">
      <div className="sticky top-0 z-10 mb-1 flex justify-end bg-[var(--sub)] pb-2">
        <button
          type="button"
          onClick={() => {
            setItems((current) => [{ id: `new-${count}`, title: demoValue(locale, `新评审意见 ${count}`, `New review note ${count}`), description: demoValue(locale, "动效时序已更新", "Motion timing updated"), time: demoValue(locale, "刚刚", "now"), group: demoValue(locale, "今天", "Today"), unread: true, tone: "neutral" }, ...current]);
            setCount((value) => value + 1);
          }}
          className="mat-cap press h-11 rounded-[9px] px-3.5 text-[12.5px] font-medium text-ink"
        >
          {demoValue(locale, "添加动态", "Add activity")}
        </button>
      </div>
      <ActivityFeed items={items} label={demoValue(locale, "动态", "Activity")} emptyLabel={demoValue(locale, "暂无动态", "No activity yet")} unreadLabel={demoValue(locale, "未读", "Unread")} unreadStartLabel={demoValue(locale, "未读动态从这里开始", "Unread activity starts here")} toneLabels={locale === "zh" ? { success: "成功", warning: "警告", error: "错误" } : undefined} />
    </div>
  );
}
