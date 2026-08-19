"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { KanbanBoard } from "@/registry/components/kanban-board";

export function KanbanBoardDemo({ locale = "en" }: DemoLocaleProps = {}) { return <KanbanBoard label={demoValue(locale, "发布看板", "Release board")} columns={[{ id: "draft", title: demoValue(locale, "草稿", "Draft") }, { id: "review", title: demoValue(locale, "评审", "Review") }, { id: "ready", title: demoValue(locale, "就绪", "Ready") }]} cards={[{ id: "motion", title: demoValue(locale, "滚动叙事", "Scroll narrative"), detail: "Hero", columnId: "draft" }, { id: "type", title: demoValue(locale, "标题系统", "Heading system"), detail: "Type", columnId: "review" }, { id: "registry", title: demoValue(locale, "Registry 输出", "Registry output"), detail: "Build", columnId: "ready" }]} />; }
