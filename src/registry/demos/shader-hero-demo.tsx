"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { ShaderHero } from "@/registry/components/shader-hero";

export function ShaderHeroDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <ShaderHero eyebrow={demoValue(locale, "空间界面", "Spatial interface")} title={demoValue(locale, "让氛围成为产品的一部分。", "Make the atmosphere part of the product.")} description={demoValue(locale, "一个会回应指针的低功耗场域；即使静止，也有清楚的焦点和层次。", "A low-power field that responds to the pointer while holding a clear focal point at rest.")} actionLabel={demoValue(locale, "打开场域笔记", "Open field notes")} />;
}
