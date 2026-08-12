"use client";

import type { DemoLocaleProps } from "../demo-locale";
import { SupportInboxBlock } from "@/registry/blocks/support-inbox";

export function SupportInboxDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <SupportInboxBlock locale={locale} />;
}
