import { useState } from "react";
import { AccordionCollapsePrimitive } from "@/registry/primitives/accordion-collapse";
import { PrimitiveDemoSurface, ProductPanel, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function AccordionCollapseDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [open, setOpen] = useState(true);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "项目设置", "Project settings")} meta="disclosure" compact={compact}>
      <div className="grid h-full place-items-center">
        <ProductPanel className="w-full max-w-[330px] overflow-hidden">
          <button className="flex min-h-11 w-full items-center justify-between px-3 text-left text-[11px] font-medium" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span>{textFor(locale, "成员权限", "Member access")}</span><span className={`text-stone-400 transition-transform duration-150 ${open ? "rotate-45" : ""}`}>＋</span></button>
          <AccordionCollapsePrimitive open={open} maxHeight={numberValue(values, "height", 140)} duration={numberValue(values, "duration", 220) / 1000} easing={easingValue(values, "ease", "soft")}>
            <div className="border-t border-stone-100 p-3 dark:border-white/[0.08]">{[textFor(locale, "管理员", "Admin"), textFor(locale, "编辑者", "Editor"), textFor(locale, "查看者", "Viewer")].map((role, index) => <label className="flex min-h-8 items-center gap-2 text-[10px] text-stone-500" key={role}><input type="checkbox" defaultChecked={index < 2} className="accent-stone-800" />{role}<span className="ml-auto text-stone-300">{index + 2}</span></label>)}</div>
          </AccordionCollapsePrimitive>
        </ProductPanel>
      </div>
    </PrimitiveDemoSurface>
  );
}
