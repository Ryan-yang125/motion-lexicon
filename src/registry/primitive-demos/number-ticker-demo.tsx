import { useState } from "react";
import { NumberTickerPrimitive } from "@/registry/primitives/number-ticker";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, StatusPill, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function NumberTickerDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [value, setValue] = useState(2408);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "本周使用", "Weekly usage")} meta="tabular" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="w-full max-w-[310px] p-4"><div className="flex items-start justify-between"><div><span className="text-[9px] text-stone-400">{textFor(locale, "注册表安装量", "REGISTRY INSTALLS")}</span><NumberTickerPrimitive value={value} duration={numberValue(values, "duration", 240) / 1000} distance={numberValue(values, "distance", 24)} easing={easingValue(values, "ease", "snap")} className="mt-2 text-[28px] font-semibold tracking-[-0.04em]" /></div><StatusPill tone="success">+18.4%</StatusPill></div>{!compact ? <ProductButton className="mt-4 w-full" onClick={() => setValue((current) => current + 137)}>{textFor(locale, "刷新数据", "Refresh data")}</ProductButton> : null}</ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
