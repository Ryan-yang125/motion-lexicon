"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { PricingCalculator } from "@/registry/components/pricing-calculator";

export function PricingCalculatorDemo({ locale = "en" }: DemoLocaleProps = {}) { return <PricingCalculator label={demoValue(locale, "团队计划", "Team plan")} tiers={[{ id: "starter", label: demoValue(locale, "起步", "Starter"), unitPrice: 12 }, { id: "studio", label: demoValue(locale, "工作室", "Studio"), unitPrice: 24 }, { id: "scale", label: demoValue(locale, "规模", "Scale"), unitPrice: 42 }]} />; }
