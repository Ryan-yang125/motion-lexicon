"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { KineticHeading } from "@/registry/components/kinetic-heading";

export function KineticHeadingDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <KineticHeading label={demoValue(locale, "可变标题", "Variable heading")} text={demoValue(locale, "风景在移动。", "The landscape shifts.")} detail={demoValue(locale, "移动指针，或在标题区域使用方向键改变张力。", "Move across the heading or use arrow keys to change its tension.")} />;
}
