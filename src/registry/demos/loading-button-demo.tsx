"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { LoadingButton } from "@/registry/components/loading-button";

function publish() {
  return new Promise((resolve) => setTimeout(resolve, 1600));
}

export function LoadingButtonDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("loading-button", locale)} className="flex justify-center rounded-[16px] bg-[#183442] p-8">
      <LoadingButton
        onAction={publish}
        pendingLabel={demoValue(locale, "发布中", "Publishing")}
        successLabel={demoValue(locale, "已发布", "Published")}
        errorLabel={demoValue(locale, "重试", "Try again")}
      >
        {demoValue(locale, "发布", "Publish")}
      </LoadingButton>
    </div>
  );
}
