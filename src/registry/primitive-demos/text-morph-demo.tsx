import { useState } from "react";
import { TextMorphPrimitive } from "@/registry/primitives/text-morph";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function TextMorphDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [saved, setSaved] = useState(false);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "编辑器状态", "Editor status")} meta="text" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="flex w-full max-w-[320px] items-center gap-3 p-3"><span className={`size-2 rounded-full ${saved ? "bg-[#55745D]" : "bg-[#93664F]"}`} /><TextMorphPrimitive value={saved ? textFor(locale, "所有更改已保存", "All changes saved") : textFor(locale, "有未保存的更改", "Unsaved changes")} duration={numberValue(values, "duration", 240) / 1000} blur={numberValue(values, "blur", 8)} delay={numberValue(values, "delay", 120) / 1000} easing={easingValue(values, "ease", "soft")} className="min-w-0 flex-1 truncate text-[11px] font-medium" />{!compact ? <ProductButton onClick={() => setSaved((value) => !value)}>{saved ? textFor(locale, "编辑", "Edit") : textFor(locale, "保存", "Save")}</ProductButton> : null}</ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
