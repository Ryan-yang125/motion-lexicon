import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { usePressDepth } from "./press-depth";
import { useRipple } from "./ripple";

const ARRIVE = [0.23, 1, 0.32, 1] as const;
const BLOOM = { duration: 0.14, ease: ARRIVE } as const;
const BASE = 40;

type CardLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> & {
  children: ReactNode;
  className?: string;
  to: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
};

export function CardLink({
  children,
  className = "",
  style,
  to,
  params,
  search,
  ...props
}: CardLinkProps) {
  const { bind: rippleBind, ripples, fadeDuration } = useRipple({ max: 3 });
  const { bind: pressBind, pressed, ref: pressRef } = usePressDepth();
  const reduced = useReducedMotion();

  return (
    <Link
      ref={pressRef}
      to={to as never}
      params={params as never}
      search={search as never}
      {...props}
      data-interior-card=""
      data-pressed={pressed ? "" : undefined}
      className={className}
      style={{
        ...style,
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        transform: pressed && !reduced ? "translateY(1px) scale(.992)" : undefined,
        transition: reduced ? "none" : "transform 150ms cubic-bezier(.23,1,.32,1)"
      }}
      onPointerDown={(event) => {
        rippleBind.onPointerDown(event);
        pressBind.onPointerDown(event);
        props.onPointerDown?.(event as never);
      }}
      onPointerUp={(event) => {
        rippleBind.onPointerUp(event);
        props.onPointerUp?.(event as never);
      }}
      onPointerCancel={(event) => {
        rippleBind.onPointerCancel(event);
        props.onPointerCancel?.(event as never);
      }}
      onLostPointerCapture={(event) => {
        rippleBind.onLostPointerCapture(event);
        props.onLostPointerCapture?.(event as never);
      }}
      onKeyDown={(event) => {
        rippleBind.onKeyDown(event);
        pressBind.onKeyDown(event);
        props.onKeyDown?.(event as never);
      }}
      onKeyUp={(event) => {
        rippleBind.onKeyUp(event);
        pressBind.onKeyUp(event);
        props.onKeyUp?.(event as never);
      }}
      onBlur={(event) => {
        rippleBind.onBlur();
        pressBind.onBlur();
        props.onBlur?.(event as never);
      }}
    >
      <span aria-hidden="true" className="interior-card-ripples">
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="interior-card-ripple"
            style={{
              left: ripple.x - BASE / 2,
              top: ripple.y - BASE / 2,
              width: BASE,
              height: BASE,
              willChange: "transform, opacity"
            }}
            initial={{
              transform: `scale(${reduced ? ripple.scale : 0.95})`,
              opacity: 0,
            }}
            animate={{
              transform: `scale(${ripple.scale})`,
              opacity: reduced || ripple.released ? 0 : 1,
            }}
            transition={{
              transform: reduced ? { duration: 0 } : BLOOM,
              opacity: {
                duration: ripple.released ? fadeDuration : 0.07,
                ease: ripple.released ? ARRIVE : "linear"
              }
            }}
          />
        ))}
      </span>
      {children}
    </Link>
  );
}
