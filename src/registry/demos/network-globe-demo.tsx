"use client";

import { NetworkGlobe, type NetworkGlobeNode } from "@/registry/components/network-globe";

const nodes: readonly NetworkGlobeNode[] = [
  { id: "sf", label: "San Francisco", latitude: 37.77, longitude: -122.42, value: "28 ms", color: "#4568FF" },
  { id: "ldn", label: "London", latitude: 51.51, longitude: -0.13, value: "41 ms", color: "#B3654A" },
  { id: "sin", label: "Singapore", latitude: 1.35, longitude: 103.82, value: "33 ms", color: "#73806B" },
];

export function NetworkGlobeDemo() {
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <NetworkGlobe nodes={nodes} label="Edge regions" />
    </div>
  );
}
