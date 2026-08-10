import { ScaleInPrimitive } from "@/registry/primitives/scale-in";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, booleanValue, easingValue, numberValue, textFor, useEntryReplay, type PrimitiveDemoProps } from "./_shared";

export function ScaleInDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  const [open, setOpen] = useEntryReplay(replayKey);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "快速创建", "Quick create")} meta="scale" compact={compact}>
      <div className="grid h-full place-items-center">
        <div className="w-full max-w-[286px] space-y-3">
          <ScaleInPrimitive
            present={open}
            startScale={numberValue(values, "scale", 92) / 100}
            overshoot={booleanValue(values, "overshoot", false)}
            duration={numberValue(values, "duration", 200) / 1000}
            easing={easingValue(values, "ease", "snap")}
            delay={numberValue(values, "delay", 0) / 1000}
            origin="bottom center"
          >
            <ProductPanel className="p-2">
              <div className="border-b border-stone-100 px-2 py-2 text-[11px] font-medium dark:border-white/[0.08]">{textFor(locale, "创建新内容", "Create new")}</div>
              <div className="grid grid-cols-3 gap-1.5 p-2">
                {["Frame", "Page", "Flow"].map((item) => <button className="rounded-[8px] bg-stone-50 px-1 py-3 text-[10px] text-stone-500 dark:bg-white/[0.05] dark:text-stone-400" key={item}>{item}</button>)}
              </div>
            </ProductPanel>
          </ScaleInPrimitive>
          {!compact ? <ProductButton tone="dark" className="w-full" onClick={() => setOpen((value) => !value)}>{open ? textFor(locale, "关闭面板", "Close panel") : textFor(locale, "打开面板", "Open panel")}</ProductButton> : null}
        </div>
      </div>
    </PrimitiveDemoSurface>
  );
}
