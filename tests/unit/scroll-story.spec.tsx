// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gsap } from "gsap";
import { ScrollStory, type ScrollStoryChapter } from "@/registry/components/scroll-story";

type Toggle = (state: { isActive: boolean }) => void;

const harness = vi.hoisted(() => ({
  reduced: false,
  toggles: [] as Toggle[],
}));

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    matchMedia: vi.fn(() => {
      let cleanup: (() => void) | undefined;
      return {
        add: (_conditions: unknown, callback: (context: { conditions: { reduceMotion: boolean } }) => void | (() => void)) => {
          cleanup = callback({ conditions: { reduceMotion: harness.reduced } }) ?? undefined;
        },
        revert: () => cleanup?.(),
      };
    }),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: vi.fn((options: { onToggle: Toggle }) => {
      harness.toggles.push(options.onToggle);
      return { kill: vi.fn() };
    }),
  },
}));

const chapters: readonly ScrollStoryChapter[] = [
  { id: "capture", title: "Capture", scene: <div>Capture scene</div> },
  { id: "ship", title: "Ship", scene: <div>Ship scene</div> },
];

beforeEach(() => {
  harness.reduced = false;
  harness.toggles = [];
  vi.clearAllMocks();
});

describe("ScrollStory chapter motion", () => {
  it("uses width-only, immediate indicators with reduced motion", () => {
    harness.reduced = true;
    const { container } = render(<ScrollStory label="Release story" chapters={chapters} />);
    const indicators = Array.from(container.querySelectorAll<HTMLElement>("[data-scroll-story-indicator]"));

    expect(indicators[0]).toHaveAttribute("data-motion-mode", "instant");
    expect(indicators[0]).toHaveClass("w-full");
    expect(indicators[1]).toHaveClass("w-1/4");
    expect(indicators[0]).not.toHaveClass("transition-transform");
    expect(indicators[0]).not.toHaveClass("scale-x-100");
    expect(gsap.fromTo).not.toHaveBeenCalled();
    expect(gsap.set).toHaveBeenCalled();

    act(() => harness.toggles[1]?.({ isActive: true }));
    expect(indicators[0]).toHaveClass("w-1/4");
    expect(indicators[1]).toHaveClass("w-full");
    expect(indicators[1]).not.toHaveClass("transition-transform");
    expect(indicators[1]).not.toHaveClass("scale-x-100");
  });

  it("retains transform transitions in standard motion", () => {
    const { container } = render(<ScrollStory label="Release story" chapters={chapters} />);
    const indicators = Array.from(container.querySelectorAll<HTMLElement>("[data-scroll-story-indicator]"));

    expect(indicators[0]).toHaveAttribute("data-motion-mode", "standard");
    expect(indicators[0]).toHaveClass("transition-transform", "scale-x-100");
    expect(indicators[1]).toHaveClass("transition-transform", "scale-x-25");
    expect(gsap.fromTo).toHaveBeenCalled();

    act(() => harness.toggles[1]?.({ isActive: true }));
    expect(indicators[0]).toHaveClass("scale-x-25");
    expect(indicators[1]).toHaveClass("scale-x-100");
  });

  it.each([
    { reduce: false, behavior: "smooth" as const },
    { reduce: true, behavior: "auto" as const },
  ])("scrolls only the internal scroller with $behavior behavior", ({ reduce, behavior }) => {
    harness.reduced = reduce;
    const { container } = render(<ScrollStory label="Release story" chapters={chapters} />);
    const shipButton = screen.getByRole("button", { name: "Ship" });
    const shipSection = shipButton.closest("section");
    const scroll = shipSection?.parentElement;
    if (!shipSection || !scroll) throw new Error("Scroll story structure was not rendered");

    const scrollTo = vi.fn();
    const scrollIntoView = vi.fn();
    Object.defineProperty(scroll, "scrollTop", { configurable: true, value: 120, writable: true });
    Object.defineProperty(scroll, "clientHeight", { configurable: true, value: 300 });
    Object.defineProperty(scroll, "scrollTo", { configurable: true, value: scrollTo });
    Object.defineProperty(shipSection, "scrollIntoView", { configurable: true, value: scrollIntoView });
    vi.spyOn(scroll, "getBoundingClientRect").mockReturnValue({ top: 100 } as DOMRect);
    vi.spyOn(shipSection, "getBoundingClientRect").mockReturnValue({ top: 430, height: 180 } as DOMRect);

    fireEvent.click(shipButton);

    expect(scrollTo).toHaveBeenCalledOnce();
    expect(scrollTo).toHaveBeenCalledWith({ top: 390, behavior });
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(container).toContainElement(scroll);
  });
});
