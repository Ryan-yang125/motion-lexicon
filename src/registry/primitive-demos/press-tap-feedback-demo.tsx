import { PressTapFeedbackPrimitive } from "@/registry/primitives/press-tap-feedback";
import { PrimitiveDemoSurface, ProductPanel, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function PressTapFeedbackDemo({ locale, values, compact }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "画布工具栏", "Canvas toolbar")} meta="press" compact={compact}>
      <div className="grid h-full place-items-center">
        <ProductPanel className="flex items-center gap-1.5 p-1.5">
          {["↖", "□", "T", "↗"].map((icon, index) => <PressTapFeedbackPrimitive key={icon} scale={numberValue(values, "scale", 96) / 100} duration={numberValue(values, "duration", 120) / 1000} easing={easingValue(values, "ease", "snap")}><button type="button" aria-label={textFor(locale, `工具 ${index + 1}`, `Tool ${index + 1}`)} className={`grid size-9 place-items-center rounded-[8px] text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF]/50 ${index === 0 ? "bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900" : "text-stone-500 hover:bg-stone-50 dark:hover:bg-white/[0.06]"}`}>{icon}</button></PressTapFeedbackPrimitive>)}
        </ProductPanel>
      </div>
    </PrimitiveDemoSurface>
  );
}
