"use client";
import type { DemoLocaleProps } from "../demo-locale";
import { MediaEditorialBlock } from "@/registry/blocks/media-editorial";
export function MediaEditorialDemo({ locale = "en" }: DemoLocaleProps = {}) { return <MediaEditorialBlock locale={locale} />; }
