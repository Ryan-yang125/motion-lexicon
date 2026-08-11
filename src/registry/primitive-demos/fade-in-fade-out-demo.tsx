import { FadeInFadeOutPrimitive } from "@/registry/primitives/fade-in-fade-out";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, StatusPill, easingValue, numberValue, textFor, useEntryReplay, type PrimitiveDemoProps } from "./_shared";

export function FadeInFadeOutDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  const [visible, setVisible] = useEntryReplay(replayKey);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "通知中心", "Notifications")} meta="opacity" compact={compact}>
      <div className="grid h-full place-items-center">
        <div className="w-full max-w-[310px] space-y-3">
          <FadeInFadeOutPrimitive
            present={visible}
            duration={numberValue(values, "duration", 220) / 1000}
            easing={easingValue(values, "ease", "calm")}
            delay={numberValue(values, "delay", 0) / 1000}
            startOpacity={numberValue(values, "opacity", 0) / 100}
          >
            <ProductPanel className="flex items-center gap-3 p-3">
              <span className="size-8 rounded-[9px] bg-[#55745D]" />
              <div className="min-w-0 flex-1"><strong className="block text-[12px]">{textFor(locale, "同步完成", "Sync complete")}</strong><span className="text-[10px] text-stone-400">{textFor(locale, "设计系统 · 12 个文件", "Design system · 12 files")}</span></div>
              <StatusPill tone="success">{textFor(locale, "完成", "Done")}</StatusPill>
            </ProductPanel>
          </FadeInFadeOutPrimitive>
          {!compact ? <ProductButton className="w-full" onClick={() => setVisible((value) => !value)}>{visible ? textFor(locale, "隐藏通知", "Hide notification") : textFor(locale, "显示通知", "Show notification")}</ProductButton> : null}
        </div>
      </div>
    </PrimitiveDemoSurface>
  );
}
