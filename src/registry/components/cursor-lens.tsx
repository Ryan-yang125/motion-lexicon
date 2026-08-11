"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

const FOLLOW = { stiffness: 360, damping: 30, mass: 0.45 } as const;

export type CursorLensProps = {
  base: ReactNode;
  detail: ReactNode;
  label: string;
  instructions?: string;
  size?: number;
  zoom?: number;
  className?: string;
};

export function CursorLens({
  base,
  detail,
  label,
  instructions = "Use the arrow keys to move the lens. Press Escape to hide it.",
  size = 132,
  zoom = 1.35,
  className = "",
}: CursorLensProps) {
  const root = useRef<HTMLDivElement>(null);
  const pointerFocus = useRef(false);
  const touchGesture = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const [hovered, setHovered] = useState(false);
  const [touchPinned, setTouchPinned] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [rootSize, setRootSize] = useState({ width: 0, height: 0 });
  const visible = hovered || touchPinned || keyboardVisible;
  const reduced = useReducedMotion() === true;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, FOLLOW);
  const y = useSpring(rawY, FOLLOW);
  const springTransform = useTransform([x, y], ([latestX, latestY]) =>
    `translate3d(${Number(latestX) - size / 2}px, ${Number(latestY) - size / 2}px, 0)`,
  );
  const rawTransform = useTransform([rawX, rawY], ([latestX, latestY]) =>
    `translate3d(${Number(latestX) - size / 2}px, ${Number(latestY) - size / 2}px, 0)`,
  );
  const springDetailTransform = useTransform([x, y], ([latestX, latestY]) =>
    `translate3d(${size / 2 - Number(latestX) * zoom}px, ${size / 2 - Number(latestY) * zoom}px, 0) scale(${zoom})`,
  );
  const rawDetailTransform = useTransform([rawX, rawY], ([latestX, latestY]) =>
    `translate3d(${size / 2 - Number(latestX) * zoom}px, ${size / 2 - Number(latestY) * zoom}px, 0) scale(${zoom})`,
  );
  const transform = reduced ? rawTransform : springTransform;
  const detailTransform = reduced ? rawDetailTransform : springDetailTransform;

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const measure = () => {
      const next = { width: node.clientWidth, height: node.clientHeight };
      setRootSize((current) => current.width === next.width && current.height === next.height ? current : next);
    };

    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const locate = (clientX: number, clientY: number) => {
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    rawX.set(Math.max(0, Math.min(box.width, clientX - box.left)));
    rawY.set(Math.max(0, Math.min(box.height, clientY - box.top)));
  };

  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    locate(event.clientX, event.clientY);
    if (event.pointerType !== "touch") {
      setHovered(true);
      return;
    }
    const gesture = touchGesture.current;
    if (
      gesture &&
      gesture.pointerId === event.pointerId &&
      Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > 8
    ) {
      gesture.moved = true;
    }
  };

  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 24 : 10;
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    let nextX = rawX.get() || box.width / 2;
    let nextY = rawY.get() || box.height / 2;
    if (event.key === "ArrowLeft") nextX -= step;
    else if (event.key === "ArrowRight") nextX += step;
    else if (event.key === "ArrowUp") nextY -= step;
    else if (event.key === "ArrowDown") nextY += step;
    else if (event.key === "Escape") {
      setHovered(false);
      setTouchPinned(false);
      setKeyboardVisible(false);
      return;
    }
    else return;
    event.preventDefault();
    rawX.set(Math.max(0, Math.min(box.width, nextX)));
    rawY.set(Math.max(0, Math.min(box.height, nextY)));
    setKeyboardVisible(true);
  };

  return (
    <div
      ref={root}
      role="group"
      tabIndex={0}
      aria-label={label}
      onPointerEnter={pointerMove}
      onPointerMove={pointerMove}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setHovered(false);
      }}
      onPointerDown={(event) => {
        pointerFocus.current = true;
        if (event.pointerType === "touch") {
          locate(event.clientX, event.clientY);
          touchGesture.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            moved: false,
          };
        }
      }}
      onPointerUp={(event) => {
        pointerFocus.current = false;
        if (event.pointerType !== "touch") return;
        const gesture = touchGesture.current;
        touchGesture.current = null;
        if (!gesture || gesture.pointerId !== event.pointerId || gesture.moved) return;
        setKeyboardVisible(false);
        setTouchPinned((pinned) => !pinned);
      }}
      onPointerCancel={(event) => {
        pointerFocus.current = false;
        if (touchGesture.current?.pointerId === event.pointerId) {
          touchGesture.current = null;
        }
      }}
      onFocus={() => {
        if (pointerFocus.current) return;
        const box = root.current?.getBoundingClientRect();
        if (box) { rawX.set(box.width / 2); rawY.set(box.height / 2); }
      }}
      onBlur={() => {
        pointerFocus.current = false;
        touchGesture.current = null;
        setHovered(false);
        setTouchPinned(false);
        setKeyboardVisible(false);
      }}
      onKeyDown={keyDown}
      className={`relative isolate min-h-[240px] w-full overflow-hidden rounded-[16px] outline-none focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.28)] ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      <div className="absolute inset-0">{base}</div>
      <AnimatePresence>
        {visible ? (
          <motion.div
            data-cursor-lens
            data-position-mode={reduced ? "instant" : "spring"}
            aria-hidden
            initial={reduced ? { opacity: 1 } : { opacity: 0, transform: `${transform.get()} scale(.96)` }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-none absolute left-0 top-0 z-10 overflow-hidden rounded-full border border-white/70 bg-white shadow-[0_18px_38px_-18px_rgba(28,25,23,.72),inset_0_0_0_1px_rgba(41,41,41,.1)] dark:border-white/25 dark:bg-[#22221F]"
            style={{ width: size, height: size, transform }}
          >
            <motion.div
              data-cursor-lens-detail
              className="absolute left-0 top-0 origin-top-left"
              style={{
                transform: detailTransform,
                width: rootSize.width || "100%",
                height: rootSize.height || "100%",
              }}
            >
              {detail}
            </motion.div>
            <span className="absolute inset-[5px] rounded-full border border-black/10 dark:border-white/10" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <span className="sr-only">{instructions}</span>
    </div>
  );
}
