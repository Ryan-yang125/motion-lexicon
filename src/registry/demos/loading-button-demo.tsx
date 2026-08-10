"use client";

import { LoadingButton } from "@/registry/components/loading-button";

function publish() {
  return new Promise((resolve) => setTimeout(resolve, 1600));
}

export function LoadingButtonDemo() {
  return (
    <div className="flex justify-center">
      <LoadingButton onAction={publish} successLabel="Published">
        Publish
      </LoadingButton>
    </div>
  );
}
