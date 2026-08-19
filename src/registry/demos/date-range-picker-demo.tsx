"use client";

import { useState } from "react";
import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { DateRangePicker, type DateRange } from "@/registry/components/date-range-picker";

export function DateRangePickerDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [range, setRange] = useState<DateRange>({ start: "2026-04-08", end: "2026-04-12" });
  return <DateRangePicker month="2026-04" label={demoValue(locale, "选择时段", "Select a range")} value={range} onChange={setRange} />;
}
