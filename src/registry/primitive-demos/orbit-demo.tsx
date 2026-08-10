import { OrbitPrimitive } from "@/registry/primitives/orbit";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function OrbitDemo({ locale, values, compact }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "云端同步", "Cloud sync")} meta="orbit" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="flex w-full max-w-[320px] items-center justify-between p-4"><div><StatusPill tone="success">{textFor(locale, "同步中", "Syncing")}</StatusPill><strong className="mt-2 block text-[12px]">Motion Lexicon</strong><span className="text-[9.5px] text-stone-400">3 devices · 18 changes</span></div><OrbitPrimitive center={<span className="grid size-12 place-items-center rounded-[14px] bg-stone-800 text-[11px] font-semibold text-white dark:bg-stone-100 dark:text-stone-900">ML</span>} satellite={<span className="block size-2 rounded-full bg-[#4568FF] shadow-[0_0_0_4px_rgba(69,104,255,0.12)]" />} radius={compact ? 34 : numberValue(values, "radius", 56)} duration={numberValue(values, "duration", 6000) / 1000} direction={stringValue(values, "direction", "normal") as "normal" | "reverse"} className={compact ? "size-20" : "size-28"} /></ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
