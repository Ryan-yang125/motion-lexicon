import { useState } from "react";
import { AnticipationPrimitive } from "@/registry/primitives/anticipation";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function AnticipationDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [sent, setSent] = useState(0);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "发送反馈", "Send feedback")} meta="anticipation" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="w-full max-w-[330px] p-4"><div className="mb-4 rounded-[9px] bg-stone-50 p-3 text-[10px] leading-5 text-stone-500 dark:bg-white/[0.04] dark:text-stone-400">{textFor(locale, "这一版的动效节奏已经很接近产品状态。", "The rhythm now feels close to a finished product.")}</div><div className="flex items-center justify-between"><span className="text-[9px] text-stone-400">{sent ? textFor(locale, "反馈已发送", "Feedback sent") : textFor(locale, "准备发送", "Ready to send")}</span><AnticipationPrimitive trigger={sent} distance={numberValue(values, "distance", 32)} anticipation={numberValue(values, "anticipation", 18) / 100} followThrough={numberValue(values, "followThrough", 12) / 100} duration={numberValue(values, "duration", 520) / 1000} easing={easingValue(values, "ease", "snap")}><ProductButton tone="dark" onClick={() => setSent((value) => value + 1)}>{textFor(locale, "发送", "Send")} →</ProductButton></AnticipationPrimitive></div></ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
