import { useState } from "react";
import { DragToReorderPrimitive, type ReorderPrimitiveItem } from "@/registry/primitives/drag-to-reorder";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

const initialItems: ReorderPrimitiveItem[] = [
  { id: "research", content: <><span className="text-stone-300">⋮⋮</span><strong className="flex-1 text-[11px]">Research motion</strong><StatusPill>Today</StatusPill></> },
  { id: "prototype", content: <><span className="text-stone-300">⋮⋮</span><strong className="flex-1 text-[11px]">Prototype states</strong><StatusPill tone="warning">Review</StatusPill></> },
  { id: "ship", content: <><span className="text-stone-300">⋮⋮</span><strong className="flex-1 text-[11px]">Ship registry</strong><StatusPill tone="success">Ready</StatusPill></> },
];

export function DragToReorderDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [items, setItems] = useState(initialItems);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "本周优先级", "Weekly priority")} meta="drag" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="w-full max-w-[330px] p-2"><DragToReorderPrimitive items={items} onReorder={setItems} distance={numberValue(values, "distance", 48)} pickupScale={numberValue(values, "scale", 103) / 100} className="m-0 grid list-none gap-1.5 p-0" itemClassName="flex min-h-11 cursor-grab items-center gap-2 rounded-[9px] border border-stone-100 bg-stone-50 px-2.5 active:cursor-grabbing dark:border-white/[0.07] dark:bg-white/[0.035]" /></ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
