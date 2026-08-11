"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

export type NetworkGlobeNode = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  value?: string;
  color?: string;
};

export type NetworkGlobeProps = {
  nodes: readonly NetworkGlobeNode[];
  label?: string;
  interactiveHint?: string;
  staticHint?: string;
  activateLabel?: string;
  liveLabel?: string;
  staticLabel?: string;
  onlineLabel?: string;
  emptyLabel?: string;
  activation?: "intent" | "auto";
  className?: string;
  onFocusNode?: (node: NetworkGlobeNode) => void;
};

type GlobeRuntime = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  globe: THREE.Group;
  nodeMeshes: Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>;
  arcMaterials: Map<string, THREE.LineBasicMaterial>;
};

const FRAME_INTERVAL_MS = 1000 / 30;
const AUTO_ROTATE_DURATION_MS = 2400;
const yieldToMain = () => new Promise<void>((resolve) => window.setTimeout(resolve, 0));

async function precompileMaterialStages(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  cancelled: () => boolean,
) {
  const renderables: Array<{ object: THREE.Object3D; visible: boolean; materialTypes: readonly string[] }> = [];
  scene.traverse((object) => {
    const material = "material" in object
      ? (object as THREE.Mesh).material
      : undefined;
    if (!material) return;
    const materials = Array.isArray(material) ? material : [material];
    renderables.push({
      object,
      visible: object.visible,
      materialTypes: materials.map((entry) => entry.type),
    });
  });
  const materialTypes = [...new Set(renderables.flatMap((entry) => entry.materialTypes))];

  for (const materialType of materialTypes) {
    await yieldToMain();
    if (cancelled()) return;
    for (const entry of renderables) {
      entry.object.visible = entry.visible && entry.materialTypes.includes(materialType);
    }
    renderer.compile(scene, camera);
  }
  for (const entry of renderables) entry.object.visible = entry.visible;
}

function applyFocusStyles(runtime: GlobeRuntime, focusedId: string | undefined) {
  runtime.nodeMeshes.forEach((mesh, id) => {
    const selected = id === focusedId;
    mesh.scale.setScalar(selected ? 1.42 : 1);
    mesh.material.opacity = selected ? 1 : 0.72;
  });
  runtime.arcMaterials.forEach((material, id) => {
    material.opacity = id === focusedId ? 0.92 : 0.24;
  });
}

