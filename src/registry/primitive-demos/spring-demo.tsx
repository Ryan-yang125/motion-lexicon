import { useState } from "react";
import { SpringPrimitive } from "@/registry/primitives/spring";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function SpringDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [active, setActive] = useState(false);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "快捷工具", "Quick tools")} meta="spring" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="w-full max-w-[330px] p-4"><div className="relative h-16 rounded-[10px] bg-stone-100 dark:bg-white/[0.05]"><div className="absolute inset-y-0 left-1/2 w-px bg-stone-200 dark:bg-white/[0.08]" /><SpringPrimitive active={active} distance={compact ? 72 : numberValue(values, "distance", 48)} stiffness={numberValue(values, "stiffness", 220)} damping={numberValue(values, "damping", 24)} mass={numberValue(values, "mass", 1)} velocity={numberValue(values, "velocity", 0)} className="absolute left-8 top-3 grid size-10 place-items-center rounded-[11px] bg-stone-800 text-[11px] text-white shadow-md dark:bg-stone-100 dark:text-stone-900">ML</SpringPrimitive></div>{!compact ? <div className="mt-3 flex items-center justify-between"><span className="text-[9px] text-stone-400">{numberValue(values, "stiffness", 220)} / {numberValue(values, "damping", 24)}</span><ProductButton onClick={() => setActive((value) => !value)}>{textFor(locale, "切换位置", "Toggle position")}</ProductButton></div> : null}</ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
