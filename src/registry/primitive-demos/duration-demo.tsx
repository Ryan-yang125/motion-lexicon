import { useState } from "react";
import { DurationPrimitive } from "@/registry/primitives/duration";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function DurationDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [active, setActive] = useState(false);
  const duration = numberValue(values, "duration", 240) / 1000;
  return (
    <PrimitiveDemoSurface label={textFor(locale, "响应速度", "Response timing")} meta={`${Math.round(duration * 1000)} ms`} compact={compact}>
      <div className="grid h-full place-items-center">
        <ProductPanel className="w-full max-w-[340px] space-y-3 p-4">
          {[{ label: textFor(locale, "当前设置", "Current"), speed: duration }, { label: textFor(locale, "快速参考", "Fast reference"), speed: 0.16 }].map((lane, index) => <div className="grid grid-cols-[66px_1fr] items-center gap-3" key={lane.label}><span className="text-[9.5px] text-stone-400">{lane.label}</span><div className="h-px bg-stone-200 dark:bg-white/[0.12]"><DurationPrimitive active={active} duration={lane.speed} easing={easingValue(values, "ease", "snap")} delay={index ? 0 : numberValue(values, "delay", 0) / 1000} distance={compact ? 90 : 150} className="-mt-1.5 size-3 rounded-full bg-stone-800 dark:bg-stone-200"><span /></DurationPrimitive></div></div>)}
          {!compact ? <ProductButton className="mt-2 w-full" onClick={() => setActive((value) => !value)}>{textFor(locale, "比较节奏", "Compare timing")}</ProductButton> : null}
        </ProductPanel>
      </div>
    </PrimitiveDemoSurface>
  );
}
