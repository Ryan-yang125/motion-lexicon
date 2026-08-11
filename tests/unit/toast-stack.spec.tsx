// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef, useState, type ReactNode, type RefObject } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastStack, type ToastItem } from "@/registry/components/toast-stack";

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  useReducedMotion: () => true,
}));

const existing: ToastItem = {
  id: "existing",
  title: "Existing notification",
  description: "Already in the stack",
};

const newest: ToastItem = {
  id: "newest",
  title: "Build finished",
  description: "Preview is ready",
};

const last: ToastItem = {
  id: "last",
  title: "Last notification",
};

function ControlledStack({
  initial = [newest, existing, last],
  returnFocusRef,
}: {
  initial?: ToastItem[];
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const [items, setItems] = useState(initial);
  return (
    <ToastStack
      items={items}
      returnFocusRef={returnFocusRef}
      onDismiss={(id) => setItems((current) => current.filter((item) => item.id !== id))}
    />
  );
}

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ToastStack announcements", () => {
  it("keeps an initially populated stack silent", () => {
    render(<ToastStack items={[existing]} onDismiss={vi.fn()} />);

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("announces a truly new first toast without replaying the existing toast after dismissal", () => {
    const { rerender } = render(<ToastStack items={[existing]} onDismiss={vi.fn()} />);

    rerender(<ToastStack items={[newest, existing]} onDismiss={vi.fn()} />);
    const status = screen.getByRole("status");
    const announcedNode = status.firstElementChild;
    expect(status).toHaveTextContent("Build finished. Preview is ready");

    rerender(<ToastStack items={[existing]} onDismiss={vi.fn()} />);
    expect(status.firstElementChild).toBe(announcedNode);
    expect(status).toHaveTextContent("Build finished. Preview is ready");
    expect(status).not.toHaveTextContent(existing.title);
  });

  it("announces the first toast added to an initially empty stack", () => {
    const { rerender } = render(<ToastStack items={[]} onDismiss={vi.fn()} />);

    rerender(<ToastStack items={[newest]} onDismiss={vi.fn()} />);
    expect(screen.getByRole("status")).toHaveTextContent("Build finished. Preview is ready");
  });
});

describe("ToastStack dismissal focus", () => {
  it("focuses the toast that takes the dismissed toast's index", () => {
    render(<ControlledStack />);
    const close = screen.getByRole("button", { name: "Dismiss Existing notification" });
    act(() => close.focus());

    fireEvent.keyDown(close, { key: "Enter" });

    expect(screen.getByRole("article", { name: last.title })).toHaveFocus();
  });

  it("focuses the previous toast after deleting the last item", () => {
    render(<ControlledStack />);
    const toast = screen.getByRole("article", { name: last.title });
    act(() => toast.focus());

    fireEvent.keyDown(toast, { key: "Delete" });

    expect(screen.getByRole("article", { name: existing.title })).toHaveFocus();
  });

  it("returns focus to the supplied trigger after dismissing its only toast", () => {
    const trigger = createRef<HTMLButtonElement>();
    render(
      <>
        <button ref={trigger} type="button">Open notifications</button>
        <ControlledStack initial={[existing]} returnFocusRef={trigger} />
      </>,
    );
    const toast = screen.getByRole("article", { name: existing.title });
    act(() => toast.focus());

    fireEvent.keyDown(toast, { key: "Escape" });

    expect(screen.getByRole("button", { name: "Open notifications" })).toHaveFocus();
  });

  it("does not steal focus when items are removed externally", () => {
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    act(() => outside.focus());
    const { rerender } = render(<ToastStack items={[existing]} onDismiss={vi.fn()} />);

    rerender(<ToastStack items={[]} onDismiss={vi.fn()} />);

    expect(outside).toHaveFocus();
    outside.remove();
  });
});
