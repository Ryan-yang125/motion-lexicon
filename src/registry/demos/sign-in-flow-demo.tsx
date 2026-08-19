"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { SignInFlow } from "@/registry/components/sign-in-flow";

export function SignInFlowDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <SignInFlow title={demoValue(locale, "回到你的工作台", "Return to your workspace")} onSubmit={() => new Promise<void>((resolve) => window.setTimeout(resolve, 460))} />;
}
