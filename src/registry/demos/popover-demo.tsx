"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useRef, useState } from "react";
import { Popover } from "@/registry/components/popover";

const people = [
  {
    id: "tl",
    first: "Ada",
    name: "Ada Lovelace",
    role: "Layout engine",
    at: "left-3 top-3",
  },
  {
    id: "tr",
    first: "Grace",
    name: "Grace Hopper",
    role: "Compilers",
    at: "right-3 top-3",
  },
  {
    id: "bl",
    first: "Alan",
    name: "Alan Kay",
    role: "Research",
    at: "left-3 bottom-3",
  },
  {
    id: "br",
    first: "Barbara",
    name: "Barbara Liskov",
    role: "Platform",
    at: "right-3 bottom-3",
  },
];

export function PopoverDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const field = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div role="group" aria-label={demoText("popover", locale)} ref={field} className="relative h-full w-full">
      {people.map((person) => (
        <div key={person.id} className={`absolute ${person.at}`}>
          <Popover
            label={demoValue(locale, `${person.name} 的资料`, `${person.name}, profile`)}
            side="top"
            boundary={field}
            open={open === person.id}
            onOpenChange={(next) => setOpen(next ? person.id : null)}
            trigger={person.first}
          >
            <div className="w-[196px]">
              <p className="text-[13px] font-medium text-stone-700 dark:text-stone-100">
                {person.name}
              </p>
              <p className="mt-0.5 text-[11.5px] text-stone-400 dark:text-stone-500">
                {demoValue(locale, `${person.role} · 2019 年加入`, `${person.role} · joined 2019`)}
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-stone-500 dark:text-stone-400">
                {demoValue(locale, "有两个评审待处理。周二刚发布文档框架。", "Two reviews open. Last shipped the docs shell on Tuesday.")}
              </p>
            </div>
          </Popover>
        </div>
      ))}
    </div>
  );
}
