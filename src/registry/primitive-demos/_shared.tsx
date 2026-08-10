import type { ReactNode } from "react";
import type { Transition } from "motion/react";
import type { Locale, ParamValues } from "@/data/types";

export type PrimitiveDemoProps = {
  locale: Locale;
  values: ParamValues;
  compact?: boolean;
  replayKey?: number;
};

export function numberValue(values: ParamValues, key: string, fallback: number) {
  const value = values[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function stringValue(values: ParamValues, key: string, fallback: string) {
  const value = values[key];
  return typeof value === "string" ? value : fallback;
}

export function booleanValue(values: ParamValues, key: string, fallback: boolean) {
  const value = values[key];
  return typeof value === "boolean" ? value : fallback;
}

export function easingValue(values: ParamValues, key: string, fallback: string): Transition["ease"] {
  const value = stringValue(values, key, fallback);
  const curves: Record<string, Transition["ease"]> = {
    linear: "linear",
    "ease-out": [0.16, 1, 0.3, 1],
    "ease-in": [0.55, 0, 1, 0.45],
    "ease-in-out": [0.65, 0, 0.35, 1],
    custom: [0.25, 0.9, 0.3, 1],
    asymmetric: [0.2, 0.8, 0.2, 1],
    soft: [0.23, 1, 0.32, 1],
    snap: [0.16, 1, 0.3, 1],
    calm: [0.33, 1, 0.68, 1],
  };
  return curves[value] ?? curves[fallback] ?? curves.soft;
}

export function PrimitiveDemoSurface({
  label,
  meta,
  compact = false,
  children,
  className = "",
}: {
  label: string;
  meta?: string;
  compact?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`primitive-live-demo flex w-full max-w-[440px] flex-col overflow-hidden border border-stone-200 bg-white text-stone-900 shadow-[0_1px_2px_rgba(28,25,23,0.08),0_10px_26px_-22px_rgba(28,25,23,0.48)] dark:border-white/[0.14] dark:bg-[#191917] dark:text-stone-100 dark:shadow-[0_1px_8px_rgba(0,0,0,0.5)] ${compact ? "is-compact h-[150px] rounded-[11px]" : "h-[300px] rounded-[14px]"} ${className}`}
      data-compact={compact ? "true" : "false"}
    >
      <header className={`flex shrink-0 items-center border-b border-stone-200 dark:border-white/[0.1] ${compact ? "h-8 px-2.5" : "h-10 px-3.5"}`}>
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-[11px] font-medium">
          <i className="size-1.5 shrink-0 rounded-full bg-stone-800 dark:bg-stone-200" />
          {label}
        </span>
        {meta ? <code className="text-[9.5px] text-stone-400 dark:text-stone-500">{meta}</code> : null}
      </header>
      <div className={`relative min-h-0 flex-1 overflow-hidden bg-stone-50 dark:bg-[#141412] ${compact ? "p-2.5" : "p-5"}`}>
        {children}
      </div>
    </section>
  );
}

export function ProductPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[12px] border border-stone-200 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.06),0_6px_14px_-12px_rgba(28,25,23,0.5)] dark:border-white/[0.12] dark:bg-[#1E1E1B] ${className}`}>
      {children}
    </div>
  );
}

export function ProductButton({ children, tone = "light", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "light" | "dark" | "danger" }) {
  const toneClass = tone === "dark"
    ? "border-stone-800 bg-stone-800 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
    : tone === "danger"
      ? "border-[#8A4A3A] bg-[#8A4A3A] text-white"
      : "border-stone-200 bg-white text-stone-700 dark:border-white/[0.14] dark:bg-[#22221F] dark:text-stone-200";
  return (
    <button {...props} className={`min-h-11 rounded-[9px] border px-3 text-[12px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF]/55 ${toneClass} ${className}`}>
      {children}
    </button>
  );
}

export function Avatar({ initials, tone = "stone" }: { initials: string; tone?: "stone" | "clay" | "moss" | "blue" }) {
  const colors = {
    stone: "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900",
    clay: "bg-[#8D6250] text-white",
    moss: "bg-[#55745D] text-white",
    blue: "bg-[#4568FF] text-white",
  };
  return <span className={`grid size-8 shrink-0 place-items-center rounded-[9px] text-[10px] font-semibold ${colors[tone]}`}>{initials}</span>;
}

export function MetaLine({ width = "70%" }: { width?: string }) {
  return <i className="block h-1 rounded-full bg-stone-200 dark:bg-white/[0.09]" style={{ width }} />;
}

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" }) {
  const colors = tone === "success"
    ? "bg-[#55745D]/12 text-[#4F6D57] dark:bg-[#78947E]/14 dark:text-[#A7C1AC]"
    : tone === "warning"
      ? "bg-[#93664F]/12 text-[#805844] dark:bg-[#B98669]/14 dark:text-[#D5AA94]"
      : "bg-stone-100 text-stone-500 dark:bg-white/[0.07] dark:text-stone-400";
  return <span className={`inline-flex min-h-6 items-center rounded-full px-2 text-[10px] font-medium ${colors}`}>{children}</span>;
}

export function textFor(locale: Locale, zh: string, en: string) {
  return locale === "zh" ? zh : en;
}
