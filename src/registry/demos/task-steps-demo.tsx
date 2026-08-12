"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useEffect, useState } from "react";
import { TaskSteps } from "@/registry/components/task-steps";

export function TaskStepsDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [current, setCurrent] = useState(0);
  const steps = [
    { id: "context", label: demoValue(locale, "读取上下文", "Read context"), meta: "0.8s" },
    { id: "build", label: demoValue(locale, "实现界面", "Build interface"), meta: "8.1s" },
    { id: "review", label: demoValue(locale, "浏览器验收", "Browser review"), meta: "3.4s" },
    { id: "deliver", label: demoValue(locale, "生成交付地址", "Create delivery URL"), meta: "5.0s" },
  ];

  useEffect(() => {
    const wait = current >= steps.length ? 2400 : 1500;
    const t = setTimeout(
      () => setCurrent((c) => (c >= steps.length ? 0 : c + 1)),
      wait,
    );
    return () => clearTimeout(t);
  }, [current, steps.length]);

  return (
    <div role="group" aria-label={demoText("task-steps", locale)} className="mx-auto w-full max-w-[280px]">
      <TaskSteps
        steps={steps}
        current={current}
        label={demoValue(locale, "Agent 执行进度", "Agent run progress")}
        copy={locale === "zh" ? {
          failedAt: (label) => `在${label}失败`,
          complete: (count) => `${count} 个步骤已全部完成`,
          progress: (label, position, total) => `${label}，第 ${position} 步，共 ${total} 步`,
          runComplete: "运行完成",
          runFailed: "运行失败",
        } : undefined}
      />
    </div>
  );
}
