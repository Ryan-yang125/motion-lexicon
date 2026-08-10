// @vitest-environment jsdom

import type { HTMLAttributes, ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SkeletonReveal } from "@/registry/components/skeleton-reveal";

vi.mock("motion/react", () => {
  type MotionDivProps = HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
    layout?: boolean;
    initial?: unknown;
    animate?: unknown;
    transition?: unknown;
  };
  const MotionDiv = ({ children, layout, initial, animate, transition, ...props }: MotionDivProps) => {
    void layout;
    void initial;
    void animate;
    void transition;
    return <div {...props}>{children}</div>;
  };
  return { motion: { div: MotionDiv }, useReducedMotion: () => true };
});

describe("SkeletonReveal server markup", () => {
  it("makes loaded content inert before hydration while loading", () => {
    const html = renderToString(
      <SkeletonReveal
        loading
        skeleton={<button type="button">Skeleton action</button>}
      >
        <button type="button">Loaded action</button>
      </SkeletonReveal>,
    );
    const container = document.createElement("div");
    container.innerHTML = html;
    const skeleton = container.querySelector('[data-skeleton-reveal-layer="skeleton"]');
    const content = container.querySelector('[data-skeleton-reveal-layer="content"]');

    expect(skeleton).not.toHaveAttribute("inert");
    expect(skeleton).toHaveAttribute("aria-hidden", "false");
    expect(content).toHaveAttribute("inert");
    expect(content).toHaveAttribute("aria-hidden", "true");
  });

  it("makes the skeleton inert before hydration once content is loaded", () => {
    const html = renderToString(
      <SkeletonReveal
        loading={false}
        skeleton={<button type="button">Skeleton action</button>}
      >
        <button type="button">Loaded action</button>
      </SkeletonReveal>,
    );
    const container = document.createElement("div");
    container.innerHTML = html;
    const skeleton = container.querySelector('[data-skeleton-reveal-layer="skeleton"]');
    const content = container.querySelector('[data-skeleton-reveal-layer="content"]');

    expect(skeleton).toHaveAttribute("inert");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(content).not.toHaveAttribute("inert");
    expect(content).toHaveAttribute("aria-hidden", "false");
  });
});
