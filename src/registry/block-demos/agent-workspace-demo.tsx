"use client";

import type { DemoLocaleProps } from "../demo-locale";
import { AgentWorkspaceBlock } from "@/registry/blocks/agent-workspace";

export function AgentWorkspaceDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <AgentWorkspaceBlock locale={locale} />;
}
