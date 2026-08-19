"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { TextLoop } from "@/registry/components/text-loop";

export function TextLoopDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const items = locale === "zh" ? ["在现场", "已归档", "可阅读"] : ["On location", "In the archive", "Ready to read"];
  return <div className="grid min-h-[180px] place-items-center rounded-[18px] bg-[#e0d9cb] p-5"><TextLoop label={demoValue(locale, "刊物状态", "Edition status")} items={items} /></div>;
}
