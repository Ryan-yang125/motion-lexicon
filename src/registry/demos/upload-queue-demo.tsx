"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { UploadQueue, type UploadItem } from "@/registry/components/upload-queue";

export function UploadQueueDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [items, setItems] = useState<UploadItem[]>(() => [
    { id: "a", name: "hero-final.webp", size: 1420000, status: "uploading", progress: 68 },
    { id: "b", name: "brand-notes.pdf", size: 820000, status: "complete", progress: 100 },
    { id: "c", name: "intro.mov", size: 18400000, status: "error", error: demoValue(locale, "连接中断", "Connection lost") },
  ]);

  return (
    <div role="group" aria-label={demoText("upload-queue", locale)} className="mx-auto h-[250px] w-full max-w-[440px] overflow-y-auto rounded-[16px] bg-[#eef4f8] p-3 pr-1">
      <UploadQueue
        items={items}
        label={demoValue(locale, "上传文件", "Upload files")}
        copy={locale === "zh" ? {
          drop: (remaining) => `拖放到这里，最多选择 ${remaining} 个`, full: "队列已满", choose: "选择文件", queue: "上传队列",
          unsupported: "不支持此文件类型",
          limit: (remaining) => `只能再添加 ${remaining} 个文件`,
          complete: "已完成", failed: "上传失败", uploading: "上传中", queued: "等待上传", retry: "重试", remove: "移除",
          progress: "上传进度", summary: (complete, total) => `${total} 个文件中 ${complete} 个已上传`,
        } : undefined}
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
