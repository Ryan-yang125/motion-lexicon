import { HoverEffectPrimitive } from "@/registry/primitives/hover-effect";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function HoverEffectDemo({ locale, values, compact }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "最近项目", "Recent projects")} meta="hover" compact={compact}>
      <div className="grid h-full place-items-center">
        <HoverEffectPrimitive distance={numberValue(values, "distance", 4)} scale={numberValue(values, "scale", 101) / 100} duration={numberValue(values, "duration", 150) / 1000} easing={easingValue(values, "ease", "snap")} className="w-full max-w-[310px] rounded-[13px] outline-none" >
          <ProductPanel className="overflow-hidden"><div className="h-20 bg-[#D7D1C7] p-3 dark:bg-[#34312D]"><div className="h-full rounded-[9px] border border-white/40 bg-[#93664F] p-3 text-white"><span className="text-[9px] opacity-60">{textFor(locale, "动效 / 04", "MOTION / 04")}</span></div></div><div className="flex items-center justify-between p-3"><div><strong className="block text-[12px]">{textFor(locale, "克制的产品动效", "Quiet product motion")}</strong><span className="text-[10px] text-stone-400">{textFor(locale, "2 分钟前更新", "Updated 2 min ago")}</span></div><StatusPill tone="success">{textFor(locale, "在线", "Live")}</StatusPill></div></ProductPanel>
        </HoverEffectPrimitive>
      </div>
    </PrimitiveDemoSurface>
  );
}
