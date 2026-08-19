"use client";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import { GridDistortion } from "@/registry/components/grid-distortion";
export function GridDistortionDemo({ locale = "en" }: DemoLocaleProps = {}) { return <div role="group" aria-label={demoText("grid-distortion", locale)} className="mx-auto w-full max-w-[600px]"><GridDistortion label={demoValue(locale, "色场网格", "Chromatic grid")} alt={demoValue(locale, "紫色场景上可弯曲的网格", "A bendable grid on a violet field")} art={<div aria-hidden className="relative size-full bg-[radial-gradient(circle_at_72%_28%,#e0adff_0_8%,transparent_8.5%),linear-gradient(135deg,#1a2747,#4d275d)]"><span className="absolute bottom-[16%] left-[9%] h-px w-[75%] bg-[#ffd796]/65" /></div>} /></div>; }
