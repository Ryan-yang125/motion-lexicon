// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MagneticAction } from "@/registry/components/magnetic-action";
import { MediaCarousel } from "@/registry/components/media-carousel";
import { MegaMenu } from "@/registry/components/mega-menu";
import { NetworkGlobe } from "@/registry/components/network-globe";
import { ProceduralProductViewer } from "@/registry/components/procedural-product-viewer";
import { RadialActions } from "@/registry/components/radial-actions";
import { ScrollStory } from "@/registry/components/scroll-story";

const gsapHarness = vi.hoisted(() => ({
  set: vi.fn(),
  killTweensOf: vi.fn(),
}));

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    killTweensOf: gsapHarness.killTweensOf,
    set: gsapHarness.set,
    fromTo: vi.fn(() => ({ kill: vi.fn() })),
    matchMedia: vi.fn(() => ({
      add: (_query: unknown, callback: (context: { conditions: { reduceMotion: boolean } }) => void) => callback({ conditions: { reduceMotion: true } }),
      revert: vi.fn(),
    })),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { create: vi.fn(() => ({ kill: vi.fn() })) },
}));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => true };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
});

describe("V4.1 group B audit regressions", () => {
  it("clears magnetic transforms when the action becomes disabled", () => {
    const { rerender } = render(<MagneticAction>Launch</MagneticAction>);
    expect(screen.getByText("Launch")).toBeVisible();

    rerender(<MagneticAction disabled>Launch</MagneticAction>);
    expect(gsapHarness.killTweensOf).toHaveBeenCalled();
    expect(gsapHarness.set).toHaveBeenCalled();
  });

  it("renders readable selected network state and a stable empty state", () => {
    const nodes = [
      { id: "one", label: "San Francisco", latitude: 37.77, longitude: -122.42 },
      { id: "two", label: "Singapore", latitude: 1.35, longitude: 103.82 },
    ];
    const { rerender } = render(<NetworkGlobe nodes={nodes} />);
    const selected = screen.getByRole("button", { name: "San Francisco" });
    expect(selected).toHaveAttribute("aria-pressed", "true");
    expect(selected).toHaveClass("bg-[#DCE4FF]", "dark:bg-[#263358]");
    expect(selected).not.toHaveClass("text-white");

    rerender(<NetworkGlobe nodes={[]} emptyLabel="No regions yet" />);
    expect(screen.getByRole("status")).toHaveTextContent("No regions yet");
    expect(screen.queryByRole("button", { name: "Explore 3D" })).not.toBeInTheDocument();
    expect(screen.queryByText("Online")).not.toBeInTheDocument();
  });

  it("exposes explicit empty collection and story states", () => {
    render(<MediaCarousel items={[]} copy={{ emptyCollection: "No stories yet" }} />);
    expect(screen.getByRole("status")).toHaveTextContent("No stories yet");

    render(<ScrollStory label="Release story" chapters={[]} emptyLabel="No chapters yet" />);
    expect(screen.getByRole("group", { name: "Release story" })).toBeInTheDocument();
    expect(screen.getByText("No chapters yet")).toHaveAttribute("role", "status");
  });

  it("commits a scroll-story chapter immediately when its control is activated", () => {
    render(
      <ScrollStory
        label="Release story"
        chapters={[
          { id: "capture", title: "Capture", scene: <span>Capture scene</span> },
          { id: "ship", title: "Ship", scene: <span>Ship scene</span> },
        ]}
      />,
    );
    const ship = screen.getByRole("button", { name: "Ship" });
    const scroll = ship.closest("section")?.parentElement;
    if (!scroll) throw new Error("Story scroller was not rendered");
    Object.defineProperty(scroll, "scrollTo", { configurable: true, value: vi.fn() });
    fireEvent.click(ship);
    expect(ship).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("status")).toHaveTextContent("Ship");
  });

  it("associates product details with their disclosure control", () => {
    render(<ProceduralProductViewer detailLabel="Precision dial" />);
    const trigger = screen.getByRole("button", { name: "Precision dial" });
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    expect(panel).not.toBeNull();
    if (!panel) throw new Error("Detail panel was not rendered");
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveClass("dark:bg-[#242421]/95");
    expect(screen.getByText("Machined control with a quiet detent.")).toHaveClass("dark:text-stone-300");
  });

  it("dismisses menus on an outside pointer action", async () => {
    render(
      <MegaMenu
        label="Product navigation"
        sections={[{ id: "product", label: "Product", links: [{ id: "overview", label: "Overview", onSelect: vi.fn() }] }]}
      />,
    );
    const megaTrigger = screen.getByRole("button", { name: "Product" });
    expect(megaTrigger).toHaveAttribute("aria-haspopup", "menu");
    fireEvent.click(megaTrigger);
    expect(screen.getByRole("menu", { name: "Product" })).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(screen.queryByRole("menu", { name: "Product" })).not.toBeInTheDocument());

    render(
      <RadialActions
        label="Canvas actions"
        trigger={<span>+</span>}
        actions={[{ id: "note", label: "Add note", icon: <span>N</span>, onSelect: vi.fn() }]}
      />,
    );
    const radialTrigger = screen.getByRole("button", { name: "Canvas actions" });
    expect(radialTrigger).toHaveAttribute("aria-haspopup", "menu");
    fireEvent.click(radialTrigger);
    expect(screen.getByRole("menu", { name: "Canvas actions" })).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(screen.queryByRole("menu", { name: "Canvas actions" })).not.toBeInTheDocument());
  });

  it("keeps normal component text on AA contrast tokens", () => {
    const { unmount } = render(
      <MediaCarousel
        items={[{ id: "one", title: "First story", eyebrow: "Collection type", description: "Story description", meta: "04:12", art: <span>Artwork</span> }]}
      />,
    );
    expect(screen.getByText("Collection")).toHaveClass("text-stone-600", "dark:text-stone-300");
    expect(screen.getByText("04:12")).toHaveClass("text-stone-600", "dark:text-stone-300");
    unmount();

    render(
      <MegaMenu
        label="Product navigation"
        sections={[{ id: "product", label: "Product", links: [{ id: "overview", label: "Overview", description: "Product summary", onSelect: vi.fn() }] }]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Product" });
    expect(trigger).toHaveClass("text-stone-600", "dark:text-stone-300");
    fireEvent.click(trigger);
    expect(screen.getByText("Product summary")).toHaveClass("text-stone-600", "dark:text-stone-300");
  });

  it("wires localized empty copy through the bilingual demos", () => {
    const carouselDemo = readFileSync("src/registry/demos/media-carousel-demo.tsx", "utf8");
    const storyDemo = readFileSync("src/registry/demos/scroll-story-demo.tsx", "utf8");
    expect(carouselDemo).toContain('emptyCollection: "暂无故事"');
    expect(storyDemo).toContain('emptyLabel={demoValue(locale, "暂无章节", "No chapters available.")}');
  });
});
