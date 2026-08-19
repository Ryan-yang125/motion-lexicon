"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { ExpandableCard } from "@/registry/components/expandable-card";

export function ExpandableCardDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <ExpandableCard label={demoValue(locale, "开放阅读", "Open reading")} items={[
    { id: "clay", title: demoValue(locale, "土的温度", "The temperature of clay"), summary: demoValue(locale, "在午后工作室记录一只手的节奏。", "A studio note about the rhythm of one hand in the afternoon."), detail: demoValue(locale, "折叠状态保留完整的构图；展开时将文字、图像和来源带入同一块阅读表面。", "The closed state keeps a complete composition; expansion brings image, text, and provenance into one reading surface."), image: "/assets/editorial/expandable-pottery-wheel.jpg", imageAlt: demoValue(locale, "陶艺工作台", "Pottery workbench"), meta: demoValue(locale, "材料", "Material") },
    { id: "table", title: demoValue(locale, "桌面上的光", "Light on the table"), summary: demoValue(locale, "一组适合慢下来看的日常物件。", "A set of everyday objects made to be viewed slowly."), detail: demoValue(locale, "共享布局让每张卡片在自己的位置上展开，周围的内容仍然构成可读的上下文。", "Shared layout lets every card open from its own place while neighboring content remains readable context."), image: "/assets/editorial/expandable-cup-shelf.jpg", imageAlt: demoValue(locale, "木架上的陶杯", "Ceramic cup on a wooden shelf"), meta: demoValue(locale, "光线", "Light") },
    { id: "print", title: demoValue(locale, "印刷的边缘", "The edge of print"), summary: demoValue(locale, "纸张、墨色和留白形成可触摸的阅读节奏。", "Paper, ink, and whitespace create a tactile reading rhythm."), detail: demoValue(locale, "内容的展开保持来源明确，卡片也仍然可以回到轻量的浏览密度。", "The expansion keeps provenance clear, and cards can still return to a lightweight browsing density."), image: "/assets/editorial/expandable-bowls.jpg", imageAlt: demoValue(locale, "一组手作陶碗", "A group of handmade ceramic bowls"), meta: demoValue(locale, "纸张", "Paper") },
  ]} />;
}
