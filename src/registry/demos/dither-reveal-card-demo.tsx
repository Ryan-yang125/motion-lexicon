"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { DitherRevealCard } from "@/registry/components/dither-reveal-card";

export function DitherRevealCardDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("dither-reveal-card", locale)} className="mx-auto w-full max-w-[440px]">
      <DitherRevealCard
        label={demoValue(locale, "显影发布简报", "Reveal the launch brief")}
        front={
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">{demoValue(locale, "工作室笔记 · 04", "Studio note · 04")}</span>
            <span>
              <strong className="block max-w-[13ch] text-[22px] font-medium leading-[1.05] tracking-[-0.035em] text-[#292929]">{demoValue(locale, "一次周全的发布。", "A launch that feels considered.")}</strong>
              <span className="mt-2 block text-[12px] text-stone-600">{demoValue(locale, "显影最终方向", "Reveal the final direction")}</span>
            </span>
          </>
        }
        back={
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#4F6651]">{demoValue(locale, "已通过的方向", "Approved direction")}</span>
            <span>
              <strong className="block max-w-[15ch] text-[22px] font-medium leading-[1.05] tracking-[-0.035em] text-[#292929]">{demoValue(locale, "安静表面。精准动效。", "Quiet surfaces. Precise motion.")}</strong>
              <span className="mt-2 block text-[12px] text-[#4F6651]">{demoValue(locale, "点击保持这一面", "Click to keep this side open")}</span>
            </span>
          </>
        }
      />
    </div>
  );
}
