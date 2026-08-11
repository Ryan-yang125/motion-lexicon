"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { LongPressButton } from "@/registry/components/long-press";

export function LongPressDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [archived, setArchived] = useState(false);

  return (
    <div role="group" aria-label={demoText("long-press", locale)} className="flex justify-center">
      <LongPressButton onLongPress={() => setArchived((v) => !v)} hint={locale === "zh" ? "按住 0.6 秒确认" : undefined}>
        <span className="grid text-left">
          <span
            className={`col-start-1 row-start-1 ${archived ? "invisible" : ""}`}
          >
            {demoValue(locale, "按住归档", "Hold to archive")}
          </span>
          <span
            className={`col-start-1 row-start-1 ${archived ? "" : "invisible"}`}
          >
            {demoValue(locale, "按住恢复", "Hold to restore")}
          </span>
        </span>
      </LongPressButton>
    </div>
  );
}
