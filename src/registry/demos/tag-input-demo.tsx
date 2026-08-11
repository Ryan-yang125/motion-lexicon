"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { TagInput } from "@/registry/components/tag-input";

export function TagInputDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("tag-input", locale)} className="mx-auto h-[150px] w-full max-w-[420px]">
      <TagInput
        defaultValue={locale === "zh" ? ["动效", "焦点顺序"] : ["motion", "focus order"]}
        max={6}
        label={demoValue(locale, "主题", "Topics")}
        placeholder={demoValue(locale, "添加主题", "Add a topic")}
        hint={demoValue(locale, "回车添加 · 退格删除", "Enter adds · Backspace removes")}
        removeLabel={locale === "zh" ? (tag) => `删除${tag}` : undefined}
        copy={locale === "zh" ? {
          duplicate: (tag) => `${tag} 已在列表中。`,
          limit: (max) => `最多可添加 ${max} 个主题。`,
          invalid: (tag) => `${tag} 不能添加到这里。`,
          added: (added, latest, total) => `${added === 1 ? latest : `${added} 个主题`}已添加，共 ${total} 个。`,
          removed: (tag, remaining) => `${tag}已删除，还剩 ${remaining} 个。`,
          selected: (tag) => `已选中${tag}，再次按退格键删除。`,
        } : undefined}
      />
    </div>
  );
}
