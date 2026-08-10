import { useState } from "react";
import { TranslatePrimitive, type TransformMode, type TransformOrigin } from "@/registry/primitives/translate";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, easingValue, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function TranslateDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [active, setActive] = useState(false);
  const mode = stringValue(values, "transform", "translate") as TransformMode;
  return (
    <PrimitiveDemoSurface label={textFor(locale, "画布检查器", "Canvas inspector")} meta={mode} compact={compact}>
      <div className="grid h-full grid-cols-[1fr_86px] gap-3">
        <div className="relative grid place-items-center overflow-hidden rounded-[10px] bg-stone-100 dark:bg-white/[0.045]">
          <TranslatePrimitive
            active={active}
            mode={mode}
            distance={numberValue(values, "distance", 36)}
            angle={numberValue(values, "angle", 12)}
            scale={numberValue(values, "scale", 92) / 100}
            origin={stringValue(values, "origin", "center") as TransformOrigin}
            duration={numberValue(values, "duration", 280) / 1000}
            easing={easingValue(values, "ease", "soft")}
          >
            <ProductPanel className="grid size-20 place-items-center"><span className="size-7 rounded-[8px] bg-[#93664F]" /></ProductPanel>
          </TranslatePrimitive>
        </div>
        <div className="space-y-2">
          <span className="block text-[9px] text-stone-400">X&nbsp;&nbsp;36</span><span className="block text-[9px] text-stone-400">Y&nbsp;&nbsp;0</span><span className="block text-[9px] text-stone-400">R&nbsp;&nbsp;{numberValue(values, "angle", 12)}°</span>
          {!compact ? <ProductButton className="mt-4 w-full px-1" onClick={() => setActive((value) => !value)}>{textFor(locale, "应用", "Apply")}</ProductButton> : null}
        </div>
      </div>
    </PrimitiveDemoSurface>
  );
}
