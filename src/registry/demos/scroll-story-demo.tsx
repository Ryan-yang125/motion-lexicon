"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import type { Locale } from "@/data/types";

import { ScrollStory } from "@/registry/components/scroll-story";

function Scene({ tone, title, index, locale }: { tone: string; title: string; index: string; locale: Locale }) {
  return (
    <div className="mx-auto w-full max-w-[230px] rounded-[10px] border border-white/55 bg-white/88 p-4 shadow-[0_4px_8px_-6px_rgba(28,25,23,.7)] dark:border-white/10 dark:bg-[#202020]">
      <div className="flex items-center justify-between"><span className="text-[9px] uppercase tracking-[.12em] text-stone-600 dark:text-stone-300">{demoValue(locale, `章节 ${index}`, `Chapter ${index}`)}</span><span className={`size-2 rounded-full ${tone}`} /></div>
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
      emptyLabel={demoValue(locale, "暂无章节", "No chapters available.")}
      height={300}
      chapters={[
        { id: "capture", eyebrow: "01", title: demoValue(locale, "捕捉信号", "Capture the signal"), scene: <Scene locale={locale} index="01" title={demoValue(locale, "新需求", "New request")} tone="bg-[#171717]" /> },
        { id: "shape", eyebrow: "02", title: demoValue(locale, "塑造动效", "Shape the motion"), scene: <Scene locale={locale} index="02" title={demoValue(locale, "动效草案", "Motion draft")} tone="bg-[#737373]" /> },
        { id: "ship", eyebrow: "03", title: demoValue(locale, "放心发布", "Ship with confidence"), scene: <Scene locale={locale} index="03" title={demoValue(locale, "可以发布", "Ready to publish")} tone="bg-[#525252]" /> },
      ]}
    />
  );
}
