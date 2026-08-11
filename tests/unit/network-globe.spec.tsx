// @vitest-environment jsdom

import { act, fireEvent, render, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NetworkGlobe as IntentNetworkGlobe } from "@/registry/components/network-globe";

function NetworkGlobe(props: ComponentProps<typeof IntentNetworkGlobe>) {
  return <IntentNetworkGlobe activation="auto" {...props} />;
}

const harness = vi.hoisted(() => ({
  createRenderer: vi.fn(),
  dispose: vi.fn(),
  forceContextLoss: vi.fn(),
  render: vi.fn(),
  nodeMaterials: [] as Array<{ opacity: number }>,
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
    compile() {
      return new Set();
    }
    render(scene: unknown, camera: unknown) {
      harness.render(scene, camera);
    }
    dispose() {
      harness.dispose();
    }
    forceContextLoss() {
      harness.forceContextLoss();
    }
  }

  class MeshBasicMaterialStub extends actual.MeshBasicMaterial {
    constructor(parameters?: ConstructorParameters<typeof actual.MeshBasicMaterial>[0]) {
      super(parameters);
      if (parameters?.opacity === 0.72) harness.nodeMaterials.push(this);
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
    MeshBasicMaterial: MeshBasicMaterialStub,
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
  harness.render.mockClear();
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
  vi.restoreAllMocks();
});

describe("NetworkGlobe", () => {
  it("keeps the static fallback until explicit intent and creates one renderer", async () => {
    const nodes = [{ id: "shanghai", label: "Shanghai", latitude: 31.23, longitude: 121.47 }];
    const { container, rerender } = render(
      <IntentNetworkGlobe nodes={nodes} activateLabel="Explore 3D" />,
    );

    expect(harness.createRenderer).not.toHaveBeenCalled();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    const activation = container.querySelector<HTMLButtonElement>('[data-webgl-activation="network-globe"]');
    expect(activation).toHaveTextContent("Explore 3D");

    fireEvent.click(activation as HTMLButtonElement);
    await waitFor(() => expect(harness.createRenderer).toHaveBeenCalledOnce());
    expect(container.querySelectorAll("canvas")).toHaveLength(1);
    expect(container.querySelector('[data-webgl-activation="network-globe"]')).not.toBeInTheDocument();

    rerender(<IntentNetworkGlobe nodes={nodes.map((node) => ({ ...node }))} activateLabel="Explore 3D" />);
    expect(harness.createRenderer).toHaveBeenCalledOnce();
  });

  it("caps rendering at 30fps and stops scheduling after the opening rotation settles", async () => {
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    }));

    const { container } = render(
      <NetworkGlobe nodes={[{ id: "shanghai", label: "Shanghai", latitude: 31.23, longitude: 121.47 }]} />,
    );
    await waitFor(() => expect(container.querySelector("canvas")).toBeInTheDocument());

    const first = frames.shift();
    first?.(100);
    const rendersAfterFirstFrame = harness.render.mock.calls.length;
    const throttled = frames.shift();
    throttled?.(110);
    expect(harness.render).toHaveBeenCalledTimes(rendersAfterFirstFrame);

    let timestamp = 144;
    let frameCount = 0;
    while (frames.length > 0 && frameCount < 240) {
      const frame = frames.shift();
      frame?.(timestamp);
      timestamp += 34;
      frameCount += 1;
    }

    expect(frameCount).toBeLessThan(240);
    expect(frames).toHaveLength(0);
  });

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
    expect(harness.nodeMaterials[1]?.opacity).toBe(1);
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
    expect(harness.nodeMaterials[3]?.opacity).toBe(1);
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
      expect(container.querySelector('[data-webgl-root="network-globe"]')).toHaveAttribute("tabindex", "0");
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

  it("keeps the current pointer active when an older pointer loses capture", async () => {
    const { container } = render(
      <NetworkGlobe
        nodes={[{ id: "shanghai", label: "Shanghai", latitude: 31.23, longitude: 121.47 }]}
      />,
    );
    const root = container.querySelector<HTMLElement>('[data-webgl-root="network-globe"]');
    const canvas = await waitFor(() => {
      const next = container.querySelector("canvas");
      expect(next).toBeInTheDocument();
      expect(root).toHaveAttribute("tabindex", "0");
      return next as HTMLCanvasElement;
    });
    if (!root) throw new Error("Network globe root was not rendered");

    const setPointerCapture = vi.fn();
    Object.defineProperty(root, "setPointerCapture", {
      configurable: true,
      value: setPointerCapture,
    });
    fireEvent.pointerDown(canvas, { pointerId: 1, clientX: 10 });
    fireEvent.pointerDown(canvas, { pointerId: 2, clientX: 20 });

    const lostCapture = new Event("lostpointercapture", { bubbles: true });
    Object.defineProperty(lostCapture, "pointerId", { value: 1 });
    fireEvent(root, lostCapture);
    fireEvent.pointerMove(root, { pointerId: 2, clientX: 40 });

    const frame = vi.mocked(requestAnimationFrame).mock.calls[0]?.[0];
    if (!frame) throw new Error("Network globe frame was not requested");
    act(() => frame(100));

    expect(setPointerCapture).toHaveBeenNthCalledWith(1, 1);
    expect(setPointerCapture).toHaveBeenNthCalledWith(2, 2);
    const scene = harness.render.mock.calls.at(-1)?.[0] as {
      children?: Array<{ type?: string; rotation?: { y: number } }>;
    } | undefined;
    const globe = scene?.children?.find((child) => child.type === "Group");
    expect(globe?.rotation?.y).toBeGreaterThan(-0.42);
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
