"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

type DitherPalette = {
  front: string;
  back: string;
  ink: string;
};

type ColorChannels = [number, number, number, number];

type ResolvedColor = {
  css: string;
  channels: ColorChannels;
};

type ResolvedPalette = {
  front: ResolvedColor;
  back: ResolvedColor;
  ink: ResolvedColor;
};

const DEFAULT_COLORS: ResolvedPalette = {
  front: { css: "rgb(238, 236, 229)", channels: [238 / 255, 236 / 255, 229 / 255, 1] },
  back: { css: "rgb(221, 228, 213)", channels: [221 / 255, 228 / 255, 213 / 255, 1] },
  ink: { css: "rgb(41, 41, 41)", channels: [41 / 255, 41 / 255, 41 / 255, 1] },
};

export type DitherRevealCardProps = {
  front: ReactNode;
  back: ReactNode;
  label?: string;
  palette?: Partial<DitherPalette>;
  defaultRevealed?: boolean;
  onRevealChange?: (revealed: boolean) => void;
  className?: string;
};

type WebGLState = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  vertex: WebGLShader;
  fragment: WebGLShader;
  progress: WebGLUniformLocation;
  resolution: WebGLUniformLocation;
  time: WebGLUniformLocation;
  front: WebGLUniformLocation;
  back: WebGLUniformLocation;
  ink: WebGLUniformLocation;
};

const VERTEX = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_progress;
uniform float u_time;
uniform vec4 u_front;
uniform vec4 u_back;
uniform vec4 u_ink;

