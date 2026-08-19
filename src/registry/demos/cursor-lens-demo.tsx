"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import type { Locale } from "@/data/types";

import { CursorLens } from "@/registry/components/cursor-lens";

function Scene({ detailed = false, locale }: { detailed?: boolean; locale: Locale }) {
  return (
    <div className={`relative size-full overflow-hidden ${detailed ? "bg-[#1c3557]" : "bg-[#d9b78e]"}`}>
      <div className="absolute -left-10 bottom-[-46px] size-44 rounded-full bg-[#b44e3d]" />
      <div className={`absolute right-[-28px] top-[-34px] size-40 rotate-12 rounded-[36px] ${detailed ? "bg-[#72b4c6]" : "bg-[#314d78]"}`} />
      <div className="absolute left-[28%] top-[22%] h-[56%] w-[47%] rounded-[10px] border border-white/60 bg-[#f7eddd]/88 p-4 shadow-[0_6px_8px_-6px_rgba(28,25,23,.65)]">
        <span className="text-[9px] uppercase tracking-[.12em] text-stone-600">{demoValue(locale, "对象 07", "Object 07")}</span>
        <strong className="mt-8 block text-[15px] text-stone-800">{demoValue(locale, "港口的蓝", "Harbor blue")}</strong>
        <p className="mt-1 text-[10px] text-stone-600">{detailed ? demoValue(locale, "修复表面 · 4 倍细节", "Restored surface · 4× detail") : demoValue(locale, "移动查看", "Move to inspect")}</p>
      </div>
    </div>
  );
}

export function CursorLensDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("cursor-lens", locale)} className="w-full max-w-[430px] rounded-[18px] bg-[#efe8dc] p-3 dark:bg-[#211d1a]">
      <CursorLens label={demoValue(locale, "查看修复后的图像细节", "Inspect restored image detail")} instructions={locale === "zh" ? "使用方向键移动放大镜，按 Escape 隐藏。" : undefined} base={<Scene locale={locale} />} detail={<Scene locale={locale} detailed />} />
    </div>
  );
}
