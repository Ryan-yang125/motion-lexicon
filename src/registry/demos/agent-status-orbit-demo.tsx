"use client";

import { useEffect, useState } from "react";
import { AgentStatusOrbit, type AgentStatus } from "@/registry/components/agent-status-orbit";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

const states: AgentStatus[] = ["thinking", "working", "waiting", "complete"];
export function AgentStatusOrbitDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [index, setIndex] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setIndex((value) => (value + 1) % states.length), 1900); return () => window.clearInterval(timer); }, []);
  const state = states[index];
  const details = locale === "zh" ? { thinking: "正在规划", working: "正在编辑 4 个文件", waiting: "等待审批", complete: "交付完成", idle: "空闲" } : { thinking: "Planning", working: "Editing 4 files", waiting: "Waiting for approval", complete: "Delivery complete", idle: "Idle" };
  return <div role="group" aria-label={demoText("agent-status-orbit", locale)} className="grid place-items-center"><AgentStatusOrbit status={state} label={demoValue(locale, "界面 Agent", "Interface agent")} detail={details[state]} elapsed={`${index * 2 + 1}.8s`} /></div>;
}
