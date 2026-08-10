import { StaggerPrimitive } from "@/registry/primitives/stagger";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function StaggerDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  const tasks = [
    textFor(locale, "键盘路径", "Keyboard path"),
    textFor(locale, "减弱动效", "Reduced motion"),
    textFor(locale, "触发与恢复", "Trigger and recovery"),
    textFor(locale, "Registry 安装", "Registry install"),
  ].slice(0, numberValue(values, "count", 4));
  return (
    <PrimitiveDemoSurface label={textFor(locale, "发布检查", "Ship checklist")} meta="stagger" compact={compact}>
      <div className="grid h-full place-items-center">
        <ProductPanel className="w-full max-w-[330px] p-2.5">
          <StaggerPrimitive
            key={replayKey}
            items={tasks.map((task, index) => <div className="flex min-h-9 items-center gap-2.5 rounded-[8px] px-2 hover:bg-stone-50 dark:hover:bg-white/[0.04]"><span className="grid size-5 place-items-center rounded-[6px] bg-stone-100 text-[9px] text-stone-500 dark:bg-white/[0.07]">{index + 1}</span><strong className="min-w-0 flex-1 truncate text-[11px] font-medium">{task}</strong><StatusPill tone="success">✓</StatusPill></div>)}
            interval={numberValue(values, "stagger", 50) / 1000}
            distance={numberValue(values, "distance", 18)}
            duration={numberValue(values, "duration", 220) / 1000}
            easing={easingValue(values, "ease", "soft")}
            className="m-0 grid list-none gap-0.5 p-0"
          />
        </ProductPanel>
      </div>
    </PrimitiveDemoSurface>
  );
}
