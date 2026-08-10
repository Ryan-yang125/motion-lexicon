// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  KineticLogoExchange,
  type KineticLogoItem,
} from "@/registry/components/kinetic-logo-exchange";

const harness = vi.hoisted(() => ({ reduced: false }));

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  useReducedMotion: () => harness.reduced,
}));

const alpha: KineticLogoItem = { id: "alpha", label: "Alpha", tone: "blue" };
const bravo: KineticLogoItem = { id: "bravo", label: "Bravo", tone: "clay" };
const charlie: KineticLogoItem = { id: "charlie", label: "Charlie", tone: "moss" };

beforeEach(() => {
  harness.reduced = false;
});

afterEach(() => {
  vi.useRealTimers();
});

function renderedOrder(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-kinetic-logo-item]"))
    .map((node) => node.dataset.kineticLogoItem);
}

describe("KineticLogoExchange dynamic items", () => {
  it("preserves its rotated order when an equivalent id sequence rerenders", () => {
    vi.useFakeTimers();
    const { container, rerender } = render(
      <KineticLogoExchange items={[alpha, bravo, charlie]} interval={1800} />,
    );
    act(() => { vi.advanceTimersByTime(1800); });
    expect(renderedOrder(container)).toEqual(["bravo", "charlie", "alpha"]);

    rerender(
      <KineticLogoExchange
        items={[{ ...alpha }, { ...bravo }, { ...charlie }]}
        interval={1800}
      />,
    );

    expect(renderedOrder(container)).toEqual(["bravo", "charlie", "alpha"]);
  });

  it("adopts the incoming order and chooses the new first item when the selection is removed", () => {
    const { container, rerender } = render(
      <KineticLogoExchange items={[alpha, bravo, charlie]} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Bravo/ }));
    expect(screen.getByRole("button", { name: /Bravo/ })).toHaveAttribute("aria-pressed", "true");

    rerender(<KineticLogoExchange items={[charlie, alpha]} />);
    expect(renderedOrder(container)).toEqual(["charlie", "alpha"]);
    expect(screen.getByRole("button", { name: /Charlie/ })).toHaveAttribute("aria-pressed", "true");

    rerender(<KineticLogoExchange items={[alpha, charlie]} />);
    expect(renderedOrder(container)).toEqual(["alpha", "charlie"]);
    expect(screen.getByRole("button", { name: /Charlie/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("clears an empty exchange and initializes selection when items return", () => {
    const { container, rerender } = render(<KineticLogoExchange items={[]} />);
    expect(renderedOrder(container)).toEqual([]);

    rerender(<KineticLogoExchange items={[bravo, alpha]} />);
    expect(renderedOrder(container)).toEqual(["bravo", "alpha"]);
    expect(screen.getByRole("button", { name: /Bravo/ })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("KineticLogoExchange reduced motion", () => {
  it("removes press scaling and transform transitions across pause and resume", () => {
    harness.reduced = true;
    render(<KineticLogoExchange items={[alpha, bravo]} />);
    const pause = screen.getByRole("button", { name: "Pause logo exchange" });

    expect(pause).not.toHaveClass("transition-transform");
    expect(pause).not.toHaveClass("active:scale-[0.96]");
    fireEvent.click(pause);
    const resume = screen.getByRole("button", { name: "Resume logo exchange" });
    expect(resume).not.toHaveClass("transition-transform");
    expect(resume).not.toHaveClass("active:scale-[0.96]");
    fireEvent.click(resume);
    expect(screen.getByRole("button", { name: "Pause logo exchange" })).not.toHaveClass("transition-transform");
  });

  it("retains press feedback in standard motion", () => {
    render(<KineticLogoExchange items={[alpha, bravo]} />);
    const pause = screen.getByRole("button", { name: "Pause logo exchange" });

    expect(pause).toHaveClass("transition-transform", "active:scale-[0.96]");
  });
});
