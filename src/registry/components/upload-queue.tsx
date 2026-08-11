"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const ROW = { type: "spring", stiffness: 420, damping: 38, mass: 0.7 } as const;
const FILL = { type: "spring", stiffness: 240, damping: 34, mass: 0.85 } as const;
const LEAVE = { duration: 0.15, ease: [0.23, 1, 0.32, 1] } as const;
const INSTANT = { duration: 0 } as const;

export type UploadStatus = "queued" | "uploading" | "complete" | "error";

export type UploadItem = {
  id: string;
  name: string;
  size?: number;
  status: UploadStatus;
  progress?: number;
  error?: string;
};

export type UploadQueueProps = {
  items: readonly UploadItem[];
  onFiles: (files: File[]) => void;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  copy?: Partial<UploadQueueCopy>;
  className?: string;
};

export type UploadQueueCopy = {
  drop: (remaining: number) => string;
  full: string;
  unsupported: string;
  limit: (remaining: number) => string;
  choose: string;
  queue: string;
  complete: string;
  failed: string;
  uploading: string;
  queued: string;
  retry: string;
  remove: string;
  progress: string;
  summary: (complete: number, total: number) => string;
};

type UploadRejection =
  | { unsupported: boolean; capacity: number | null }
  | null;

const defaultCopy: UploadQueueCopy = {
  drop: (remaining) => `Drop here or choose up to ${remaining}`,
  full: "Queue is full",
  unsupported: "This file type is not supported",
  limit: (remaining) => `Only ${remaining} more ${remaining === 1 ? "file" : "files"} can be added`,
  choose: "Choose",
  queue: "Upload queue",
  complete: "Complete",
  failed: "Upload failed",
  uploading: "Uploading",
  queued: "Queued",
  retry: "Retry",
  remove: "Remove",
  progress: "Upload progress for",
  summary: (complete, total) => `${complete} of ${total} uploads complete`,
};

