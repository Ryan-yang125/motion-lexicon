import { useState } from "react";
import { CrossfadePrimitive } from "@/registry/primitives/crossfade";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, StatusPill, easingValue, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function CrossfadeDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [published, setPublished] = useState(false);
  return (
    <PrimitiveDemoSurface label={textFor(locale, "发布状态", "Publish status")} meta="crossfade" compact={compact}>
      <div className="grid h-full place-items-center">
        <ProductPanel className="w-full max-w-[320px] p-4">
          <CrossfadePrimitive stateKey={published ? "published" : "draft"} duration={numberValue(values, "duration", 200) / 1000} easing={easingValue(values, "ease", "calm")} overlap={numberValue(values, "overlap", 50) / 100}>
            <div className="flex items-center gap-3"><span className={`size-9 rounded-[10px] ${published ? "bg-[#55745D]" : "bg-[#93664F]"}`} /><div className="min-w-0 flex-1"><strong className="block text-[12px]">{published ? textFor(locale, "版本已发布", "Release published") : textFor(locale, "等待发布", "Ready to publish")}</strong><span className="text-[10px] text-stone-400">motion-lexicon@5.0.0</span></div><StatusPill tone={published ? "success" : "warning"}>{published ? textFor(locale, "在线", "Live") : textFor(locale, "草稿", "Draft")}</StatusPill></div>
          </CrossfadePrimitive>
          {!compact ? <ProductButton className="mt-4 w-full" tone={published ? "light" : "dark"} onClick={() => setPublished((value) => !value)}>{published ? textFor(locale, "返回草稿", "Return to draft") : textFor(locale, "发布版本", "Publish release")}</ProductButton> : null}
        </ProductPanel>
      </div>
    </PrimitiveDemoSurface>
  );
}
