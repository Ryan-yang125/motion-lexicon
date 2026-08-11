"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const DRAW = { duration: 0.38, ease: [0.23, 1, 0.32, 1] } as const;
const CELL = { type: "spring", stiffness: 520, damping: 38, mass: 0.5 } as const;
const INSTANT = { duration: 0 } as const;

export type IntegrationNodeTone = "blue" | "clay" | "moss" | "neutral";

export type IntegrationNode = {
  id: string;
  label: string;
  meta?: string;
  x: number;
  y: number;
  tone?: IntegrationNodeTone;
};

export type IntegrationEdge = {
  id?: string;
  from: string;
  to: string;
};

export type IntegrationMapProps = {
  nodes: readonly IntegrationNode[];
  edges: readonly IntegrationEdge[];
  label?: string;
  width?: number;
  height?: number;
  emptyLabel?: string;
  formatStatus?: (label: string) => string;
  className?: string;
};

const tone: Record<IntegrationNodeTone, { node: string; text: string }> = {
  blue: { node: "fill-[#EEF2FF] stroke-[#8DA2FF] dark:fill-[#20283F] dark:stroke-[#657BCB]", text: "fill-[#3347A5] dark:fill-[#B7C4FF]" },
  clay: { node: "fill-[#F4ECE8] stroke-[#C99078] dark:fill-[#352822] dark:stroke-[#9D6B55]", text: "fill-[#714635] dark:fill-[#E3B29D]" },
  moss: { node: "fill-[#EAF0EB] stroke-[#87A88F] dark:fill-[#243128] dark:stroke-[#63816A]", text: "fill-[#3F6247] dark:fill-[#A9CBB0]" },
  neutral: { node: "fill-[#F5F5F4] stroke-[#D6D3D1] dark:fill-[#252522] dark:stroke-[#57534E]", text: "fill-[#57534E] dark:fill-[#D6D3D1]" },
};

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return fine;
}

function useAnimationActivity<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    let intersecting = true;
    let visible = !document.hidden;
    const update = () => setActive(intersecting && visible);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    const onVisibility = () => {
      visible = !document.hidden;
      update();
    };
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return { ref, active };
}

