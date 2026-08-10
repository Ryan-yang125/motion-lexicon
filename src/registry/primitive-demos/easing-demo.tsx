import { useState } from "react";
import { EasingPrimitive, type EasingName } from "@/registry/primitives/easing";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function EasingDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [active, setActive] = useState(false);
  const distance = compact ? 100 : numberValue(values, "distance", 120);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "缓动比较", "Easing comparison")} meta={stringValue(values, "ease", "ease-out")} compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="w-full max-w-[340px] p-4"><div className="mb-3 flex items-center justify-between text-[9px] text-stone-400"><span>START</span><span>END</span></div><div className="h-px bg-stone-200 dark:bg-white/[0.1]"><EasingPrimitive active={active} distance={distance} duration={numberValue(values, "duration", 520) / 1000} easing={stringValue(values, "ease", "ease-out") as EasingName} className="-mt-2 size-4 rounded-full bg-[#4568FF] shadow-[0_0_0_4px_rgba(69,104,255,0.12)]"><span /></EasingPrimitive></div>{!compact ? <div className="mt-7 flex items-center justify-between"><code className="text-[9px] text-stone-400">cubic-bezier</code><ProductButton onClick={() => setActive((value) => !value)}>{textFor(locale, "运行", "Run")}</ProductButton></div> : null}</ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
