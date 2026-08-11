import { useRef } from "react";
import { ScrollDrivenAnimationPrimitive } from "@/registry/primitives/scroll-driven-animation";
import { PrimitiveDemoSurface, ProductPanel, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function ScrollDrivenAnimationDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const container = useRef<HTMLDivElement>(null);
  const sections = locale === "zh" ? ["介绍", "交互", "无障碍", "发布"] : ["Introduction", "Interaction", "Accessibility", "Shipping"];
  return (
    <PrimitiveDemoSurface label={textFor(locale, "文档进度", "Document progress")} meta="scroll" compact={compact}>
      <div ref={container} className="relative h-full overflow-y-auto overscroll-contain rounded-[10px] bg-stone-100 px-4 dark:bg-white/[0.04]">
        <div className="sticky left-0 top-0 z-10 h-1 bg-stone-200 dark:bg-white/[0.1]"><ScrollDrivenAnimationPrimitive start={numberValue(values, "start", 10) / 100} end={numberValue(values, "end", 80) / 100} distance={compact ? 90 : 180} axis="x" containerRef={container} className="h-full w-1/2 rounded-full bg-[#4568FF]"><span /></ScrollDrivenAnimationPrimitive></div>
        <div className="space-y-3 py-10">
          {sections.map((title, index) => <ScrollDrivenAnimationPrimitive key={title} start={numberValue(values, "start", 10) / 100} end={numberValue(values, "end", 80) / 100} distance={numberValue(values, "distance", 80)} axis={stringValue(values, "axis", "y") as "x" | "y"} containerRef={container}><ProductPanel className="p-3"><span className="text-[9px] text-stone-400">0{index + 1}</span><strong className="ml-3 text-[11px]">{title}</strong></ProductPanel></ScrollDrivenAnimationPrimitive>)}
        </div>
      </div>
    </PrimitiveDemoSurface>
  );
}
