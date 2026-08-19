"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { DitherRevealCard } from "@/registry/components/dither-reveal-card";

export function DitherRevealCardDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("dither-reveal-card", locale)} className="mx-auto w-full max-w-[440px]">
      <DitherRevealCard
        label={demoValue(locale, "显影展览海报", "Reveal the exhibition poster")}
        palette={{ front: "#1d1e19", back: "#c86741", ink: "#fff2da" }}
        front={
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#f7e0bd]/66">{demoValue(locale, "北岸印刷厂 · 04", "Northline Press · 04")}</span>
            <span>
              <strong className="block max-w-[12ch] font-serif text-[29px] leading-[.9] tracking-[-0.06em] text-[#fff2da]">{demoValue(locale, "光在手中成形。", "Light takes shape by hand.")}</strong>
              <span className="mt-3 block text-[11px] tracking-[.03em] text-[#f7e0bd]/70">{demoValue(locale, "点击显影展览信息", "Tap to develop the exhibition")}</span>
            </span>
          </>
        }
        back={
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#381c15]/72">{demoValue(locale, "十月 / 东京与上海", "October / Tokyo & Shanghai")}</span>
            <span>
              <strong className="block max-w-[12ch] font-serif text-[29px] leading-[.9] tracking-[-0.06em] text-[#301813]">{demoValue(locale, "夜色印记", "Nocturne studies")}</strong>
              <span className="mt-3 block text-[11px] tracking-[.03em] text-[#381c15]/72">{demoValue(locale, "点击保持海报展开", "Tap to keep the poster open")}</span>
            </span>
          </>
        }
      />
    </div>
  );
}
