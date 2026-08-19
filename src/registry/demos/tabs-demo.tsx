"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { Tabs } from "@/registry/components/tabs";

export function TabsDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [tab, setTab] = useState("overview");
  const items = [
    { value: "overview", label: demoValue(locale, "概览", "Overview") },
    { value: "activity", label: demoValue(locale, "动态", "Activity") },
    { value: "members", label: demoValue(locale, "成员", "Members") },
  ];
  const panels: Record<string, { title: string; lines: string[] }> = locale === "zh" ? {
    overview: { title: "Acme 工作区", lines: ["4 个项目，2 个已归档", "创建于 3 月 14 日"] },
    activity: { title: "过去 24 小时", lines: ["Dana 部署了 api-gateway", "Rui 关闭了 3 个问题"] },
    members: { title: "6 位成员", lines: ["2 位管理员，4 位编辑", "1 个邀请待处理"] },
  } : {
    overview: { title: "Acme workspace", lines: ["4 projects, 2 archived", "Created 14 March"] },
    activity: { title: "Last 24 hours", lines: ["Dana deployed api-gateway", "Rui closed 3 issues"] },
    members: { title: "6 people", lines: ["2 admins, 4 editors", "1 invite pending"] },
  };

  return (
    <div role="group" aria-label={demoText("tabs", locale)} className="mx-auto w-full max-w-[440px] rounded-[16px] bg-[#f1f4f8] p-3">
      <Tabs
        items={items}
        value={tab}
        onValueChange={setTab}
        label={demoValue(locale, "工作区栏目", "Workspace sections")}
        panelClassName="mt-3"
        renderPanel={(value) => (
          <div className="flex h-[86px] flex-col justify-center rounded-[11px] bg-sub px-3.5">
            <p className="text-[13px] font-medium text-ink">{panels[value].title}</p>
            {panels[value].lines.map((line) => (
              <p key={line} className="mt-1 text-[12.5px] text-ink-2">
                {line}
              </p>
            ))}
          </div>
        )}
      />
    </div>
  );
}
