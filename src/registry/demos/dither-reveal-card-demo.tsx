"use client";

import { DitherRevealCard } from "@/registry/components/dither-reveal-card";

export function DitherRevealCardDemo() {
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <DitherRevealCard
        label="Reveal the launch brief"
        front={
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500">Studio note · 04</span>
            <span>
              <strong className="block max-w-[13ch] text-[22px] font-medium leading-[1.05] tracking-[-0.035em] text-[#292929]">A launch that feels considered.</strong>
              <span className="mt-2 block text-[12px] text-stone-600">Reveal the final direction</span>
            </span>
          </>
        }
        back={
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#4F6651]">Approved direction</span>
            <span>
              <strong className="block max-w-[15ch] text-[22px] font-medium leading-[1.05] tracking-[-0.035em] text-[#292929]">Quiet surfaces. Precise motion.</strong>
              <span className="mt-2 block text-[12px] text-[#4F6651]">Click to keep this side open</span>
            </span>
          </>
        }
      />
    </div>
  );
}
