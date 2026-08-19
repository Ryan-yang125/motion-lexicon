"use client";

import { useState } from "react";
import { StreamingAnswer } from "@/registry/components/streaming-answer";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function StreamingAnswerDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [key, setKey] = useState(0);
  return <div role="group" aria-label={demoText("streaming-answer", locale)} className="mx-auto w-full max-w-[500px] rounded-[16px] bg-[#f2f6fb] p-3 shadow-[0_18px_38px_-30px_rgba(24,57,82,.5)]" onDoubleClick={() => setKey((value) => value + 1)}><StreamingAnswer key={key} label={demoValue(locale, "研究结论", "Research answer")} streamingLabel={demoValue(locale, "生成中", "Streaming")} sourcesLabel={(count) => demoValue(locale, `${count} 个来源`, `${count} sources`)} text={demoValue(locale, "三个高意图页面贡献了本周大部分自然增长。建议保留产品页结构，并把下一轮实验集中到示例质量和首次复制体验。", "Three high-intent pages drove most organic growth this week. Keep the product-page structure and focus the next experiment on example quality and the first-copy experience.")} sources={[{ id: "a", title: demoValue(locale, "搜索表现", "Search performance"), domain: "analytics" }, { id: "b", title: demoValue(locale, "组件使用记录", "Component usage"), domain: "events" }]} followUps={[demoValue(locale, "展开实验计划", "Draft the experiment"), demoValue(locale, "查看页面明细", "Show page details")]} /></div>;
}
