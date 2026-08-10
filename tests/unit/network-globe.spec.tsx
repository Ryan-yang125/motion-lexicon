// @vitest-environment jsdom

import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkGlobe } from "@/registry/components/network-globe";

const harness = vi.hoisted(() => ({
  dispose: vi.fn(),
  forceContextLoss: vi.fn(),
  reduced: false,
}));

vi.mock("motion/react", () => ({
  useReducedMotion: () => harness.reduced,
}));

vi.mock("three", async (importOriginal) => {
  const actual = await importOriginal<typeof import("three")>();

  class WebGLRendererStub {
    domElement = document.createElement("canvas");
    outputColorSpace = actual.SRGBColorSpace;

    setClearColor() {}
    setPixelRatio() {}
    setSize() {}
    render() {}
    dispose() {
      harness.dispose();
    }
    forceContextLoss() {
      harness.forceContextLoss();
    }
  }

  return { ...actual, WebGLRenderer: WebGLRendererStub };
});

class ResizeObserverStub {
  observe() {}
  disconnect() {}
}

class IntersectionObserverStub {
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  harness.dispose.mockClear();
  harness.forceContextLoss.mockClear();
  harness.reduced = false;
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("NetworkGlobe", () => {
  it("returns to a static fallback when runtime nodes become empty", async () => {
    const { container, rerender } = render(
      <NetworkGlobe
        nodes={[
          {
            id: "shanghai",
            label: "Shanghai",
            latitude: 31.23,
            longitude: 121.47,
          },
        ]}
      />,
    );
    const root = container.querySelector<HTMLElement>(
      '[data-webgl-root="network-globe"]',
    );
    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="network-globe"]',
    );

    await waitFor(() => {
      expect(root).toHaveAttribute("tabindex", "0");
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    rerender(<NetworkGlobe nodes={[]} />);

    await waitFor(() => {
      expect(container.querySelector("canvas")).not.toBeInTheDocument();
      expect(fallback).toHaveClass("opacity-100");
      expect(root).not.toHaveAttribute("tabindex");
      expect(root).toHaveClass("touch-pan-y");
      expect(root).toHaveAccessibleName(/Static network preview/);
    });
    expect(harness.dispose).toHaveBeenCalledOnce();
    expect(harness.forceContextLoss).toHaveBeenCalledOnce();
  });

  it("shows the fallback on context loss and redraws after restore with reduced motion", async () => {
    harness.reduced = true;
    const { container } = render(
      <NetworkGlobe
        nodes={[{ id: "shanghai", label: "Shanghai", latitude: 31.23, longitude: 121.47 }]}
      />,
    );
    const root = container.querySelector<HTMLElement>('[data-webgl-root="network-globe"]');
    const fallback = container.querySelector<HTMLElement>('[data-webgl-fallback="network-globe"]');
    const canvas = await waitFor(() => {
      const next = container.querySelector("canvas");
      expect(next).toBeInTheDocument();
      return next as HTMLCanvasElement;
    });

    const lost = new Event("webglcontextlost", { cancelable: true });
    fireEvent(canvas, lost);
    expect(lost.defaultPrevented).toBe(true);
    await waitFor(() => {
      expect(fallback).toHaveClass("opacity-100");
      expect(root).not.toHaveAttribute("tabindex");
    });

    const frameCalls = vi.mocked(requestAnimationFrame).mock.calls.length;
    fireEvent(canvas, new Event("webglcontextrestored"));
    await waitFor(() => {
      expect(fallback).toHaveClass("opacity-0");
      expect(root).toHaveAttribute("tabindex", "0");
      expect(vi.mocked(requestAnimationFrame).mock.calls.length).toBeGreaterThan(frameCalls);
    });
  });
});
