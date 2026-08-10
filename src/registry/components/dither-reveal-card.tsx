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
uniform vec3 u_front;
uniform vec3 u_back;
uniform vec3 u_ink;

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
  vec3 base = mix(u_front, u_back, reveal);
  vec3 color = mix(base, u_ink, edge * 0.055 * (1.0 - abs(u_progress - 0.5) * 1.3));
  gl_FragColor = vec4(color, 1.0);
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
    alpha: false,
    antialias: false,
    depth: false,
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

function rgb(value: string): [number, number, number] {
  const normalized = value.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6);
  return [0, 2, 4].map((offset) =>
    Number.parseInt(full.slice(offset, offset + 2), 16) / 255,
  ) as [number, number, number];
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
  const stateRef = useRef<WebGLState | null>(null);
  const frameRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const progressRef = useRef(defaultRevealed ? 1 : 0);
  const targetRef = useRef(defaultRevealed ? 1 : 0);
  const reduced = useReducedMotion() === true;
  const [pinned, setPinned] = useState(defaultRevealed);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [supported, setSupported] = useState(true);
  const active = pinned || hovered || focused;
  const colors: DitherPalette = {
    front: palette?.front ?? "#EEECE5",
    back: palette?.back ?? "#DDE4D5",
    ink: palette?.ink ?? "#292929",
  };

  const render = useCallback((time = performance.now()) => {
    const state = stateRef.current;
    if (!state || !visibleRef.current) return;
    const { gl } = state;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.useProgram(state.program);
    gl.uniform2f(state.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(state.progress, progressRef.current);
    gl.uniform1f(state.time, time);
    gl.uniform3fv(state.front, rgb(colors.front));
    gl.uniform3fv(state.back, rgb(colors.back));
    gl.uniform3fv(state.ink, rgb(colors.ink));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, [colors.back, colors.front, colors.ink]);

  const tick = useCallback(
    (time: number) => {
      frameRef.current = null;
      const target = targetRef.current;
      const current = progressRef.current;
      const next = reduced ? target : current + (target - current) * 0.18;
      progressRef.current = Math.abs(target - next) < 0.002 ? target : next;
      render(time);
      if (progressRef.current !== target && visibleRef.current) {
        frameRef.current = requestAnimationFrame(tick);
      }
    },
    [reduced, render],
  );

  const requestRender = useCallback(() => {
    if (frameRef.current === null && visibleRef.current) {
      frameRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let state: WebGLState | null = null;
    try {
      state = createWebGL(canvas);
    } catch {
      state = null;
    }
    if (!state) {
      setSupported(false);
      return;
    }
    stateRef.current = state;

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
        gl.getExtension("WEBGL_lose_context")?.loseContext();
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
      className={`group relative isolate min-h-[220px] w-full overflow-hidden rounded-[18px] border border-stone-200 bg-[#EEECE5] text-left shadow-[0_1px_2px_rgba(41,41,41,0.06),0_18px_50px_-34px_rgba(41,41,41,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EC] dark:border-white/[0.14] dark:bg-[#1D1D1A] dark:focus-visible:ring-[#93B0FF] dark:focus-visible:ring-offset-[#151513] ${className}`}
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
          backgroundColor: active ? colors.back : colors.front,
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
      <span className="absolute bottom-4 right-4 z-20 grid size-11 place-items-center rounded-full border border-black/10 bg-white/70 text-[#292929] shadow-sm backdrop-blur-md transition-transform duration-150 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-active:scale-[0.96] dark:border-white/[0.14] dark:bg-black/30 dark:text-white">
        <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
          <path d="M5 10h10M11.5 6.5 15 10l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