function formatBytes(value?: number) {
  if (value === undefined) return "";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function accepts(file: File, accept?: string) {
  if (!accept?.trim()) return true;
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return accept.split(",").some((entry) => {
    const rule = entry.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

function useAnimationActivity<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    let visible = !document.hidden;
    let intersecting = true;
    const update = () => setActive(visible && intersecting);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    const onVisibility = () => {
      visible = !document.hidden;
      update();
    };
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { ref, active };
}

export function UploadQueue({
  items,
  onFiles,
  onRemove,
  onRetry,
  label = "Upload files",
  accept,
  multiple = true,
  maxFiles = 8,
  copy: copyOverrides,
  className = "",
}: UploadQueueProps) {
  const copy = { ...defaultCopy, ...copyOverrides };
  const id = useId();
  const reduced = useReducedMotion() === true;
  const [dragging, setDragging] = useState(false);
  const [rejection, setRejection] = useState<UploadRejection>(null);
  const { ref, active } = useAnimationActivity<HTMLDivElement>();
  const input = useRef<HTMLInputElement>(null);
  const chooseButton = useRef<HTMLButtonElement>(null);
  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  const pendingFocus = useRef<{
    id: string;
    index: number;
    trigger: HTMLButtonElement;
  } | null>(null);
  const remaining = Math.max(0, maxFiles - items.length);

  useLayoutEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;

    const triggerStillPresent = pending.trigger.isConnected && ref.current?.contains(pending.trigger);
    const itemStillPresent = items.some((item) => item.id === pending.id);
    if (triggerStillPresent && itemStillPresent) {
      if (document.activeElement !== pending.trigger) pendingFocus.current = null;
      return;
    }

    pendingFocus.current = null;
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLElement &&
      activeElement !== document.body &&
      activeElement !== document.documentElement &&
      activeElement !== pending.trigger
    ) {
      return;
    }

    const candidateIds = [
      items.some((item) => item.id === pending.id) ? pending.id : undefined,
      items[pending.index]?.id,
      items[pending.index - 1]?.id,
    ].filter((id, index, values): id is string => Boolean(id) && values.indexOf(id) === index);

    for (const id of candidateIds) {
      const action = rowRefs.current.get(id)?.querySelector<HTMLButtonElement>("button:not([disabled])");
      if (action) {
        action.focus({ preventScroll: true });
        return;
      }
    }
    chooseButton.current?.focus({ preventScroll: true });
  }, [items, ref]);

  const requestRowAction = (
    event: ReactMouseEvent<HTMLButtonElement>,
    id: string,
    index: number,
    action: (id: string) => void,
  ) => {
    pendingFocus.current = document.activeElement === event.currentTarget
      ? { id, index, trigger: event.currentTarget }
      : null;
    action(id);
  };

  const submitFiles = (source: FileList | null) => {
    if (!source || remaining === 0) return;
    const sourceFiles = Array.from(source);
    const acceptedFiles = sourceFiles.filter((file) => accepts(file, accept));
    const capacity = multiple ? remaining : Math.min(1, remaining);
    const unsupported = acceptedFiles.length < sourceFiles.length;
    const exceedsCapacity = acceptedFiles.length > capacity;
    setRejection(
      unsupported || exceedsCapacity
        ? { unsupported, capacity: exceedsCapacity ? capacity : null }
        : null,
    );
    const files = acceptedFiles
      .slice(0, capacity);
    if (files.length > 0) onFiles(files);
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    submitFiles(event.target.files);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    submitFiles(event.dataTransfer.files);
  };

  return (
    <div ref={ref} className={`w-full max-w-[430px] ${className}`}>
      <div
        data-upload-drop-zone
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        }}
        onDrop={onDrop}
        className={`flex min-h-16 items-center gap-3 rounded-[12px] border border-dashed px-3 py-2.5 transition-[background-color,border-color] duration-150 ${
          dragging
            ? "border-[#4568FF] bg-[#4568FF]/[0.06] dark:border-[#93B0FF] dark:bg-[#93B0FF]/[0.08]"
            : "border-stone-300 bg-stone-50 dark:border-white/[0.2] dark:bg-white/[0.04]"
        }`}
      >
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-[9px] bg-white text-stone-500 shadow-[0_1px_3px_rgba(28,25,23,0.12)] dark:bg-[#252522] dark:text-stone-400 dark:shadow-[0_1px_3px_rgba(0,0,0,0.45)]">
          <svg viewBox="0 0 18 18" width="16" height="16" fill="none">
            <path d="M9 12V3m0 0L5.5 6.5M9 3l3.5 3.5M3 11v2.5A1.5 1.5 0 0 0 4.5 15h9a1.5 1.5 0 0 0 1.5-1.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-[13px] font-medium text-stone-800 dark:text-stone-100">{label}</strong>
          <span
            role={rejection ? "alert" : undefined}
            className={`mt-0.5 block text-[11.5px] ${
              rejection
                ? "text-[#8C4B35] dark:text-[#E2A38A]"
                : "text-stone-500 dark:text-stone-300"
            }`}
          >
            {rejection
              ? [
                  rejection.unsupported ? copy.unsupported : null,
                  rejection.capacity !== null ? copy.limit(rejection.capacity) : null,
                ].filter((message): message is string => message !== null).join(" ")
              : remaining > 0
                ? copy.drop(remaining)
                : copy.full}
          </span>
        </span>
        <input
          ref={input}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={remaining === 0}
          aria-label={label}
          tabIndex={-1}
          onChange={onInput}
          className="sr-only"
        />
        <button
          ref={chooseButton}
          type="button"
          disabled={remaining === 0}
          onClick={() => input.current?.click()}
          className="h-11 shrink-0 rounded-[9px] border border-stone-200 bg-white px-3 text-[12.5px] font-medium text-stone-700 outline-none transition-[background-color,border-color] duration-150 hover:bg-stone-100 focus-visible:border-[#4568FF] disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/[0.16] dark:bg-[#252522] dark:text-stone-200 dark:hover:bg-white/10 dark:focus-visible:border-[#93B0FF]"
        >
          {copy.choose}
        </button>
      </div>

      <ul aria-label={copy.queue} className="mt-2 space-y-1.5">
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <UploadRow
              key={item.id}
              item={item}
              rowRef={(node) => {
                if (node) rowRefs.current.set(item.id, node);
                else rowRefs.current.delete(item.id);
              }}
              onRemove={onRemove ? (event) => requestRowAction(event, item.id, index, onRemove) : undefined}
              onRetry={onRetry ? (event) => requestRowAction(event, item.id, index, onRetry) : undefined}
              reduced={reduced}
              animateIndeterminate={active}
              copy={copy}
            />
          ))}
        </AnimatePresence>
      </ul>
      <span className="sr-only" role="status" aria-live="polite">
        {copy.summary(items.filter((item) => item.status === "complete").length, items.length)}
      </span>
    </div>
  );
}