function pointOnGlobe(latitude: number, longitude: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function arcBetween(start: THREE.Vector3, end: THREE.Vector3) {
  const distance = start.distanceTo(end);
  const middle = start
    .clone()
    .add(end)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(1.64 + distance * 0.24);
  return new THREE.QuadraticBezierCurve3(start, middle, end).getPoints(42);
}

export function NetworkGlobe({
  nodes,
  label = "Global network",
  interactiveHint = "Drag or use arrow keys to rotate.",
  staticHint = "Static network preview.",
  activateLabel = "Explore 3D",
  liveLabel = "Live network",
  staticLabel = "Static network",
  onlineLabel = "Online",
  emptyLabel = "No network nodes available.",
  activation = "intent",
  className = "",
  onFocusNode,
}: NetworkGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<GlobeRuntime | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const autoRotateUntilRef = useRef(0);
  const requestFrameRef = useRef<() => void>(() => undefined);
  const focusAfterActivationRef = useRef(false);
  const visibleRef = useRef(true);
  const rotationRef = useRef({ y: -0.42, targetY: -0.42, dragging: false, pointerId: -1, x: 0 });
  const sceneNodesRef = useRef(nodes);
  sceneNodesRef.current = nodes;
  const reduced = useReducedMotion() === true;
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const [activationRequested, setActivationRequested] = useState(activation === "auto");
  const firstId = nodes[0]?.id ?? "";
  const [focusedId, setFocusedId] = useState(firstId);
  const [rendererReady, setRendererReady] = useState(false);
  const sceneSignature = JSON.stringify(
    nodes.map(({ id, latitude, longitude, color }) => [id, latitude, longitude, color]),
  );
  const effectiveFocusedId = nodes.some((node) => node.id === focusedId)
    ? focusedId
    : firstId;
  const effectiveFocusedIdRef = useRef(effectiveFocusedId);
  effectiveFocusedIdRef.current = effectiveFocusedId;

  const focused = useMemo(
    () => nodes.find((node) => node.id === effectiveFocusedId),
    [effectiveFocusedId, nodes],
  );

  useEffect(() => {
    if (focusedId !== effectiveFocusedId) setFocusedId(effectiveFocusedId);
  }, [effectiveFocusedId, focusedId]);

  useEffect(() => {
    if (activation === "auto") setActivationRequested(true);
  }, [activation]);

  const draw = () => {
    const runtime = runtimeRef.current;
    if (runtime) runtime.renderer.render(runtime.scene, runtime.camera);
  };

  const animate = (timestamp: number) => {
    frameRef.current = null;
    const runtime = runtimeRef.current;
    if (!runtime || !visibleRef.current) return;
    const elapsed = lastFrameTimeRef.current > 0
      ? timestamp - lastFrameTimeRef.current
      : FRAME_INTERVAL_MS;
    if (lastFrameTimeRef.current > 0 && elapsed < FRAME_INTERVAL_MS) {
      frameRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameTimeRef.current = timestamp;
    const rotation = rotationRef.current;
    if (!reducedRef.current) {
      const autoRotating = !rotation.dragging && timestamp < autoRotateUntilRef.current;
      if (autoRotating) rotation.targetY += 0.0011 * Math.min(2, Math.max(1, elapsed / 16.67));
      rotation.y += (rotation.targetY - rotation.y) * 0.14;
      runtime.globe.rotation.y = rotation.y;
      draw();
      const moving = rotation.dragging || autoRotating || Math.abs(rotation.targetY - rotation.y) > 0.0005;
      if (moving) frameRef.current = requestAnimationFrame(animate);
    } else {
      runtime.globe.rotation.y = rotation.targetY;
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
    if (!activationRequested) return;
    const mount = mountRef.current;
    const sceneNodes = sceneNodesRef.current;
    if (!mount || sceneNodes.length === 0) {
      setRendererReady(false);
      return;
    }
    let cancelled = false;
    const resources = new Set<{ dispose: () => void }>();
    const track = <T extends { dispose: () => void }>(resource: T) => {
      resources.add(resource);
      return resource;
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.12, 5.15);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      setRendererReady(false);
      if (activation === "intent") setActivationRequested(false);
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.prepend(renderer.domElement);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      const rotation = rotationRef.current;
      if (rotation.pointerId >= 0 && mount.hasPointerCapture(rotation.pointerId)) {
        mount.releasePointerCapture(rotation.pointerId);
      }
      rotation.dragging = false;
      rotation.pointerId = -1;
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

    const globe = new THREE.Group();
    globe.rotation.set(-0.12, rotationRef.current.y, 0.02);
    scene.add(globe);

    const sphereGeometry = track(new THREE.SphereGeometry(1.55, 28, 20));
    const sphereMaterial = track(
      new THREE.MeshBasicMaterial({
        color: 0x77756f,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      }),
    );
    globe.add(new THREE.Mesh(sphereGeometry, sphereMaterial));

    const innerGeometry = track(new THREE.SphereGeometry(1.515, 40, 28));
    const innerMaterial = track(
      new THREE.MeshBasicMaterial({
        color: 0xe8e5dd,
        transparent: true,
        opacity: 0.82,
      }),
    );
    globe.add(new THREE.Mesh(innerGeometry, innerMaterial));

    const nodeMeshes = new Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>();
    const arcMaterials = new Map<string, THREE.LineBasicMaterial>();
    const hub = pointOnGlobe(sceneNodes[0].latitude, sceneNodes[0].longitude, 1.58);

    sceneNodes.forEach((node, index) => {
      const geometry = track(new THREE.SphereGeometry(index === 0 ? 0.075 : 0.055, 18, 12));
      const material = track(
        new THREE.MeshBasicMaterial({
          color: node.color ?? (index === 0 ? "#4568FF" : "#B3654A"),
          transparent: true,
          opacity: 0.72,
        }),
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pointOnGlobe(node.latitude, node.longitude, 1.59));
      globe.add(mesh);
      nodeMeshes.set(node.id, mesh);

      if (index > 0) {
        const arcGeometry = track(
          new THREE.BufferGeometry().setFromPoints(
            arcBetween(hub, pointOnGlobe(node.latitude, node.longitude, 1.58)),
          ),
        );
        const arcMaterial = track(
          new THREE.LineBasicMaterial({
            color: node.color ?? "#7B8A72",
            transparent: true,
            opacity: 0.4,
          }),
        );
        globe.add(new THREE.Line(arcGeometry, arcMaterial));
        arcMaterials.set(node.id, arcMaterial);
      }
    });

    const runtime = { renderer, scene, camera, globe, nodeMeshes, arcMaterials };
    applyFocusStyles(runtime, effectiveFocusedIdRef.current || undefined);
    runtimeRef.current = runtime;

    const resize = new ResizeObserver(([entry]) => {
      const width = Math.max(1, entry.contentRect.width);
      const height = Math.max(1, entry.contentRect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      requestFrameRef.current();
    });
    resize.observe(mount);

    let intersecting = true;
    const intersection = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      visibleRef.current = intersecting && !document.hidden;
      if (visibleRef.current) requestFrameRef.current();
      else if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    });
    const onVisibility = () => {
      visibleRef.current = intersecting && !document.hidden;
      if (visibleRef.current) requestFrameRef.current();
      else if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
    intersection.observe(mount);
    document.addEventListener("visibilitychange", onVisibility);
    void precompileMaterialStages(renderer, scene, camera, () => cancelled).then(() => {
      if (cancelled) return;
      lastFrameTimeRef.current = 0;
      autoRotateUntilRef.current = performance.now() + AUTO_ROTATE_DURATION_MS;
      setRendererReady(true);
      requestFrameRef.current();
    });

    return () => {
      cancelled = true;
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      resources.forEach((resource) => resource.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      runtimeRef.current = null;
      frameRef.current = null;
      lastFrameTimeRef.current = 0;
    };
  }, [activation, activationRequested, sceneSignature]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    applyFocusStyles(runtime, focused?.id);
    requestFrameRef.current();
  }, [focused?.id]);

  useEffect(() => {
    requestFrameRef.current();
  }, [reduced]);

  useEffect(() => {
    if (!rendererReady || !focusAfterActivationRef.current) return;
    focusAfterActivationRef.current = false;
    mountRef.current?.focus({ preventScroll: true });
  }, [rendererReady]);

  const focusNode = (node: NetworkGlobeNode) => {
    setFocusedId(node.id);
    onFocusNode?.(node);
  };

  return (
    <div
      ref={mountRef}
      data-webgl-root="network-globe"
      role="group"
      tabIndex={rendererReady ? 0 : undefined}
      aria-label={
        rendererReady
          ? `${label}. ${interactiveHint}`
          : `${label}. ${staticHint}`
      }
      onPointerDown={(event) => {
        if (!rendererReady || !(event.target instanceof HTMLCanvasElement)) return;
        const rotation = rotationRef.current;
        autoRotateUntilRef.current = 0;
        rotation.dragging = true;
        rotation.pointerId = event.pointerId;
        rotation.x = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.focus({ preventScroll: true });
      }}
      onPointerMove={(event) => {
        if (!rendererReady) return;
        const rotation = rotationRef.current;
        if (!rotation.dragging || rotation.pointerId !== event.pointerId) return;
        rotation.targetY += (event.clientX - rotation.x) * 0.007;
        rotation.x = event.clientX;
        requestFrame();
      }}
      onPointerUp={(event) => {
        if (!rendererReady) return;
        const rotation = rotationRef.current;
        if (rotation.pointerId !== event.pointerId) return;
        rotation.dragging = false;
        rotation.pointerId = -1;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      }}
      onPointerCancel={() => {
        if (!rendererReady) return;
        rotationRef.current.dragging = false;
        rotationRef.current.pointerId = -1;
      }}
      onLostPointerCapture={() => {
        rotationRef.current.dragging = false;
        rotationRef.current.pointerId = -1;
      }}
      onKeyDown={
        rendererReady
          ? (event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              autoRotateUntilRef.current = 0;
              rotationRef.current.targetY += event.key === "ArrowLeft" ? -0.16 : 0.16;
              event.preventDefault();
              requestFrame();
            }
          : undefined
      }
      className={`relative isolate min-h-[250px] w-full overflow-hidden rounded-[18px] border border-stone-200 bg-[#EDEBE4] outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EC] dark:border-white/[0.14] dark:bg-[#1D1D1A] dark:focus-visible:ring-[#93B0FF] dark:focus-visible:ring-offset-[#151513] ${rendererReady ? "touch-none" : "touch-pan-y"} ${className}`}
    >
      <div
        data-webgl-fallback="network-globe"
        aria-hidden
        className={`pointer-events-none absolute inset-0 grid place-items-center ${rendererReady ? "opacity-0" : "opacity-100"}`}
      >
        <div className="relative size-40 rounded-full border border-stone-400/35 bg-[#DDE4D5] shadow-md dark:border-white/20 dark:bg-[#2A2A27]">
          <span className="absolute inset-[18%] rounded-full border border-stone-500/20" />
          <span className="absolute inset-x-2 top-1/2 border-t border-stone-500/20" />
          <span className="absolute inset-y-2 left-1/2 border-l border-stone-500/20" />
          {nodes.slice(0, 6).map((node, index) => (
            <span
              key={node.id}
              className="absolute size-2 rounded-full border border-white/80 shadow-[0_2px_8px_rgba(41,41,41,.3)]"
              style={{
                left: `${20 + ((node.longitude + 180) / 360) * 60}%`,
                top: `${18 + ((90 - node.latitude) / 180) * 64}%`,
                background: node.color ?? (index === 0 ? "#4568FF" : "#B3654A"),
              }}
            />
          ))}
        </div>
      </div>

      {!rendererReady && activation === "intent" && nodes.length > 0 ? (
        <button
          type="button"
          data-webgl-activation="network-globe"
          disabled={activationRequested}
          onClick={() => {
            focusAfterActivationRef.current = true;
            setActivationRequested(true);
          }}
          className="absolute left-1/2 top-1/2 z-30 min-h-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/90 px-4 text-[12px] font-semibold text-[#292929] shadow-[0_4px_8px_-4px_rgba(41,41,41,.6)] outline-none backdrop-blur-md focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 disabled:opacity-60 dark:border-white/15 dark:bg-[#292927]/90 dark:text-white"
        >
          {activateLabel}
        </button>
      ) : null}

      {nodes.length === 0 ? (
        <p role="status" className="absolute inset-x-4 top-1/2 z-20 -translate-y-1/2 text-center text-[12px] font-medium text-stone-700 dark:text-stone-200">
          {emptyLabel}
        </p>
      ) : null}

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
        <span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300">
            {rendererReady ? liveLabel : staticLabel}
          </span>
          <strong className="mt-1 block text-[14px] font-medium tracking-[-0.02em] text-[#292929] dark:text-stone-100">{label}</strong>
        </span>
        {focused ? <span className="text-right">
          <strong className="block font-mono text-[12px] font-medium tabular-nums text-[#292929] dark:text-stone-100">{focused?.value ?? onlineLabel}</strong>
          <span className="mt-0.5 block text-[10px] text-stone-600 dark:text-stone-300">{focused.label}</span>
        </span> : null}
      </div>

      {nodes.length > 0 ? <div className="absolute inset-x-3 bottom-3 z-20 grid grid-cols-3 gap-1.5 rounded-[13px] border border-black/[0.08] bg-white/70 p-1.5 shadow-[0_4px_8px_-6px_rgba(41,41,41,0.5)] backdrop-blur-xl dark:border-white/[0.12] dark:bg-black/25">
        {nodes.map((node) => {
          const selected = node.id === focused?.id;
          return (
            <button
              key={node.id}
              type="button"
              aria-pressed={selected}
              onClick={() => focusNode(node)}
              className={`min-h-11 min-w-0 truncate rounded-[9px] px-2 text-[11px] font-medium outline-none transition-[background-color,color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[#4568FF] ${
                selected
                  ? "bg-[#DCE4FF] shadow-[inset_0_0_0_1px_rgba(69,104,255,.42)] dark:bg-[#263358]"
                  : "text-stone-600 hover:bg-black/[0.05] dark:text-stone-300 dark:hover:bg-white/[0.08]"
              }`}
            >
              {node.label}
            </button>
          );
        })}
      </div> : null}
    </div>
  );
}
