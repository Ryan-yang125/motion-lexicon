import { useState } from "react";
import { CompositingPrimitive, type CompositingProperty } from "@/registry/primitives/compositing";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, easingValue, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function CompositingDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [active, setActive] = useState(false);
  const property = stringValue(values, "property", "transform") as CompositingProperty;
  return (
    <PrimitiveDemoSurface label={textFor(locale, "渲染路径", "Render path")} meta={property} compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="w-full max-w-[340px] space-y-4 p-4"><div className="grid grid-cols-[64px_1fr] items-center gap-3"><span className="text-[9px] text-stone-400">{textFor(locale, "合成", "COMPOSITE")}</span><div className="h-px bg-stone-200 dark:bg-white/[0.1]"><CompositingPrimitive active={active} property={property} distance={compact ? 80 : numberValue(values, "distance", 80)} duration={numberValue(values, "duration", 520) / 1000} easing={easingValue(values, "ease", "linear")} className="-mt-1.5 size-3 rounded-full bg-[#55745D]"><span /></CompositingPrimitive></div></div><div className="grid grid-cols-[64px_1fr] items-center gap-3"><span className="text-[9px] text-stone-400">{textFor(locale, "布局", "LAYOUT")}</span><div className="h-1 rounded-full bg-[#93664F]/20"><div className="h-full w-2/3 rounded-full bg-[#93664F]" /></div></div>{!compact ? <ProductButton className="w-full" onClick={() => setActive((value) => !value)}>{textFor(locale, "运行比较", "Run comparison")}</ProductButton> : null}</ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