function UploadRow({
  item,
  rowRef,
  onRemove,
  onRetry,
  reduced,
  animateIndeterminate,
  copy,
}: {
  item: UploadItem;
  rowRef: (node: HTMLLIElement | null) => void;
  onRemove?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  onRetry?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  reduced: boolean;
  animateIndeterminate: boolean;
  copy: UploadQueueCopy;
}) {
  const progress = Math.min(100, Math.max(0, item.progress ?? 0));
  const complete = item.status === "complete";
  const error = item.status === "error";
  const unknown = item.status === "uploading" && item.progress === undefined;
  const hasActions = (error && Boolean(onRetry)) || Boolean(onRemove);
  const status = complete ? copy.complete : error ? item.error ?? copy.failed : item.status === "uploading" ? item.progress === undefined ? copy.uploading : `${Math.round(progress)}%` : copy.queued;

  return (
    <motion.li
      ref={rowRef}
      layout={!reduced}
      initial={reduced ? { opacity: 0 } : { opacity: 0, transform: "translate3d(0, 8px, 0)" }}
      animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, transform: "translate3d(12px, 0, 0)", transition: LEAVE }}
      transition={reduced ? INSTANT : ROW}
      className={`relative overflow-hidden rounded-[11px] border bg-white px-3 dark:bg-[#1D1D1A] ${
        error ? "border-[#93664F]/50 dark:border-[#C99078]/50" : "border-stone-200 dark:border-white/[0.16]"
      } ${complete ? "py-0" : "py-1.5"}`}
    >
      <div className="flex min-h-11 items-center gap-2.5">
        <span aria-hidden="true" className={`grid size-8 shrink-0 place-items-center rounded-[8px] ${complete ? "bg-[#55745D]/[0.12] text-[#55745D] dark:bg-[#87A88F]/[0.14] dark:text-[#87A88F]" : error ? "bg-[#93664F]/[0.12] text-[#93664F] dark:bg-[#C99078]/[0.14] dark:text-[#C99078]" : "bg-stone-100 text-stone-500 dark:bg-white/[0.08] dark:text-stone-400"}`}>
          {complete ? (
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="m3.5 8.2 2.7 2.7 6.3-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M4 2.5h5l3 3v8H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M9 2.5v3h3" stroke="currentColor" strokeWidth="1.3" /></svg>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <strong className="truncate text-[12.5px] font-medium text-stone-800 dark:text-stone-100">{item.name}</strong>
            <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-stone-500 dark:text-stone-400">{status}</span>
          </span>
          {!complete ? <span className="mt-0.5 block text-[10.5px] text-stone-600 dark:text-stone-300">{formatBytes(item.size)}</span> : null}
        </span>
        {hasActions ? (
          <span className="flex shrink-0 items-center gap-0.5">
            {error && onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                aria-label={`${copy.retry} ${item.name}`}
                className="h-11 shrink-0 rounded-[8px] px-2.5 text-[12px] font-medium text-stone-700 outline-none transition-colors duration-150 hover:bg-stone-100 focus-visible:shadow-[inset_0_0_0_1px_#4568FF] dark:text-stone-200 dark:hover:bg-white/10 dark:focus-visible:shadow-[inset_0_0_0_1px_#93B0FF]"
              >
                {copy.retry}
              </button>
            ) : null}
            {onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`${copy.remove} ${item.name}`}
                className="grid size-11 shrink-0 place-items-center rounded-[8px] text-stone-500 outline-none transition-colors duration-150 hover:bg-stone-100 hover:text-stone-800 focus-visible:shadow-[inset_0_0_0_1px_#4568FF] dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100 dark:focus-visible:shadow-[inset_0_0_0_1px_#93B0FF]"
              >
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </button>
            ) : null}
          </span>
        ) : null}
      </div>
      {!complete && !error ? (
        <div
          role="progressbar"
          aria-label={`${copy.progress} ${item.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={unknown ? undefined : Math.round(progress)}
          aria-valuetext={unknown ? copy.uploading : `${Math.round(progress)}%`}
          className="absolute inset-x-3 bottom-0 h-[2px] overflow-hidden rounded-full bg-stone-100 dark:bg-white/10"
        >
          {unknown ? (
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-[#4568FF] dark:bg-[#93B0FF]"
              animate={reduced || !animateIndeterminate ? { transform: "translate3d(0,0,0)" } : { transform: ["translate3d(-110%,0,0)", "translate3d(270%,0,0)"] }}
              transition={reduced || !animateIndeterminate ? INSTANT : { duration: 1.15, ease: "linear", repeat: Infinity }}
            />
          ) : (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 origin-left rounded-full bg-[#4568FF] dark:bg-[#93B0FF]"
              initial={false}
              animate={{ scaleX: progress / 100 }}
              transition={reduced ? INSTANT : FILL}
            />
          )}
        </div>
      ) : null}
    </motion.li>
  );
}
