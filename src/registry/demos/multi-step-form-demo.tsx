"use client";

import { useState } from "react";
import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { MultiStepForm } from "@/registry/components/multi-step-form";

export function MultiStepFormDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [name, setName] = useState(""); const [role, setRole] = useState("Design");
  return <MultiStepForm label={demoValue(locale, "新工作区", "New workspace")} submitLabel={demoValue(locale, "完成设置", "Finish setup")} onSubmit={() => new Promise<void>((resolve) => window.setTimeout(resolve, 480))} steps={[
    { id: "name", title: demoValue(locale, "给空间命名", "Name the space"), description: demoValue(locale, "名称会显示在团队导航中。", "This name appears in team navigation."), validate: () => name.trim() ? null : demoValue(locale, "请输入名称后继续。", "Enter a name to continue."), content: <input value={name} onChange={(event) => setName(event.target.value)} placeholder={demoValue(locale, "例如：春季刊", "For example: Spring edition")} className="min-h-11 w-full rounded-lg border border-black/[.13] px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF]" /> },
    { id: "role", title: demoValue(locale, "选择工作方式", "Choose a working mode"), description: demoValue(locale, "可以随时在设置中调整。", "You can adjust this later in settings."), content: <div className="flex gap-2">{["Design", "Writing"].map((item) => <button key={item} type="button" aria-pressed={role === item} onClick={() => setRole(item)} className={`min-h-11 rounded-full border px-4 text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] ${role === item ? "border-[#242424] bg-[#242424] text-white" : "border-black/[.12]"}`}>{item}</button>)}</div> },
  ]} />;
}
