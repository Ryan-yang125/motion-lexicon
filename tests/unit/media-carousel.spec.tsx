// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MediaCarousel,
  type MediaCarouselItem,
} from "@/registry/components/media-carousel";

vi.mock("motion/react", () => ({
  useReducedMotion: () => false,
}));

const items: readonly MediaCarouselItem[] = [
  { id: "one", title: "One", art: <span>First artwork</span> },
  { id: "two", title: "Two", art: <span>Second artwork</span> },
  { id: "three", title: "Three", art: <span>Third artwork</span> },
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MediaCarousel", () => {
  it("positions a non-zero initial slide without emitting a selection", () => {
    let frame: FrameRequestCallback | null = null;
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frame = callback;
        return 5;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const originalOffsetLeft = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "offsetLeft",
    );
    Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
      configurable: true,
      get() {
        const slideLabel = this.parentElement?.getAttribute("aria-label");
        const slideNumber = slideLabel ? Number.parseInt(slideLabel, 10) : Number.NaN;
        return Number.isNaN(slideNumber) ? 0 : (slideNumber - 1) * 200;
      },
    });

    try {
      const onSelect = vi.fn();
      const { container } = render(
        <MediaCarousel items={items} initialIndex={2} onSelect={onSelect} />,
      );
      const viewport = container.querySelector<HTMLDivElement>(
        '[aria-roledescription="carousel"]',
      );
      if (!viewport) throw new Error("Carousel viewport was not rendered");

      expect(viewport.scrollLeft).toBe(400);
      expect(screen.getByText("03 / 03")).toBeInTheDocument();
      expect(
        screen.getByRole("group", { name: "3 of 3" }).querySelector("button"),
      ).toHaveAttribute("aria-current", "true");
      fireEvent.scroll(viewport);
      act(() => frame?.(0));
      expect(onSelect).not.toHaveBeenCalled();
    } finally {
      if (originalOffsetLeft) {
        Object.defineProperty(
          HTMLElement.prototype,
          "offsetLeft",
          originalOffsetLeft,
        );
      } else {
        Reflect.deleteProperty(HTMLElement.prototype, "offsetLeft");
      }
    }
  });

  it("emits once when native scrolling changes the nearest slide", () => {
    let frame: FrameRequestCallback | null = null;
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frame = callback;
        return 7;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    const onSelect = vi.fn();
    const { container } = render(<MediaCarousel items={items} onSelect={onSelect} />);

    const viewport = container.querySelector<HTMLDivElement>(
      '[aria-roledescription="carousel"]',
    );
    if (!viewport) throw new Error("Carousel viewport was not rendered");
    const slides = items.map((_, index) => {
      const slide = screen
        .getByRole("group", { name: `${index + 1} of ${items.length}` })
        .querySelector<HTMLButtonElement>("button");
      if (!slide) throw new Error(`Slide ${index + 1} button was not rendered`);
      return slide;
    });

    Object.defineProperty(viewport, "clientWidth", { configurable: true, value: 200 });
    Object.defineProperty(viewport, "scrollLeft", { configurable: true, value: 200, writable: true });
    Object.defineProperty(viewport, "scrollTo", { configurable: true, value: vi.fn() });
    slides.forEach((slide, index) => {
      Object.defineProperty(slide, "offsetLeft", { configurable: true, value: index * 200 });
      Object.defineProperty(slide, "offsetWidth", { configurable: true, value: 200 });
    });

    fireEvent.scroll(viewport);
    act(() => frame?.(0));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenLastCalledWith(items[1], 1);

    fireEvent.scroll(viewport);
    act(() => frame?.(16));
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenLastCalledWith(items[2], 2);

    Object.defineProperty(viewport, "scrollLeft", { configurable: true, value: 400, writable: true });
    fireEvent.scroll(viewport);
    act(() => frame?.(32));
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});
