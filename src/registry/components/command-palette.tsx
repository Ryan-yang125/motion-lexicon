"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";

const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const;
const CROSSFADE = { type: "spring", stiffness: 260, damping: 34, mass: 0.8 } as const;
const BOUNDARY = /[\s\-_/.:]/;
const ROW = 36;
const GAP = 2;
const PAD = 5;

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  keywords?: string;
  shortcut?: string[];
};

export type UseCommandPaletteOptions = {
  items: CommandItem[];
  onSelect: (item: CommandItem) => void;
  onDismiss?: () => void;
};

function scoreOne(text: string, query: string): number {
  const t = text.toLowerCase();
  let cursor = 0;
  let total = 0;
  let streak = 0;

  for (let i = 0; i < query.length; i++) {
    const at = t.indexOf(query[i], cursor);
    if (at < 0) return -1;
    streak = at === cursor && i > 0 ? streak + 1 : 0;
    total += 2 + streak * 4;
    if (at === 0) total += 12;
    else if (BOUNDARY.test(t[at - 1])) total += 8;
    cursor = at + 1;
  }

  return total;
}

function rank(items: CommandItem[], query: string): CommandItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  const scored: { item: CommandItem; score: number; order: number }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const direct = scoreOne(item.label, q);
    const aliased = item.keywords ? scoreOne(item.keywords, q) - 3 : -1;
    const best = Math.max(direct, item.keywords ? aliased : -1);
    if (best < 0) continue;
    scored.push({ item, score: best - item.label.length * 0.05, order: i });
  }

  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return scored.map((s) => s.item);
}

export function useCommandPalette({
  items,
  onSelect,
  onDismiss,
}: UseCommandPaletteOptions) {
  const [query, setQuery] = useState("");
  const [pinned, setPinned] = useState<string | null>(null);

  const listRef = useRef<HTMLUListElement>(null);
  const pointer = useRef({ x: -1, y: -1 });

  const select = useRef(onSelect);
  select.current = onSelect;
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  const results = useMemo(() => rank(items, query), [items, query]);

  const activeId = results.some((r) => r.id === pinned)
    ? pinned
    : (results[0]?.id ?? null);
  const activeIndex = results.findIndex((r) => r.id === activeId);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [query]);

  const reveal = (index: number) => {
    const list = listRef.current;
    const row = list?.children[index];
    if (!list || !(row instanceof HTMLElement)) return;
    const top = row.offsetTop - PAD;
    const bottom = row.offsetTop + row.offsetHeight + PAD;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = bottom - list.clientHeight;
    }
  };

  const jump = (index: number) => {
    if (results.length === 0) return;
    const next = Math.max(0, Math.min(results.length - 1, index));
    setPinned(results[next].id);
    reveal(next);
  };

  const move = (delta: number) => {
    if (results.length === 0) return;
    const from = activeIndex < 0 ? 0 : activeIndex;
    jump((from + delta + results.length) % results.length);
  };

  const run = (item?: CommandItem) => {
    const target = item ?? results.find((r) => r.id === activeId);
    if (target) select.current(target);
  };

  const pointerActivate = (id: string, event: React.PointerEvent) => {
    const { x, y } = pointer.current;
    if (event.clientX === x && event.clientY === y) return;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (id !== activeId) setPinned(id);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      jump(0);
    } else if (event.key === "End") {
      event.preventDefault();
      jump(results.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run();
    } else if (event.key === "Escape") {
      event.preventDefault();
      dismiss.current?.();
    }
  };

  return {
    query,
    setQuery,
    results,
    activeId,
    activeIndex,
    listRef,
    onKeyDown,
    pointerActivate,
    jump,
    move,
    run,
  };
}

export type CommandPaletteProps = {
  items: CommandItem[];
  onSelect: (item: CommandItem) => void;
  onDismiss?: () => void;

  open?: boolean;
  placeholder?: string;
  emptyLabel?: string;
  label?: string;
  maxRows?: number;
  autoFocus?: boolean;
  className?: string;
};

