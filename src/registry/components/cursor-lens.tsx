"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

const FOLLOW = { stiffness: 360, damping: 30, mass: 0.45 } as const;

export type CursorLensProps = {
  base: ReactNode;
  detail: ReactNode;
  label: string;
  size?: number;
  zoom?: number;
  className?: string;
};

export function CursorLens({
  base,
  detail,
  label,
  size = 132,
  zoom = 1.35,
  className = "",
}: CursorLensProps) {
  const root = useRef<HTMLDivElement>(null);
  const pointerFocus = useRef(false);
  const [visible, setVisible] = useState(false);
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

  const locate = (clientX: number, clientY: number) => {
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    rawX.set(Math.max(0, Math.min(box.width, clientX - box.left)));
    rawY.set(Math.max(0, Math.min(box.height, clientY - box.top)));
  };

  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    locate(event.clientX, event.clientY);
    if (event.pointerType !== "touch") setVisible(true);
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
    else if (event.key === "Escape") { setVisible(false); return; }
    else return;
    event.preventDefault();
    rawX.set(Math.max(0, Math.min(box.width, nextX)));
    rawY.set(Math.max(0, Math.min(box.height, nextY)));
    setVisible(true);
  };

  return (
    <div
      ref={root}
      role="group"
      tabIndex={0}
      aria-label={label}
      onPointerEnter={pointerMove}
      onPointerMove={pointerMove}
      onPointerLeave={() => setVisible(false)}
      onPointerDown={(event) => {
        pointerFocus.current = true;
        if (event.pointerType === "touch") {
          locate(event.clientX, event.clientY);
          setVisible((value) => !value);
        }
      }}
      onPointerUp={() => { pointerFocus.current = false; }}
      onPointerCancel={() => { pointerFocus.current = false; }}
      onFocus={() => {
        if (pointerFocus.current) return;
        const box = root.current?.getBoundingClientRect();
        if (box) { rawX.set(box.width / 2); rawY.set(box.height / 2); }
      }}
      onBlur={() => { pointerFocus.current = false; setVisible(false); }}
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
              className="absolute left-0 top-0 h-[240px] w-full origin-top-left"
              style={{ transform: detailTransform, width: root.current?.clientWidth || "100%" }}
            >
              {detail}
            </motion.div>
            <span className="absolute inset-[5px] rounded-full border border-black/10 dark:border-white/10" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <span className="sr-only">Use the arrow keys to move the lens. Press Escape to hide it.</span>
    </div>
  );
}
