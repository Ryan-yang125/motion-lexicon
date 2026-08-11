"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const;
const SEG = "flex min-h-11 items-center justify-center px-3 text-center text-[13px] font-medium leading-[18px] tracking-[-0.01em] whitespace-nowrap";

export type SegmentedOption = { value: string; label: string; disabled?: boolean };
type Props = { options: SegmentedOption[]; label: string; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; className?: string };

export function SegmentedControl({ options, label, value, defaultValue, onValueChange, className = "" }: Props) {
  const count = Math.max(1, options.length);
  const [internal, setInternal] = useState(() => defaultValue ?? options[0]?.value ?? "");
  const [hovered, setHovered] = useState(-1);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const found = options.findIndex((option) => option.value === current);
  const index = found < 0 ? 0 : found;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const emit = useRef(onValueChange);
  emit.current = onValueChange;
  const reduced = useReducedMotion();
  const pos = useMotionValue(index);
  const thumbX = useTransform(pos, (next) => `${next * 100}%`);
  const maskX = useTransform(pos, (next) => `${next * -100}%`);
  const template = `repeat(${count}, minmax(0, 1fr))`;

  useEffect(() => {
    if (reduced) { pos.set(index); return; }
    const controls = animate(pos, index, CELL);
    return () => controls.stop();
  }, [index, pos, reduced]);

  const select = useCallback((next: string) => {
    if (!controlled) setInternal(next);
    if (next !== current) emit.current?.(next);
  }, [controlled, current]);
  const seek = useCallback((from: number, direction: number) => {
    let next = from;
    for (let countIndex = 0; countIndex < count; countIndex += 1) {
      next = (next + direction + count) % count;
      if (!options[next]?.disabled) return next;
    }
    return from;
  }, [count, options]);
  const go = useCallback((next: number) => {
    const option = options[next];
    if (!option || option.disabled) return;
    buttons.current[next]?.focus();
    select(option.value);
  }, [options, select]);

  return <div role="radiogroup" aria-label={label} className={`relative inline-block select-none rounded-[9px] border border-stone-200 bg-stone-100/70 p-0.5 shadow-[inset_0_1px_2px_rgba(28,25,23,0.07)] dark:border-white/[0.16] dark:bg-[#1D1D1A] ${className}`}>
    <div className="relative grid" style={{ gridTemplateColumns: template, touchAction: "manipulation" }}>
      {options.map((option, optionIndex) => <span key={option.value} aria-hidden className={`${SEG} pointer-events-none ${option.disabled ? "text-stone-300 dark:text-stone-600" : hovered === optionIndex && optionIndex !== index ? "text-stone-700 dark:text-stone-200" : "text-stone-500 dark:text-stone-400"}`}>{option.label}</span>)}
      <motion.div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden rounded-[6px] bg-stone-800 shadow-[0_1px_2px_rgba(28,25,23,0.28)] dark:bg-stone-100" style={{ width: `${100 / count}%`, x: thumbX }} initial={false}>
        <motion.div className="absolute inset-0" style={{ x: maskX }} initial={false}><div className="absolute inset-y-0 left-0 grid" style={{ width: `${count * 100}%`, gridTemplateColumns: template }}>{options.map((option) => <span key={option.value} className={`${SEG} text-stone-50 dark:text-stone-900`}>{option.label}</span>)}</div></motion.div>
      </motion.div>
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: template }} onPointerLeave={() => setHovered(-1)}>
        {options.map((option, optionIndex) => <button key={option.value} ref={(node) => { buttons.current[optionIndex] = node; }} type="button" role="radio" aria-checked={optionIndex === index} aria-disabled={option.disabled || undefined} tabIndex={optionIndex === index ? 0 : -1} onClick={() => !option.disabled && select(option.value)} onPointerEnter={() => !option.disabled && setHovered(optionIndex)} onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); go(seek(optionIndex, 1)); }
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); go(seek(optionIndex, -1)); }
          if (event.key === "Home") { event.preventDefault(); go(seek(count - 1, 1)); }
          if (event.key === "End") { event.preventDefault(); go(seek(0, -1)); }
        }} className="cursor-default rounded-[6px] outline-none focus-visible:bg-[#4568FF]/[0.06] focus-visible:shadow-[inset_0_0_0_1px_#4568FF] dark:focus-visible:bg-[#93B0FF]/[0.08] dark:focus-visible:shadow-[inset_0_0_0_1px_#93B0FF]"><span className="sr-only">{option.label}</span></button>)}
      </div>
    </div>
  </div>;
}
