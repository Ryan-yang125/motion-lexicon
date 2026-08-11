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
    { id: "new", label: demoValue(locale, "新建文档", "New document"), hint: demoValue(locale, "工作区", "Workspace"), shortcut: ["⌘", "N"] },
    { id: "dup", label: demoValue(locale, "复制文档", "Duplicate document"), keywords: "copy clone 复制" },
    { id: "del", label: demoValue(locale, "删除文档", "Delete document"), keywords: "remove trash 删除" },
    { id: "share", label: demoValue(locale, "分享链接", "Share link"), hint: demoValue(locale, "任何获得链接的人", "Anyone with the link") },
    { id: "export", label: demoValue(locale, "导出 PDF", "Export as PDF"), keywords: "download print 下载" },
    { id: "rename", label: demoValue(locale, "重命名文档", "Rename document"), shortcut: ["F2"] },
    { id: "history", label: demoValue(locale, "版本历史", "Version history"), keywords: "revisions restore 版本" },
    { id: "settings", label: demoValue(locale, "打开设置", "Open settings"), shortcut: ["⌘", ","] },
  ];

  return (
    <div role="group" aria-label={demoText("command-palette", locale)} className="grid w-full place-items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mat-cap press h-9 rounded-[9px] px-3.5 text-[13px] font-medium text-ink"
      >
        {demoValue(locale, "打开命令", "Open commands")}
      </button>
      {open ? (
        <CommandPalette
          open
          items={commands}
          onDismiss={() => setOpen(false)}
          onSelect={() => setOpen(false)}
          label={demoValue(locale, "命令面板", "Command palette")}
          placeholder={demoValue(locale, "输入关键词", "Type a command")}
          emptyLabel={demoValue(locale, "没有匹配命令", "No matching command")}
        />
      ) : null}
    </div>
  );
}
