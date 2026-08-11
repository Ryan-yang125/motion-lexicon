import { OriginAwareAnimationPrimitive, type MotionOrigin } from "@/registry/primitives/origin-aware-animation";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, easingValue, numberValue, stringValue, textFor, useEntryReplay, type PrimitiveDemoProps } from "./_shared";

export function OriginAwareAnimationDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  const [open, setOpen] = useEntryReplay(replayKey);
  const layers = locale === "zh" ? ["画框", "文本", "图像"] : ["Frame", "Text", "Image"];
  return (
    <PrimitiveDemoSurface label={textFor(locale, "图层工具", "Layer tools")} meta="origin" compact={compact}>
      <div className="relative h-full">
        <div className="absolute bottom-2 left-2">
          <ProductButton tone="dark" onClick={() => setOpen((value) => !value)}>＋</ProductButton>
          <OriginAwareAnimationPrimitive open={open} origin={stringValue(values, "origin", "top-left") as MotionOrigin} startScale={numberValue(values, "scale", 88) / 100} duration={numberValue(values, "duration", 220) / 1000} easing={easingValue(values, "ease", "soft")} className="absolute bottom-11 left-0 w-[190px]">
            <ProductPanel className="p-2"><strong className="block px-2 py-1.5 text-[10px]">{textFor(locale, "添加图层", "Add layer")}</strong>{layers.map((item) => <button className="block min-h-7 w-full rounded-[7px] px-2 text-left text-[10px] text-stone-500 hover:bg-stone-50 dark:hover:bg-white/[0.05]" key={item}>{item}</button>)}</ProductPanel>
          </OriginAwareAnimationPrimitive>
        </div>
        <div className="absolute right-3 top-3 h-20 w-28 rounded-[10px] border border-dashed border-stone-300 dark:border-stone-700" />
      </div>
    </PrimitiveDemoSurface>
  );
}
