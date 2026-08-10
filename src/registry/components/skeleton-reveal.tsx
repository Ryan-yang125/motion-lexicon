"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const REVEAL = { duration: 0.24, ease: [0.23, 1, 0.32, 1] } as const;
const HIDE = { duration: 0.13, ease: [0.4, 0, 1, 1] } as const;
const INSTANT = { duration: 0 } as const;

export type SkeletonRevealProps = {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  label?: string;
  minHeight?: number | string;
  className?: string;
};

export function SkeletonReveal({
  loading,
  skeleton,
  children,
  label = "Content",
  minHeight = 160,
  className = "",
}: SkeletonRevealProps) {
  const reduced = useReducedMotion() === true;
  const mounted = useRef(false);
  const [announcement, setAnnouncement] = useState(loading ? "Loading" : "Content loaded");

  useEffect(() => {
    if (mounted.current) setAnnouncement(loading ? "Loading" : "Content loaded");
    mounted.current = true;
  }, [loading]);

  const style: CSSProperties = { minHeight };
  const skeletonInert: Record<string, string> = !loading ? { inert: "" } : {};
  const contentInert: Record<string, string> = loading ? { inert: "" } : {};

  return (
    <section aria-label={label} className={`w-full ${className}`}>
      <motion.div layout={!reduced} style={style} className="relative grid overflow-hidden">
        <div
          data-skeleton-reveal-layer="skeleton"
          aria-hidden={!loading}
          {...skeletonInert}
          className={`col-start-1 row-start-1 ${loading ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <motion.div
            initial={false}
            animate={
              loading
                ? { opacity: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)" }
                : { opacity: 0, filter: "blur(2px)", clipPath: "inset(0% 0% 100% 0%)" }
            }
            transition={reduced ? INSTANT : loading ? REVEAL : HIDE}
          >
            {skeleton}
          </motion.div>
        </div>

        <div
          data-skeleton-reveal-layer="content"
          aria-hidden={loading}
          {...contentInert}
          className={`col-start-1 row-start-1 ${loading ? "pointer-events-none" : "pointer-events-auto"}`}
        >
          <motion.div
            initial={false}
            animate={
              loading
                ? { opacity: 0, filter: "blur(3px)", clipPath: "inset(8% 0% 0% 0%)", transform: "translate3d(0, 5px, 0)" }
                : { opacity: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)", transform: "translate3d(0, 0, 0)" }
            }
            transition={reduced ? INSTANT : loading ? HIDE : REVEAL}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
      <span role="status" aria-live="polite" className="sr-only">{announcement}</span>
    </section>
  );
}
