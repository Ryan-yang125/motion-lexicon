"use client";

import { CursorLens } from "@/registry/components/cursor-lens";

function Scene({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className={`relative size-full overflow-hidden ${detailed ? "bg-[#C8C0B3]" : "bg-[#DDD7CD]"}`}>
      <div className="absolute -left-10 bottom-[-46px] size-44 rounded-full bg-[#55745D]" />
      <div className={`absolute right-[-28px] top-[-34px] size-40 rotate-12 rounded-[36px] ${detailed ? "bg-[#4568FF]" : "bg-[#7C86A6]"}`} />
      <div className="absolute left-[28%] top-[22%] h-[56%] w-[47%] rounded-[18px] border border-white/60 bg-white/75 p-4 shadow-[0_18px_38px_-28px_rgba(28,25,23,.65)]">
        <span className="text-[9px] uppercase tracking-[.12em] text-stone-400">Object 07</span>
        <strong className="mt-8 block text-[15px] text-stone-800">Quiet geometry</strong>
        <p className="mt-1 text-[10px] text-stone-500">{detailed ? "Restored surface · 4× detail" : "Move to inspect"}</p>
      </div>
    </div>
  );
}

export function CursorLensDemo() {
  return (
    <div className="w-full max-w-[430px]">
      <CursorLens label="Inspect restored image detail" base={<Scene />} detail={<Scene detailed />} />
    </div>
  );
}
