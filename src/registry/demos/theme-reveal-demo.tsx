"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { ThemeReveal } from "@/registry/components/theme-reveal";

export function ThemeRevealDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const dark = theme === "dark";
  return (
    <div role="group" aria-label={demoText("theme-reveal", locale)} data-theme-reveal-state={theme} className={`w-full max-w-[420px] rounded-[16px] border p-4 transition-[background-color,border-color,color] duration-200 ${dark ? "border-[#d5b782]/20 bg-[#161b1e] text-stone-100" : "border-[#b9cbd1]/55 bg-[#eaf3f1] text-stone-800"}`}>
      <div className="flex items-center justify-between">
        <strong className="text-[14px] font-medium">{demoValue(locale, "晚间笔记", "Evening notes")}</strong>
        <ThemeReveal theme={theme} onThemeChange={setTheme} lightLabel={demoValue(locale, "使用浅色主题", "Use light theme")} darkLabel={demoValue(locale, "使用深色主题", "Use dark theme")} />
      </div>
      <div className={`mt-8 rounded-[14px] p-4 ${dark ? "bg-white/[.06]" : "bg-white/75"}`}>
        <div className="h-1.5 w-4/5 rounded-full bg-current opacity-20" />
        <div className="mt-2 h-1.5 w-3/5 rounded-full bg-current opacity-10" />
      </div>
    </div>
  );
}
