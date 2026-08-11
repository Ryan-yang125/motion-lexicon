import { useState } from "react";
import { RipplePrimitive } from "@/registry/primitives/ripple";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function RippleDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [count, setCount] = useState(3);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "项目操作", "Project actions")} meta="pointer" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="flex w-full max-w-[320px] items-center gap-3 p-3"><div className="min-w-0 flex-1"><strong className="block text-[11px]">{textFor(locale, "动效研究", "Motion studies")}</strong><span className="text-[9.5px] text-stone-400">{textFor(locale, `${count} 位协作者`, `${count} collaborators`)}</span></div><StatusPill tone="success">{textFor(locale, "活跃", "Active")}</StatusPill><RipplePrimitive duration={numberValue(values, "duration", 160) / 1000} size={numberValue(values, "size", 220) / 100} opacity={numberValue(values, "opacity", 24) / 100} onPress={() => setCount((value) => value + 1)} className="min-h-11 rounded-[9px] bg-stone-800 px-3 text-[10px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF]/55 dark:bg-stone-100 dark:text-stone-900">＋ {textFor(locale, "邀请", "Invite")}</RipplePrimitive></ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
