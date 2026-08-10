"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";

export type KineticLogoItem = {
  id: string;
  label: string;
  mark?: ReactNode;
  tone?: "blue" | "clay" | "moss" | "ink";
};

export type KineticLogoExchangeProps = {
  items: readonly KineticLogoItem[];
  label?: string;
  interval?: number;
  columns?: 2 | 3 | 4;
  className?: string;
  onSelect?: (item: KineticLogoItem) => void;
};

const toneClass = {
  blue: "bg-[#E6EBFF] text-[#4568FF] dark:bg-[#4568FF]/20 dark:text-[#B7C5FF]",
  clay: "bg-[#F1E1DA] text-[#9B513B] dark:bg-[#B3654A]/20 dark:text-[#E5A791]",
  moss: "bg-[#E1E7DC] text-[#53624E] dark:bg-[#73806B]/20 dark:text-[#B7C5B0]",
  ink: "bg-[#292929] text-white dark:bg-stone-100 dark:text-[#292929]",
} as const;

function rotate<T>(values: readonly T[]) {
  if (values.length < 2) return [...values];
  return [...values.slice(1), values[0]];
}

export function KineticLogoExchange({
  items,
  label = "Works with your tools",
  interval = 3600,
  columns = 3,
  className = "",
  onSelect,
}: KineticLogoExchangeProps) {
  const reduced = useReducedMotion() === true;
  const [order, setOrder] = useState(() => items.map((item) => item.id));
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(items[0]?.id ?? "");
  const [cycle, setCycle] = useState(0);
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const byId = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items],
  );

  useEffect(() => {
    const nextOrder = items.map((item) => item.id);
    setOrder(nextOrder);
    setSelected((current) => current && nextOrder.includes(current) ? current : nextOrder[0] ?? "");
  }, [items]);

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
    const onVisibility = () => {
      documentVisible = !document.hidden;
      update();
    };
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (reduced || paused || !visible || order.length < 2) return;
    const timer = window.setInterval(() => {
      setOrder((current) => rotate(current));
      setCycle((current) => current + 1);
    }, Math.max(1800, interval));
    return () => window.clearInterval(timer);
  }, [interval, order.length, paused, reduced, visible]);

  const pause = () => setPaused(true);

  return (
    <section
      ref={root}
      aria-label={label}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") pause();
      }}
      onFocusCapture={pause}
      className={`w-full overflow-hidden rounded-[18px] border border-stone-200 bg-[#EEECE5] p-3 shadow-[0_16px_44px_-36px_rgba(41,41,41,0.48)] dark:border-white/[0.14] dark:bg-[#1D1D1A] ${className}`}
    >
      <header className="mb-2 flex min-h-11 items-center justify-between gap-3 px-1">
        <div>
          <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-stone-500">Connections</span>
          <h3 className="mt-0.5 text-[13px] font-medium tracking-[-0.015em] text-[#292929] dark:text-stone-100">{label}</h3>
        </div>
        <button
          type="button"
          aria-label={paused ? "Resume logo exchange" : "Pause logo exchange"}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
          className={`grid size-11 place-items-center rounded-full border border-black/[0.08] bg-white/70 text-[#292929] outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 dark:border-white/[0.12] dark:bg-black/20 dark:text-white ${reduced ? "" : "transition-transform duration-150 active:scale-[0.96]"}`}
        >
          {paused ? (
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
              <path d="m7.3 5.4 7 4.6-7 4.6V5.4Z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
              <path d="M6.8 5.2v9.6M13.2 5.2v9.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </header>

      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {order.map((id, index) => {
          const item = byId.get(id);
          if (!item) return null;
          const active = selected === item.id;
          return (
            <motion.button
              layout={!reduced}
              key={item.id}
              data-kinetic-logo-item={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                pause();
                setSelected(item.id);
                onSelect?.(item);
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 430, damping: 38, mass: 0.52 }
              }
              className={`group relative min-h-[72px] min-w-0 overflow-hidden rounded-[12px] border bg-white/72 p-2 text-left outline-none transition-[border-color,box-shadow,background-color] duration-150 focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-1 dark:bg-white/[0.055] ${
                active
                  ? "border-[#4568FF]/40 shadow-[inset_0_0_0_1px_rgba(69,104,255,0.18),0_8px_20px_-16px_rgba(41,41,41,0.5)] dark:border-[#93B0FF]/50"
                  : "border-black/[0.07] dark:border-white/[0.09]"
              }`}
            >
              <motion.span
                key={`${item.id}-${cycle}`}
                initial={
                  reduced
                    ? false
                    : {
                        opacity: 0.48,
                        filter: "blur(5px)",
                        clipPath: index % 2 === 0 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
                      }
                }
                animate={{ opacity: 1, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
                transition={{ duration: reduced ? 0 : 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex min-w-0 items-center gap-2"
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-[10px] ${toneClass[item.tone ?? "ink"]}`}
                >
                  {item.mark ?? (
                    <span className="text-[11px] font-semibold uppercase">{item.label.slice(0, 2)}</span>
                  )}
                </span>
                <span className="min-w-0 truncate text-[10.5px] font-medium text-stone-600 dark:text-stone-300">{item.label}</span>
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
