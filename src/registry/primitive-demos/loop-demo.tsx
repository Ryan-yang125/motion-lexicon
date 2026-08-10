import { LoopPrimitive, type LoopDirection } from "@/registry/primitives/loop";
import { PrimitiveDemoSurface, ProductPanel, booleanValue, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function LoopDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "上传队列", "Upload queue")} meta="loop" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="flex w-full max-w-[320px] items-center gap-4 p-4"><div className="relative grid size-12 place-items-center rounded-[12px] bg-stone-100 dark:bg-white/[0.06]"><LoopPrimitive key={replayKey} duration={numberValue(values, "duration", 1200) / 1000} pause={numberValue(values, "pause", 160) / 1000} direction={stringValue(values, "direction", "normal") as LoopDirection} iterations={numberValue(values, "iterations", 3)} infinite={booleanValue(values, "infinite", false)} distance={10} className="size-2 rounded-full bg-[#4568FF]"><span /></LoopPrimitive></div><div className="min-w-0 flex-1"><strong className="block text-[11px]">motion-v4.zip</strong><span className="text-[9.5px] text-stone-400">{textFor(locale, "正在处理 40 个文件", "Processing 40 files")}</span><div className="mt-2 h-1 overflow-hidden rounded-full bg-stone-100 dark:bg-white/[0.07]"><div className="h-full w-2/3 bg-stone-700 dark:bg-stone-300" /></div></div></ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
