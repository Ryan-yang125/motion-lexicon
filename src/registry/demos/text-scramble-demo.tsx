"use client";

import { useState } from "react";
import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { TextScramble } from "@/registry/components/text-scramble";

export function TextScrambleDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const values = locale === "zh" ? ["信号已锁定", "正在同步", "部署完成"] : ["SIGNAL LOCKED", "SYNCING DATA", "DEPLOYED"];
  const [index, setIndex] = useState(0);
  return <div className="flex min-h-[180px] flex-col justify-between rounded-[18px] bg-[#e7eae2] p-5"><span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#68715f]">{demoValue(locale, "系统状态", "System status")}</span><TextScramble value={values[index]} label={demoValue(locale, "技术状态文字", "Technical status text")} /><button type="button" onClick={() => setIndex((current) => (current + 1) % values.length)} className="min-h-11 w-fit rounded-full border border-[#1e201d]/15 bg-white/70 px-4 text-[12px] text-[#363a34] outline-none transition hover:bg-white focus-visible:ring-2 focus-visible:ring-[#4568FF]">{demoValue(locale, "变更状态", "Change status")} <span aria-hidden>→</span></button></div>;
}
