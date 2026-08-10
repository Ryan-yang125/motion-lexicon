import { TypewriterPrimitive } from "@/registry/primitives/typewriter";
import { PrimitiveDemoSurface, booleanValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function TypewriterDemo({ locale, values, compact, replayKey }: PrimitiveDemoProps) {
  const command = "npx shadcn@latest add @motion-lexicon/slide-in";
  return (
    <PrimitiveDemoSurface label={textFor(locale, "终端", "Terminal")} meta="typewriter" compact={compact}>
      <div className="grid h-full place-items-center"><div className="w-full max-w-[350px] overflow-hidden rounded-[12px] bg-[#20201E] text-stone-100 shadow-[0_8px_20px_-16px_rgba(0,0,0,0.75)]"><div className="flex h-8 items-center gap-1.5 border-b border-white/[0.08] px-3"><i className="size-1.5 rounded-full bg-[#93664F]" /><i className="size-1.5 rounded-full bg-[#B59A69]" /><i className="size-1.5 rounded-full bg-[#55745D]" /></div><div className="min-h-20 p-4 font-mono text-[10px] leading-5"><span className="mr-2 text-[#8FA397]">›</span><TypewriterPrimitive key={replayKey} text={command} duration={numberValue(values, "duration", 1200) / 1000} characters={numberValue(values, "characters", 18)} caret={booleanValue(values, "caret", true)} /></div></div></div>
    </PrimitiveDemoSurface>
  );
}
