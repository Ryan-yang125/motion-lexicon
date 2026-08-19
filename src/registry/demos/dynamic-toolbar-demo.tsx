"use client";
import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { DynamicToolbar } from "@/registry/components/dynamic-toolbar";
export function DynamicToolbarDemo({ locale = "en" }: DemoLocaleProps = {}) { return <DynamicToolbar label={demoValue(locale, "编辑工具", "Editing tools")} actions={[{ id: "bold", label: demoValue(locale, "加粗", "Bold"), icon: "B" }, { id: "image", label: demoValue(locale, "图片", "Image"), icon: "◫" }, { id: "link", label: demoValue(locale, "链接", "Link"), icon: "↗" }]} />; }
