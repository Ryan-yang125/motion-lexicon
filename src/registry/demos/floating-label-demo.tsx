"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { FloatingLabelInput } from "@/registry/components/floating-label";

export function FloatingLabelDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("floating-label", locale)} className="flex justify-center">
      <div className="w-full max-w-[320px]">
        <FloatingLabelInput
          label={demoValue(locale, "账户编号", "Account reference")}
          hint={demoValue(locale, "见账单页眉。", "Printed on the statement header.")}
          maxLength={16}
        />
      </div>
    </div>
  );
}
