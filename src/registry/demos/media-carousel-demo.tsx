"use client";

import {
  MediaCarousel,
  type MediaCarouselItem,
} from "@/registry/components/media-carousel";

const stories: readonly MediaCarouselItem[] = [
  {
    id: "atrium",
    eyebrow: "Architecture",
    title: "Quiet Geometry",
    description: "A study in light, rhythm and the spaces between objects.",
    meta: "04:12",
    art: (
      <div
        role="img"
        aria-label="Abstract blue architectural forms"
        className="relative size-full overflow-hidden bg-[#D9E2EE]"
      >
        <div className="absolute inset-y-[12%] left-[9%] w-[36%] rounded-t-full bg-[#4568FF] shadow-[0_18px_40px_-20px_rgba(43,63,142,0.85)]" />
        <div className="absolute inset-y-[24%] right-[8%] w-[42%] rounded-[45%_8px_8px_45%] border border-white/60 bg-[#ECF0F5]/75 backdrop-blur-sm" />
        <div className="absolute bottom-[12%] left-[30%] h-[38%] w-px bg-[#292929]/24" />
        <span className="absolute bottom-[10%] right-[10%] font-mono text-[9px] uppercase tracking-[0.18em] text-[#292929]/55">
          Vol. 01
        </span>
      </div>
    ),
  },
  {
    id: "earth",
    eyebrow: "Materials",
    title: "Earth Register",
    description: "Clay, mineral and paper arranged as a tactile field note.",
    meta: "06:38",
    art: (
      <div
        role="img"
        aria-label="Clay and moss material composition"
        className="relative size-full overflow-hidden bg-[#E8E0D4]"
      >
        <div className="absolute -left-[8%] top-[12%] aspect-square w-[58%] rounded-full bg-[#A75F45] shadow-[0_20px_48px_-22px_rgba(105,48,31,0.7)]" />
        <div className="absolute bottom-[8%] right-[7%] h-[68%] w-[38%] rounded-[999px_999px_12px_12px] bg-[#657260]" />
        <div className="absolute left-[39%] top-[18%] h-[58%] w-[18%] rotate-[8deg] rounded-full border border-[#292929]/20 bg-[#F5F0E8]/80 backdrop-blur-[2px]" />
        <span className="absolute bottom-[10%] left-[10%] font-mono text-[9px] uppercase tracking-[0.18em] text-white/75">
          Field 07
        </span>
      </div>
    ),
  },
  {
    id: "signal",
    eyebrow: "Sound",
    title: "A Signal in Blue",
    description: "Synthetic tones translated into a restrained visual score.",
    meta: "03:49",
    art: (
      <div
        role="img"
        aria-label="Dark sound-wave composition"
        className="relative size-full overflow-hidden bg-[#171817]"
      >
        <div className="absolute inset-x-[8%] top-1/2 h-px bg-white/18" />
        <div className="absolute inset-x-[14%] top-[36%] flex h-[30%] items-center justify-between gap-1">
          {[18, 44, 70, 36, 86, 58, 28, 68, 42, 20, 54, 34].map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="w-px rounded-full bg-[#7792FF]"
              style={{ height: `${height}%`, opacity: 0.45 + index / 30 }}
            />
          ))}
        </div>
        <div className="absolute right-[9%] top-[12%] size-12 rounded-full border border-white/15 bg-white/[0.04]" />
        <span className="absolute bottom-[10%] left-[9%] font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
          Frequency 21
        </span>
      </div>
    ),
  },
  {
    id: "paper",
    eyebrow: "Edition",
    title: "Notes on Stillness",
    description: "Small observations from an unhurried afternoon.",
    meta: "08:05",
    art: (
      <div
        role="img"
        aria-label="Editorial paper composition"
        className="relative size-full overflow-hidden bg-[#D8D3C8]"
      >
        <div className="absolute inset-[11%_20%_10%_12%] rotate-[-4deg] rounded-[3px] border border-black/10 bg-[#F4F0E8] shadow-[0_22px_34px_-24px_rgba(41,41,41,0.55)]" />
        <div className="absolute left-[22%] top-[25%] h-px w-[34%] bg-[#292929]/65" />
        <div className="absolute left-[22%] top-[34%] h-px w-[48%] bg-[#292929]/18" />
        <div className="absolute left-[22%] top-[40%] h-px w-[43%] bg-[#292929]/18" />
        <div className="absolute bottom-[20%] right-[16%] size-[22%] rounded-full bg-[#B76549] mix-blend-multiply" />
        <span className="absolute bottom-[10%] left-[9%] font-mono text-[9px] uppercase tracking-[0.18em] text-[#292929]/48">
          Essay 12
        </span>
      </div>
    ),
  },
];

export function MediaCarouselDemo() {
  return (
    <div className="mx-auto w-full max-w-[520px]">
      <MediaCarousel items={stories} label="Selected stories" />
    </div>
  );
}
