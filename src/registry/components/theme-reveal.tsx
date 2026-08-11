"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import { flushSync } from "react-dom";

type ViewTransitionLike = { ready: Promise<void>; finished: Promise<void> };
type TransitionDocument = Document & { startViewTransition?: (update: () => void | Promise<void>) => ViewTransitionLike };

export type ThemeRevealProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "onClick" | "onError"> & {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void | Promise<void>;
  onError?: (error: unknown) => void;
  lightLabel?: string;
  darkLabel?: string;
  duration?: number;
};

export function ThemeReveal({
  theme,
  onThemeChange,
  onError,
  lightLabel = "Use light theme",
  darkLabel = "Use dark theme",
  duration = 460,
  className = "",
  disabled,
  ...props
}: ThemeRevealProps) {
  const button = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(false);
  const [reduced, setReduced] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const toggle = async () => {
    if (disabled || pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    const next = theme === "dark" ? "light" : "dark";
    try {
      const start = (document as TransitionDocument).startViewTransition;
      if (!start || reduced || !button.current) {
        await onThemeChange(next);
        return;
      }

      const box = button.current.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const transition = start.call(document, () => {
        let result: void | Promise<void> = undefined;
        flushSync(() => { result = onThemeChange(next); });
        return result;
      });
      await transition.ready;
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration, easing: "cubic-bezier(.23,1,.32,1)", pseudoElement: "::view-transition-new(root)" },
      );
      await transition.finished;
    } catch (error: unknown) {
      onError?.(error);
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  const dark = theme === "dark";
  const unavailable = Boolean(disabled || pending);
  return (
    <button
      ref={button}
      {...props}
      type="button"
      aria-label={dark ? lightLabel : darkLabel}
      aria-pressed={dark}
      aria-busy={pending || undefined}
      aria-disabled={unavailable || undefined}
      disabled={disabled}
      onClick={toggle}
      className={`relative grid size-11 place-items-center overflow-hidden rounded-full border border-stone-200 bg-white text-stone-700 outline-none transition-[border-color,box-shadow,background-color,color] duration-150 focus-visible:border-[#4568FF] focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.22)] disabled:opacity-45 dark:border-white/15 dark:bg-[#242421] dark:text-stone-200 ${className}`}
    >
      <span aria-hidden className={`absolute size-4 rounded-full bg-current transition-[opacity,transform] ${reduced ? "duration-0" : "duration-200"} ${dark ? "scale-[.72] opacity-0" : "scale-100 opacity-100"}`} />
      <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" className={`absolute transition-[opacity,transform] ${reduced ? "duration-0" : "duration-200"} ${dark ? "scale-100 opacity-100" : "scale-[.72] opacity-0"}`}>
        <path d="M20 15.2A8.1 8.1 0 0 1 8.8 4a8.2 8.2 0 1 0 11.2 11.2Z" fill="currentColor" />
      </svg>
    </button>
  );
}
