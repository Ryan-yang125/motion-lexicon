import { useState } from "react";
import { HoldToConfirmPrimitive } from "@/registry/primitives/hold-to-confirm";
import { PrimitiveDemoSurface, ProductPanel, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function HoldToConfirmPrimitiveDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [deleted, setDeleted] = useState(false);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "危险区域", "Danger zone")} meta="hold" compact={compact}>
      <div className="grid h-full place-items-center">
        <ProductPanel className="w-full max-w-[330px] p-4"><div className="flex items-start gap-3"><span className="grid size-8 place-items-center rounded-[9px] bg-[#8A4A3A]/10 text-[#8A4A3A]">×</span><div className="min-w-0 flex-1"><strong className="block text-[12px]">{textFor(locale, "删除工作区", "Delete workspace")}</strong><p className="mt-1 text-[10px] leading-4 text-stone-400">{textFor(locale, "这个操作会移除所有项目和成员。", "This removes every project and member.")}</p></div></div><HoldToConfirmPrimitive onConfirm={() => setDeleted(true)} duration={numberValue(values, "duration", 1200) / 1000} holdScale={numberValue(values, "scale", 98) / 100} confirmed={textFor(locale, "已确认删除", "Deletion confirmed")} className="mt-4 min-h-10 w-full rounded-[9px] border border-[#8A4A3A]/35 bg-[#8A4A3A]/8 px-3 text-[11px] font-medium text-[#8A4A3A] outline-none focus-visible:ring-2 focus-visible:ring-[#8A4A3A]/35">{deleted ? textFor(locale, "已删除", "Deleted") : textFor(locale, "按住删除工作区", "Hold to delete workspace")}</HoldToConfirmPrimitive></ProductPanel>
      </div>
    </PrimitiveDemoSurface>
  );
}
