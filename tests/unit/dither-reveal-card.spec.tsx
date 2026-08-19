import { StrictMode } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DitherRevealCard } from "../../src/registry/components/dither-reveal-card";

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, useReducedMotion: () => motionPreference.reduced };
});

function installWebGL() {
  let lost = false;
  const loseContext = vi.fn(() => {
    lost = true;
  });
  const drawArrays = vi.fn();
  const uniform4fv = vi.fn();
  const gl = {
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    COMPILE_STATUS: 35713,
    LINK_STATUS: 35714,
    ARRAY_BUFFER: 34962,
    STATIC_DRAW: 35044,
    FLOAT: 5126,
    TRIANGLES: 4,
    drawingBufferWidth: 440,
    drawingBufferHeight: 250,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => null),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => ({})),
    createBuffer: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    getProgramInfoLog: vi.fn(() => null),
    deleteBuffer: vi.fn(),
    deleteProgram: vi.fn(),
    useProgram: vi.fn(),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    getUniformLocation: vi.fn(() => ({})),
    viewport: vi.fn(),
    uniform2f: vi.fn(),
    uniform1f: vi.fn(),
    uniform4fv,
    drawArrays,
    getExtension: vi.fn((name: string) =>
      name === "WEBGL_lose_context" ? { loseContext } : null,
    ),
  } as unknown as WebGLRenderingContext;
  const getContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation(((type: string) =>
      type === "webgl" ? (lost ? null : gl) : null) as typeof HTMLCanvasElement.prototype.getContext);
  class ResizeObserverStub {
    observe() {}
    disconnect() {}
  }
  class IntersectionObserverStub {
    observe() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  const frames: FrameRequestCallback[] = [];
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());

  return {
    loseContext,
    drawArrays,
    uniform4fv,
    getContext,
    frames,
    flushFrame(time: number) {
      const callback = frames.shift();
      if (callback) callback(time);
    },
  };
}

