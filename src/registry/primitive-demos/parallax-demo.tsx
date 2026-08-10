import { useRef } from "react";
import { ParallaxPrimitive } from "@/registry/primitives/parallax";
import { PrimitiveDemoSurface, StatusPill, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function ParallaxDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const container = useRef<HTMLDivElement>(null);
  const axis = stringValue(values, "axis", "y") as "x" | "y";
  return (
    <PrimitiveDemoSurface label={textFor(locale, "项目封面", "Project cover")} meta="parallax" compact={compact}>
      <div ref={container} className="relative h-full overflow-y-auto overscroll-contain rounded-[10px] bg-[#D8D2C8] dark:bg-[#302E2A]">
        <div className="h-16" />
        <ParallaxPrimitive containerRef={container} axis={axis} distance={numberValue(values, "distance", 48)} speed={numberValue(values, "speed", 35) / 100} className="absolute inset-x-5 top-10 h-28 overflow-hidden rounded-[12px] bg-[#55745D]"><div className="absolute -right-5 -top-5 size-28 rounded-full bg-white/10" /><div className="absolute bottom-4 left-4 text-white"><StatusPill>Interior 04</StatusPill><strong className="mt-2 block text-[14px]">{textFor(locale, "安静的产品动效", "Quiet product motion")}</strong></div></ParallaxPrimitive>
        <div className="h-32" />
        <div className="mx-5 rounded-[10px] bg-white/75 p-3 text-[10px] text-stone-600 backdrop-blur-sm dark:bg-black/20 dark:text-stone-300">{textFor(locale, "滚动查看前后景之间克制的速度差。", "Scroll to inspect the restrained depth between layers.")}</div>
        <div className="h-24" />
      </div>
    </PrimitiveDemoSurface>
  );
}
