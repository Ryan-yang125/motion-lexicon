"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { SegmentedControl } from "@/registry/components/segmented-control";

export function SegmentedControlDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [range, setRange] = useState("day");

  return (
    <div role="group" aria-label={demoText("segmented-control", locale)} className="flex w-full justify-center rounded-[16px] bg-[#edf3f2] p-6">
      <SegmentedControl
        label={demoValue(locale, "报告周期", "Report range")}
        options={[
          { value: "day", label: demoValue(locale, "日", "Day") },
          { value: "week", label: demoValue(locale, "周", "Week") },
          { value: "month", label: demoValue(locale, "月", "Month") },
          { value: "quarter", label: demoValue(locale, "季度", "Quarter") },
        ]}
        value={range}
        onValueChange={setRange}
      />
    </div>
  );
}
