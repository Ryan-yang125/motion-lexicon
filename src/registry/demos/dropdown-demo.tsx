"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { Dropdown } from "@/registry/components/dropdown";

export function DropdownDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [visibility, setVisibility] = useState("private");

  return (
    <div role="group" aria-label={demoText("dropdown", locale)} className="grid w-full place-items-center rounded-[16px] bg-[#ecf3f4] pb-[96px] pt-8">
      <Dropdown
        label={demoValue(locale, "可见范围", "Visibility")}
        items={[
          { value: "private", label: demoValue(locale, "仅自己", "Only me"), hint: demoValue(locale, "默认", "default") },
          { value: "team", label: demoValue(locale, "Acme 全员", "Anyone at Acme") },
          { value: "link", label: demoValue(locale, "任何获得链接的人", "Anyone with the link") },
          { value: "public", label: demoValue(locale, "公开到网页", "Public on the web") },
        ]}
        value={visibility}
        onChange={setVisibility}
      />
    </div>
  );
}
