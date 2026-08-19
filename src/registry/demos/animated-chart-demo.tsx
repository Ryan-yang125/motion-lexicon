"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { AnimatedChart } from "@/registry/components/animated-chart";

export function AnimatedChartDemo({ locale = "en" }: DemoLocaleProps = {}) { return <AnimatedChart label={demoValue(locale, "阅读趋势", "Reading trend")} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]} series={[{ id: "readers", label: demoValue(locale, "读者", "Readers"), values: [22, 41, 36, 63, 58, 88], color: "#4568FF" }, { id: "saves", label: demoValue(locale, "收藏", "Saves"), values: [12, 24, 19, 34, 43, 57], color: "#57724f" }]} />; }
