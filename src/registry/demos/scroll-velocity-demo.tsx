"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { ScrollVelocity } from "@/registry/components/scroll-velocity";

export function ScrollVelocityDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <ScrollVelocity label={demoValue(locale, "滚动速度", "Scroll velocity")} text={demoValue(locale, "现场笔记", "Field notes")} />;
}
