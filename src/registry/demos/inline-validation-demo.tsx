"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { InlineValidation } from "@/registry/components/inline-validation";

export function InlineValidationDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [email, setEmail] = useState("");
  const checkEmail = (value: string) => {
    if (value.trim() === "") return demoValue(locale, "请输入工作邮箱。", "A work email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value)) return demoValue(locale, "邮箱地址不完整。", "That is not a complete email address.");
    return null;
  };

  return (
    <div role="group" aria-label={demoText("inline-validation", locale)} className="flex justify-center">
      <div className="w-full max-w-[300px]">
        <InlineValidation
          label={demoValue(locale, "工作邮箱", "Work email")}
          type="email"
          placeholder="you@work.com"
          value={email}
          onChange={setEmail}
          validate={checkEmail}
          hint={demoValue(locale, "仅用于发送邀请。", "Only used to send the invite.")}
        />
      </div>
    </div>
  );
}
