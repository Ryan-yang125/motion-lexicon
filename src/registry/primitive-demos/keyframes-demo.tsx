import { KeyframesPrimitive, type KeyframeFill, type KeyframeMode } from "@/registry/primitives/keyframes";
import { PrimitiveDemoSurface, ProductPanel, easingValue, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function KeyframesDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "交互时间线", "Interaction timeline")} meta="keyframes" compact={compact}>
      <div className="grid h-full place-items-center">
        <ProductPanel className="w-full max-w-[340px] px-4 py-5">
          <div className="mb-5 flex items-center justify-between text-[10px] text-stone-400"><span>0 ms</span><span>{numberValue(values, "duration", 720)} ms</span></div>
          <div className="relative h-12 border-t border-stone-200 dark:border-white/[0.12]">
            {["Trigger", "Move", "Settle"].map((label, index) => <span className="absolute top-[-4px] grid gap-2 text-[9px] text-stone-400" style={{ left: `${index * 50}%`, transform: index === 2 ? "translateX(-100%)" : undefined }} key={label}><i className="size-2 rounded-full bg-stone-300 dark:bg-stone-600" />{label}</span>)}
            <KeyframesPrimitive
              key={replayKey}
              mode={stringValue(values, "mode", "keyframes") as KeyframeMode}
              fill={stringValue(values, "fill", "both") as KeyframeFill}
              steps={numberValue(values, "steps", 4)}
              duration={numberValue(values, "duration", 720) / 1000}
              easing={easingValue(values, "ease", "ease-in-out")}
              distance={compact ? 82 : 118}
              className="absolute left-1/2 top-[-7px] size-3 rounded-full bg-[#4568FF] shadow-[0_0_0_4px_rgba(69,104,255,0.12)]"
            ><span /></KeyframesPrimitive>
          </div>
        </ProductPanel>
      </div>
    </PrimitiveDemoSurface>
  );
}
