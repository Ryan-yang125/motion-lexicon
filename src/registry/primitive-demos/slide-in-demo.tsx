import { SlideInPrimitive, type SlideDirection } from "@/registry/primitives/slide-in";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, Avatar, easingValue, numberValue, stringValue, textFor, useEntryReplay, type PrimitiveDemoProps } from "./_shared";

export function SlideInDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  const [open, setOpen] = useEntryReplay(replayKey);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "团队动态", "Team activity")} meta="slide-in" compact={compact}>
      <div className="grid h-full place-items-center">
        <div className="w-full max-w-[320px] space-y-3 overflow-hidden">
          <SlideInPrimitive
            present={open}
            direction={stringValue(values, "direction", "up") as SlideDirection}
            distance={numberValue(values, "distance", 28)}
            duration={numberValue(values, "duration", 240) / 1000}
            easing={easingValue(values, "ease", "soft")}
            delay={numberValue(values, "delay", 0) / 1000}
          >
            <ProductPanel className="flex items-center gap-3 p-3">
              <Avatar initials="MS" tone="clay" />
              <div className="min-w-0 flex-1"><strong className="block truncate text-[12px]">Mira {textFor(locale, "更新了首页动效", "updated the landing motion")}</strong><span className="text-[10px] text-stone-400">{textFor(locale, "2 分钟前 · 动效评审", "2 min ago · Motion review")}</span></div>
            </ProductPanel>
          </SlideInPrimitive>
          {!compact ? <ProductButton className="w-full" onClick={() => setOpen((value) => !value)}>{open ? textFor(locale, "移出动态", "Remove activity") : textFor(locale, "加入动态", "Add activity")}</ProductButton> : null}
        </div>
      </div>
    </PrimitiveDemoSurface>
  );
}
