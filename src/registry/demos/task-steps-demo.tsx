"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useEffect, useState } from "react";
import { TaskSteps } from "@/registry/components/task-steps";

export function TaskStepsDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [current, setCurrent] = useState(0);
  const steps = [
    { id: "queue", label: demoValue(locale, "已排队", "Queued"), meta: "0.2s" },
    { id: "build", label: demoValue(locale, "构建中", "Building"), meta: "8.1s" },
    { id: "test", label: demoValue(locale, "运行检查", "Running checks"), meta: "3.4s" },
    { id: "deploy", label: demoValue(locale, "部署中", "Deploying"), meta: "5.0s" },
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
        label={demoValue(locale, "部署进度", "Deploy progress")}
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
