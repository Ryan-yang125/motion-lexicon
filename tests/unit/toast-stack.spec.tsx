// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastStack, type ToastItem } from "@/registry/components/toast-stack";

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
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
