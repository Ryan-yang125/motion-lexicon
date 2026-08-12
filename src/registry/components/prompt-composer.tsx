"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

export type ComposerSource = {
  id: string;
  label: string;
  type: "file" | "web" | "app";
  connected?: boolean;
};
export type PromptComposerProps = {
  sources?: readonly ComposerSource[];
  model?: string;
  placeholder?: string;
  sendLabel?: string;
  addSourcesLabel?: string;
  dictationLabel?: string;
  onSubmit?: (prompt: string, sourceIds: string[]) => void;
  className?: string;
};

export function PromptComposer({
  sources = [],
  model = "Agent 5",
  placeholder = "Ask the agent to…",
  sendLabel = "Send",
  addSourcesLabel = "Add sources",
  dictationLabel = "Start dictation",
  onSubmit,
  className = "",
}: PromptComposerProps) {
  const [prompt, setPrompt] = useState("");
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const reduced = useReducedMotion();
  const send = () => {
    const value = prompt.trim();
    if (!value) return;
    onSubmit?.(value, selected);
    setPrompt("");
    setSent(true);
    window.setTimeout(() => setSent(false), 1200);
  };

  return (
    <section
      className={`relative w-full rounded-[22px] border border-zinc-200 bg-white p-2 text-zinc-950 shadow-[0_24px_60px_-34px_rgba(24,24,27,.55)] dark:border-white/10 dark:bg-[#17191d] dark:text-zinc-50 ${className}`}
    >
      {selected.length ? (
        <div className="flex flex-wrap gap-1.5 px-2 pt-2">
          {selected.map((id) => {
            const source = sources.find((item) => item.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  setSelected((current) =>
                    current.filter((value) => value !== id),
                  )
                }
                className="min-h-11 rounded-full bg-blue-50 px-2.5 text-[10px] text-[#4568ff] dark:bg-[#4568ff]/10 dark:text-[#93b0ff]"
              >
                @{source?.label ?? id} ×
              </button>
            );
          })}
        </div>
      ) : null}
      <textarea
        ref={area}
        value={prompt}
        rows={3}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            send();
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-h-20 w-full resize-none bg-transparent px-3 py-3 text-[14px] leading-6 outline-none placeholder:text-zinc-400"
      />
      <div className="flex items-center gap-1 border-t border-zinc-100 px-1 pt-2 dark:border-white/8">
        <button
          type="button"
          aria-expanded={menu}
          aria-label={addSourcesLabel}
          onClick={() => setMenu((value) => !value)}
          className="grid size-11 place-items-center rounded-full text-lg text-zinc-500 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff] dark:hover:bg-white/5"
        >
          ＋
        </button>
        <button
          type="button"
          className="min-h-11 rounded-full px-3 text-[10px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5"
        >
          {model}⌄
        </button>
        <button
          type="button"
          aria-label={dictationLabel}
          className="ml-auto grid size-11 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff] dark:hover:bg-white/5"
        >
          ◉
        </button>
        <motion.button
          type="button"
          aria-label={sendLabel}
          disabled={!prompt.trim()}
          onClick={send}
          whileTap={reduced ? undefined : { scale: 0.94 }}
          className={`grid size-11 place-items-center rounded-full text-white outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff] disabled:opacity-30 ${sent ? "bg-emerald-500" : "bg-zinc-950 dark:bg-zinc-50 dark:text-zinc-950"}`}
        >
          {sent ? "✓" : "↑"}
        </motion.button>
      </div>
      <AnimatePresence>
        {menu ? (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            className="absolute bottom-14 left-3 z-20 w-[min(300px,calc(100%-24px))] rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#202228]"
          >
            {sources.map((source) => (
              <button
                key={source.id}
                type="button"
                onClick={() =>
                  setSelected((current) =>
                    current.includes(source.id)
                      ? current.filter((id) => id !== source.id)
                      : [...current, source.id],
                  )
                }
                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-zinc-50 dark:hover:bg-white/5"
              >
                <span className="grid size-7 place-items-center rounded-lg bg-zinc-100 text-[9px] uppercase text-zinc-500 dark:bg-white/5">
                  {source.type.slice(0, 1)}
                </span>
                <span className="text-[11px] font-medium">{source.label}</span>
                <span
                  className={`ml-auto size-2 rounded-full ${selected.includes(source.id) ? "bg-[#4568ff]" : source.connected ? "bg-emerald-500" : "bg-zinc-200"}`}
                />
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