function edgePath(from: IntegrationNode, to: IntegrationNode) {
  const middle = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} C ${middle} ${from.y}, ${middle} ${to.y}, ${to.x} ${to.y}`;
}

function fitNodeText(value: string, maxUnits: number) {
  const characters = Array.from(value);
  let units = 0;
  let result = "";
  for (const character of characters) {
    const next = (character.codePointAt(0) ?? 0) <= 0xff ? 0.55 : 1;
    if (units + next > maxUnits) return `${result.trimEnd()}…`;
    result += character;
    units += next;
  }
  return result;
}

export function IntegrationMap({
  nodes,
  edges,
  label = "Integration map",
  width = 440,
  height = 230,
  emptyLabel = "No integrations available",
  formatStatus = (name) => `${name} connections highlighted`,
  className = "",
}: IntegrationMapProps) {
  const resolvedWidth = Number.isFinite(width) && width > 0 ? width : 440;
  const resolvedHeight = Number.isFinite(height) && height > 0 ? height : 230;
  const reduced = useReducedMotion() === true;
  const finePointer = useFinePointer();
  const { ref, active } = useAnimationActivity<HTMLDivElement>();
  const [keyboardFocused, setKeyboardFocused] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const validKeyboardFocused = keyboardFocused && nodeById.has(keyboardFocused) ? keyboardFocused : null;
  const validHovered = hovered && nodeById.has(hovered) ? hovered : null;
  const validSelected = selected && nodeById.has(selected) ? selected : null;
  const activeNode = validHovered ?? validKeyboardFocused ?? validSelected;

  useEffect(() => {
    if (keyboardFocused && !nodeById.has(keyboardFocused)) setKeyboardFocused(null);
    if (hovered && !nodeById.has(hovered)) setHovered(null);
    if (selected && !nodeById.has(selected)) setSelected(null);
  }, [hovered, keyboardFocused, nodeById, selected]);

  const related = useMemo(() => {
    if (!activeNode) return new Set(nodes.map((node) => node.id));
    const ids = new Set([activeNode]);
    for (const edge of edges) {
      if (edge.from === activeNode) ids.add(edge.to);
      if (edge.to === activeNode) ids.add(edge.from);
    }
    return ids;
  }, [activeNode, edges, nodes]);

  if (nodes.length === 0) {
    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={`grid min-h-28 w-full place-items-center rounded-[12px] border border-stone-200 bg-white px-4 text-center text-[12px] text-stone-600 dark:border-white/[0.14] dark:bg-[#1D1D1A] dark:text-stone-300 ${className}`}
      >
        <span role="status">{emptyLabel}</span>
      </div>
    );
  }

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="relative">
        <svg
          viewBox={`0 0 ${resolvedWidth} ${resolvedHeight}`}
          aria-hidden="true"
          focusable="false"
          className="block h-auto w-full overflow-visible"
        >
        <g aria-hidden="true">
          {edges.map((edge, index) => {
            const from = nodeById.get(edge.from);
            const to = nodeById.get(edge.to);
            if (!from || !to) return null;
            const id = edge.id ?? `${edge.from}-${edge.to}-${index}`;
            const connected = !activeNode || edge.from === activeNode || edge.to === activeNode;
            const path = edgePath(from, to);
            return (
              <g key={id}>
                <motion.path
                  d={path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: connected ? 0.42 : 0.1 }}
                  transition={reduced ? INSTANT : { ...DRAW, delay: index * 0.04 }}
                  className="text-stone-400 dark:text-stone-500"
                />
                <motion.path
                  d={path}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="2 22"
                  initial={false}
                  animate={{
                    opacity: connected ? 0.9 : 0,
                    strokeDashoffset: reduced || !active ? 0 : -48,
                  }}
                  transition={
                    reduced || !active || !connected
                      ? INSTANT
                      : {
                          opacity: { duration: 0.16, ease: [0.23, 1, 0.32, 1] },
                          strokeDashoffset: { duration: 1.5 + index * 0.16, ease: "linear", repeat: Infinity },
                        }
                  }
                  className="stroke-[#4568FF] dark:stroke-[#93B0FF]"
                />
              </g>
            );
          })}
        </g>

        {nodes.map((node) => {
          const colors = tone[node.tone ?? "neutral"];
          const visible = related.has(node.id);
          return (
            <motion.g
              key={node.id}
              initial={false}
              animate={{ opacity: visible ? 1 : 0.3, scale: activeNode === node.id ? 1.035 : 1 }}
              transition={reduced ? INSTANT : CELL}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              <rect
                x={node.x - 48}
                y={node.y - 22}
                width="96"
                height="44"
                rx="11"
                strokeWidth={activeNode === node.id ? 2 : 1}
                className={`${colors.node} ${activeNode === node.id ? "stroke-[#4568FF] dark:stroke-[#93B0FF]" : ""}`}
              />
              <text x={node.x} y={node.y - (node.meta ? 2 : -4)} textAnchor="middle" fontSize="12" fontWeight="600" className={colors.text}>
                {fitNodeText(node.label, 7.4)}
              </text>
              {node.meta ? <text x={node.x} y={node.y + 12} textAnchor="middle" fontSize="9.5" className={colors.text}>{fitNodeText(node.meta, 9.2)}</text> : null}
            </motion.g>
          );
        })}
        </svg>
        <div
          role="group"
          aria-label={label}
          className="absolute inset-0"
          onClick={() => setSelected(null)}
        >
          {nodes.map((node) => (
            <button
              key={node.id}
              data-integration-map-node={node.id}
              type="button"
              aria-label={`${node.label}${node.meta ? `, ${node.meta}` : ""}`}
              aria-pressed={validSelected === node.id}
              onClick={(event) => {
                event.stopPropagation();
                setSelected((current) => current === node.id ? null : node.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSelected(null);
              }}
              onFocus={() => setKeyboardFocused(node.id)}
              onBlur={() => setKeyboardFocused((current) => current === node.id ? null : current)}
              onMouseEnter={() => {
                if (finePointer) setHovered(node.id);
              }}
              onMouseLeave={() => {
                if (finePointer) setHovered((current) => current === node.id ? null : current);
              }}
              className="absolute min-h-11 min-w-11 rounded-[11px] bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-1 dark:focus-visible:ring-[#93B0FF]"
              style={{
                left: `${(node.x / resolvedWidth) * 100}%`,
                top: `${(node.y / resolvedHeight) * 100}%`,
                width: `${(96 / resolvedWidth) * 100}%`,
                height: `${(44 / resolvedHeight) * 100}%`,
                minWidth: 44,
                minHeight: 44,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {activeNode ? formatStatus(nodeById.get(activeNode)?.label ?? activeNode) : ""}
      </span>
    </div>
  );
}
