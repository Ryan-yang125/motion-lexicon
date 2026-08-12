"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { InlineValidation } from "@/registry/components/inline-validation";

export function InlineValidationDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [url, setUrl] = useState("");
  const checkUrl = (value: string) => {
    if (value.trim() === "") return demoValue(locale, "请输入知识库地址。", "A knowledge base URL is required.");
    if (!/^https:\/\/[a-z0-9.-]+(?:\/.*)?$/iu.test(value)) return demoValue(locale, "请输入完整的 HTTPS 地址。", "Enter a complete HTTPS URL.");
    return null;
  };

  return (
    <div role="group" aria-label={demoText("inline-validation", locale)} className="flex justify-center">
      <div className="w-full max-w-[300px]">
        <InlineValidation
          label={demoValue(locale, "Agent 知识库", "Agent knowledge base")}
          type="url"
          placeholder="https://docs.example.com"
          value={url}
          onChange={setUrl}
          validate={checkUrl}
          hint={demoValue(locale, "Agent 将读取此地址中的公开内容。", "The agent will read public content from this URL.")}
        />
      </div>
    </div>
  );
}
