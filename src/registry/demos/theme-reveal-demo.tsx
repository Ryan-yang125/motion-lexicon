"use client";

import { useState } from "react";
import { ThemeReveal } from "@/registry/components/theme-reveal";

export function ThemeRevealDemo() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const dark = theme === "dark";
  return (
    <div className={`w-full max-w-[420px] rounded-[18px] border p-4 transition-[background-color,border-color,color] duration-200 ${dark ? "border-white/10 bg-[#1D1D1A] text-stone-100" : "border-stone-200 bg-[#ECE8E0] text-stone-800"}`}>
      <div className="flex items-center justify-between">
        <div><span className="text-[9px] uppercase tracking-[.12em] opacity-45">Reading room</span><strong className="mt-1 block text-[14px]">Evening notes</strong></div>
        <ThemeReveal theme={theme} onThemeChange={setTheme} />
      </div>
      <div className={`mt-8 rounded-[14px] p-4 ${dark ? "bg-white/[.06]" : "bg-white/75"}`}>
        <div className="h-1.5 w-4/5 rounded-full bg-current opacity-20" />
        <div className="mt-2 h-1.5 w-3/5 rounded-full bg-current opacity-10" />
      </div>
    </div>
  );
}
