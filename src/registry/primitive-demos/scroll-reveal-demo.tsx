import { ScrollRevealPrimitive } from "@/registry/primitives/scroll-reveal";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function ScrollRevealDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "更新日志", "Changelog")} meta="in view" compact={compact}>
      <div className="grid h-full place-items-center">
        <ScrollRevealPrimitive key={replayKey} threshold={numberValue(values, "threshold", 20) / 100} distance={numberValue(values, "distance", 28)} duration={numberValue(values, "duration", 260) / 1000} easing={easingValue(values, "ease", "soft")} className="w-full max-w-[326px]">
          <ProductPanel className="p-4"><div className="flex items-center justify-between"><strong className="text-[12px]">Motion Lexicon v4</strong><StatusPill tone="success">{textFor(locale, "已发布", "Published")}</StatusPill></div><p className="mt-3 text-[10.5px] leading-5 text-stone-500 dark:text-stone-400">{textFor(locale, "40 个原子动效现在拥有独立实现、真实场景和同源代码。", "Forty primitives now ship with independent implementations, real scenes, and one source of truth.")}</p></ProductPanel>
        </ScrollRevealPrimitive>
      </div>
    </PrimitiveDemoSurface>
  );
}
