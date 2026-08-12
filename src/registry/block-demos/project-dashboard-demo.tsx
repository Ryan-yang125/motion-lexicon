"use client";

import type { DemoLocaleProps } from "../demo-locale";
import { ProjectDashboardBlock } from "@/registry/blocks/project-dashboard";

export function ProjectDashboardDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <ProjectDashboardBlock locale={locale} />;
}
