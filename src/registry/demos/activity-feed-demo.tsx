"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { ActivityFeed, type ActivityItem } from "@/registry/components/activity-feed";

export function ActivityFeedDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [items, setItems] = useState<ActivityItem[]>(() => locale === "zh" ? [
    { id: "a", title: "实现 Agent 完成浏览器验收", description: "桌面、移动端与暗色模式均通过", time: "2 分钟", group: "今天", unread: true, tone: "success" },
    { id: "b", title: "研究 Agent 提交了参考证据", description: "Beautiful UI · 12 个交互模式", time: "18 分钟", group: "今天", tone: "neutral" },
    { id: "c", title: "发布 Agent 请求确认", description: "生产部署即将开始", time: "1 小时", group: "今天", tone: "warning" },
  ] : [
    { id: "a", title: "Builder agent passed browser review", description: "Desktop, mobile, and dark mode verified", time: "2m", group: "Today", unread: true, tone: "success" },
    { id: "b", title: "Research agent attached evidence", description: "Beautiful UI · 12 interaction patterns", time: "18m", group: "Today", tone: "neutral" },
    { id: "c", title: "Release agent requested approval", description: "Production deploy is ready to start", time: "1h", group: "Today", tone: "warning" },
  ]);
  const [count, setCount] = useState(1);

  return (
    <div role="group" aria-label={demoText("activity-feed", locale)} className="mx-auto h-[250px] w-full max-w-[420px] overflow-y-auto pr-1">
      <div className="sticky top-0 z-10 mb-1 flex justify-end bg-[var(--sub)] pb-2">
        <button
          type="button"
          onClick={() => {
            setItems((current) => [{ id: `new-${count}`, title: demoValue(locale, `Agent 事件 ${count}`, `Agent event ${count}`), description: demoValue(locale, "新的运行证据已附加", "New run evidence attached"), time: demoValue(locale, "刚刚", "now"), group: demoValue(locale, "今天", "Today"), unread: true, tone: "neutral" }, ...current]);
            setCount((value) => value + 1);
          }}
          className="mat-cap press h-11 rounded-[9px] px-3.5 text-[12.5px] font-medium text-ink"
        >
          {demoValue(locale, "模拟 Agent 事件", "Simulate agent event")}
        </button>
      </div>
      <ActivityFeed items={items} label={demoValue(locale, "Agent 动态", "Agent activity")} emptyLabel={demoValue(locale, "暂无 Agent 动态", "No agent activity yet")} unreadLabel={demoValue(locale, "未读", "Unread")} unreadStartLabel={demoValue(locale, "未读动态从这里开始", "Unread activity starts here")} toneLabels={locale === "zh" ? { success: "成功", warning: "警告", error: "错误" } : undefined} />
    </div>
  );
}
