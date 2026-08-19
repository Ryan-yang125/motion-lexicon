"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

export type ShaderHeroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

const vertexSource = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
const fragmentSource = `precision mediump float;
uniform vec2 resolution; uniform vec2 pointer; uniform float time; uniform float motion;
float hash(vec2 p) { return fract(sin(dot(p, vec2(41.31, 289.23))) * 43758.5); }
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy; uv.x *= resolution.x / resolution.y;
  vec2 p = uv - vec2(.82, .54); p.x -= .28;
  float distanceToPointer = length(uv - pointer);
  float wave = sin((uv.x * 7. + uv.y * 4. + time * .45) + distanceToPointer * 16.) * .055 * motion;
  float arc = smoothstep(.61 + wave, .12 + wave, length(p + vec2(sin(time*.18)*.035, 0.0)));
  float rim = smoothstep(.13, .0, abs(length(p) - .32 - wave));
  float grain = (hash(gl_FragCoord.xy) - .5) * .035;
  vec3 base = vec3(.025, .035, .06);
  vec3 bloom = vec3(.18, .75, .82) * arc + vec3(.85, .2, .47) * rim;
  vec3 color = base + bloom * (1. - distanceToPointer * .32) + grain;
  gl_FragColor = vec4(color, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
  return shader;
}

export function ShaderHero({
  eyebrow = "Spatial interface",
  title = "Make the atmosphere part of the product.",
  description = "A responsive field that holds its shape before interaction and bends gently around intent.",
  actionLabel = "Open field notes",
  onAction,
  className = "",
}: ShaderHeroProps) {
  const reduced = useReducedMotion() === true;
  const headingId = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef(true);
  const pointerRef = useRef({ x: 0.76, y: 0.46 });
  const frameRef = useRef<number | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) { setSupported(false); return; }
    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      setSupported(false);
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }
    const program = gl.createProgram();
    if (!program) { setSupported(false); return; }
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { setSupported(false); gl.deleteProgram(program); return; }
    const buffer = gl.createBuffer();
    if (!buffer) { setSupported(false); return; }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    const resolution = gl.getUniformLocation(program, "resolution");
    const pointer = gl.getUniformLocation(program, "pointer");
    const time = gl.getUniformLocation(program, "time");
    const motion = gl.getUniformLocation(program, "motion");
    const start = performance.now();
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(bounds.width * ratio));
      canvas.height = Math.max(1, Math.floor(bounds.height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const draw = (now: number) => {
      frameRef.current = null;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(pointer, pointerRef.current.x, pointerRef.current.y);
      gl.uniform1f(time, reduced ? 0 : (now - start) / 1000);
      gl.uniform1f(motion, reduced ? 0 : 1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced && visibleRef.current) frameRef.current = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry?.isIntersecting ?? false;
      if (visibleRef.current && frameRef.current === null) frameRef.current = requestAnimationFrame(draw);
    }, { threshold: 0.08 });
    const resizeObserver = new ResizeObserver(() => { resize(); if (frameRef.current === null) frameRef.current = requestAnimationFrame(draw); });
    resize(); observer.observe(canvas); resizeObserver.observe(canvas);
    frameRef.current = requestAnimationFrame(draw);
    return () => {
      observer.disconnect(); resizeObserver.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment);
    };
  }, [reduced]);

  return (
    <section aria-labelledby={headingId} className={`relative isolate min-h-[390px] overflow-hidden rounded-[18px] bg-[#070a12] px-5 py-6 text-white shadow-[0_20px_65px_-26px_rgba(15,30,72,.78)] sm:px-8 sm:py-9 ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden
        onPointerMove={(event) => {
          if (reduced || event.pointerType !== "mouse") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          pointerRef.current = { x: (event.clientX - bounds.left) / bounds.width, y: 1 - (event.clientY - bounds.top) / bounds.height };
        }}
        className="absolute inset-0 size-full"
      />
      {!supported ? <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,#248c9a,transparent_28%),radial-gradient(circle_at_82%_48%,#a82d64,transparent_13%),#070a12]" /> : null}
      <div className="relative z-10 flex min-h-[342px] max-w-md flex-col justify-end">
        <span className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-100/68">{eyebrow}</span>
        <h3 id={headingId} className="mt-3 max-w-[11ch] text-4xl font-medium leading-[.94] tracking-[-.06em] sm:text-5xl">{title}</h3>
        <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/72">{description}</p>
        <button type="button" onClick={onAction} className="mt-6 min-h-11 w-fit rounded-full border border-white/22 bg-white/[.1] px-4 text-[12px] font-medium outline-none backdrop-blur-md transition hover:bg-white/[.17] focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070a12]">{actionLabel}</button>
      </div>
      <span className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.16em] text-white/60">{reduced ? "Still" : "WebGL"}</span>
    </section>
  );
}
