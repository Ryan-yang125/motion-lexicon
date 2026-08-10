"use client";

import { useState } from "react";
import { UploadQueue, type UploadItem } from "@/registry/components/upload-queue";

const initial: UploadItem[] = [
  { id: "a", name: "hero-final.webp", size: 1420000, status: "uploading", progress: 68 },
  { id: "b", name: "brand-notes.pdf", size: 820000, status: "complete", progress: 100 },
  { id: "c", name: "intro.mov", size: 18400000, status: "error", error: "Connection lost" },
];

export function UploadQueueDemo() {
  const [items, setItems] = useState(initial);

  return (
    <div className="mx-auto h-[250px] w-full max-w-[440px] overflow-y-auto pr-1">
      <UploadQueue
        items={items}
        maxFiles={5}
        accept="image/*,video/*,.pdf"
        onFiles={(files) => {
          setItems((current) => [
            ...files.map((file, index) => ({
              id: `${file.name}-${file.lastModified}-${index}`,
              name: file.name,
              size: file.size,
              status: "queued" as const,
            })),
            ...current,
          ].slice(0, 5));
        }}
        onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
        onRetry={(id) => setItems((current) => current.map((item) => item.id === id ? { ...item, status: "queued", error: undefined } : item))}
      />
    </div>
  );
}
