// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { UploadQueue, type UploadItem } from "@/registry/components/upload-queue";

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  useReducedMotion: () => true,
}));

const failed: UploadItem = {
  id: "failed-upload",
  name: "launch-film.mp4",
  status: "error",
  error: "Connection lost",
};

describe("UploadQueue failed items", () => {
  it("reports unsupported dropped files and clears the error after a valid drop", () => {
    const onFiles = vi.fn();
    const { container } = render(
      <UploadQueue items={[]} accept="image/*" onFiles={onFiles} />,
    );
    const dropZone = container.querySelector("[data-upload-drop-zone]");
    expect(dropZone).not.toBeNull();

    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [new File(["notes"], "notes.txt", { type: "text/plain" })] },
    });
    expect(screen.getByRole("alert")).toHaveTextContent("This file type is not supported");
    expect(onFiles).not.toHaveBeenCalled();

    const image = new File(["image"], "cover.png", { type: "image/png" });
    fireEvent.drop(dropZone!, { dataTransfer: { files: [image] } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onFiles).toHaveBeenCalledWith([image]);
  });

  it("reports when a drop exceeds the remaining queue capacity", () => {
    const onFiles = vi.fn();
    const { container } = render(
      <UploadQueue items={[]} accept="image/*" maxFiles={1} onFiles={onFiles} />,
    );
    const first = new File(["first"], "first.png", { type: "image/png" });
    const second = new File(["second"], "second.png", { type: "image/png" });

    fireEvent.drop(container.querySelector("[data-upload-drop-zone]")!, {
      dataTransfer: { files: [first, second] },
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Only 1 more file can be added");
    expect(onFiles).toHaveBeenCalledWith([first]);
  });

  it("keeps the single-file rejection capacity stable after controlled items update", () => {
    const accepted: File[][] = [];

    function ControlledQueue() {
      const [items, setItems] = useState<UploadItem[]>([]);
      return (
        <UploadQueue
          items={items}
          multiple={false}
          maxFiles={8}
          onFiles={(files) => {
            accepted.push(files);
            setItems(files.map((file) => ({
              id: file.name,
              name: file.name,
              status: "queued",
            })));
          }}
        />
      );
    }

    const { container } = render(<ControlledQueue />);
    const first = new File(["first"], "first.png", { type: "image/png" });
    const second = new File(["second"], "second.png", { type: "image/png" });

    fireEvent.drop(container.querySelector("[data-upload-drop-zone]")!, {
      dataTransfer: { files: [first, second] },
    });

    expect(accepted).toEqual([[first]]);
    expect(screen.getByRole("alert")).toHaveTextContent("Only 1 more file can be added");
    expect(screen.getByText(first.name)).toBeInTheDocument();
  });

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

  it("restores Retry focus to the remaining action in the same controlled row", async () => {
    function ControlledQueue() {
      const [items, setItems] = useState<UploadItem[]>([failed]);
      return (
        <UploadQueue
          items={items}
          onFiles={vi.fn()}
          onRetry={(id) => setItems((current) => current.map((item) =>
            item.id === id ? { ...item, status: "queued", error: undefined } : item
          ))}
          onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
        />
      );
    }

    render(<ControlledQueue />);
    const retry = screen.getByRole("button", { name: `Retry ${failed.name}` });
    retry.focus();
    fireEvent.click(retry);

    await waitFor(() => expect(screen.getByRole("button", { name: `Remove ${failed.name}` })).toHaveFocus());
  });

  it("restores Remove focus by same index, previous row, then Choose", async () => {
    const first: UploadItem = { id: "first", name: "first.pdf", status: "complete" };
    const last: UploadItem = { id: "last", name: "last.pdf", status: "complete" };

    function ControlledQueue() {
      const [items, setItems] = useState<UploadItem[]>([first, failed, last]);
      return (
        <UploadQueue
          items={items}
          maxFiles={3}
          onFiles={vi.fn()}
          onRetry={vi.fn()}
          onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
        />
      );
    }

    const { rerender } = render(<ControlledQueue />);
    const removeFailed = screen.getByRole("button", { name: `Remove ${failed.name}` });
    removeFailed.focus();
    fireEvent.click(removeFailed);
    await waitFor(() => expect(screen.getByRole("button", { name: `Remove ${last.name}` })).toHaveFocus());

    rerender(
      <UploadQueue
        items={[first]}
        maxFiles={1}
        onFiles={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    const removeFirst = screen.getByRole("button", { name: `Remove ${first.name}` });
    removeFirst.focus();
    fireEvent.click(removeFirst);
    rerender(<UploadQueue items={[]} maxFiles={1} onFiles={vi.fn()} onRemove={vi.fn()} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Choose" })).toHaveFocus());
  });

  it("does not move focus for unrelated controlled item changes", () => {
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.focus();
    const { rerender } = render(
      <UploadQueue items={[failed]} onFiles={vi.fn()} onRetry={vi.fn()} onRemove={vi.fn()} />,
    );

    rerender(
      <UploadQueue
        items={[{ ...failed, progress: 20 }]}
        onFiles={vi.fn()}
        onRetry={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(outside).toHaveFocus();
    outside.remove();
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
