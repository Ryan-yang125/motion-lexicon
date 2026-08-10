"use client";

import { SpotlightBento, type SpotlightBentoItem } from "@/registry/components/spotlight-bento";

const pulse = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
    <path d="M3 10h3l1.4-4 3.2 8 1.5-4H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const nodes = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
    <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="11" cy="15" r="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="m6.8 6.2 6.2-.8M6.2 7.8l3.6 5.6m3-6.6-1.2 6.3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const items: readonly SpotlightBentoItem[] = [
  { id: "latency", label: "Median response", value: "34 ms", meta: "Live", icon: pulse, tone: "blue" },
  { id: "regions", label: "Active regions", value: "12 regions", meta: "+2", icon: nodes, tone: "moss" },
  { id: "delivery", label: "Successful deliveries", value: "99.98%", meta: "30d", icon: pulse, tone: "clay" },
  { id: "sessions", label: "Sessions now", value: "8,492", meta: "+8%", icon: nodes, tone: "ink" },
];

export function SpotlightBentoDemo() {
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <SpotlightBento items={items} label="Network overview" />
    </div>
  );
}
