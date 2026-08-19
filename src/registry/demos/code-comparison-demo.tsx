"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import { CodeComparison, type CodeComparisonItem } from "@/registry/components/code-comparison";

const options: readonly CodeComparisonItem[] = [
  { id: "static", label: "Static", meta: "A / B", description: "The baseline holds the first frame with no state transition.", code: `const Panel = () => (\n  <section className="panel">\n    <h2>Signal report</h2>\n    <button>Open</button>\n  </section>\n);`, preview: <div aria-hidden className="grid size-full place-items-center p-5"><div className="w-full rounded-xl border border-white/15 bg-[#202634] p-4 text-[#edf3ff]"><span className="font-mono text-[8px] tracking-[.14em] text-[#a8c8ff]/70">SIGNAL REPORT</span><strong className="mt-8 block text-[20px] tracking-[-.04em]">A calm first frame.</strong><span className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-2 text-[10px]">Open report</span></div></div> },
  { id: "motion", label: "Motion", meta: "A / B", description: "Selection and panel content share one short, interruptible transition.", code: `const Panel = ({ open }) => (\n  <motion.section\n    layout\n    animate={{ opacity: open ? 1 : .72 }}\n    transition={{ duration: .2 }}\n  >\n    <Report open={open} />\n  </motion.section>\n);`, preview: <div aria-hidden className="grid size-full place-items-center p-5"><div className="w-full -rotate-2 rounded-xl border border-[#a9cfff]/35 bg-[#3a5d92] p-4 text-[#f4f8ff] shadow-[0_18px_35px_-20px_rgba(0,0,0,.8)]"><span className="font-mono text-[8px] tracking-[.14em] text-[#d9ebff]/75">SIGNAL REPORT</span><strong className="mt-8 block text-[20px] tracking-[-.04em]">State keeps its place.</strong><span className="mt-3 inline-flex rounded-full bg-[#e3f0ff] px-3 py-2 text-[10px] text-[#243e65]">Open report</span></div></div> },
];

export function CodeComparisonDemo({ locale = "en" }: DemoLocaleProps = {}) { return <div role="group" aria-label={demoText("code-comparison", locale)} className="mx-auto w-full max-w-[620px]"><CodeComparison items={options} label={demoValue(locale, "状态与表现", "State and presentation")} /></div>; }
