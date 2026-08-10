"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
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
    if (typeof window === "undefined") return;
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

export function IntegrationMap({
  nodes,
  edges,
  label = "Integration map",
  width = 440,
  height = 230,
  className = "",
}: IntegrationMapProps) {
  const reduced = useReducedMotion() === true;
  const finePointer = useFinePointer();
  const { ref, active } = useAnimationActivity<HTMLDivElement>();
  const [focused, setFocused] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const activeNode = focused ?? selected;
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const related = useMemo(() => {
    if (!activeNode) return new Set(nodes.map((node) => node.id));
    const ids = new Set([activeNode]);
    for (const edge of edges) {
      if (edge.from === activeNode) ids.add(edge.to);
      if (edge.to === activeNode) ids.add(edge.from);
    }
    return ids;
  }, [activeNode, edges, nodes]);

  const onNodeKeyDown = (event: KeyboardEvent<SVGGElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelected((current) => current === id ? null : id);
    } else if (event.key === "Escape") {
      setSelected(null);
    }
  };

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label={label}
        className="block h-auto w-full overflow-visible"
        onClick={() => setSelected(null)}
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
          const pressed = selected === node.id;
          return (
            <motion.g
              key={node.id}
              role="button"
              tabIndex={0}
              aria-label={`${node.label}${node.meta ? `, ${node.meta}` : ""}`}
              aria-pressed={pressed}
              initial={false}
              animate={{ opacity: visible ? 1 : 0.3, scale: activeNode === node.id ? 1.035 : 1 }}
              transition={reduced ? INSTANT : CELL}
              style={{ transformOrigin: `${node.x}px ${node.y}px`, cursor: "pointer" }}
              onClick={(event) => {
                event.stopPropagation();
                setSelected((current) => current === node.id ? null : node.id);
              }}
              onKeyDown={(event) => onNodeKeyDown(event, node.id)}
              onFocus={() => setFocused(node.id)}
              onBlur={() => setFocused(null)}
              onMouseEnter={() => {
                if (finePointer) setFocused(node.id);
              }}
              onMouseLeave={(event) => {
                if (finePointer && typeof document !== "undefined" && document.activeElement !== event.currentTarget) setFocused(null);
              }}
              className="outline-none"
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
                {node.label}
              </text>
              {node.meta ? <text x={node.x} y={node.y + 12} textAnchor="middle" opacity="0.65" fontSize="9.5" className={colors.text}>{node.meta}</text> : null}
            </motion.g>
          );
        })}
      </svg>
      <span className="sr-only" role="status" aria-live="polite">
        {activeNode ? `${nodeById.get(activeNode)?.label ?? activeNode} connections highlighted` : ""}
      </span>
    </div>
  );
}
