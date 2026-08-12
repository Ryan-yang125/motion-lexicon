"use client";

import { motion, useReducedMotion } from "motion/react";

export type AgentStatus =
  | "idle"
  | "thinking"
  | "working"
  | "waiting"
  | "complete";
export type AgentStatusOrbitProps = {
  status: AgentStatus;
  label?: string;
  detail?: string;
  elapsed?: string;
  className?: string;
};

const copy: Record<
  AgentStatus,
  { tone: string; points: number; speed: number }
> = {
  idle: { tone: "#a1a1aa", points: 1, speed: 0 },
  thinking: { tone: "#4568ff", points: 3, speed: 2.8 },
  working: { tone: "#4568ff", points: 5, speed: 1.7 },
  waiting: { tone: "#f59e0b", points: 2, speed: 0 },
  complete: { tone: "#10b981", points: 1, speed: 0 },
};

export function AgentStatusOrbit({
  status,
  label = "Agent",
  detail,
  elapsed,
  className = "",
}: AgentStatusOrbitProps) {
  const reduced = useReducedMotion();
  const state = copy[status];
  return (
    <div
      role="status"
      className={`inline-flex min-h-12 items-center gap-3 rounded-full border border-zinc-200 bg-white px-2.5 pr-4 text-zinc-950 shadow-[0_10px_30px_-22px_rgba(24,24,27,.55)] dark:border-white/10 dark:bg-[#17191d] dark:text-zinc-50 ${className}`}
    >
      <span
        className="relative grid size-8 place-items-center rounded-full bg-zinc-950 dark:bg-zinc-50"
        aria-hidden="true"
      >
        <span
          className="size-1.5 rounded-full"
          style={{ background: state.tone }}
        />
        {Array.from({ length: state.points }).map((_, index) => (
          <motion.i
            key={index}
            className="absolute left-1/2 top-1/2 size-1 rounded-full"
            style={{
              background: state.tone,
              margin: -2,
              transformOrigin: `${2 + index * 2}px ${2 + index * 2}px`,
            }}
            animate={
              state.speed && !reduced
                ? { rotate: 360, x: [7 + index * 1.5, 7 + index * 1.5] }
                : { x: 7 + index * 1.5 }
            }
            transition={{
              duration: state.speed || 0,
              repeat: Infinity,
              ease: "linear",
              delay: index * -0.22,
            }}
          />
        ))}
      </span>
      <span className="min-w-0">
        <strong className="block text-[11px] font-medium">{label}</strong>
        <span className="block truncate text-[9px] capitalize text-zinc-400">
          {detail ?? status}
        </span>
      </span>
      {elapsed ? (
        <code className="ml-1 text-[9px] tabular-nums text-zinc-400">
          {elapsed}
        </code>
      ) : null}
    </div>
  );
}
