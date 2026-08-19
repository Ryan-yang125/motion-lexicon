"use client";

import { useState } from "react";
import { HoldAction } from "@/registry/components/hold-action";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function HoldActionDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [archived, setArchived] = useState(false);
  return <div role="group" aria-label={demoText("hold-action", locale)} className="flex justify-center">
    <HoldAction onComplete={() => setArchived((value) => !value)} completeLabel={demoValue(locale, "操作已完成", "Action complete")} hint={demoValue(locale, "按住 1.2 秒确认；松开或移出会取消操作。", "Hold for 1.2 seconds. Releasing or moving away cancels the action.")}>
      {archived ? demoValue(locale, "按住恢复", "Hold to restore") : demoValue(locale, "按住归档", "Hold to archive")}
    </HoldAction>
  </div>;
}
