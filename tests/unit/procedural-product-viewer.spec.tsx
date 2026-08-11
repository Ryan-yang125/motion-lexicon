// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProceduralProductViewer as IntentProceduralProductViewer } from "@/registry/components/procedural-product-viewer";

function ProceduralProductViewer(props: ComponentProps<typeof IntentProceduralProductViewer>) {
  return <IntentProceduralProductViewer activation="auto" {...props} />;
}

const harness = vi.hoisted(() => ({
  reduced: false,
  createRenderer: vi.fn(),
  render: vi.fn(),
  rendererOptions: [] as Array<{ antialias?: boolean }>,
}));

vi.mock("motion/react", () => ({
  useReducedMotion: () => harness.reduced,
}));

vi.mock("three", async (importOriginal) => {
  const actual = await importOriginal<typeof import("three")>();

  class WebGLRendererStub {
    domElement = document.createElement("canvas");
    outputColorSpace = actual.SRGBColorSpace;
    shadowMap = { enabled: false, type: actual.PCFSoftShadowMap };

    constructor(options?: { antialias?: boolean }) {
      harness.createRenderer();
      harness.rendererOptions.push(options ?? {});
    }

    setClearColor() {}
    setPixelRatio() {}
    setSize() {}
    compile() {
      return new Set();
    }
    render(scene: unknown, camera: unknown) {
      harness.render(scene, camera);
    }
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
  harness.createRenderer.mockClear();
  harness.render.mockClear();
  harness.rendererOptions = [];
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ProceduralProductViewer reset motion", () => {
  it("keeps the static fallback until intent and initializes only once", async () => {
    let initialize: IdleRequestCallback | undefined;
    const requestIdle = vi.fn((callback: IdleRequestCallback) => {
      initialize = callback;
      return 1;
    });
    vi.stubGlobal("requestIdleCallback", requestIdle);
    vi.stubGlobal("cancelIdleCallback", vi.fn());

    const { container, rerender } = render(
      <IntentProceduralProductViewer labels={{ activateInteractive: "Explore 3D" }} />,
    );
    expect(requestIdle).not.toHaveBeenCalled();
    expect(harness.createRenderer).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Explore 3D" }));
    expect(requestIdle).toHaveBeenCalledOnce();
    expect(harness.createRenderer).not.toHaveBeenCalled();
    act(() => initialize?.({ didTimeout: false, timeRemaining: () => 8 }));
    await waitFor(() => expect(harness.createRenderer).toHaveBeenCalledOnce());
    expect(container.querySelectorAll("canvas")).toHaveLength(1);

    rerender(<IntentProceduralProductViewer labels={{ activateInteractive: "Explore 3D" }} />);
    expect(harness.createRenderer).toHaveBeenCalledOnce();
  });

  it("waits for browser idle time before creating the WebGL renderer", async () => {
    let initialize: IdleRequestCallback | undefined;
    vi.stubGlobal("requestIdleCallback", vi.fn((callback: IdleRequestCallback) => {
      initialize = callback;
      return 1;
    }));
    vi.stubGlobal("cancelIdleCallback", vi.fn());

    const { container } = render(<ProceduralProductViewer />);
    expect(harness.createRenderer).not.toHaveBeenCalled();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();

    act(() => initialize?.({ didTimeout: false, timeRemaining: () => 8 }));
    await waitFor(() => expect(harness.createRenderer).toHaveBeenCalledOnce());
    expect(harness.rendererOptions[0]).toMatchObject({ antialias: false });
  });

  it("defers an accent-driven renderer rebuild to a fresh idle period", async () => {
    const initializers: IdleRequestCallback[] = [];
    const cancelIdle = vi.fn();
    vi.stubGlobal("requestIdleCallback", vi.fn((callback: IdleRequestCallback) => {
      initializers.push(callback);
      return initializers.length;
    }));
    vi.stubGlobal("cancelIdleCallback", cancelIdle);

    const { rerender } = render(<ProceduralProductViewer accent="#4568FF" />);
    act(() => initializers[0]?.({ didTimeout: false, timeRemaining: () => 8 }));
    await waitFor(() => expect(harness.createRenderer).toHaveBeenCalledOnce());

    rerender(<ProceduralProductViewer accent="#B3654A" />);
    expect(cancelIdle).toHaveBeenCalledWith(1);
    expect(harness.createRenderer).toHaveBeenCalledOnce();

    act(() => initializers[1]?.({ didTimeout: false, timeRemaining: () => 8 }));
    await waitFor(() => expect(harness.createRenderer).toHaveBeenCalledTimes(2));
  });

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

  it("preserves drag inertia when pointer capture is released normally", async () => {
    const { container } = render(<ProceduralProductViewer />);
    const root = container.querySelector<HTMLElement>('[data-webgl-root="procedural-product-viewer"]');
    const canvas = await waitFor(() => {
      const next = container.querySelector("canvas");
      expect(next).toBeInTheDocument();
      expect(root).toHaveAttribute("tabindex", "0");
      return next as HTMLCanvasElement;
    });
    if (!root) throw new Error("Product viewer root was not rendered");

    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.defineProperties(root, {
      setPointerCapture: { configurable: true, value: setPointerCapture },
      releasePointerCapture: { configurable: true, value: releasePointerCapture },
    });

    const animationFrame = vi.mocked(requestAnimationFrame);
    const initialFrame = animationFrame.mock.calls[0]?.[0];
    if (!initialFrame) throw new Error("Initial render frame was not requested");
    act(() => initialFrame(0));
    harness.render.mockClear();

    vi.spyOn(performance, "now")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(16);
    fireEvent.pointerDown(canvas, { pointerId: 7, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(root, { pointerId: 7, clientX: 30, clientY: 20 });
    const inertiaFrame = animationFrame.mock.calls.at(-1)?.[0];
    if (!inertiaFrame) throw new Error("Inertia frame was not requested");

    fireEvent.pointerUp(root, { pointerId: 7 });
    const lostCapture = new Event("lostpointercapture", { bubbles: true });
    Object.defineProperty(lostCapture, "pointerId", { value: 7 });
    fireEvent(root, lostCapture);
    expect(releasePointerCapture).toHaveBeenCalledWith(7);

    act(() => inertiaFrame(32));
    const scene = harness.render.mock.calls.at(-1)?.[0] as {
      children?: Array<{ type?: string; rotation?: { y: number } }>;
    } | undefined;
    const product = scene?.children?.find((child) => child.type === "Group");
    expect(product?.rotation?.y).toBeGreaterThan(0.018);
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
      expect(root).toHaveAttribute("tabindex", "0");
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
