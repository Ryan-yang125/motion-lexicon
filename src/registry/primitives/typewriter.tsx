"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export type TypewriterPrimitiveProps = {
  text: string;
  duration?: number;
  characters?: number;
  caret?: boolean;
  className?: string;
};

export function TypewriterPrimitive({
  text,
  duration = 1.2,
  characters,
  caret = true,
  className,
}: TypewriterPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const content = useMemo(() => text.slice(0, characters ?? text.length), [characters, text]);
  const [visible, setVisible] = useState(reduceMotion ? content.length : 0);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(content.length);
      return;
    }
    setVisible(0);
    const interval = Math.max(24, (duration * 1000) / Math.max(1, content.length));
    const timer = window.setInterval(() => {
      setVisible((current) => {
        if (current >= content.length) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [content, duration, reduceMotion]);

  return (
    <span className={className} aria-label={content}>
      <span aria-hidden>{content.slice(0, visible)}</span>
      {caret ? (
        <motion.span
          aria-hidden
          className="ml-[1px] inline-block h-[1em] w-px bg-current align-[-0.12em]"
          animate={{ opacity: reduceMotion ? 1 : [1, 0, 1] }}
          transition={{ duration: 0.8, ease: "linear", repeat: reduceMotion ? 0 : Infinity }}
        />
      ) : null}
    </span>
  );
}
