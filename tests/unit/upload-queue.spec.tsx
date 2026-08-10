// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UploadQueue, type UploadItem } from "@/registry/components/upload-queue";

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  useReducedMotion: () => true,
}));

const failed: UploadItem = {
  id: "failed-upload",
  name: "launch-film.mp4",
  status: "error",
  error: "Connection lost",
};

describe("UploadQueue failed items", () => {
  it("offers independent retry and remove actions when both callbacks are provided", () => {
    const onRetry = vi.fn();
    const onRemove = vi.fn();

    render(
      <UploadQueue
        items={[failed]}
        onFiles={vi.fn()}
        onRetry={onRetry}
        onRemove={onRemove}
      />,
    );

    const retry = screen.getByRole("button", { name: `Retry ${failed.name}` });
    const remove = screen.getByRole("button", { name: `Remove ${failed.name}` });
    expect(retry).toHaveClass("h-11");
    expect(remove).toHaveClass("size-11");

    fireEvent.click(retry);
    fireEvent.click(remove);

    expect(onRetry).toHaveBeenCalledOnce();
    expect(onRetry).toHaveBeenCalledWith(failed.id);
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledWith(failed.id);
  });

  it("releases controlled queue capacity after a failed item is removed", () => {
    const onRemove = vi.fn();
    const { rerender } = render(
      <UploadQueue
        items={[failed]}
        maxFiles={1}
        onFiles={vi.fn()}
        onRemove={onRemove}
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Choose" })).toBeDisabled();
    expect(screen.getByLabelText("Upload files")).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: `Remove ${failed.name}` }));
    expect(onRemove).toHaveBeenCalledWith(failed.id);

    rerender(
      <UploadQueue
        items={[]}
        maxFiles={1}
        onFiles={vi.fn()}
        onRemove={onRemove}
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Choose" })).toBeEnabled();
    expect(screen.getByLabelText("Upload files")).toBeEnabled();
    expect(screen.getByText("Drop here or choose up to 1")).toBeInTheDocument();
  });
});
