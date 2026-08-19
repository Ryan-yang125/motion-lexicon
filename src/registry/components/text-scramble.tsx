"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export type TextScrambleProps = { value: string; label?: string; characters?: string; duration?: number; className?: string };

export function TextScramble({ value, label = "Text scramble", characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", duration = 520, className = "" }: TextScrambleProps) {
  const reduced = useReducedMotion() === true;
  const outputId = useId();
  const frameRef = useRef<number | null>(null);
  const previousRef = useRef(value);
  const [output, setOutput] = useState(value);
  useEffect(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (reduced || previousRef.current === value) { previousRef.current = value; setOutput(value); return; }
    const start = performance.now(); const from = previousRef.current; const length = Math.max(from.length, value.length);
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / Math.max(1, duration));
      const resolved = Math.floor(progress * length);
      const next = Array.from({ length }, (_, index) => index < resolved ? (value[index] ?? "") : value[index] === " " ? " " : characters[(index * 17 + Math.floor(now / 42)) % characters.length]).join("");
      setOutput(next);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate); else { frameRef.current = null; previousRef.current = value; setOutput(value); }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); };
  }, [characters, duration, reduced, value]);
  return <output id={outputId} aria-label={label} aria-live="polite" className={`inline-flex min-h-11 items-center rounded-md border border-black/[.1] bg-[#171717] px-4 font-mono text-sm tracking-[.12em] text-[#d9ff82] shadow-[0_12px_28px_-18px_rgba(18,18,18,.95)] ${className}`}>{output}</output>;
}