export function CommandPalette({
  items,
  onSelect,
  onDismiss,
  open,
  placeholder = "Search commands",
  emptyLabel = "No command matches",
  label = "Command palette",
  maxRows = 6,
  autoFocus = false,
  className = "",
}: CommandPaletteProps) {
  const uid = useId();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);

  const {
    query,
    setQuery,
    results,
    activeId,
    listRef,
    onKeyDown,
    pointerActivate,
    run,
  } = useCommandPalette({ items, onSelect, onDismiss });

  const rows = Math.max(1, Math.min(maxRows, items.length));
  const height = PAD * 2 + rows * ROW + (rows - 1) * GAP;
  const count = results.length;

  useEffect(() => {
    if (autoFocus && open === undefined) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [autoFocus, open]);

  useEffect(() => {
    if (open) setQuery("");
  }, [open, setQuery]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!liveRef.current) return;
      liveRef.current.textContent =
        count === 0
          ? emptyLabel
          : `${count} ${count === 1 ? "command" : "commands"} available`;
    }, 400);
    return () => clearTimeout(id);
  }, [count, emptyLabel]);

  const spring = reduced ? { duration: 0 } : CELL;

  const overlaid = open !== undefined;

  const surface = (
    <div
      className={`overflow-hidden rounded-[14px] border border-stone-200 bg-white dark:border-white/[0.16] dark:bg-[#1D1D1A] ${
        overlaid
          ? "w-full max-w-[520px] shadow-[0_1px_2px_rgba(28,25,23,0.07),0_28px_56px_-24px_rgba(24,22,20,0.5)] dark:shadow-[0_3px_16px_rgba(0,0,0,0.65)]"
          : ""
      } ${className}`}
    >
      <div className="flex h-11 items-center gap-2.5 border-b border-stone-200 px-3 dark:border-white/[0.16]">
        <svg
          viewBox="0 0 16 16"
          className="size-[14px] shrink-0 text-stone-500 dark:text-stone-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="7" cy="7" r="4.25" />
          <path d="M10.2 10.2 13.5 13.5" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label={label}
          aria-expanded
          aria-controls={`${uid}-list`}
          aria-autocomplete="list"
          aria-activedescendant={activeId ? `${uid}-${activeId}` : undefined}
          autoComplete="off"
          spellCheck={false}
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-[13.5px] text-stone-700 outline-none placeholder:text-stone-400 dark:text-stone-200 dark:placeholder:text-stone-500"
        />
        <span className="min-w-[3ch] shrink-0 text-right font-mono text-[9.5px] tabular-nums text-stone-500 dark:text-stone-400">
          {count}
        </span>
      </div>
      <div className="relative" style={{ height }}>
        <ul
          ref={listRef}
          id={`${uid}-list`}
          role="listbox"
          aria-label={label}
          onMouseDown={(e) => e.preventDefault()}
          className="absolute inset-0 flex flex-col gap-[2px] overflow-y-auto overscroll-contain p-[5px] [scrollbar-gutter:stable]"
        >
          {results.map((item) => {
            const active = item.id === activeId;
            return (
              <motion.li
                key={item.id}
                id={`${uid}-${item.id}`}
                role="option"
                aria-selected={active}
                layout={reduced ? false : "position"}
                transition={spring}
                onPointerMove={(e) => pointerActivate(item.id, e)}
                onClick={() => run(item)}
                className="relative flex h-9 shrink-0 cursor-default items-center rounded-[9px] px-2.5"
              >
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={reduced ? { duration: 0 } : CROSSFADE}
                  className="absolute inset-0 rounded-[9px] bg-stone-100 dark:bg-white/10"
                />
                <span className="relative flex min-w-0 flex-1 items-center gap-2.5">
                  <span className="truncate text-[13px] font-medium text-stone-700 dark:text-stone-200">
                    {item.label}
                  </span>

                  {item.hint ? (
                    <span className="hidden shrink-0 text-[11.5px] text-stone-500 sm:inline dark:text-stone-400">
                      {item.hint}
                    </span>
                  ) : null}

                  {item.shortcut ? (
                    <span className="ml-auto flex shrink-0 items-center gap-1">
                      {item.shortcut.map((key) => (
                        <span
                          key={key}
                          className="flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] border border-stone-200 px-1 font-mono text-[9.5px] tabular-nums text-stone-500 dark:border-white/[0.16] dark:text-stone-400"
                        >
                          {key}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </span>
              </motion.li>
            );
          })}
        </ul>

        {count === 0 ? (
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : CROSSFADE}
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-center text-[12.5px] text-stone-500 dark:text-stone-400"
          >
            {emptyLabel}
          </motion.p>
        ) : null}
      </div>
      <span ref={liveRef} role="status" aria-live="polite" className="sr-only" />
    </div>
  );

  if (!overlaid) return surface;
  return <PaletteLayer open={open} onDismiss={onDismiss} label={label}>{surface}</PaletteLayer>;
}

function PaletteLayer({
  open,
  onDismiss,
  label,
  children,
}: {
  open: boolean;
  onDismiss?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const leave = useRef(onDismiss);
  leave.current = onDismiss;

  useEffect(() => setHost(document.body), []);

  useIsoLayoutEffect(() => {
    if (!open || !host) return;
    returnFocus.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    layerRef.current
      ?.querySelector<HTMLElement>(
        'input:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )
      ?.focus({ preventScroll: true });
    return () => {
      const node = returnFocus.current;
      requestAnimationFrame(() => node?.focus({ preventScroll: true }));
      returnFocus.current = null;
    };
  }, [host, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        leave.current?.();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        layerRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((node) => !node.hasAttribute("aria-hidden"));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !layerRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !layerRef.current?.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    const padding = root.style.paddingRight;
    const gutter = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gutter > 0) root.style.paddingRight = `${gutter}px`;
    return () => {
      root.style.overflow = overflow;
      root.style.paddingRight = padding;
    };
  }, [open]);

  if (!host) return null;

  return createPortal(
    open ? (
        <div
          ref={layerRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onPointerDown={(event) => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            leave.current?.();
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-stone-900/40 dark:bg-black/65"
            onPointerDown={(event) => {
              event.preventDefault();
              leave.current?.();
            }}
          />
          <div className="relative flex w-full justify-center">
            {children}
          </div>
        </div>
      ) : null,
    host,
  );
}
