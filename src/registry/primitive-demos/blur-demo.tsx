import { BlurPrimitive, type BlurRevealMode } from "@/registry/primitives/blur";
import { PrimitiveDemoSurface, ProductButton, StatusPill, easingValue, numberValue, stringValue, textFor, useEntryReplay, type PrimitiveDemoProps } from "./_shared";

export function BlurDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  const [present, setPresent] = useEntryReplay(replayKey);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "资源预览", "Asset preview")} meta="blur" compact={compact}>
      <div className="grid h-full place-items-center"><div className="w-full max-w-[330px] space-y-3"><BlurPrimitive present={present} blur={numberValue(values, "blur", 14)} mode={stringValue(values, "reveal", "blur") as BlurRevealMode} duration={numberValue(values, "duration", 260) / 1000} easing={easingValue(values, "ease", "soft")}><div className="relative h-32 overflow-hidden rounded-[13px] bg-[#373B31] p-4 text-white"><div className="absolute -right-8 -top-10 size-32 rounded-full bg-[#93664F] opacity-80" /><div className="absolute bottom-[-30px] left-10 size-28 rotate-12 rounded-[24px] bg-[#55745D]" /><StatusPill>{textFor(locale, "资源 04", "ASSET 04")}</StatusPill><strong className="absolute bottom-4 left-4 text-[13px]">{textFor(locale, "克制的产品动效", "Quiet product motion")}</strong></div></BlurPrimitive>{!compact ? <ProductButton className="w-full" onClick={() => setPresent((value) => !value)}>{textFor(locale, "切换资源", "Toggle asset")}</ProductButton> : null}</div></div>
    </PrimitiveDemoSurface>
  );
}
