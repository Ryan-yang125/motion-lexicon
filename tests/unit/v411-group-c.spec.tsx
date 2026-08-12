// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CursorLens } from "@/registry/components/cursor-lens";
import { SpotlightBento, type SpotlightBentoItem } from "@/registry/components/spotlight-bento";
import { ToastStack, type ToastItem } from "@/registry/components/toast-stack";
import { VoiceCapture } from "@/registry/components/voice-capture";

vi.mock("motion/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("motion/react")>(),
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  useReducedMotion: () => true,
}));

class ResizeObserverStub {
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("V4.1 group C interaction hardening", () => {
  it("keeps the landing stage on a thin boundary without decorative elevation", () => {
    const css = readFileSync("src/v4.css", "utf8");
    const rule = css.match(/\.landing-stage\s*\{([^}]+)\}/)?.[1];

    expect(rule).toContain("border: 1px solid var(--hairline);");
    expect(rule).toContain("box-shadow: none;");
  });

  it("keeps the cursor lens boundary without a wide shadow", () => {
    const { container } = render(
      <CursorLens
        label="Inspect details"
        base={<span>Base</span>}
        detail={<span>Detail</span>}
      />,
    );

    fireEvent.keyDown(screen.getByRole("group", { name: "Inspect details" }), {
      key: "ArrowRight",
    });
    expect(container.querySelector("[data-cursor-lens]")).toHaveClass(
      "border",
      "border-white/70",
      "dark:border-white/25",
      "shadow-[0_4px_8px_-6px_rgba(28,25,23,.72),inset_0_0_0_1px_rgba(41,41,41,.1)]",
    );
  });

  it("exposes the selected spotlight tile to pointer and keyboard users", () => {
    const items: readonly SpotlightBentoItem[] = [
      { id: "latency", label: "Median response", value: "34 ms" },
      { id: "regions", label: "Active regions", value: "12 regions" },
    ];
    const onSelect = vi.fn();
    render(<SpotlightBento items={items} selectedId="latency" onSelect={onSelect} />);

    const selected = screen.getByRole("button", { name: /34 ms/i });
    const unselected = screen.getByRole("button", { name: /12 regions/i });
    expect(selected).toHaveAttribute("aria-pressed", "true");
    expect(unselected).toHaveAttribute("aria-pressed", "false");
    expect(selected.querySelector("[data-spotlight-indicator]")).toHaveClass("opacity-100");

    fireEvent.click(unselected);
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });

  it("announces localized voice state and exposes the elapsed timer", () => {
    render(
      <VoiceCapture
        recordingLabel="正在录制"
        pausedLabel="录制已暂停"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Record voice message" }));
    expect(screen.getByRole("status")).toHaveTextContent("正在录制");
    expect(screen.getByRole("timer", { name: "正在录制, 00:00" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Pause recording" }));
    expect(screen.getByRole("status")).toHaveTextContent("录制已暂停");
    expect(screen.getByRole("timer", { name: "录制已暂停, 00:00" })).toBeVisible();
  });

  it("reserves the full expanded height for every toast row", () => {
    const items: ToastItem[] = [
      { id: "one", title: "One" },
      { id: "two", title: "Two" },
      { id: "three", title: "Three" },
    ];
    const { container } = render(<ToastStack items={items} onDismiss={vi.fn()} />);

    fireEvent.focus(screen.getByRole("article", { name: "One" }));
    expect(container.querySelector("ol")).toHaveStyle({ height: "190px" });
  });
});
