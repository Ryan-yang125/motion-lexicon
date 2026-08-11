"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { FloatingDock } from "@/registry/components/floating-dock";

const Glyph = ({ children }: { children: string }) => <span aria-hidden className="text-[12px] font-semibold">{children}</span>;

export function FloatingDockDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [active, setActive] = useState("canvas");
  const items = [
    ["home", demoValue(locale, "首页", "Home"), "H"], ["canvas", demoValue(locale, "画布", "Canvas"), "C"], ["assets", demoValue(locale, "素材", "Assets"), "A"], ["notes", demoValue(locale, "笔记", "Notes"), "N"], ["settings", demoValue(locale, "设置", "Settings"), "S"],
  ] as const;
  return (
    <div role="group" aria-label={demoText("floating-dock", locale)} className="grid w-full max-w-[430px] place-items-center rounded-[18px] bg-[#DDD7CD] px-4 py-16 dark:bg-[#292825]">
      <FloatingDock
        label={demoValue(locale, "工作区工具", "Workspace tools")}
        activeId={active}
        items={items.map(([id, label, glyph]) => ({ id, label, icon: <Glyph>{glyph}</Glyph>, onSelect: () => setActive(id) }))}
      />
    </div>
  );
}
