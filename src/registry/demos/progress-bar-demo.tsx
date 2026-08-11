"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/registry/components/progress-bar";

export function ProgressBarDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (value === null) {
      const id = setTimeout(() => setValue(8), 1300);
      return () => clearTimeout(id);
    }
    if (value < 100) {
      const id = setTimeout(() => setValue(Math.min(100, value + 14)), 520);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setValue(null), 1800);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <div role="group" aria-label={demoText("progress-bar", locale)} className="mx-auto w-full max-w-[360px]">
      <ProgressBar
        value={value}
        label="roadmap.pdf"
        pendingLabel={demoValue(locale, "计算大小", "Sizing")}
        completeLabel={demoValue(locale, "上传完成", "Upload complete")}
      />
    </div>
  );
}
