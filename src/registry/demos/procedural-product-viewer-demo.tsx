"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { ProceduralProductViewer } from "@/registry/components/procedural-product-viewer";

export function ProceduralProductViewerDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("procedural-product-viewer", locale)} className="mx-auto w-full max-w-[440px]">
      <ProceduralProductViewer
        productName="Arc One"
        detailLabel={demoValue(locale, "精密旋钮", "Precision dial")}
        labels={{
          interactiveViewer: demoValue(locale, "交互式三维查看器。拖动或使用方向键旋转。", "Interactive 3D viewer. Drag or use arrow keys to rotate."),
          staticPreview: demoValue(locale, "静态产品预览。", "Static product preview."),
          objectStudy: demoValue(locale, "物件研究", "Object study"),
          dragToTurn: demoValue(locale, "拖动旋转", "DRAG TO TURN"),
          staticBadge: demoValue(locale, "静态预览", "STATIC PREVIEW"),
          activateInteractive: demoValue(locale, "启用交互", "Explore 3D"),
          detailDescription: demoValue(locale, "带有轻柔刻度感的精密控制器。", "Machined control with a quiet detent."),
          resetView: demoValue(locale, "重置视角", "Reset view"),
        }}
      />
    </div>
  );
}
