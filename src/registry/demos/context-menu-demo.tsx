"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import {
  ContextMenu,
  type ContextMenuItem,
} from "@/registry/components/context-menu";

const initial = [
  { id: "a", name: "cover-final-v4.png", meta: "PNG · 1.2 MB" },
  { id: "b", name: "hero-crop@2x.png", meta: "PNG · 840 KB" },
  { id: "c", name: "desk-shot-0912.jpg", meta: "JPG · 2.4 MB" },
];

export function ContextMenuDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [files, setFiles] = useState(initial);

  const actions = (id: string): ContextMenuItem[] => [
    { id: "open", label: demoValue(locale, "打开", "Open"), shortcut: "↵" },
    { id: "rename", label: demoValue(locale, "重命名", "Rename"), shortcut: "F2" },
    { id: "copy", label: demoValue(locale, "复制链接", "Copy link"), shortcut: "⌘L" },
    { id: "sep", type: "separator" },
    {
      id: "trash",
      label: demoValue(locale, "移到废纸篓", "Move to trash"),
      shortcut: "⌫",
      onSelect: () => setFiles((prev) => prev.filter((file) => file.id !== id)),
    },
  ];

  return (
    <div role="group" aria-label={demoText("context-menu", locale)} className="mx-auto w-full max-w-[380px] rounded-[16px] bg-[#f5ead9] p-3 shadow-[0_18px_38px_-30px_rgba(67,46,21,.4)]">
      {files.length > 0 ? (
        <ul className="space-y-1">
          {files.map((file) => (
            <li key={file.id}>
              <ContextMenu
                label={demoValue(locale, `${file.name} 的操作`, `Actions for ${file.name}`)}
                hint={locale === "zh" ? "右键点击，或按 Shift 加 F10 打开操作菜单" : undefined}
                items={actions(file.id)}
                className="flex h-[50px] items-center rounded-[9px] bg-sub px-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-ink">
                    {file.name}
                  </span>
                  <span className="mt-[1px] block text-[11px] text-ink-3">
                    {file.meta}
                  </span>
                </span>
              </ContextMenu>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid h-[158px] place-items-center">
          <button
            type="button"
            onClick={() => setFiles(initial)}
            className="mat-cap press h-9 rounded-[9px] px-3.5 text-[13px] font-medium text-ink"
          >
            {demoValue(locale, "恢复文件", "Put them back")}
          </button>
        </div>
      )}
    </div>
  );
}
