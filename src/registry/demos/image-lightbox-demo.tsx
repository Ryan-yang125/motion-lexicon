"use client";

import {
  ImageLightbox,
  type ImageLightboxItem,
} from "@/registry/components/image-lightbox";

const works: readonly ImageLightboxItem[] = [
  {
    id: "interval",
    title: "Interval I",
    caption: "Blue plane, soft edge and a single measured interruption.",
    meta: "A–01",
    art: (
      <div className="relative size-full overflow-hidden bg-[#D9E2EE]">
        <div className="absolute inset-y-[8%] left-[11%] w-[32%] rounded-t-full bg-[#4568FF]" />
        <div className="absolute bottom-[12%] right-[8%] h-[54%] w-[42%] rounded-[2px] border border-white/55 bg-white/38 backdrop-blur-[3px]" />
        <span className="absolute right-[10%] top-[9%] font-mono text-[8px] tracking-[0.16em] text-[#292929]/45">01—04</span>
      </div>
    ),
  },
  {
    id: "field",
    title: "Clay Field",
    caption: "Mineral color held between a circle and a quiet horizon.",
    meta: "A–02",
    art: (
      <div className="relative size-full overflow-hidden bg-[#E6DED1]">
        <div className="absolute -left-[12%] top-[18%] aspect-square w-[66%] rounded-full bg-[#AF654C]" />
        <div className="absolute inset-x-0 bottom-[18%] h-px bg-[#292929]/22" />
        <div className="absolute bottom-[12%] right-[9%] h-[58%] w-[22%] rounded-full bg-[#687362] mix-blend-multiply" />
      </div>
    ),
  },
  {
    id: "nocturne",
    title: "Nocturne 18",
    caption: "A small study of frequency, distance and electric color.",
    meta: "A–03",
    art: (
      <div className="relative size-full overflow-hidden bg-[#171817]">
        <div className="absolute left-[10%] top-[17%] size-[36%] rounded-full border border-[#728BFF]/50 bg-[#4568FF]/18 shadow-[0_0_42px_rgba(69,104,255,0.28)]" />
        <div className="absolute inset-y-[14%] right-[16%] w-px bg-white/18" />
        <div className="absolute bottom-[19%] right-[9%] h-px w-[48%] bg-[#728BFF]/70" />
      </div>
    ),
  },
  {
    id: "fold",
    title: "Fold Study",
    caption: "Paper volume modeled with shadow, restraint and one warm mark.",
    meta: "B–01",
    art: (
      <div className="relative size-full overflow-hidden bg-[#D7D3CA]">
        <div className="absolute inset-[12%_18%] -rotate-3 bg-[#F4F0E8] shadow-[0_24px_42px_-24px_rgba(41,41,41,0.65)]" />
        <div className="absolute left-[24%] top-[29%] h-px w-[38%] bg-[#292929]/55" />
        <div className="absolute bottom-[18%] right-[17%] size-[23%] rounded-full bg-[#B76549] mix-blend-multiply" />
      </div>
    ),
  },
  {
    id: "trace",
    title: "Green Trace",
    caption: "A botanical silhouette reduced to direction and negative space.",
    meta: "B–02",
    art: (
      <div className="relative size-full overflow-hidden bg-[#DCE1D7]">
        <div className="absolute bottom-[-12%] left-[28%] h-[112%] w-[30%] rotate-[28deg] rounded-full bg-[#697762]" />
        <div className="absolute right-[13%] top-[18%] size-[30%] rounded-full border border-[#292929]/20 bg-white/28 backdrop-blur-[2px]" />
        <div className="absolute bottom-[14%] left-[10%] h-px w-[26%] bg-[#292929]/35" />
      </div>
    ),
  },
  {
    id: "aperture",
    title: "Aperture",
    caption: "An optical form built from overlap, transparency and balance.",
    meta: "B–03",
    art: (
      <div className="relative size-full overflow-hidden bg-[#E5E3DE]">
        <div className="absolute left-[13%] top-[15%] size-[56%] rounded-full bg-[#292929]" />
        <div className="absolute bottom-[11%] right-[12%] size-[52%] rounded-full border border-white/50 bg-[#7890F4]/80 mix-blend-multiply" />
        <div className="absolute left-[34%] top-[35%] size-[18%] rounded-full border border-white/45 bg-white/10" />
      </div>
    ),
  },
];

export function ImageLightboxDemo() {
  return (
    <div className="mx-auto w-full max-w-[520px]">
      <ImageLightbox items={works} label="Material studies" />
    </div>
  );
}
