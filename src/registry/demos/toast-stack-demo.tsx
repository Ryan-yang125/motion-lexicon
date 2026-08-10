"use client";

import { useState } from "react";
import { ToastStack, type ToastItem } from "@/registry/components/toast-stack";

const seed: ToastItem[] = [
  { id: "sync", title: "Changes synced", description: "Atlas workspace · just now", tone: "success" },
  { id: "comment", title: "New review note", description: "Mira mentioned you in Header", tone: "neutral" },
  { id: "export", title: "Export needs attention", description: "One image is missing", tone: "warning" },
];

export function ToastStackDemo() {
  const [items, setItems] = useState(seed);
  const [count, setCount] = useState(1);

  const add = () => {
    setItems((current) => [
      {
        id: `new-${count}`,
        title: `Build ${count} finished`,
        description: "Preview is ready to inspect",
        tone: "success",
      },
      ...current,
    ]);
    setCount((value) => value + 1);
  };

  return (
    <div className="mx-auto flex h-[250px] w-full max-w-[440px] flex-col items-center gap-3">
      <button
        type="button"
        onClick={add}
        className="mat-cap press h-11 rounded-[9px] px-4 text-[13px] font-medium text-ink"
      >
        Add notification
      </button>
      <ToastStack
        items={items}
        maxVisible={3}
        onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
      />
    </div>
  );
}
