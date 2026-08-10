"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

export type ProceduralProductViewerProps = {
  productName?: string;
  detailLabel?: string;
  accent?: string;
  className?: string;
};

type RotationState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  dragging: boolean;
  pointerId: number | null;
  lastX: number;
  lastY: number;
  lastTime: number;
};

const LIMIT_X = 0.32;
const LIMIT_Y = 0.72;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function makeProduct(
  accent: THREE.ColorRepresentation,
  resources: Set<{ dispose: () => void }>,
) {
  const group = new THREE.Group();
  const track = <T extends { dispose: () => void }>(resource: T) => {
    resources.add(resource);
    return resource;
  };

  const shell = track(
    new THREE.MeshStandardMaterial({
      color: 0xe8e5dd,
      roughness: 0.52,
      metalness: 0.08,
    }),
  );
  const dark = track(
    new THREE.MeshStandardMaterial({
      color: 0x292929,
      roughness: 0.38,
      metalness: 0.25,
    }),
  );
  const accentMaterial = track(
    new THREE.MeshStandardMaterial({
      color: accent,
      roughness: 0.32,
      metalness: 0.22,
    }),
  );
  const glass = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xdce4ef,
      roughness: 0.12,
      metalness: 0.05,
      transmission: 0.12,
      transparent: true,
      opacity: 0.92,
    }),
  );

  const bodyShape = new THREE.Shape();
  const width = 1.18;
  const height = 1.52;
  const radius = 0.16;
  const left = -width / 2;
  const bottom = -height / 2;
  bodyShape.moveTo(left + radius, bottom);
  bodyShape.lineTo(left + width - radius, bottom);
  bodyShape.quadraticCurveTo(left + width, bottom, left + width, bottom + radius);
  bodyShape.lineTo(left + width, bottom + height - radius);
  bodyShape.quadraticCurveTo(left + width, bottom + height, left + width - radius, bottom + height);
  bodyShape.lineTo(left + radius, bottom + height);
  bodyShape.quadraticCurveTo(left, bottom + height, left, bottom + height - radius);
  bodyShape.lineTo(left, bottom + radius);
  bodyShape.quadraticCurveTo(left, bottom, left + radius, bottom);
  const bodyGeometry = track(
    new THREE.ExtrudeGeometry(bodyShape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 12,
      steps: 1,
    }),
  );
  bodyGeometry.center();
  const body = new THREE.Mesh(bodyGeometry, shell);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const glassGeometry = track(new THREE.BoxGeometry(0.93, 0.76, 0.035));
  const face = new THREE.Mesh(glassGeometry, glass);
  face.position.set(0, 0.24, 0.249);
  face.castShadow = true;
  group.add(face);

  const displayGeometry = track(new THREE.PlaneGeometry(0.72, 0.5));
  const displayMaterial = track(
    new THREE.MeshBasicMaterial({ color: 0x171918, transparent: true, opacity: 0.94 }),
  );
  const display = new THREE.Mesh(displayGeometry, displayMaterial);
  display.position.set(0, 0.25, 0.27);
  group.add(display);

  const barGeometry = track(new THREE.BoxGeometry(0.42, 0.035, 0.018));
  const bar = new THREE.Mesh(barGeometry, accentMaterial);
  bar.position.set(-0.1, 0.28, 0.286);
  group.add(bar);

  const shortBarGeometry = track(new THREE.BoxGeometry(0.2, 0.025, 0.018));
  const shortBar = new THREE.Mesh(shortBarGeometry, shell);
  shortBar.position.set(-0.21, 0.18, 0.286);
  group.add(shortBar);

  const dialGeometry = track(new THREE.CylinderGeometry(0.145, 0.145, 0.09, 36));
  const dial = new THREE.Mesh(dialGeometry, dark);
  dial.rotation.x = Math.PI / 2;
  dial.position.set(0.3, -0.42, 0.27);
  dial.castShadow = true;
  group.add(dial);

  const ringGeometry = track(new THREE.TorusGeometry(0.2, 0.025, 12, 48));
  const ring = new THREE.Mesh(ringGeometry, accentMaterial);
  ring.position.set(-0.27, -0.41, 0.282);
  group.add(ring);

  const footGeometry = track(new THREE.CylinderGeometry(0.44, 0.52, 0.09, 48));
  const foot = new THREE.Mesh(footGeometry, dark);
  foot.position.y = -0.81;
  foot.castShadow = true;
  group.add(foot);

  const edgeGeometry = track(new THREE.EdgesGeometry(bodyGeometry, 35));
  const edgeMaterial = track(
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.38 }),
  );
  group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));

  group.rotation.x = -0.08;
  return group;
}

