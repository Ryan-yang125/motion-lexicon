"use client";

import type { DemoLocaleProps } from "../demo-locale";
import { DeveloperDocsBlock } from "@/registry/blocks/developer-docs";

export function DeveloperDocsDemo({ locale = "en" }: DemoLocaleProps = {}) { return <DeveloperDocsBlock locale={locale} />; }
