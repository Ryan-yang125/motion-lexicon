"use client";

import { useCallback, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const PANEL = { duration: 0.14, ease: [0.23, 1, 0.32, 1] } as const;

export type TabItem = {
  value: string;
  label: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
};

export type TabsActivation = "automatic" | "manual";
export type UseTabsOptions = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  activation?: TabsActivation;
};

export function useTabs({
  items,
  value: controlled,
  defaultValue,
  onValueChange,
  activation = "automatic",
}: UseTabsOptions) {
  const base = useId();
  const nodes = useRef(new Map<string, HTMLButtonElement>());
  const direction = useRef(1);

  const [internal, setInternal] = useState(
    () => defaultValue ?? items.find((i) => !i.disabled)?.value ?? items[0]?.value ?? "",
  );
  const [instant, setInstant] = useState(false);

  const value = controlled ?? internal;

  const emit = useRef(onValueChange);
  emit.current = onValueChange;

  const select = useCallback(
    (next: string, immediately = false) => {
      if (next === value) return;
      const from = items.findIndex((i) => i.value === value);
      const to = items.findIndex((i) => i.value === next);
      direction.current = to < from ? -1 : 1;
      setInstant(immediately);
      if (controlled === undefined) setInternal(next);
      emit.current?.(next);
    },
    [controlled, items, value],
  );

  const focusAt = useCallback(
    (i: number) => {
      const item = items[i];
      if (!item) return;
      nodes.current.get(item.value)?.focus();
    },
    [items],
  );

  const nextEnabled = useCallback(
    (from: number, dir: number) => {
      const n = items.length;
      let i = from < 0 ? 0 : from;
      for (let k = 0; k < n; k += 1) {
        i = (i + dir + n) % n;
        if (!items[i].disabled) return i;
      }
      return from;
    },
    [items],
  );

  const endStop = useCallback(
    (dir: number) => {
      const n = items.length;
      if (dir > 0) {
        for (let i = 0; i < n; i += 1) if (!items[i].disabled) return i;
      } else {
        for (let i = n - 1; i >= 0; i -= 1) if (!items[i].disabled) return i;
      }
      return 0;
    },
    [items],
  );

  const getTabProps = useCallback(
    (item: TabItem, index: number) => ({
      id: `${base}-tab-${item.value}`,
      role: "tab" as const,
      type: "button" as const,
      "aria-selected": item.value === value,
      "aria-controls": `${base}-panel-${item.value}`,
      "aria-disabled": item.disabled ? (true as const) : undefined,
      tabIndex: item.value === value ? 0 : -1,
      ref: (node: HTMLButtonElement | null) => {
        if (node) nodes.current.set(item.value, node);
        else nodes.current.delete(item.value);
      },
      onClick: () => {
        if (!item.disabled) select(item.value);
      },
      onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const to = nextEnabled(index, e.key === "ArrowRight" ? 1 : -1);
          focusAt(to);
          if (activation === "automatic") select(items[to].value, true);
          return;
        }
        if (e.key === "Home" || e.key === "End") {
          e.preventDefault();
          const to = endStop(e.key === "Home" ? 1 : -1);
          focusAt(to);
          if (activation === "automatic") select(items[to].value, true);
          return;
        }
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!item.disabled) select(item.value, true);
        }
      },
    }),
    [activation, base, endStop, focusAt, items, nextEnabled, select, value],
  );

  const getPanelProps = useCallback(
    (panelValue: string) => {
      const active = panelValue === value;
      return {
        id: `${base}-panel-${panelValue}`,
        role: "tabpanel" as const,
        "aria-labelledby": `${base}-tab-${panelValue}`,
        "aria-hidden": active ? undefined : (true as const),
        hidden: !active,
        tabIndex: active ? 0 : -1,
      };
    },
    [base, value],
  );

  const tabListProps = {
    role: "tablist" as const,
    "aria-orientation": "horizontal" as const,
  };

  return {
    value,
    select,
    instant,
    direction: direction.current,
    tabListProps,
    getTabProps,
    getPanelProps,
  };
}

export type UseTabsReturn = ReturnType<typeof useTabs>;

export type TabsProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  activation?: TabsActivation;
  renderPanel?: (value: string) => ReactNode;
  toolbar?: ReactNode;
  label?: string;
  panelClassName?: string;
  className?: string;
};

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  activation = "automatic",
  renderPanel,
  toolbar,
  label = "Tabs",
  panelClassName = "",
  className = "",
}: TabsProps) {
  const tabs = useTabs({ items, value, defaultValue, onValueChange, activation });
  const reduced = useReducedMotion();

  return (
    <div
      className={`w-full overflow-hidden rounded-[12px] border border-stone-200 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.06),0_4px_10px_-8px_rgba(28,25,23,0.45)] dark:border-white/[0.16] dark:bg-[#1D1D1A] dark:shadow-[0_1px_6px_rgba(0,0,0,0.45)] ${className}`}
    >
      <div className="interior-tabs-toolbar">
        <div
          {...tabs.tabListProps}
          aria-label={label}
          className="relative flex w-full gap-1 border-b border-stone-200 bg-stone-50 px-1 pt-1 dark:border-white/[0.16] dark:bg-[#1D1D1A]"
        >
          {items.map((item, index) => {
            const selected = item.value === tabs.value;
            return (
              <button
                key={item.value}
                {...tabs.getTabProps(item, index)}
                aria-label={item.ariaLabel}
                className={`relative flex h-8 shrink-0 items-center justify-center rounded-t-[8px] px-3.5 text-[12.5px] outline-none transition-colors duration-150 after:pointer-events-none after:absolute after:inset-0 after:rounded-t-[8px] after:content-[''] focus-visible:after:shadow-[inset_0_0_0_1px_#4568FF] dark:focus-visible:after:shadow-[inset_0_0_0_1px_#93B0FF] ${
                  item.disabled
                    ? "cursor-default text-stone-400 dark:text-stone-500"
                    : selected
                      ? "border border-b-0 border-stone-200 bg-white text-stone-800 dark:border-white/[0.16] dark:bg-[#1D1D1A] dark:text-stone-100"
                      : "text-stone-500 hover:bg-stone-200/50 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-white/[0.05] dark:hover:text-stone-200"
                }`}
              >
                <span className="relative grid place-items-center leading-[1.4]">
                  <span aria-hidden className="invisible col-start-1 row-start-1 font-medium">
                    {item.label}
                  </span>
                  <span
                    className={`col-start-1 row-start-1 ${selected ? "font-medium" : ""}`}
                  >
                    {item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {toolbar ? <div className="interior-tabs-action">{toolbar}</div> : null}
      </div>

      {renderPanel ? items.map((item) => {
        const selected = item.value === tabs.value;
        return (
          <motion.div
            key={item.value}
            {...tabs.getPanelProps(item.value)}
            initial={false}
            animate={{ opacity: selected ? 1 : 0 }}
            transition={reduced || tabs.instant ? { duration: 0 } : PANEL}
            className={`rounded-[11px] text-[13.5px] leading-relaxed text-stone-700 outline-none focus-visible:shadow-[inset_0_0_0_1px_#4568FF] dark:text-stone-200 dark:focus-visible:shadow-[inset_0_0_0_1px_#93B0FF] ${panelClassName}`}
          >
            {renderPanel(item.value)}
          </motion.div>
        );
      }) : null}
    </div>
  );
}
