"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import type { Locale } from "@/data/types";

import { ScrollStory } from "@/registry/components/scroll-story";

function Scene({ tone, title, index, locale }: { tone: string; title: string; index: string; locale: Locale }) {
  return (
    <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[18px] border border-[#f8e6cc]/35 bg-[#f2e5cf] p-3 shadow-[0_28px_60px_-28px_rgba(0,0,0,.88)]">
      <div className="relative min-h-[196px] overflow-hidden rounded-[12px] bg-[#29241d] p-4">
        <div aria-hidden className={`absolute -right-10 -top-10 size-40 rounded-full opacity-90 blur-[1px] ${tone}`} />
        <div aria-hidden className="absolute bottom-[-38%] left-[-4%] h-[74%] w-[112%] rotate-[-9deg] rounded-[42%] border border-white/20 bg-[#11110f]/65" />
        <div className="relative z-10 flex items-center justify-between text-[#f8ead8]">
          <span className="font-mono text-[9px] uppercase tracking-[.16em]">{demoValue(locale, "北岸工作室", "Northline Studio")}</span>
          <span className="rounded-full border border-white/25 px-2 py-1 font-mono text-[8px]">{index}/03</span>
        </div>
        <div className="relative z-10 mt-11 max-w-[13ch]">
          <span className="font-mono text-[9px] uppercase tracking-[.14em] text-[#ffd7ad]/75">{demoValue(locale, `章节 ${index}`, `Chapter ${index}`)}</span>
          <strong className="mt-2 block font-serif text-[25px] leading-[.92] tracking-[-.06em] text-[#fff5e7]">{title}</strong>
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
          <span className="h-px w-20 bg-white/45" />
          <span className="font-mono text-[8px] tracking-[.18em] text-white/55">FIELD NOTES</span>
        </div>
      </div>
    </div>
  );
}

export function ScrollStoryDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <ScrollStory
      label={demoText("scroll-story", locale)}
      emptyLabel={demoValue(locale, "暂无章节", "No chapters available.")}
      height={300}
      chapters={[
        { id: "capture", eyebrow: "01", title: demoValue(locale, "收集现场", "Collect the field"), scene: <Scene locale={locale} index="01" title={demoValue(locale, "海岸的光", "Light from the coast")} tone="bg-[#d97848]" /> },
        { id: "shape", eyebrow: "02", title: demoValue(locale, "编辑节奏", "Edit the rhythm"), scene: <Scene locale={locale} index="02" title={demoValue(locale, "一张缓慢的牌", "One slow card")} tone="bg-[#6e8b80]" /> },
        { id: "ship", eyebrow: "03", title: demoValue(locale, "发布成册", "Publish the issue"), scene: <Scene locale={locale} index="03" title={demoValue(locale, "在纸上停留", "Hold on paper")} tone="bg-[#d7a74d]" /> },
      ]}
    />
  );
}
