"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { KineticLogoExchange, type KineticLogoItem } from "@/registry/components/kinetic-logo-exchange";

const diamond = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
    <path d="m10 3 6 7-6 7-6-7 6-7Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const orbit = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
    <circle cx="10" cy="10" r="2.1" fill="currentColor" />
    <ellipse cx="10" cy="10" rx="7" ry="3.4" stroke="currentColor" strokeWidth="1.3" transform="rotate(-24 10 10)" />
  </svg>
);

const wave = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
    <path d="M3 11c2.2-6 4.4 6 7 0s4.8 6 7-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const logos: readonly KineticLogoItem[] = [
  { id: "north", label: "North", mark: diamond, tone: "blue" },
  { id: "orbit", label: "Orbit", mark: orbit, tone: "ink" },
  { id: "fold", label: "Fold", mark: wave, tone: "moss" },
  { id: "form", label: "Form", mark: diamond, tone: "clay" },
  { id: "relay", label: "Relay", mark: orbit, tone: "blue" },
  { id: "signal", label: "Signal", mark: wave, tone: "ink" },
];

export function KineticLogoExchangeDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("kinetic-logo-exchange", locale)} className="mx-auto w-full max-w-[440px]">
      <KineticLogoExchange items={logos} label={demoValue(locale, "已连接的工作区", "Connected workspace")} eyebrow={demoValue(locale, "连接", "Connections")} pauseLabel={demoValue(locale, "暂停标志轮换", "Pause logo exchange")} resumeLabel={demoValue(locale, "继续标志轮换", "Resume logo exchange")} emptyLabel={demoValue(locale, "暂无已连接工具", "No connected tools")} />
    </div>
  );
}
