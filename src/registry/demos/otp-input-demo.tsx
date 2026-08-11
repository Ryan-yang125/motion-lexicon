"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useEffect, useRef, useState } from "react";
import {
  OtpInput,
  type OtpInputHandle,
  type OtpStatus,
} from "@/registry/components/otp-input";

const CODE = "204815";

export function OtpInputDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const field = useRef<OtpInputHandle>(null);
  const [status, setStatus] = useState<OtpStatus>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const back = setTimeout(() => {
      field.current?.clear();
      setStatus("idle");
    }, 1600);
    return () => clearTimeout(back);
  }, [status]);

  return (
    <div role="group" aria-label={demoText("otp-input", locale)} className="flex justify-center">
      <OtpInput
        ref={field}
        status={status}
        onComplete={(value) => setStatus(value === CODE ? "success" : "error")}
        label={demoValue(locale, "验证码", "Verification code")}
        hint={demoValue(locale, `输入 ${CODE}，也可试试其他数字。`, `Try ${CODE}, or anything else.`)}
        successMessage={demoValue(locale, "验证码正确。", "Code accepted.")}
        errorMessage={demoValue(locale, "验证码错误。", "That code is not right.")}
        formatCellLabel={locale === "zh" ? (label, index, length) => `${label}，第 ${index} 位，共 ${length} 位` : undefined}
      />
    </div>
  );
}
