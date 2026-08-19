"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import { PixelatedImage } from "@/registry/components/pixelated-image";

export function PixelatedImageDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <div role="group" aria-label={demoText("pixelated-image", locale)} className="mx-auto w-full max-w-[560px]"><PixelatedImage label={demoValue(locale, "港口影像显影", "Harbour image development")} alt={demoValue(locale, "暮色中的橙色浮标与港口", "An orange buoy in a harbour at dusk")} caption={demoValue(locale, "点击在图像与印刷网点之间切换。", "Tap to move between the image and its printing grid.")} art={<div aria-hidden className="relative size-full overflow-hidden bg-[#164b61]"><span className="absolute -left-[8%] bottom-[-32%] size-[76%] rounded-full border-[18px] border-[#f1c06c]" /><span className="absolute right-[18%] top-[15%] h-[72%] w-[8%] rounded-full bg-[#e36f49]" /><span className="absolute inset-x-0 bottom-[15%] h-[2px] bg-[#d4f2dd]/75" /></div>} /></div>;
}
