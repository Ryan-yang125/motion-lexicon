// @vitest-environment jsdom

import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkGlobe } from "@/registry/components/network-globe";

const harness = vi.hoisted(() => ({
  createRenderer: vi.fn(),
  dispose: vi.fn(),
  forceContextLoss: vi.fn(),
  nodeMaterials: [] as Array<{ emissiveIntensity: number }>,
  arcMaterials: [] as Array<{ opacity: number }>,
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

    constructor() {
      harness.createRenderer();
    }

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

  class MeshStandardMaterialStub extends actual.MeshStandardMaterial {
    constructor(parameters?: ConstructorParameters<typeof actual.MeshStandardMaterial>[0]) {
      super(parameters);
      harness.nodeMaterials.push(this);
    }
  }

  class LineBasicMaterialStub extends actual.LineBasicMaterial {
    constructor(parameters?: ConstructorParameters<typeof actual.LineBasicMaterial>[0]) {
      super(parameters);
      harness.arcMaterials.push(this);
    }
  }

  return {
    ...actual,
    WebGLRenderer: WebGLRendererStub,
    MeshStandardMaterial: MeshStandardMaterialStub,
    LineBasicMaterial: LineBasicMaterialStub,
  };
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
  harness.createRenderer.mockClear();
  harness.dispose.mockClear();
  harness.forceContextLoss.mockClear();
  harness.nodeMaterials = [];
  harness.arcMaterials = [];
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
  it("reapplies the active node styles when scene data rebuilds the runtime", async () => {
    const shanghai = {
      id: "shanghai",
      label: "Shanghai",
      latitude: 31.23,
      longitude: 121.47,
      color: "#4568FF",
    };
    const london = {
      id: "london",
      label: "London",
      latitude: 51.51,
      longitude: -0.13,
      color: "#B3654A",
    };
    const { rerender } = render(<NetworkGlobe nodes={[shanghai, london]} />);
    const londonButton = await waitFor(() => {
      const button = document.querySelectorAll<HTMLButtonElement>("button")[1];
      expect(button).toHaveTextContent("London");
      return button;
    });

    fireEvent.click(londonButton);
    expect(harness.nodeMaterials[1]?.emissiveIntensity).toBe(0.72);
    expect(harness.arcMaterials[0]?.opacity).toBe(0.92);

    rerender(
      <NetworkGlobe
        nodes={[
          shanghai,
          { ...london, longitude: 2.35, color: "#73806B" },
        ]}
      />,
    );

    await waitFor(() => expect(harness.createRenderer).toHaveBeenCalledTimes(2));
    expect(harness.nodeMaterials[3]?.emissiveIntensity).toBe(0.72);
    expect(harness.arcMaterials[1]?.opacity).toBe(0.92);
    expect(document.querySelectorAll("button")[1]).toHaveAttribute("aria-pressed", "true");
  });

  it("reuses WebGL resources for equivalent node content and rebuilds for scene changes", async () => {
    const nodes = [
      {
        id: "shanghai",
        label: "Shanghai",
        latitude: 31.23,
        longitude: 121.47,
        color: "#4568FF",
      },
      {
        id: "london",
        label: "London",
        latitude: 51.51,
        longitude: -0.13,
        color: "#B3654A",
      },
    ];
    const { container, rerender } = render(<NetworkGlobe nodes={nodes} />);
    const firstCanvas = await waitFor(() => {
      const canvas = container.querySelector("canvas");
      expect(canvas).toBeInTheDocument();
      return canvas;
    });
    expect(harness.createRenderer).toHaveBeenCalledOnce();

    rerender(<NetworkGlobe nodes={nodes.map((node) => ({ ...node }))} />);
    expect(container.querySelector("canvas")).toBe(firstCanvas);
    expect(harness.createRenderer).toHaveBeenCalledOnce();
    expect(harness.dispose).not.toHaveBeenCalled();
    expect(harness.forceContextLoss).not.toHaveBeenCalled();

    const frameCalls = vi.mocked(requestAnimationFrame).mock.calls.length;
    rerender(
      <NetworkGlobe
        nodes={nodes.map((node) => node.id === "london" ? { ...node, longitude: 2.35 } : node)}
      />,
    );
    await waitFor(() => {
      expect(harness.createRenderer).toHaveBeenCalledTimes(2);
      expect(container.querySelector("canvas")).not.toBe(firstCanvas);
    });
    expect(harness.dispose).toHaveBeenCalledOnce();
    expect(harness.forceContextLoss).toHaveBeenCalledOnce();
    expect(vi.mocked(requestAnimationFrame).mock.calls.length).toBeGreaterThan(frameCalls);
  });

  it("keeps the legal fallback focused after a removed node is added again", async () => {
    const shanghai = {
      id: "shanghai",
      label: "Shanghai",
      latitude: 31.23,
      longitude: 121.47,
    };
    const london = {
      id: "london",
      label: "London",
      latitude: 51.51,
      longitude: -0.13,
    };
    const { rerender } = render(<NetworkGlobe nodes={[shanghai, london]} />);

    const londonButton = await waitFor(() => {
      const button = document.querySelector<HTMLButtonElement>("button[aria-pressed='false']");
      expect(button).toHaveTextContent("London");
      return button as HTMLButtonElement;
    });
    fireEvent.click(londonButton);
    expect(londonButton).toHaveAttribute("aria-pressed", "true");

    rerender(<NetworkGlobe nodes={[shanghai]} />);
    expect(document.querySelector("button")).toHaveAttribute("aria-pressed", "true");

    rerender(<NetworkGlobe nodes={[shanghai, london]} />);
    const buttons = document.querySelectorAll("button");
    expect(buttons[0]).toHaveTextContent("Shanghai");
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
    expect(buttons[1]).toHaveTextContent("London");
    expect(buttons[1]).toHaveAttribute("aria-pressed", "false");
  });

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
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.defineProperties(root, {
      setPointerCapture: { configurable: true, value: setPointerCapture },
      hasPointerCapture: { configurable: true, value: () => true },
      releasePointerCapture: { configurable: true, value: releasePointerCapture },
    });
    fireEvent.pointerDown(canvas, { pointerId: 7, pointerType: "mouse", clientX: 20 });
    expect(setPointerCapture).toHaveBeenCalledWith(7);

    const lost = new Event("webglcontextlost", { cancelable: true });
    fireEvent(canvas, lost);
    expect(lost.defaultPrevented).toBe(true);
    expect(releasePointerCapture).toHaveBeenCalledWith(7);
    await waitFor(() => {
      expect(fallback).toHaveClass("opacity-100");
      expect(root).not.toHaveAttribute("tabindex");
    });

    const frameCalls = vi.mocked(requestAnimationFrame).mock.calls.length;
    fireEvent.pointerDown(canvas, { pointerId: 8, pointerType: "mouse", clientX: 40 });
    fireEvent.pointerMove(root as HTMLElement, { pointerId: 8, pointerType: "mouse", clientX: 80 });
    expect(setPointerCapture).toHaveBeenCalledTimes(1);
    expect(vi.mocked(requestAnimationFrame)).toHaveBeenCalledTimes(frameCalls);
    fireEvent(canvas, new Event("webglcontextrestored"));
    await waitFor(() => {
      expect(fallback).toHaveClass("opacity-0");
      expect(root).toHaveAttribute("tabindex", "0");
      expect(vi.mocked(requestAnimationFrame).mock.calls.length).toBeGreaterThan(frameCalls);
    });
  });
});
