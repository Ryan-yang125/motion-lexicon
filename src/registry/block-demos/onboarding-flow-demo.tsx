"use client";
import type { DemoLocaleProps } from "../demo-locale";
import { OnboardingFlowBlock } from "@/registry/blocks/onboarding-flow";
export function OnboardingFlowDemo({ locale = "en" }: DemoLocaleProps = {}) { return <OnboardingFlowBlock locale={locale} />; }
