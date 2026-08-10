// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SpotlightBento,
  type SpotlightBentoItem,
} from "@/registry/components/spotlight-bento";

vi.mock("motion/react", () => ({
  useReducedMotion: () => false,
}));

const items: readonly SpotlightBentoItem[] = [
  { id: "latency", label: "Median response", value: "34 ms", tone: "blue" },
  { id: "regions", label: "Active regions", value: "12 regions", tone: "moss" },
];

class ResizeObserverStub {
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SpotlightBento", () => {
  it("renders static cards when no selection callback is provided", () => {
    const { container } = render(<SpotlightBento items={items} />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(container.querySelectorAll("article")).toHaveLength(items.length);
    expect(screen.getByText("34 ms")).toBeVisible();
    expect(screen.getByText("12 regions")).toBeVisible();
  });

  it("renders keyboard-operable buttons when selection is enabled", () => {
    const onSelect = vi.fn();
    render(<SpotlightBento items={items} onSelect={onSelect} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(items.length);
    expect(buttons[0]).toHaveAttribute("type", "button");
    expect(buttons[0]).not.toHaveAttribute("tabindex", "-1");

    buttons[1].focus();
    expect(buttons[1]).toHaveFocus();
    fireEvent.click(buttons[1]);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });
});
