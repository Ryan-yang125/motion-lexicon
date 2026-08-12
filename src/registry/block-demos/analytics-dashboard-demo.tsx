"use client";

import type { DemoLocaleProps } from "../demo-locale";
import { AnalyticsDashboardBlock } from "@/registry/blocks/analytics-dashboard";

export function AnalyticsDashboardDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <AnalyticsDashboardBlock locale={locale} />;
}
