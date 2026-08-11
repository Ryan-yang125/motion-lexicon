import { useState } from "react";
import { Motion3dTiltFlipPrimitive } from "@/registry/primitives/3d-tilt-flip";
import { PrimitiveDemoSurface, ProductButton, StatusPill, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

function Face({ back, locale }: { back?: boolean; locale: "zh" | "en" }) {
  return <div className={`size-full rounded-[13px] border p-4 shadow-[0_8px_20px_-16px_rgba(28,25,23,0.55)] ${back ? "border-stone-800 bg-stone-800 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900" : "border-stone-200 bg-white dark:border-white/[0.12] dark:bg-[#20201D]"}`}><div className="flex items-center justify-between"><span className="text-[9px] uppercase tracking-[0.08em] opacity-50">{textFor(locale, "工作区", "Workspace")}</span><StatusPill>{back ? textFor(locale, "专业", "PRO") : textFor(locale, "免费", "FREE")}</StatusPill></div><strong className="mt-8 block text-[16px]">{back ? textFor(locale, "团队计划", "Team plan") : "Motion Lexicon"}</strong><p className="mt-1 text-[10px] opacity-55">{back ? textFor(locale, "无限项目 · 12 位成员", "Unlimited projects · 12 seats") : textFor(locale, "点击查看计划", "Flip to view plan")}</p></div>;
}

export function ThreeDTiltFlipDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [flipped, setFlipped] = useState(false);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "工作区计划", "Workspace plan")} meta="3D" compact={compact}>
      <div className="grid h-full place-items-center">
        <div className="w-[260px] space-y-3">
          <Motion3dTiltFlipPrimitive flipped={flipped} front={<Face locale={locale} />} back={<Face locale={locale} back />} angle={numberValue(values, "angle", 180)} perspective={numberValue(values, "perspective", 800)} duration={numberValue(values, "duration", 280) / 1000} easing={easingValue(values, "ease", "ease-in-out")} className={compact ? "h-[94px]" : "h-[142px]"} />
          {!compact ? <ProductButton className="w-full" onClick={() => setFlipped((value) => !value)}>{textFor(locale, "翻转卡片", "Flip card")}</ProductButton> : null}
        </div>
      </div>
    </PrimitiveDemoSurface>
  );
}
