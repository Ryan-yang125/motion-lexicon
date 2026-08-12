"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type HandoffAgent = {
  id: string;
  name: string;
  role: string;
  initials: string;
  tone?: "blue" | "green" | "amber";
};
export type MultiAgentHandoffProps = {
  agents: readonly HandoffAgent[];
  task: string;
  artifact?: string;
  defaultActive?: number;
  eyebrow?: string;
  handoffLabel?: string;
  ownerLabel?: (name: string) => string;
  onHandoff?: (agent: HandoffAgent) => void;
  className?: string;
};

const tones = {
  blue: "bg-[#4568ff]",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
} as const;

export function MultiAgentHandoff({
  agents,
  task,
  artifact,
  defaultActive = 0,
  eyebrow = "Agent relay",
  handoffLabel = "Hand off",
  ownerLabel = (name) => `${name} owns the next action`,
  onHandoff,
  className = "",
}: MultiAgentHandoffProps) {
  const [active, setActive] = useState(
    Math.min(defaultActive, Math.max(0, agents.length - 1)),
  );
  const reduced = useReducedMotion();
  const next = agents.length ? (active + 1) % agents.length : 0;
  const advance = () => {
    if (!agents.length) return;
    setActive(next);
    onHandoff?.(agents[next]);
  };
  return (
    <section
      className={`w-full rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-950 shadow-[0_20px_55px_-36px_rgba(24,24,27,.55)] dark:border-white/10 dark:bg-[#17191d] dark:text-zinc-50 ${className}`}
    >
      <header className="flex items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[.14em] text-zinc-400">
          {eyebrow}
        </span>
        {artifact ? (
          <code className="ml-auto rounded-md bg-zinc-100 px-2 py-1 text-[9px] text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
            {artifact}
          </code>
        ) : null}
      </header>
      <h3 className="mt-3 text-[14px] font-semibold tracking-[-.02em]">
        {task}
      </h3>
      <div
        className="relative mt-5 grid"
        style={{
          gridTemplateColumns: `repeat(${Math.max(agents.length, 1)}, minmax(0, 1fr))`,
        }}
      >
        <span
          aria-hidden="true"
          className="absolute left-[12%] right-[12%] top-5 h-px bg-zinc-200 dark:bg-white/10"
        />
        {agents.map((agent, index) => (
          <div
            key={agent.id}
            className="relative z-10 grid justify-items-center text-center"
          >
            <motion.span
              className={`grid size-10 place-items-center rounded-full border-4 border-white text-[10px] font-semibold text-white shadow-sm dark:border-[#17191d] ${tones[agent.tone ?? "blue"]}`}
              animate={
                index === active && !reduced
                  ? {
                      y: [0, -3, 0],
                      boxShadow: [
                        "0 2px 6px rgba(0,0,0,.12)",
                        "0 8px 18px rgba(69,104,255,.3)",
                        "0 2px 6px rgba(0,0,0,.12)",
                      ],
                    }
                  : { opacity: index <= active ? 1 : 0.45 }
              }
              transition={{
                duration: 1.6,
                repeat: index === active ? Infinity : 0,
              }}
            >
              {agent.initials}
            </motion.span>
            <strong className="mt-2 text-[10px]">{agent.name}</strong>
            <span className="mt-0.5 text-[8px] text-zinc-400">
              {agent.role}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-white/8 dark:bg-white/[.025]">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {ownerLabel(agents[active]?.name ?? "Agent")}
          </span>
        </div>
        <button
          type="button"
          disabled={agents.length < 2}
          onClick={advance}
          className="mt-3 min-h-11 w-full rounded-full bg-zinc-950 text-[10px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff] disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-950"
        >
          {handoffLabel} → {agents[next]?.name}
        </button>
      </div>
    </section>
  );
}
