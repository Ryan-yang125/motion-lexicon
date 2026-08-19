"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { NetworkGlobe, type NetworkGlobeNode } from "@/registry/components/network-globe";

const nodes: readonly NetworkGlobeNode[] = [
  { id: "sf", label: "San Francisco", latitude: 37.77, longitude: -122.42, value: "28 ms", color: "#ffb05e" },
  { id: "ldn", label: "London", latitude: 51.51, longitude: -0.13, value: "41 ms", color: "#7bdde3" },
  { id: "sin", label: "Singapore", latitude: 1.35, longitude: 103.82, value: "33 ms", color: "#b6edc8" },
  { id: "syd", label: "Sydney", latitude: -33.87, longitude: 151.21, value: "37 ms", color: "#d5a5ff" },
  { id: "hel", label: "Helsinki", latitude: 60.17, longitude: 24.94, value: "46 ms", color: "#ff8d87" },
];

export function NetworkGlobeDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("network-globe", locale)} className="mx-auto w-full max-w-[440px]">
      <NetworkGlobe
        nodes={nodes.map((node) => ({ ...node, label: locale === "zh" ? ({ sf: "旧金山", ldn: "伦敦", sin: "新加坡", syd: "悉尼", hel: "赫尔辛基" }[node.id] ?? node.label) : node.label }))}
        label={demoValue(locale, "潮汐网络", "Tidal network")}
        interactiveHint={demoValue(locale, "拖动或使用方向键旋转。", "Drag or use arrow keys to rotate.")}
        staticHint={demoValue(locale, "静态网络预览。", "Static network preview.")}
        activateLabel={demoValue(locale, "启用交互", "Explore 3D")}
        liveLabel={demoValue(locale, "实时网络", "Live network")}
        staticLabel={demoValue(locale, "静态网络", "Static network")}
        onlineLabel={demoValue(locale, "在线", "Online")}
        emptyLabel={demoValue(locale, "暂无网络节点", "No network nodes available.")}
      />
    </div>
  );
}
