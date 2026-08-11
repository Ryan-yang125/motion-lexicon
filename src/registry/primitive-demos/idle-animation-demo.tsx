import { IdleAnimationPrimitive, type IdleStyle } from "@/registry/primitives/idle-animation";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function IdleAnimationDemo({ locale, values, compact }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "服务状态", "Service status")} meta="idle" compact={compact}>
      <div className="grid h-full place-items-center"><IdleAnimationPrimitive style={stringValue(values, "style", "float") as IdleStyle} distance={numberValue(values, "distance", 8)} duration={numberValue(values, "duration", 2200) / 1000} pause={numberValue(values, "pause", 300) / 1000} className="w-full max-w-[300px]"><ProductPanel className="flex items-center gap-3 p-4"><span className="relative grid size-10 place-items-center rounded-[11px] bg-[#55745D]/12"><i className="size-2 rounded-full bg-[#55745D] shadow-[0_0_0_4px_rgba(85,116,93,0.12)]" /></span><div className="min-w-0 flex-1"><strong className="block text-[11px]">Registry API</strong><span className="text-[9.5px] text-stone-400">{textFor(locale, "运行正常 · 38 ms", "Operational · 38 ms")}</span></div><StatusPill tone="success">99.99%</StatusPill></ProductPanel></IdleAnimationPrimitive></div>
    </PrimitiveDemoSurface>
  );
}
