"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { SplitTextReveal } from "@/registry/components/split-text-reveal";

export function SplitTextRevealDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <SplitTextReveal text={demoValue(locale, "给每一个字留出抵达的时间。", "Give every word time to arrive.")} label={demoValue(locale, "逐词标题显现", "Words assemble into a heading")} replayLabel={demoValue(locale, "重新播放", "Replay reveal")} />;
}
