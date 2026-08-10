"use client";

import { useState } from "react";
import { RadialActions } from "@/registry/components/radial-actions";

const Icon = ({ children }: { children: string }) => <span aria-hidden className="text-[14px] font-medium">{children}</span>;

export function RadialActionsDemo() {
  const [last, setLast] = useState("Choose a tool");
  return (
    <div className="relative grid w-full max-w-[420px] place-items-center overflow-hidden rounded-[18px] bg-[#E7E2D9] dark:bg-[#262522]">
      <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[.08em] text-stone-500">Canvas tools</span>
      <span role="status" className="absolute bottom-4 left-4 text-[11px] text-stone-500">{last}</span>
      <RadialActions
        label="Open canvas tools"
        trigger={<span aria-hidden className="text-xl leading-none">+</span>}
        actions={[
          { id: "note", label: "Add note", icon: <Icon>N</Icon>, onSelect: () => setLast("Note added") },
          { id: "image", label: "Add image", icon: <Icon>I</Icon>, onSelect: () => setLast("Image added") },
          { id: "link", label: "Add link", icon: <Icon>L</Icon>, onSelect: () => setLast("Link added") },
          { id: "frame", label: "Add frame", icon: <Icon>F</Icon>, onSelect: () => setLast("Frame added") },
        ]}
      />
    </div>
  );
}
