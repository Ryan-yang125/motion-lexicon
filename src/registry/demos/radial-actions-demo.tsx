"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { RadialActions } from "@/registry/components/radial-actions";

const Icon = ({ children }: { children: string }) => <span aria-hidden className="text-[14px] font-medium">{children}</span>;

export function RadialActionsDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [last, setLast] = useState(() => demoValue(locale, "选择工具", "Choose a tool"));
  return (
    <div role="group" aria-label={demoText("radial-actions", locale)} className="relative grid w-full max-w-[420px] place-items-center overflow-hidden rounded-[18px] bg-[#E7E2D9] dark:bg-[#262522]">
      <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[.08em] text-stone-500">{demoValue(locale, "画布工具", "Canvas tools")}</span>
      <span role="status" className="absolute bottom-4 left-4 text-[11px] text-stone-500">{last}</span>
      <RadialActions
        label={demoValue(locale, "打开画布工具", "Open canvas tools")}
        trigger={<span aria-hidden className="text-xl leading-none">+</span>}
        actions={[
          { id: "note", label: demoValue(locale, "添加便签", "Add note"), icon: <Icon>N</Icon>, onSelect: () => setLast(demoValue(locale, "已添加便签", "Note added")) },
          { id: "image", label: demoValue(locale, "添加图片", "Add image"), icon: <Icon>I</Icon>, onSelect: () => setLast(demoValue(locale, "已添加图片", "Image added")) },
          { id: "link", label: demoValue(locale, "添加链接", "Add link"), icon: <Icon>L</Icon>, onSelect: () => setLast(demoValue(locale, "已添加链接", "Link added")) },
          { id: "frame", label: demoValue(locale, "添加画框", "Add frame"), icon: <Icon>F</Icon>, onSelect: () => setLast(demoValue(locale, "已添加画框", "Frame added")) },
        ]}
      />
    </div>
  );
}