describe("DitherRevealCard WebGL fallback", () => {
  afterEach(() => {
    motionPreference.reduced = false;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("updates palette uniforms without recreating or losing the WebGL context", async () => {
    const {
      loseContext,
      drawArrays,
      uniform4fv,
      getContext,
      frames,
      flushFrame,
    } = installWebGL();

    const { rerender, unmount } = render(
      <DitherRevealCard
        palette={{ front: "rgb(12 34 56)" }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );
    expect(screen.getByRole("button", { name: "Reveal card" })).toHaveClass(
      "border",
      "border-[#f9e3bd]/25",
      "bg-[#1d1e19]",
    );
    expect(screen.getByRole("button", { name: "Reveal card" }).className).not.toContain("shadow-");
    await waitFor(() =>
      expect(getContext.mock.calls.filter(([type]) => type === "webgl")).toHaveLength(1),
    );
    act(() => flushFrame(16));
    const drawsBeforePaletteUpdate = drawArrays.mock.calls.length;

    rerender(
      <DitherRevealCard
        palette={{ front: "rgb(120 140 160)" }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );
    await waitFor(() => expect(frames.length).toBeGreaterThan(0));
    act(() => flushFrame(32));

    expect(getContext.mock.calls.filter(([type]) => type === "webgl")).toHaveLength(1);
    expect(loseContext).not.toHaveBeenCalled();
    expect(drawArrays.mock.calls.length).toBeGreaterThan(drawsBeforePaletteUpdate);
    expect(uniform4fv).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([
        120 / 255,
        140 / 255,
        160 / 255,
        1,
      ]),
    );

    unmount();
    await waitFor(() => expect(loseContext).toHaveBeenCalledOnce());
  });

  it("updates CSS variable palettes after theme changes without recreating WebGL", async () => {
    const {
      drawArrays,
      uniform4fv,
      getContext,
      frames,
      flushFrame,
    } = installWebGL();
    const getComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudoElement) => {
      const computed = getComputedStyle(element, pseudoElement);
      if (
        element instanceof HTMLElement &&
        element.style.color === "var(--dither-front)"
      ) {
        return new Proxy(computed, {
          get(target, property) {
            if (property === "color") {
              return document.documentElement.style.getPropertyValue("--dither-front") ||
                element.parentElement?.style.color ||
                target.color;
            }
            return Reflect.get(target, property, target);
          },
        });
      }
      return computed;
    });
    document.documentElement.style.setProperty("--dither-front", "rgb(12 34 56)");

    const { container } = render(
      <DitherRevealCard
        palette={{ front: "var(--dither-front)" }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );
    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="dither-reveal-card"]',
    );
    await waitFor(() => expect(fallback).toHaveStyle({ backgroundColor: "rgb(12, 34, 56)" }));
    act(() => {
      while (frames.length > 0) flushFrame(16);
    });
    const drawsBeforeThemeChange = drawArrays.mock.calls.length;

    act(() => {
      document.documentElement.dataset.theme = "night";
      document.documentElement.style.setProperty("--dither-front", "rgb(120 140 160)");
    });
    await waitFor(() => expect(frames.length).toBeGreaterThan(0));
    act(() => {
      while (frames.length > 0) flushFrame(32);
    });

    await waitFor(() => expect(fallback).toHaveStyle({ backgroundColor: "rgb(120, 140, 160)" }));
    expect(getContext.mock.calls.filter(([type]) => type === "webgl")).toHaveLength(1);
    expect(drawArrays.mock.calls.length).toBeGreaterThan(drawsBeforeThemeChange);
    expect(uniform4fv).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([120 / 255, 140 / 255, 160 / 255, 1]),
    );

    document.documentElement.style.removeProperty("--dither-front");
    delete document.documentElement.dataset.theme;
  });

  it("uses the safe fallback for an undefined CSS variable and resolves it when defined", async () => {
    const {
      uniform4fv,
      getContext,
      frames,
      flushFrame,
    } = installWebGL();
    const getComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudoElement) => {
      const computed = getComputedStyle(element, pseudoElement);
      if (
        element instanceof HTMLElement &&
        element.style.color === "var(--missing-dither-front)"
      ) {
        return new Proxy(computed, {
          get(target, property) {
            if (property === "color") {
              return document.documentElement.style.getPropertyValue("--missing-dither-front") ||
                element.parentElement?.style.color ||
                target.color;
            }
            return Reflect.get(target, property, target);
          },
        });
      }
      return computed;
    });
    document.documentElement.style.color = "rgb(190 20 30)";

    const { container } = render(
      <DitherRevealCard
        palette={{ front: "var(--missing-dither-front)" }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );
    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="dither-reveal-card"]',
    );

    await waitFor(() =>
      expect(fallback).toHaveStyle({ backgroundColor: "rgb(29, 30, 25)" }),
    );
    expect(fallback).not.toHaveStyle({ backgroundColor: "rgb(190, 20, 30)" });
    act(() => {
      while (frames.length > 0) flushFrame(16);
    });

    act(() => {
      document.documentElement.style.setProperty(
        "--missing-dither-front",
        "rgb(70 80 90)",
      );
    });
    await waitFor(() => expect(frames.length).toBeGreaterThan(0));
    act(() => {
      while (frames.length > 0) flushFrame(32);
    });

    await waitFor(() =>
      expect(fallback).toHaveStyle({ backgroundColor: "rgb(70, 80, 90)" }),
    );
    expect(uniform4fv).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([70 / 255, 80 / 255, 90 / 255, 1]),
    );
    expect(getContext.mock.calls.filter(([type]) => type === "webgl")).toHaveLength(1);

    document.documentElement.style.removeProperty("--missing-dither-front");
    document.documentElement.style.removeProperty("color");
  });

  it("keeps nested CSS variable fallbacks valid", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    const getComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudoElement) => {
      const computed = getComputedStyle(element, pseudoElement);
      if (
        element instanceof HTMLElement &&
        element.style.color === "var(--missing-outer, var(--missing-inner, #fff))"
      ) {
        return new Proxy(computed, {
          get(target, property) {
            if (property === "color") return "rgb(255, 255, 255)";
            return Reflect.get(target, property, target);
          },
        });
      }
      return computed;
    });

    const { container } = render(
      <DitherRevealCard
        palette={{ front: "var(--missing-outer, var(--missing-inner, #fff))" }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );
    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="dither-reveal-card"]',
    );

    await waitFor(() =>
      expect(fallback).toHaveStyle({ backgroundColor: "rgb(255, 255, 255)" }),
    );
  });

  it("keeps WebGL active through StrictMode effect replay", async () => {
    const { getContext, loseContext } = installWebGL();

    const { container, unmount } = render(
      <StrictMode>
        <DitherRevealCard
          front={<span>Front</span>}
          back={<span>Back</span>}
        />
      </StrictMode>,
    );

    await waitFor(() =>
      expect(getContext.mock.calls.filter(([type]) => type === "webgl")).toHaveLength(2),
    );
    expect(loseContext).not.toHaveBeenCalled();
    expect(
      container.querySelector('[data-webgl-fallback="dither-reveal-card"]'),
    ).toHaveStyle({ opacity: "0" });

    unmount();
    await waitFor(() => expect(loseContext).toHaveBeenCalledOnce());
  });

  it("falls back on context loss and rebuilds resources after restoration", async () => {
    const {
      getContext,
      loseContext,
      drawArrays,
      flushFrame,
    } = installWebGL();
    const { container, unmount } = render(
      <DitherRevealCard
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );
    const canvas = container.querySelector("canvas");
    const fallback = container.querySelector(
      '[data-webgl-fallback="dither-reveal-card"]',
    );
    if (!canvas) throw new Error("Dither canvas was not rendered");

    await waitFor(() =>
      expect(getContext.mock.calls.filter(([type]) => type === "webgl")).toHaveLength(1),
    );
    let lossAllowed = true;
    act(() => {
      lossAllowed = canvas.dispatchEvent(
        new Event("webglcontextlost", { cancelable: true }),
      );
    });

    expect(lossAllowed).toBe(false);
    await waitFor(() => expect(fallback).toHaveStyle({ opacity: "1" }));
    const drawsBeforeRestore = drawArrays.mock.calls.length;

    act(() => {
      canvas.dispatchEvent(new Event("webglcontextrestored"));
    });
    await waitFor(() => {
      expect(getContext.mock.calls.filter(([type]) => type === "webgl")).toHaveLength(2);
      expect(fallback).toHaveStyle({ opacity: "0" });
    });
    act(() => flushFrame(48));
    expect(drawArrays.mock.calls.length).toBeGreaterThan(drawsBeforeRestore);

    unmount();
    await waitFor(() => expect(loseContext).toHaveBeenCalledOnce());
    const contextCallsAfterUnmount = getContext.mock.calls.length;
    act(() => {
      canvas.dispatchEvent(new Event("webglcontextrestored"));
    });
    expect(getContext).toHaveBeenCalledTimes(contextCallsAfterUnmount);
  });

  it("removes arrow transform motion when reduced motion is enabled", () => {
    motionPreference.reduced = true;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    const { container } = render(
      <DitherRevealCard
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );
    const arrow = container.querySelector<HTMLElement>("[data-dither-arrow]");

    expect(arrow).not.toBeNull();
    expect(arrow?.className).not.toContain("transition-transform");
    expect(arrow?.className).not.toContain("group-active:scale-[0.96]");
  });

  it("uses the custom palette for both static reveal states", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    const { container } = render(
      <DitherRevealCard
        label="Reveal custom palette"
        palette={{ front: "#123456", back: "#ABCDEF" }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );

    const card = screen.getByRole("button", { name: "Reveal custom palette" });
    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="dither-reveal-card"]',
    );
    expect(fallback).not.toBeNull();

    await waitFor(() => expect(fallback).toHaveStyle({ opacity: "1" }));
    expect(fallback).toHaveStyle({ backgroundColor: "rgb(18, 52, 86)" });

    fireEvent.focus(card);
    expect(fallback).toHaveStyle({ backgroundColor: "rgb(171, 205, 239)" });
  });

  it.each([
    ["rgb()", "rgb(12 34 56 / 60%)", "rgba(12, 34, 56, 0.6)"],
    ["hsl()", "hsl(120 50% 50%)", "rgb(64, 191, 64)"],
    ["named color", "rebeccapurple", "rgb(102, 51, 153)"],
  ])("normalizes %s colors for the shared WebGL and fallback palette", async (_, color, expected) => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    const { container } = render(
      <DitherRevealCard
        label={`Reveal ${color}`}
        palette={{ front: color }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );

    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="dither-reveal-card"]',
    );
    expect(fallback).not.toBeNull();
    await waitFor(() => expect(fallback).toHaveStyle({ backgroundColor: expected }));
  });

  it("falls back to the safe palette for invalid CSS colors", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    const { container } = render(
      <DitherRevealCard
        palette={{ front: "definitely-not-a-color" }}
        front={<span>Front</span>}
        back={<span>Back</span>}
      />,
    );

    const fallback = container.querySelector<HTMLElement>(
      '[data-webgl-fallback="dither-reveal-card"]',
    );
    await waitFor(() =>
      expect(fallback).toHaveStyle({ backgroundColor: "rgb(29, 30, 25)" }),
    );
  });
});
