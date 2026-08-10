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
  className?: string;
  onFocusNode?: (node: NetworkGlobeNode) => void;
};

type GlobeRuntime = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  globe: THREE.Group;
  nodeMeshes: Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>;
  arcMaterials: Map<string, THREE.LineBasicMaterial>;
};

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
  className = "",
  onFocusNode,
}: NetworkGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<GlobeRuntime | null>(null);
  const frameRef = useRef<number | null>(null);
  const requestFrameRef = useRef<() => void>(() => undefined);
  const visibleRef = useRef(true);
  const rotationRef = useRef({ y: -0.42, targetY: -0.42, dragging: false, pointerId: -1, x: 0 });
  const reduced = useReducedMotion() === true;
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const firstId = nodes[0]?.id ?? "";
  const [focusedId, setFocusedId] = useState(firstId);

  const focused = useMemo(
    () => nodes.find((node) => node.id === focusedId) ?? nodes[0],
    [focusedId, nodes],
  );

  const draw = () => {
    const runtime = runtimeRef.current;
    if (runtime) runtime.renderer.render(runtime.scene, runtime.camera);
  };

  const animate = () => {
    frameRef.current = null;
    const runtime = runtimeRef.current;
    if (!runtime || !visibleRef.current) return;
    const rotation = rotationRef.current;
    if (!reducedRef.current) {
      if (!rotation.dragging) rotation.targetY += 0.0011;
      rotation.y += (rotation.targetY - rotation.y) * 0.14;
      runtime.globe.rotation.y = rotation.y;
      draw();
      frameRef.current = requestAnimationFrame(animate);
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
    const mount = mountRef.current;
    if (!mount || nodes.length === 0) return;
    const resources = new Set<{ dispose: () => void }>();
    const track = <T extends { dispose: () => void }>(resource: T) => {
      resources.add(resource);
      return resource;
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.12, 5.15);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.prepend(renderer.domElement);

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
      new THREE.MeshPhongMaterial({
        color: 0xe8e5dd,
        transparent: true,
        opacity: 0.82,
        shininess: 12,
      }),
    );
    globe.add(new THREE.Mesh(innerGeometry, innerMaterial));

    scene.add(new THREE.HemisphereLight(0xffffff, 0x80786b, 2.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(3, 3, 4);
    scene.add(key);

    const nodeMeshes = new Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>();
    const arcMaterials = new Map<string, THREE.LineBasicMaterial>();
    const hub = pointOnGlobe(nodes[0].latitude, nodes[0].longitude, 1.58);

    nodes.forEach((node, index) => {
      const geometry = track(new THREE.SphereGeometry(index === 0 ? 0.075 : 0.055, 18, 12));
      const material = track(
        new THREE.MeshStandardMaterial({
          color: node.color ?? (index === 0 ? "#4568FF" : "#B3654A"),
          emissive: node.color ?? (index === 0 ? "#4568FF" : "#B3654A"),
          emissiveIntensity: 0.18,
          roughness: 0.42,
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

    runtimeRef.current = { renderer, scene, camera, globe, nodeMeshes, arcMaterials };

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
    requestFrameRef.current();

    return () => {
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
    };
  }, [nodes]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    runtime.nodeMeshes.forEach((mesh, id) => {
      const selected = id === focused?.id;
      mesh.scale.setScalar(selected ? 1.42 : 1);
      mesh.material.emissiveIntensity = selected ? 0.72 : 0.18;
    });
    runtime.arcMaterials.forEach((material, id) => {
      material.opacity = id === focused?.id ? 0.92 : 0.24;
    });
    requestFrameRef.current();
  }, [focused?.id]);

  useEffect(() => {
    requestFrameRef.current();
  }, [reduced]);

  const focusNode = (node: NetworkGlobeNode) => {
    setFocusedId(node.id);
    onFocusNode?.(node);
  };

  return (
    <div
      ref={mountRef}
      role="group"
      tabIndex={0}
      aria-label={`${label}. Drag or use arrow keys to rotate.`}
      onPointerDown={(event) => {
        if (!(event.target instanceof HTMLCanvasElement)) return;
        const rotation = rotationRef.current;
        rotation.dragging = true;
        rotation.pointerId = event.pointerId;
        rotation.x = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.focus({ preventScroll: true });
      }}
      onPointerMove={(event) => {
        const rotation = rotationRef.current;
        if (!rotation.dragging || rotation.pointerId !== event.pointerId) return;
        rotation.targetY += (event.clientX - rotation.x) * 0.007;
        rotation.x = event.clientX;
        requestFrame();
      }}
      onPointerUp={(event) => {
        const rotation = rotationRef.current;
        if (rotation.pointerId !== event.pointerId) return;
        rotation.dragging = false;
        rotation.pointerId = -1;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      }}
      onPointerCancel={() => {
        rotationRef.current.dragging = false;
        rotationRef.current.pointerId = -1;
      }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        rotationRef.current.targetY += event.key === "ArrowLeft" ? -0.16 : 0.16;
        event.preventDefault();
        requestFrame();
      }}
      className={`relative isolate min-h-[250px] w-full touch-none overflow-hidden rounded-[18px] border border-stone-200 bg-[#EDEBE4] outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EC] dark:border-white/[0.14] dark:bg-[#1D1D1A] dark:focus-visible:ring-[#93B0FF] dark:focus-visible:ring-offset-[#151513] ${className}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
        <span>
          <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-stone-500">Live network</span>
          <strong className="mt-1 block text-[14px] font-medium tracking-[-0.02em] text-[#292929] dark:text-stone-100">{label}</strong>
        </span>
        <span className="text-right">
          <strong className="block font-mono text-[12px] font-medium tabular-nums text-[#292929] dark:text-stone-100">{focused?.value ?? "Online"}</strong>
          <span className="mt-0.5 block text-[10px] text-stone-500">{focused?.label}</span>
        </span>
      </div>

      <div className="absolute inset-x-3 bottom-3 z-20 grid grid-cols-3 gap-1.5 rounded-[13px] border border-black/[0.08] bg-white/70 p-1.5 shadow-[0_8px_28px_-20px_rgba(41,41,41,0.55)] backdrop-blur-xl dark:border-white/[0.12] dark:bg-black/25">
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
                  ? "bg-[#292929] text-white shadow-sm dark:bg-stone-100 dark:text-[#292929]"
                  : "text-stone-600 hover:bg-black/[0.05] dark:text-stone-300 dark:hover:bg-white/[0.08]"
              }`}
            >
              {node.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
