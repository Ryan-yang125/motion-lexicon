"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { SliderDetents } from "@/registry/components/slider-detents";

const speed = (v: number) => `${v.toFixed(2)}×`;

export function SliderDetentsDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [value, setValue] = useState(1.35);

  return (
    <div role="group" aria-label={demoText("slider-detents", locale)} className="grid w-full place-items-center">
      <div className="w-full max-w-[340px]">
        <SliderDetents
          label={demoValue(locale, "播放速度", "Playback speed")}
          value={value}
          onValueChange={setValue}
          min={0.25}
          max={2}
          step={0.05}
          detents={[
            { value: 0.5, label: "0.5×" },
            { value: 1, label: demoValue(locale, "正常", "Normal") },
            { value: 1.5, label: "1.5×" },
            { value: 2, label: "2×" },
          ]}
          format={speed}
        />
      </div>
    </div>
  );
}
