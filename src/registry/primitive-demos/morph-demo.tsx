import { useState } from "react";
import { MorphPrimitive, type MorphMode } from "@/registry/primitives/morph";
import { PrimitiveDemoSurface, ProductPanel, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

const projects = ["Atlas", "North", "Studio"];

export function MorphDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [board, setBoard] = useState(false);
  const mode = stringValue(values, "mode", "morph") as MorphMode;
  return (
    <PrimitiveDemoSurface label={textFor(locale, "项目视图", "Project view")} meta={mode} compact={compact}>
      <ProductPanel className="flex h-full flex-col p-2.5">
        <div className="mb-2 flex items-center justify-between"><strong className="text-[11px]">{textFor(locale, "进行中", "In progress")}</strong><div className="flex rounded-[7px] bg-stone-100 p-0.5 text-[9px] dark:bg-white/[0.06]"><button className={`rounded-[5px] px-2 py-1 ${!board ? "bg-white shadow-sm dark:bg-[#292925]" : ""}`} onClick={() => setBoard(false)}>List</button><button className={`rounded-[5px] px-2 py-1 ${board ? "bg-white shadow-sm dark:bg-[#292925]" : ""}`} onClick={() => setBoard(true)}>Board</button></div></div>
        <div className={board ? "grid flex-1 grid-cols-3 gap-1.5" : "grid flex-1 content-start gap-1.5"}>
          {projects.map((project, index) => <MorphPrimitive key={project} mode={mode} layoutId={`morph-${project}`} duration={numberValue(values, "duration", 260) / 1000} className={`rounded-[8px] border border-stone-200 bg-stone-50 dark:border-white/[0.08] dark:bg-white/[0.04] ${board ? "min-h-20 p-2" : "flex min-h-9 items-center gap-2 px-2.5"}`}><span className={`block rounded-[5px] ${index === 0 ? "bg-[#4568FF]" : index === 1 ? "bg-[#93664F]" : "bg-[#55745D]"} ${board ? "mb-3 size-6" : "size-4"}`} /><strong className="text-[9.5px]">{project}</strong></MorphPrimitive>)}
        </div>
      </ProductPanel>
    </PrimitiveDemoSurface>
  );
}
