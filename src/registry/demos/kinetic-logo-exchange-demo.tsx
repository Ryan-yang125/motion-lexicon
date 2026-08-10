"use client";

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

export function KineticLogoExchangeDemo() {
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <KineticLogoExchange items={logos} label="Connected workspace" />
    </div>
  );
}
