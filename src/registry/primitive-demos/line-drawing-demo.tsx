import { LineDrawingPrimitive } from "@/registry/primitives/line-drawing";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function LineDrawingDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "发布完成", "Publish complete")} meta="path" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="flex w-full max-w-[310px] items-center gap-4 p-4"><span className="grid size-12 place-items-center rounded-[13px] bg-[#55745D]/12 text-[#55745D]"><LineDrawingPrimitive key={replayKey} duration={numberValue(values, "duration", 1000) / 1000} delay={numberValue(values, "delay", 0) / 1000} easing={easingValue(values, "ease", "calm")} className="size-7" label={textFor(locale, "发布成功", "Published")} /></span><div className="min-w-0 flex-1"><StatusPill tone="success">motion-v5.0</StatusPill><strong className="mt-1.5 block text-[12px]">{textFor(locale, "部署成功", "Deployment complete")}</strong><span className="text-[9.5px] text-stone-400">{textFor(locale, "246 个页面 · 104 个注册项", "246 pages · 104 registry items")}</span></div></ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
