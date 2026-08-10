"use client";

import { ProceduralProductViewer } from "@/registry/components/procedural-product-viewer";

export function ProceduralProductViewerDemo() {
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <ProceduralProductViewer productName="Arc One" detailLabel="Precision dial" />
    </div>
  );
}
