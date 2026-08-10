// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("ProceduralProductViewer WebGL recovery", () => {
  it("shows the fallback on context loss and requests a reduced-motion redraw after restore", async () => {
    harness.reduced = true;
    const { container } = render(<ProceduralProductViewer />);
    const root = container.querySelector<HTMLElement>('[data-webgl-root="procedural-product-viewer"]');
    const fallback = container.querySelector<HTMLElement>('[data-webgl-fallback="procedural-product-viewer"]');
    const canvas = await waitFor(() => {
      const next = container.querySelector("canvas");
      expect(next).toBeInTheDocument();
      return next as HTMLCanvasElement;
    });
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.defineProperties(root, {
      setPointerCapture: { configurable: true, value: setPointerCapture },
      hasPointerCapture: { configurable: true, value: () => true },
      releasePointerCapture: { configurable: true, value: releasePointerCapture },
    });
    fireEvent.pointerDown(canvas, {
      pointerId: 7,
      pointerType: "mouse",
      clientX: 20,
      clientY: 20,
    });
    expect(setPointerCapture).toHaveBeenCalledWith(7);

    const lost = new Event("webglcontextlost", { cancelable: true });
    fireEvent(canvas, lost);
    expect(lost.defaultPrevented).toBe(true);
    expect(releasePointerCapture).toHaveBeenCalledWith(7);
    await waitFor(() => {
      expect(fallback).toHaveClass("opacity-100");
      expect(root).not.toHaveAttribute("tabindex");
      expect(screen.queryByRole("button", { name: "Reset view" })).not.toBeInTheDocument();
    });

    const frameCalls = vi.mocked(requestAnimationFrame).mock.calls.length;
    fireEvent.pointerDown(canvas, {
      pointerId: 8,
      pointerType: "mouse",
      clientX: 40,
      clientY: 40,
    });
    fireEvent.pointerMove(root as HTMLElement, {
      pointerId: 8,
      pointerType: "mouse",
      clientX: 80,
      clientY: 80,
    });
    expect(setPointerCapture).toHaveBeenCalledTimes(1);
    expect(vi.mocked(requestAnimationFrame)).toHaveBeenCalledTimes(frameCalls);
    fireEvent(canvas, new Event("webglcontextrestored"));
    await waitFor(() => {
      expect(fallback).toHaveClass("opacity-0");
      expect(root).toHaveAttribute("tabindex", "0");
      expect(screen.getByRole("button", { name: "Reset view" })).toBeInTheDocument();
      expect(vi.mocked(requestAnimationFrame).mock.calls.length).toBeGreaterThan(frameCalls);
    });
  });
});
