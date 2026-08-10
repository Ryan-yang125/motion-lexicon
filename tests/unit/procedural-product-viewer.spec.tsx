// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProceduralProductViewer } from "@/registry/components/procedural-product-viewer";

const harness = vi.hoisted(() => ({ reduced: false }));

vi.mock("motion/react", () => ({
  useReducedMotion: () => harness.reduced,
}));

vi.mock("three", async (importOriginal) => {
  const actual = await importOriginal<typeof import("three")>();

  class WebGLRendererStub {
    domElement = document.createElement("canvas");
    outputColorSpace = actual.SRGBColorSpace;
    shadowMap = { enabled: false, type: actual.PCFSoftShadowMap };

    setClearColor() {}
    setPixelRatio() {}
    setSize() {}
    render() {}
    dispose() {}
    forceContextLoss() {}
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
  harness.reduced = false;
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ProceduralProductViewer reset motion", () => {
  it("removes transform press feedback with reduced motion", async () => {
    harness.reduced = true;
    render(<ProceduralProductViewer />);
    const reset = await screen.findByRole("button", { name: "Reset view" });

    expect(reset).not.toHaveClass("transition-transform");
    expect(reset).not.toHaveClass("active:scale-[0.96]");
  });

  it("retains transform press feedback in standard motion", async () => {
    render(<ProceduralProductViewer />);
    const reset = await screen.findByRole("button", { name: "Reset view" });

    await waitFor(() => {
      expect(reset).toHaveClass("transition-transform", "active:scale-[0.96]");
    });
  });
});
