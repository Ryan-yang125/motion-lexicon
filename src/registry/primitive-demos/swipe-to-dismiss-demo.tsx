import { useState } from "react";
import { SwipeToDismissPrimitive } from "@/registry/primitives/swipe-to-dismiss";
import { Avatar, PrimitiveDemoSurface, ProductButton, ProductPanel, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function SwipeToDismissDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [version, setVersion] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "收件箱", "Inbox")} meta="swipe" compact={compact}>
      <div className="grid h-full place-items-center"><div className="w-full max-w-[330px] space-y-3">{!dismissed ? <SwipeToDismissPrimitive key={version} threshold={numberValue(values, "distance", 96)} resistance={numberValue(values, "resistance", 65) / 100} onDismiss={() => setDismissed(true)}><ProductPanel className="flex cursor-grab items-center gap-3 p-3 active:cursor-grabbing"><Avatar initials="ML" tone="moss" /><div className="min-w-0 flex-1"><strong className="block text-[11px]">{textFor(locale, "动效评审已完成", "Motion review complete")}</strong><span className="text-[9.5px] text-stone-400">{textFor(locale, "轻扫即可归档", "Swipe to archive")}</span></div><span className="text-stone-300">→</span></ProductPanel></SwipeToDismissPrimitive> : <div className="py-4 text-center text-[10px] text-stone-400">{textFor(locale, "通知已归档", "Notification archived")}</div>}{!compact ? <ProductButton className="w-full" onClick={() => { setVersion((value) => value + 1); setDismissed(false); }}>{textFor(locale, "恢复通知", "Restore notification")}</ProductButton> : null}</div></div>
    </PrimitiveDemoSurface>
  );
}
