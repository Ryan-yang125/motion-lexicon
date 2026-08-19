"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

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
  blue: "bg-[#2457d6]",
  green: "bg-[#147a56]",
  amber: "bg-[#bc6b18]",
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
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    let intersecting = true;
    let documentVisible = !document.hidden;
    const update = () => setVisible(intersecting && documentVisible);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    const onVisibility = () => { documentVisible = !document.hidden; update(); };
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  const next = agents.length ? (active + 1) % agents.length : 0;
  const advance = () => {
    if (!agents.length) return;
    setActive(next);
    onHandoff?.(agents[next]);
  };
  return (
    <section
      ref={root}
      className={`w-full rounded-[14px] border border-neutral-200 bg-white p-4 text-neutral-950 shadow-[0_18px_48px_-40px_rgba(15,23,42,.55)] dark:border-white/10 dark:bg-[#1b1b1b] dark:text-neutral-50 ${className}`}
    >
      <header className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
          {eyebrow}
        </span>
        {artifact ? (
          <code className="ml-auto rounded-md bg-neutral-100 px-2 py-1 text-[9px] text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
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
          className="absolute left-[12%] right-[12%] top-5 h-px bg-neutral-200 dark:bg-white/10"
        />
        {agents.map((agent, index) => (
          <div
            key={agent.id}
            className="relative z-10 grid justify-items-center text-center"
          >
            <motion.span
              className={`grid size-10 place-items-center rounded-full border-4 border-white text-[10px] font-semibold text-white shadow-sm dark:border-[#181818] ${tones[agent.tone ?? "blue"]}`}
              animate={
                index === active && !reduced && visible
                  ? {
                      y: [0, -3, 0],
                      boxShadow: [
                        "0 2px 6px rgba(0,0,0,.12)",
                        "0 4px 10px rgba(0,0,0,.2)",
                        "0 2px 6px rgba(0,0,0,.12)",
                      ],
                    }
                  : { opacity: index <= active ? 1 : 0.45 }
              }
              transition={{
                duration: 1.6,
                repeat: index === active && visible ? Infinity : 0,
              }}
            >
              {agent.initials}
            </motion.span>
            <strong className="mt-2 text-[10px]">{agent.name}</strong>
            <span className="mt-0.5 text-[8px] text-neutral-400">
              {agent.role}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-neutral-100 pt-3 dark:border-white/8">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
            {ownerLabel(agents[active]?.name ?? "Agent")}
          </span>
        </div>
        <button
          type="button"
          disabled={agents.length < 2}
          onClick={advance}
          className="mt-3 min-h-11 w-full rounded-lg bg-neutral-950 text-[10px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-40 dark:bg-neutral-50 dark:text-neutral-950"
        >
          {handoffLabel} → {agents[next]?.name}
        </button>
      </div>
    </section>
  );
}