export function ProceduralProductViewer({
  productName = "Arc One",
  detailLabel = "Tactile dial",
  accent = "#4568FF",
  className = "",
}: ProceduralProductViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const frameRef = useRef<number | null>(null);
  const requestFrameRef = useRef<() => void>(() => undefined);
  const visibleRef = useRef(true);
  const reduced = useReducedMotion() === true;
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const rotation = useRef<RotationState>({
    x: -0.08,
    y: 0,
    targetX: -0.08,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
  });
  const [detailOpen, setDetailOpen] = useState(false);
  const [rendererReady, setRendererReady] = useState(false);

  const draw = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (renderer && scene && camera) renderer.render(scene, camera);
  };

  const animate = () => {
    frameRef.current = null;
    if (!visibleRef.current) return;
    const model = groupRef.current;
    const state = rotation.current;
    if (!model) return;

    if (!reducedRef.current) {
      if (!state.dragging) {
        state.targetX += state.velocityX;
        state.targetY += state.velocityY;
        state.velocityX *= 0.84;
        state.velocityY *= 0.84;
        state.targetX += (-0.08 - state.targetX) * 0.025;
        state.targetY += (0 - state.targetY) * 0.025;
      }
      state.targetX = clamp(state.targetX, -LIMIT_X, LIMIT_X);
      state.targetY = clamp(state.targetY, -LIMIT_Y, LIMIT_Y);
      state.x += (state.targetX - state.x) * 0.2;
      state.y += (state.targetY - state.y) * 0.2;
      model.rotation.set(state.x, state.y, 0);
      draw();
      const moving =
        state.dragging ||
        Math.abs(state.targetX - state.x) > 0.0005 ||
        Math.abs(state.targetY - state.y) > 0.0005 ||
        Math.abs(state.velocityX) > 0.0001 ||
        Math.abs(state.velocityY) > 0.0001;
      if (moving) frameRef.current = requestAnimationFrame(animate);
    } else {
      model.rotation.set(state.targetX, state.targetY, 0);
      draw();
    }
  };

  const requestFrame = () => {
    if (frameRef.current === null && visibleRef.current) {
      frameRef.current = requestAnimationFrame(animate);
    }
  };
  requestFrameRef.current = requestFrame;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const resources = new Set<{ dispose: () => void }>();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    camera.position.set(0, 0.08, 4.35);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setRendererReady(false);
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.prepend(renderer.domElement);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      setRendererReady(false);
    };
    const onContextRestored = () => {
      setRendererReady(true);
      requestFrameRef.current();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);
    setRendererReady(true);

    const ambient = new THREE.HemisphereLight(0xf8f5ed, 0x8b7f70, 2.4);
    const key = new THREE.DirectionalLight(0xffffff, 3.6);
    key.position.set(2.8, 3.6, 4.5);
    key.castShadow = true;
    const rim = new THREE.DirectionalLight(0x93b0ff, 2.4);
    rim.position.set(-3.2, 1.2, -2.4);
    scene.add(ambient, key, rim);

    const product = makeProduct(accent, resources);
    scene.add(product);

    const groundGeometry = new THREE.CircleGeometry(1.12, 64);
    const groundMaterial = new THREE.MeshBasicMaterial({
      color: 0x292929,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    });
    resources.add(groundGeometry);
    resources.add(groundMaterial);
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.89, 0);
    scene.add(ground);

    rendererRef.current = renderer;
    cameraRef.current = camera;
    sceneRef.current = scene;
    groupRef.current = product;

    const resize = new ResizeObserver(([entry]) => {
      const width = Math.max(1, entry.contentRect.width);
      const height = Math.max(1, entry.contentRect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      requestFrameRef.current();
    });
    resize.observe(mount);

    const intersection = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) requestFrameRef.current();
      else if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    });
    intersection.observe(mount);
    requestFrameRef.current();

    return () => {
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
      resize.disconnect();
      intersection.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      resources.forEach((resource) => resource.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      rendererRef.current = null;
      cameraRef.current = null;
      sceneRef.current = null;
      groupRef.current = null;
      frameRef.current = null;
    };
  }, [accent]);

  useEffect(() => {
    requestFrameRef.current();
  }, [reduced]);

  const reset = () => {
    const state = rotation.current;
    state.targetX = -0.08;
    state.targetY = 0;
    state.velocityX = 0;
    state.velocityY = 0;
    requestFrame();
  };

  return (
    <div
      ref={mountRef}
      data-webgl-root="procedural-product-viewer"
      role="group"
      tabIndex={rendererReady ? 0 : undefined}
      aria-label={
        rendererReady
          ? `${productName} interactive 3D viewer. Drag or use arrow keys to rotate.`
          : `${productName}. Static product preview.`
      }
      onPointerDown={(event) => {
        if (!(event.target instanceof HTMLCanvasElement)) return;
        const state = rotation.current;
        state.dragging = true;
        state.pointerId = event.pointerId;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        state.lastTime = performance.now();
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.focus({ preventScroll: true });
      }}
      onPointerMove={(event) => {
        const state = rotation.current;
        if (!state.dragging || state.pointerId !== event.pointerId) return;
        const now = performance.now();
        const elapsed = Math.max(8, now - state.lastTime);
        const dx = event.clientX - state.lastX;
        const dy = event.clientY - state.lastY;
        state.targetY = clamp(state.targetY + dx * 0.008, -LIMIT_Y, LIMIT_Y);
        state.targetX = clamp(state.targetX + dy * 0.006, -LIMIT_X, LIMIT_X);
        state.velocityY = reduced ? 0 : (dx / elapsed) * 0.026;
        state.velocityX = reduced ? 0 : (dy / elapsed) * 0.018;
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        state.lastTime = now;
        requestFrame();
      }}
      onPointerUp={(event) => {
        const state = rotation.current;
        if (state.pointerId !== event.pointerId) return;
        state.dragging = false;
        state.pointerId = null;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
        requestFrame();
      }}
      onPointerCancel={() => {
        rotation.current.dragging = false;
        rotation.current.pointerId = null;
      }}
      onKeyDown={
        rendererReady
          ? (event) => {
              const state = rotation.current;
              const step = event.shiftKey ? 0.2 : 0.1;
              if (event.key === "ArrowLeft") state.targetY -= step;
              else if (event.key === "ArrowRight") state.targetY += step;
              else if (event.key === "ArrowUp") state.targetX -= step;
              else if (event.key === "ArrowDown") state.targetX += step;
              else if (event.key === "Home") reset();
              else return;
              state.targetX = clamp(state.targetX, -LIMIT_X, LIMIT_X);
              state.targetY = clamp(state.targetY, -LIMIT_Y, LIMIT_Y);
              event.preventDefault();
              requestFrame();
            }
          : undefined
      }
      className={`relative isolate min-h-[250px] w-full overflow-hidden rounded-[18px] border border-stone-200 bg-[#EEECE5] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_48px_-38px_rgba(41,41,41,0.55)] outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EC] dark:border-white/[0.14] dark:bg-[#1D1D1A] dark:focus-visible:ring-[#93B0FF] dark:focus-visible:ring-offset-[#151513] ${rendererReady ? "cursor-grab touch-none active:cursor-grabbing" : "touch-pan-y"} ${className}`}
    >
      <div
        data-webgl-fallback="procedural-product-viewer"
        aria-hidden
        className={`pointer-events-none absolute inset-0 grid place-items-center ${rendererReady ? "opacity-0" : "opacity-100"}`}
      >
        <div className="relative h-40 w-28 -rotate-3 rounded-[22px] border border-white/80 bg-[#E8E5DD] shadow-lg dark:border-white/20 dark:bg-[#353531]">
          <span className="absolute inset-x-3 top-4 h-16 rounded-[10px] border border-black/10 bg-[#171918] shadow-inner">
            <span className="absolute left-3 top-5 h-1 w-10 rounded-full" style={{ background: accent }} />
            <span className="absolute left-3 top-8 h-1 w-6 rounded-full bg-white/40" />
          </span>
          <span className="absolute bottom-7 left-4 size-8 rounded-full border-[5px]" style={{ borderColor: accent }} />
          <span className="absolute bottom-7 right-4 size-7 rounded-full bg-[#292929] shadow-[inset_2px_2px_4px_rgba(255,255,255,.16)]" />
          <span className="absolute -bottom-2 left-1/2 h-3 w-20 -translate-x-1/2 rounded-full bg-[#292929] shadow-lg" />
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-stone-500">Object study</span>
          <strong className="mt-1 block text-[14px] font-medium tracking-[-0.02em] text-[#292929] dark:text-stone-100">{productName}</strong>
        </span>
        <span className="rounded-full border border-black/[0.08] bg-white/60 px-2.5 py-1 font-mono text-[9px] text-stone-600 backdrop-blur-md dark:border-white/[0.12] dark:bg-black/20 dark:text-stone-300">
          {rendererReady ? "DRAG TO TURN" : "STATIC PREVIEW"}
        </span>
      </div>

      <button
        type="button"
        aria-expanded={detailOpen}
        onClick={() => setDetailOpen((open) => !open)}
        className="absolute left-[62%] top-[44%] z-20 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2"
      >
        <span className="grid size-5 place-items-center rounded-full border-2 border-white bg-[#4568FF] shadow-[0_0_0_5px_rgba(69,104,255,0.16),0_4px_12px_rgba(41,41,41,0.25)]">
          <span className="size-1 rounded-full bg-white" />
        </span>
        <span className="sr-only">{detailLabel}</span>
      </button>

      <div
        aria-hidden={!detailOpen}
        className={`pointer-events-none absolute bottom-4 left-4 z-20 max-w-[170px] rounded-[12px] border border-black/[0.08] bg-white/80 px-3 py-2.5 shadow-lg backdrop-blur-xl ${reduced ? "" : "transition-[opacity,transform] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)]"}`}
        style={{
          opacity: detailOpen ? 1 : 0,
          transform: detailOpen ? "translate3d(0,0,0)" : "translate3d(0,6px,0)",
        }}
      >
        <strong className="block text-[12px] font-medium text-[#292929]">{detailLabel}</strong>
        <span className="mt-0.5 block text-[10px] leading-4 text-stone-500">Machined control with a quiet detent.</span>
      </div>

      {rendererReady ? (
        <button
          type="button"
          onClick={reset}
          className={`absolute bottom-3 right-3 z-20 grid size-11 place-items-center rounded-full border border-black/[0.08] bg-white/70 text-[#292929] shadow-sm outline-none backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 dark:border-white/[0.14] dark:bg-black/25 dark:text-white ${reduced ? "" : "transition-transform duration-150 active:scale-[0.96]"}`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
            <path d="M5.4 6.2A6 6 0 1 1 4.2 11M5.4 6.2V2.9M5.4 6.2H2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">Reset view</span>
        </button>
      ) : null}
    </div>
  );
}
