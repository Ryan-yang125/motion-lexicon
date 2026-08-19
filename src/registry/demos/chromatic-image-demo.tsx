"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import { ChromaticImage } from "@/registry/components/chromatic-image";

export function ChromaticImageDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <div role="group" aria-label={demoText("chromatic-image", locale)} className="mx-auto w-full max-w-[560px]"><ChromaticImage label={demoValue(locale, "色差肖像", "Chromatic portrait")} alt={demoValue(locale, "紫色背景上的太阳和长直线", "A sun and long line on a violet ground")} caption={demoValue(locale, "移动指针，让两组色版沿着焦点分离。", "Move across the frame to separate the colour plates around your focus.")} art={<div aria-hidden className="relative size-full overflow-hidden bg-[#39205b]"><span className="absolute left-[16%] top-[18%] size-[54%] rounded-full bg-[#f4bb62]" /><span className="absolute inset-y-[-12%] right-[23%] w-[4%] rotate-[27deg] bg-[#e55e86]" /><span className="absolute bottom-[17%] left-[9%] h-px w-[72%] bg-[#dbddff]/80" /></div>} /></div>;
}
