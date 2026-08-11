import { useState } from "react";
import { DragToReorderPrimitive } from "@/registry/primitives/drag-to-reorder";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function DragToReorderDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [order, setOrder] = useState(["research", "prototype", "ship"]);
  const rows = {
    research: { label: textFor(locale, "研究动效", "Research motion"), status: textFor(locale, "今天", "Today"), tone: undefined },
    prototype: { label: textFor(locale, "制作状态原型", "Prototype states"), status: textFor(locale, "评审", "Review"), tone: "warning" as const },
    ship: { label: textFor(locale, "发布注册表", "Ship registry"), status: textFor(locale, "就绪", "Ready"), tone: "success" as const },
  };
  const items = order.map((id) => {
    const row = rows[id as keyof typeof rows];
    return { id, content: <><span className="text-stone-300">⋮⋮</span><strong className="flex-1 text-[11px]">{row.label}</strong><StatusPill tone={row.tone}>{row.status}</StatusPill></> };
  });
  return (
    <PrimitiveDemoSurface label={textFor(locale, "本周优先级", "Weekly priority")} meta="drag" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="w-full max-w-[330px] p-2"><DragToReorderPrimitive items={items} onReorder={(next) => setOrder(next.map((item) => item.id))} distance={numberValue(values, "distance", 48)} pickupScale={numberValue(values, "scale", 103) / 100} className="m-0 grid list-none gap-1.5 p-0" itemClassName="flex min-h-11 cursor-grab items-center gap-2 rounded-[9px] border border-stone-100 bg-stone-50 px-2.5 active:cursor-grabbing dark:border-white/[0.07] dark:bg-white/[0.035]" /></ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
