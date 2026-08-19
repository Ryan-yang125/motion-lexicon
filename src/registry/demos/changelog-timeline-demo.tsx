"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { ChangelogTimeline } from "@/registry/components/changelog-timeline";

export function ChangelogTimelineDemo({ locale = "en" }: DemoLocaleProps = {}) { return <ChangelogTimeline label={demoValue(locale, "版本记录", "Release notes")} entries={[{ id: "6", version: "v6.0", date: "Aug 2026", title: demoValue(locale, "更大的画布", "A larger canvas"), description: demoValue(locale, "新的组件系列让产品、媒体和文字拥有更清楚的动作语言。", "New component families give product, media, and type a clearer language of movement."), tag: "Latest" }, { id: "5", version: "v5.0", date: "Aug 2025", title: demoValue(locale, "可安装的动效", "Installable motion"), description: demoValue(locale, "首个 Registry 发布让预览与源码保持一致。", "The first Registry release kept preview and source aligned.") }, { id: "4", version: "v4.0", date: "May 2025", title: demoValue(locale, "工作流优先", "Workflow first"), description: demoValue(locale, "产品交互成为目录的核心。", "Product interaction became the center of the catalog.") }]} />; }
