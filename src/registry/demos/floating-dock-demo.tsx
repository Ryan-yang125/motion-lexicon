"use client";

import { useState } from "react";
import { FloatingDock } from "@/registry/components/floating-dock";

const Glyph = ({ children }: { children: string }) => <span aria-hidden className="text-[12px] font-semibold">{children}</span>;

export function FloatingDockDemo() {
  const [active, setActive] = useState("canvas");
  const items = [
    ["home", "Home", "H"], ["canvas", "Canvas", "C"], ["assets", "Assets", "A"], ["notes", "Notes", "N"], ["settings", "Settings", "S"],
  ] as const;
  return (
    <div className="grid w-full max-w-[430px] place-items-center rounded-[18px] bg-[#DDD7CD] px-4 py-16 dark:bg-[#292825]">
      <FloatingDock
        label="Workspace tools"
        activeId={active}
        items={items.map(([id, label, glyph]) => ({ id, label, icon: <Glyph>{glyph}</Glyph>, onSelect: () => setActive(id) }))}
      />
    </div>
  );
}
