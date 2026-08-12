"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import {
  CommandPalette,
  type CommandItem,
} from "@/registry/components/command-palette";

export function CommandPaletteDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [open, setOpen] = useState(false);
  const commands: CommandItem[] = [
    { id: "research", label: demoValue(locale, "研究参考产品", "Research reference products"), hint: demoValue(locale, "浏览器", "Browser"), shortcut: ["⌘", "R"] },
    { id: "build", label: demoValue(locale, "构建 Agent Workspace", "Build Agent Workspace"), keywords: "agent interface workspace 构建" },
    { id: "review", label: demoValue(locale, "检查动效与无障碍", "Review motion and accessibility"), keywords: "review motion a11y 检查" },
    { id: "explain", label: demoValue(locale, "解释当前实现", "Explain current implementation"), hint: demoValue(locale, "基于源码", "From source") },
    { id: "test", label: demoValue(locale, "运行完整质量检查", "Run full quality checks"), keywords: "test lint build 测试" },
    { id: "preview", label: demoValue(locale, "发布预览", "Publish preview"), shortcut: ["⌘", "↵"] },
    { id: "diff", label: demoValue(locale, "审阅所有改动", "Review all changes"), keywords: "diff changes review 改动" },
    { id: "handoff", label: demoValue(locale, "交接给另一个 Agent", "Hand off to another agent"), keywords: "handoff delegate 交接" },
  ];

  return (
    <div role="group" aria-label={demoText("command-palette", locale)} className="grid w-full place-items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mat-cap press h-9 rounded-[9px] px-3.5 text-[13px] font-medium text-ink"
      >
        {demoValue(locale, "调用 Agent 命令", "Open agent commands")}
      </button>
      {open ? (
        <CommandPalette
          open
          items={commands}
          onDismiss={() => setOpen(false)}
          onSelect={() => setOpen(false)}
          label={demoValue(locale, "Agent 命令", "Agent commands")}
          placeholder={demoValue(locale, "告诉 Agent 下一步做什么", "Tell the agent what to do")}
          emptyLabel={demoValue(locale, "没有匹配命令", "No matching command")}
        />
      ) : null}
    </div>
  );
}
