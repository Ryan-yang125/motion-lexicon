"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import type { Locale } from "@/data/types";

import { ScrollStory } from "@/registry/components/scroll-story";

function Scene({ tone, title, index, locale }: { tone: string; title: string; index: string; locale: Locale }) {
  return (
    <div className="mx-auto w-full max-w-[230px] rounded-[16px] border border-white/55 bg-white/88 p-4 shadow-[0_22px_42px_-30px_rgba(28,25,23,.8)] dark:border-white/10 dark:bg-[#1F1F1C]">
      <div className="flex items-center justify-between"><span className="text-[9px] uppercase tracking-[.12em] text-stone-400">{demoValue(locale, `章节 ${index}`, `Chapter ${index}`)}</span><span className={`size-2 rounded-full ${tone}`} /></div>
      <strong className="mt-8 block text-[15px] text-stone-800 dark:text-stone-100">{title}</strong>
      <div className="mt-3 h-1.5 w-4/5 rounded-full bg-stone-200 dark:bg-white/10" />
      <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-stone-100 dark:bg-white/5" />
    </div>
  );
}

export function ScrollStoryDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <ScrollStory
      label={demoText("scroll-story", locale)}
      height={300}
      chapters={[
        { id: "capture", eyebrow: "01", title: demoValue(locale, "捕捉信号", "Capture the signal"), scene: <Scene locale={locale} index="01" title={demoValue(locale, "新需求", "New request")} tone="bg-[#4568FF]" /> },
        { id: "shape", eyebrow: "02", title: demoValue(locale, "塑造动效", "Shape the motion"), scene: <Scene locale={locale} index="02" title={demoValue(locale, "动效草案", "Motion draft")} tone="bg-[#93664F]" /> },
        { id: "ship", eyebrow: "03", title: demoValue(locale, "放心发布", "Ship with confidence"), scene: <Scene locale={locale} index="03" title={demoValue(locale, "可以发布", "Ready to publish")} tone="bg-[#55745D]" /> },
      ]}
    />
  );
}
