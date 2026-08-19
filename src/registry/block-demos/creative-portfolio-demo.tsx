"use client";

import type { DemoLocaleProps } from "../demo-locale";
import { CreativePortfolioBlock } from "@/registry/blocks/creative-portfolio";

export function CreativePortfolioDemo({ locale = "en" }: DemoLocaleProps = {}) { return <CreativePortfolioBlock locale={locale} />; }
