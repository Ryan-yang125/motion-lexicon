"use client";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import { AuroraCanvas } from "@/registry/components/aurora-canvas";
export function AuroraCanvasDemo({ locale = "en" }: DemoLocaleProps = {}) { return <div role="group" aria-label={demoText("aurora-canvas", locale)} className="mx-auto w-full max-w-[620px]"><AuroraCanvas label={demoValue(locale, "潮汐光场", "Tidal aurora field")}><div className="p-6 text-[#f3fff9]"><span className="font-mono text-[9px] tracking-[.17em] text-[#c5eee4]/72">NORTHLINE / ATMOSPHERE</span><strong className="mt-24 block max-w-[12ch] font-serif text-[39px] leading-[.86] tracking-[-.07em]">{demoValue(locale, "停留在光里", "Stay in the light")}</strong></div></AuroraCanvas></div>; }
