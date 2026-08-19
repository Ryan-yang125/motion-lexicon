"use client";
import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { ResizableSidebar } from "@/registry/components/resizable-sidebar";
export function ResizableSidebarDemo({ locale = "en" }: DemoLocaleProps = {}) { return <ResizableSidebar label={demoValue(locale, "项目导航", "Project navigation")} items={[{ id: "overview", label: demoValue(locale, "概览", "Overview"), icon: "◌" }, { id: "notes", label: demoValue(locale, "笔记", "Notes"), icon: "≡" }, { id: "files", label: demoValue(locale, "文件", "Files"), icon: "□" }]} />; }
