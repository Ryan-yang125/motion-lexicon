"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useId, useState } from "react";
import { PasswordStrength } from "@/registry/components/password-strength";

export function PasswordStrengthDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const id = useId();
  const [value, setValue] = useState("");

  return (
    <div role="group" aria-label={demoText("password-strength", locale)} className="mx-auto w-full max-w-[320px]">
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-stone-700 dark:text-stone-200"
      >
        {demoValue(locale, "新密码", "New password")}
      </label>

      <input
        id={id}
        type="password"
        value={value}
        autoComplete="new-password"
        spellCheck={false}
        onChange={(e) => setValue(e.target.value)}
        placeholder={demoValue(locale, "输入密码", "Type a password")}
        className="mt-1.5 h-10 w-full rounded-[10px] border-2 border-stone-200 bg-stone-100/70 px-3 text-[13px] text-stone-700 shadow-[inset_0_1px_2px_rgba(28,25,23,0.07)] outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-stone-400 focus:border-[#4568FF] focus:bg-white focus:shadow-none focus-visible:outline-none dark:border-white/[0.08] dark:bg-[#1D1D1A] dark:text-stone-200 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)] dark:placeholder:text-stone-500 dark:focus:border-[#93B0FF] dark:focus:bg-[#252522]"
      />

      <PasswordStrength
        value={value}
        className="mt-3"
        labels={locale === "zh" ? ["空", "弱", "一般", "良好", "强"] : undefined}
        meterLabel={demoValue(locale, "密码强度", "Password strength")}
        guessableLabel={demoValue(locale, "常见易猜密码", "Commonly guessed")}
        metLabel={demoValue(locale, "已满足", "met")}
        notMetLabel={demoValue(locale, "未满足", "not met")}
        formatAnnouncement={locale === "zh" ? ({ label, guessable, unmet }) => `密码强度${label}。${guessable ? "这是常见易猜模式。" : ""}${unmet.length === 0 ? "已满足全部要求。" : `仍需满足：${unmet.map((rule) => rule.label).join("、")}。`}` : undefined}
        rules={locale === "zh" ? [
          { id: "length", label: "至少 12 个字符", test: (candidate) => candidate.length >= 12 },
          { id: "case", label: "含大小写字母", test: (candidate) => /[a-z]/.test(candidate) && /[A-Z]/.test(candidate) },
          { id: "digit", label: "含数字", test: (candidate) => /\d/.test(candidate) },
          { id: "symbol", label: "含符号", test: (candidate) => /[!-/:-@[-`{-~]/.test(candidate) },
        ] : undefined}
      />
    </div>
  );
}
