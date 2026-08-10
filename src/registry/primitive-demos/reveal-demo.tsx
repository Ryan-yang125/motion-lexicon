import { RevealPrimitive, type RevealMode } from "@/registry/primitives/reveal";
import { PrimitiveDemoSurface, ProductButton, StatusPill, easingValue, numberValue, stringValue, textFor, useEntryReplay, type PrimitiveDemoProps } from "./_shared";

export function RevealDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  const [present, setPresent] = useEntryReplay(replayKey);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "版本说明", "Release notes")} meta="reveal" compact={compact}>
      <div className="grid h-full place-items-center">
        <div className="w-full max-w-[330px] space-y-3">
          <RevealPrimitive
            present={present}
            mode={stringValue(values, "reveal", "clip") as RevealMode}
            distance={numberValue(values, "distance", 20)}
            duration={numberValue(values, "duration", 260) / 1000}
            easing={easingValue(values, "ease", "soft")}
            delay={numberValue(values, "delay", 0) / 1000}
          >
            <div className="overflow-hidden rounded-[12px] bg-stone-900 p-4 text-white dark:bg-stone-100 dark:text-stone-900">
              <div className="mb-6 flex items-center justify-between"><StatusPill>v4.0</StatusPill><span className="text-[9px] opacity-50">10 AUG</span></div>
              <strong className="block text-[15px]">{textFor(locale, "原子动效，重新完成", "Primitives, rebuilt")}</strong>
              <p className="mt-1 text-[10px] opacity-60">40 independent React motion interactions.</p>
            </div>
          </RevealPrimitive>
          {!compact ? <ProductButton className="w-full" onClick={() => setPresent((value) => !value)}>{textFor(locale, "切换版本说明", "Toggle release note")}</ProductButton> : null}
        </div>
      </div>
    </PrimitiveDemoSurface>
  );
}
