"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { ProceduralProductViewer } from "@/registry/components/procedural-product-viewer";

export function ProceduralProductViewerDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("procedural-product-viewer", locale)} className="mx-auto w-full max-w-[440px]">
      <ProceduralProductViewer
        productName="Arc One / 01"
        detailLabel={demoValue(locale, "黄铜刻度盘", "Brass detent dial")}
        accent="#dc774a"
        labels={{
          interactiveViewer: demoValue(locale, "交互式三维查看器。拖动或使用方向键旋转。", "Interactive 3D viewer. Drag or use arrow keys to rotate."),
          staticPreview: demoValue(locale, "静态产品预览。", "Static product preview."),
          objectStudy: demoValue(locale, "物件研究 · 北岸 01", "Object study · Northline 01"),
          dragToTurn: demoValue(locale, "拖动旋转", "DRAG TO TURN"),
          staticBadge: demoValue(locale, "静态预览", "STATIC PREVIEW"),
          activateInteractive: demoValue(locale, "启用交互", "Explore 3D"),
          detailDescription: demoValue(locale, "为缓慢、可触的声音控制而车制。", "Machined for slow, tactile sound control."),
          resetView: demoValue(locale, "重置视角", "Reset view"),
        }}
      />
    </div>
  );
}
