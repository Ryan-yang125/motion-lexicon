"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes, type PointerEvent } from "react";
import { gsap } from "gsap";

export type MagneticActionProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onBlur" | "onPointerLeave" | "onPointerMove"> & {
  strength?: number;
  labelShift?: number;
  glow?: string;
};

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function MagneticAction({
  children,
  className = "",
  strength = 0.22,
  labelShift = 0.42,
  glow = "rgba(255,255,255,.46)",
  disabled,
  style,
  ...props
}: MagneticActionProps) {
  const root = useRef<HTMLButtonElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotionPreference();
  const movers = useRef<{ x: (value: number) => void; y: (value: number) => void; lx: (value: number) => void; ly: (value: number) => void } | null>(null);

  useEffect(() => {
    const button = root.current;
    const text = label.current;
    if (!button || !text || reduced) return;
    movers.current = {
      x: gsap.quickTo(button, "x", { duration: 0.42, ease: "power3.out" }),
      y: gsap.quickTo(button, "y", { duration: 0.42, ease: "power3.out" }),
      lx: gsap.quickTo(text, "x", { duration: 0.5, ease: "power3.out" }),
      ly: gsap.quickTo(text, "y", { duration: 0.5, ease: "power3.out" }),
    };
    return () => {
      movers.current = null;
      gsap.killTweensOf([button, text]);
      gsap.set([button, text], { clearProps: "transform" });
    };
  }, [reduced]);

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduced || disabled || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (bounds.left + bounds.width / 2);
    const dy = event.clientY - (bounds.top + bounds.height / 2);
    movers.current?.x(dx * strength);
    movers.current?.y(dy * strength);
    movers.current?.lx(dx * strength * labelShift);
    movers.current?.ly(dy * strength * labelShift);
    event.currentTarget.style.setProperty("--magnetic-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty("--magnetic-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  const reset = () => {
    movers.current?.x(0);
    movers.current?.y(0);
    movers.current?.lx(0);
    movers.current?.ly(0);
  };

  return (
    <button
      ref={root}
      type="button"
      disabled={disabled}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
      className={`group relative inline-flex min-h-11 select-none items-center justify-center overflow-hidden rounded-full bg-stone-900 px-5 text-[13px] font-medium text-white shadow-[0_12px_30px_-18px_rgba(28,25,23,.75)] outline-none transition-[box-shadow,background-color] duration-150 focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.28),0_14px_34px_-18px_rgba(28,25,23,.8)] disabled:pointer-events-none disabled:opacity-45 dark:bg-stone-100 dark:text-stone-950 ${className}`}
      style={{
        ...style,
        backgroundImage: `radial-gradient(circle at var(--magnetic-x,50%) var(--magnetic-y,50%), ${glow}, transparent 34%)`,
        touchAction: "manipulation",
      }}
      {...props}
    >
      <span ref={label} className="relative z-10 inline-flex items-center gap-2 will-change-transform">
        {children}
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-[1px] rounded-full border border-white/15" />
    </button>
  );
}
