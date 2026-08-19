"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { TextMorph } from "@/registry/components/text-morph";

export function TextMorphDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const phrases = locale === "zh" ? ["创作笔记", "工作室档案", "现场记录"] : ["Studio notes", "Field records", "Material studies"];
  return <div className="grid min-h-[180px] place-items-center rounded-[18px] bg-[#f3eee5] p-5"><TextMorph phrases={phrases} label={demoValue(locale, "相关内容", "Related content")} /></div>;
}
