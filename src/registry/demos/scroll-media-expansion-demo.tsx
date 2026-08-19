"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { ScrollMediaExpansion } from "@/registry/components/scroll-media-expansion";

export function ScrollMediaExpansionDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <ScrollMediaExpansion label={demoValue(locale, "滚动媒体扩展演示", "Scroll media expansion demo")} slides={[
    { id: "harbor", eyebrow: demoValue(locale, "海岸档案", "Coastal archive"), title: demoValue(locale, "给旅程留出更大的画面。", "Leave more room for the journey."), description: demoValue(locale, "从一个安静的编辑卡片开始，让画面随着阅读进入完整视野。", "Begin with a quiet editorial card, then let the landscape take the entire frame."), image: "/assets/editorial/scroll-lighthouse.jpg", imageAlt: demoValue(locale, "海岸上的灯塔", "Lighthouse on the coast") },
    { id: "garden", eyebrow: demoValue(locale, "植被研究", "Plant study"), title: demoValue(locale, "光线成为空间的一部分。", "Light becomes part of the room."), description: demoValue(locale, "层次、材质和柔和的色彩为产品叙事提供停留的理由。", "Layers, material, and a warm palette give the product story somewhere to pause."), image: "/assets/editorial/scroll-coastline.jpg", imageAlt: demoValue(locale, "开阔的海岸线", "Open coastline") },
    { id: "studio", eyebrow: demoValue(locale, "工作室", "Studio"), title: demoValue(locale, "把细节带到前景。", "Bring the detail into the foreground."), description: demoValue(locale, "全幅媒体保留上下文，同时为后续操作建立清楚的焦点。", "Full-bleed media keeps context while establishing a clear focal point for the next action."), image: "/assets/editorial/scroll-architecture.jpg", imageAlt: demoValue(locale, "混凝土建筑细节", "Concrete architecture detail") },
  ]} />;
}