float bayer4(vec2 p) {
  vec2 cell = mod(floor(p), 4.0);
  float x = cell.x;
  float y = cell.y;
  if (y < 1.0) {
    if (x < 1.0) return 0.0 / 16.0;
    if (x < 2.0) return 8.0 / 16.0;
    if (x < 3.0) return 2.0 / 16.0;
    return 10.0 / 16.0;
  }
  if (y < 2.0) {
    if (x < 1.0) return 12.0 / 16.0;
    if (x < 2.0) return 4.0 / 16.0;
    if (x < 3.0) return 14.0 / 16.0;
    return 6.0 / 16.0;
  }
  if (y < 3.0) {
    if (x < 1.0) return 3.0 / 16.0;
    if (x < 2.0) return 11.0 / 16.0;
    if (x < 3.0) return 1.0 / 16.0;
    return 9.0 / 16.0;
  }
  if (x < 1.0) return 15.0 / 16.0;
  if (x < 2.0) return 7.0 / 16.0;
  if (x < 3.0) return 13.0 / 16.0;
  return 5.0 / 16.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(u_resolution, vec2(1.0));
  float sweep = uv.x * 0.64 + (1.0 - uv.y) * 0.36;
  float softWave = sin((uv.y * 9.0) + (u_time * 0.001)) * 0.018;
  float threshold = clamp((u_progress * 1.32) - sweep * 0.32 + softWave, 0.0, 1.0);
  float pattern = bayer4(gl_FragCoord.xy);
  float reveal = step(pattern, threshold);
  if (u_progress <= 0.001) reveal = 0.0;
  if (u_progress >= 0.999) reveal = 1.0;
  float edge = 1.0 - smoothstep(0.0, 0.075, abs(pattern - threshold));
  vec4 base = mix(u_front, u_back, reveal);
  vec4 color = mix(base, u_ink, edge * 0.055 * (1.0 - abs(u_progress - 0.5) * 1.3));
  gl_FragColor = color;
}`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const detail = gl.getShaderInfoLog(shader) ?? "Shader compilation failed.";
    gl.deleteShader(shader);
    throw new Error(detail);
  }
  return shader;
}

function uniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
) {
  const location = gl.getUniformLocation(program, name);
  if (!location) throw new Error(`Missing WebGL uniform: ${name}`);
  return location;
}

function createWebGL(canvas: HTMLCanvasElement): WebGLState | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  if (!program || !buffer) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const detail = gl.getProgramInfoLog(program) ?? "Program linking failed.";
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    throw new Error(detail);
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  return {
    gl,
    program,
    buffer,
    vertex,
    fragment,
    progress: uniform(gl, program, "u_progress"),
    resolution: uniform(gl, program, "u_resolution"),
    time: uniform(gl, program, "u_time"),
    front: uniform(gl, program, "u_front"),
    back: uniform(gl, program, "u_back"),
    ink: uniform(gl, program, "u_ink"),
  };
}

function parseComputedRgb(value: string): ColorChannels | null {
  const match = value.match(
    /^rgba?\(\s*([+-]?[\d.]+)(%)?[,\s]+([+-]?[\d.]+)(%)?[,\s]+([+-]?[\d.]+)(%)?(?:\s*[,/]\s*([+-]?[\d.]+)(%)?)?\s*\)$/i,
  );
  if (!match) return null;
  const toByte = (part: string, percent: string | undefined) =>
    Math.min(255, Math.max(0, Number.parseFloat(part) * (percent ? 2.55 : 1)));
  const alphaText = match[7];
  const alpha = alphaText
    ? Math.min(1, Math.max(0, Number.parseFloat(alphaText) * (match[8] ? 0.01 : 1)))
    : 1;
  const bytes = [
    toByte(match[1], match[2]),
    toByte(match[3], match[4]),
    toByte(match[5], match[6]),
  ];
  if (bytes.some((channel) => Number.isNaN(channel)) || Number.isNaN(alpha)) return null;
  return [bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, alpha];
}

function rgbaCss(channels: ColorChannels) {
  const [red, green, blue, alpha] = channels;
  return `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${Math.round(alpha * 1000) / 1000})`;
}

function sampleCssColor(value: string): ColorChannels | null {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
  return [red / 255, green / 255, blue / 255, alpha / 255];
}

function resolveCssColor(
  value: string | undefined,
  fallback: ResolvedColor,
  scope: HTMLElement | null,
): ResolvedColor {
  const candidate = value?.trim();
  if (!candidate || typeof document === "undefined") {
    return candidate
      ? { css: candidate, channels: fallback.channels }
      : fallback;
  }

  const probeHost = document.createElement("span");
  probeHost.style.position = "fixed";
  probeHost.style.pointerEvents = "none";
  probeHost.style.visibility = "hidden";
  const probe = document.createElement("span");
  probe.style.color = candidate;
  if (!probe.style.color) return fallback;

  const host = scope ?? document.body;
  if (!host) return fallback;
  probeHost.append(probe);
  host.append(probeHost);
  let computed: string;
  if (usesCssVariable(candidate)) {
    probeHost.style.color = "rgb(1, 2, 3)";
    const first = window.getComputedStyle(probe).color;
    probeHost.style.color = "rgb(4, 5, 6)";
    const second = window.getComputedStyle(probe).color;
    probeHost.remove();
    if (!first || first !== second) return fallback;
    computed = second;
  } else {
    computed = window.getComputedStyle(probe).color;
    probeHost.remove();
  }

  const channels = sampleCssColor(computed) ?? parseComputedRgb(computed);
  return channels ? { css: rgbaCss(channels), channels } : fallback;
}

function samePalette(left: ResolvedPalette, right: ResolvedPalette) {
  return left.front.css === right.front.css &&
    left.back.css === right.back.css &&
    left.ink.css === right.ink.css;
}

function usesCssVariable(value: string | undefined) {
  return value?.toLowerCase().includes("var(") === true;
}

export function DitherRevealCard({
  front,
  back,
  label = "Reveal card",
  palette,
  defaultRevealed = false,
  onRevealChange,
  className = "",
}: DitherRevealCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLButtonElement>(null);
  const stateRef = useRef<WebGLState | null>(null);
  const frameRef = useRef<number | null>(null);
  const contextLossRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const progressRef = useRef(defaultRevealed ? 1 : 0);
  const targetRef = useRef(defaultRevealed ? 1 : 0);
  const reduced = useReducedMotion() === true;
  const [pinned, setPinned] = useState(defaultRevealed);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [supported, setSupported] = useState(true);
  const active = pinned || hovered || focused;
  const paletteFront = palette?.front;
  const paletteBack = palette?.back;
  const paletteInk = palette?.ink;
  const [colors, setColors] = useState<ResolvedPalette>(() => ({
    front: paletteFront?.trim()
      ? { css: paletteFront, channels: DEFAULT_COLORS.front.channels }
      : DEFAULT_COLORS.front,
    back: paletteBack?.trim()
      ? { css: paletteBack, channels: DEFAULT_COLORS.back.channels }
      : DEFAULT_COLORS.back,
    ink: paletteInk?.trim()
      ? { css: paletteInk, channels: DEFAULT_COLORS.ink.channels }
      : DEFAULT_COLORS.ink,
  }));
  const colorsRef = useRef(colors);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const render = useCallback((time = performance.now()) => {
    const state = stateRef.current;
    if (!state || !visibleRef.current) return;
    const { gl } = state;
    const currentColors = colorsRef.current;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.useProgram(state.program);
    gl.uniform2f(state.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(state.progress, progressRef.current);
    gl.uniform1f(state.time, time);
    gl.uniform4fv(state.front, currentColors.front.channels);
    gl.uniform4fv(state.back, currentColors.back.channels);
    gl.uniform4fv(state.ink, currentColors.ink.channels);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, []);

  const tick = useCallback(
    (time: number) => {
      frameRef.current = null;
      const target = targetRef.current;
      const current = progressRef.current;
      const next = reducedRef.current
        ? target
        : current + (target - current) * 0.18;
      progressRef.current = Math.abs(target - next) < 0.002 ? target : next;
      render(time);
      if (progressRef.current !== target && visibleRef.current) {
        frameRef.current = requestAnimationFrame(tick);
      }
    },
    [render],
  );

  const requestRender = useCallback(() => {
    if (frameRef.current === null && visibleRef.current) {
      frameRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const resolvePalette = useCallback(() => {
    const nextColors = {
      front: resolveCssColor(paletteFront, DEFAULT_COLORS.front, rootRef.current),
      back: resolveCssColor(paletteBack, DEFAULT_COLORS.back, rootRef.current),
      ink: resolveCssColor(paletteInk, DEFAULT_COLORS.ink, rootRef.current),
    };
    if (samePalette(colorsRef.current, nextColors)) return;
    colorsRef.current = nextColors;
    setColors(nextColors);
    requestRender();
  }, [paletteBack, paletteFront, paletteInk, requestRender]);

  useEffect(() => {
    resolvePalette();
    if (
      !usesCssVariable(paletteFront) &&
      !usesCssVariable(paletteBack) &&
      !usesCssVariable(paletteInk)
    ) {
      return;
    }

    const root = rootRef.current;
    if (!root || typeof MutationObserver === "undefined") return;
    let paletteFrame: number | null = null;
    const scheduleResolve = () => {
      if (paletteFrame !== null) return;
      paletteFrame = requestAnimationFrame(() => {
        paletteFrame = null;
        resolvePalette();
      });
    };
    const observer = new MutationObserver(scheduleResolve);
    for (let ancestor: HTMLElement | null = root; ancestor; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, { attributes: true });
    }
    const colorScheme = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    colorScheme?.addEventListener("change", scheduleResolve);

    return () => {
      observer.disconnect();
      colorScheme?.removeEventListener("change", scheduleResolve);
      if (paletteFrame !== null) cancelAnimationFrame(paletteFrame);
    };
  }, [paletteBack, paletteFront, paletteInk, resolvePalette]);

  useEffect(() => {
    if (contextLossRef.current !== null) {
      window.clearTimeout(contextLossRef.current);
      contextLossRef.current = null;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const initialize = () => {
      let nextState: WebGLState | null = null;
      try {
        nextState = createWebGL(canvas);
      } catch {
        nextState = null;
      }
      stateRef.current = nextState;
      setSupported(Boolean(nextState));
      return nextState;
    };
    if (!initialize()) return;

    const onContextLost = (event: Event) => {
      event.preventDefault();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      stateRef.current = null;
      setSupported(false);
    };
    const onContextRestored = () => {
      if (initialize()) requestRender();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    const resize = new ResizeObserver(([entry]) => {
      const width = Math.max(1, entry.contentRect.width);
      const height = Math.max(1, entry.contentRect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      requestRender();
    });
    resize.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) requestRender();
      else if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    });
    intersection.observe(canvas);
    requestRender();

    return () => {
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      resize.disconnect();
      intersection.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      const current = stateRef.current;
      if (current) {
        const { gl } = current;
        gl.deleteBuffer(current.buffer);
        gl.deleteProgram(current.program);
        gl.deleteShader(current.vertex);
        gl.deleteShader(current.fragment);
        const extension = gl.getExtension("WEBGL_lose_context");
        if (extension) {
          const timer = window.setTimeout(() => {
            extension.loseContext();
            if (contextLossRef.current === timer) contextLossRef.current = null;
          }, 0);
          contextLossRef.current = timer;
        }
      }
      stateRef.current = null;
      frameRef.current = null;
    };
  }, [requestRender]);

  useEffect(() => {
    targetRef.current = active ? 1 : 0;
    if (reduced) progressRef.current = targetRef.current;
    requestRender();
  }, [active, reduced, requestRender]);

  const toggle = () => {
    const next = !pinned;
    setPinned(next);
    onRevealChange?.(next);
  };

  return (
    <button
      ref={rootRef}
      type="button"
      aria-label={label}
      aria-pressed={pinned}
      onClick={toggle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      className={`group relative isolate min-h-[220px] w-full overflow-hidden rounded-[10px] border border-neutral-200 bg-[#f5f5f5] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 dark:border-white/[0.14] dark:bg-[#181818] ${className}`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 size-full ${supported ? "opacity-100" : "opacity-0"}`}
      />
      <span
        aria-hidden
        data-webgl-fallback="dither-reveal-card"
        className={`absolute inset-0 ${reduced ? "" : "transition-colors duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)]"}`}
        style={{
          backgroundColor: active ? colors.back.css : colors.front.css,
          opacity: supported ? 0 : 1,
        }}
      />
      <span className="relative z-10 grid min-h-[220px] p-5 sm:p-6">
        <span
          aria-hidden={active}
          className={`col-start-1 row-start-1 flex min-w-0 flex-col justify-between ${reduced ? "" : "transition-[opacity,transform] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)]"}`}
          style={{
            opacity: active ? 0 : 1,
            transform: reduced || !active ? "translate3d(0,0,0)" : "translate3d(0,-6px,0)",
          }}
        >
          {front}
        </span>
        <span
          aria-hidden={!active}
          className={`col-start-1 row-start-1 flex min-w-0 flex-col justify-between ${reduced ? "" : "transition-[opacity,transform] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)]"}`}
          style={{
            opacity: active ? 1 : 0,
            transform: reduced || active ? "translate3d(0,0,0)" : "translate3d(0,6px,0)",
          }}
        >
          {back}
        </span>
      </span>
      <span
        data-dither-arrow
        className={`absolute bottom-4 right-4 z-20 grid size-11 place-items-center rounded-lg border border-black/10 bg-white text-[#292929] dark:border-white/[0.14] dark:bg-[#202020] dark:text-white ${reduced ? "" : "transition-transform duration-150 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-active:scale-[0.96]"}`}
      >
        <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
          <path d="M5 10h10M11.5 6.5 15 10l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
