// @vitest-environment jsdom

import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkGlobe } from "@/registry/components/network-globe";

const rendererSpies = vi.hoisted(() => ({
  dispose: vi.fn(),
  forceContextLoss: vi.fn(),
}));

vi.mock("motion/react", () => ({
  useReducedMotion: () => false,
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
      rendererSpies.dispose();
    }
    forceContextLoss() {
      rendererSpies.forceContextLoss();
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
  rendererSpies.dispose.mockClear();
  rendererSpies.forceContextLoss.mockClear();
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
    expect(rendererSpies.dispose).toHaveBeenCalledOnce();
    expect(rendererSpies.forceContextLoss).toHaveBeenCalledOnce();
  });
});
