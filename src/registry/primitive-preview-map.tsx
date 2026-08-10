import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from "react";
import type { Locale, MotionRecipe, ParamValues } from "@/data/types";
import type { PrimitiveDemoProps } from "./primitive-demos/_shared";
import { PrimitiveGuidePreview } from "./primitive-guide-preview";

type DemoModule = Record<string, ComponentType<PrimitiveDemoProps>>;

const demoLoaders: Record<string, () => Promise<DemoModule>> = {
  "fade-in-fade-out": () => import("./primitive-demos/fade-in-fade-out-demo"),
  "slide-in": () => import("./primitive-demos/slide-in-demo"),
  "scale-in": () => import("./primitive-demos/scale-in-demo"),
  "reveal": () => import("./primitive-demos/reveal-demo"),
  "stagger": () => import("./primitive-demos/stagger-demo"),
  "keyframes": () => import("./primitive-demos/keyframes-demo"),
  "duration": () => import("./primitive-demos/duration-demo"),
  "translate": () => import("./primitive-demos/translate-demo"),
  "3d-tilt-flip": () => import("./primitive-demos/3d-tilt-flip-demo"),
  "origin-aware-animation": () => import("./primitive-demos/origin-aware-animation-demo"),
  "crossfade": () => import("./primitive-demos/crossfade-demo"),
  "morph": () => import("./primitive-demos/morph-demo"),
  "accordion-collapse": () => import("./primitive-demos/accordion-collapse-demo"),
  "direction-aware-transition": () => import("./primitive-demos/direction-aware-transition-demo"),
  "scroll-reveal": () => import("./primitive-demos/scroll-reveal-demo"),
  "scroll-driven-animation": () => import("./primitive-demos/scroll-driven-animation-demo"),
  "parallax": () => import("./primitive-demos/parallax-demo"),
  "page-transition": () => import("./primitive-demos/page-transition-demo"),
  "hover-effect": () => import("./primitive-demos/hover-effect-demo"),
  "press-tap-feedback": () => import("./primitive-demos/press-tap-feedback-demo"),
  "hold-to-confirm": () => import("./primitive-demos/hold-to-confirm-demo"),
  "drag-to-reorder": () => import("./primitive-demos/drag-to-reorder-demo"),
  "swipe-to-dismiss": () => import("./primitive-demos/swipe-to-dismiss-demo"),
  "shake-wiggle": () => import("./primitive-demos/shake-wiggle-demo"),
  "ripple": () => import("./primitive-demos/ripple-demo"),
  "easing": () => import("./primitive-demos/easing-demo"),
  "spring": () => import("./primitive-demos/spring-demo"),
  "loop": () => import("./primitive-demos/loop-demo"),
  "marquee": () => import("./primitive-demos/marquee-demo"),
  "orbit": () => import("./primitive-demos/orbit-demo"),
  "idle-animation": () => import("./primitive-demos/idle-animation-demo"),
  "blur": () => import("./primitive-demos/blur-demo"),
  "before-after-slider": () => import("./primitive-demos/before-after-slider-demo"),
  "line-drawing": () => import("./primitive-demos/line-drawing-demo"),
  "text-morph": () => import("./primitive-demos/text-morph-demo"),
  "skeleton-shimmer": () => import("./primitive-demos/skeleton-shimmer-demo"),
  "number-ticker": () => import("./primitive-demos/number-ticker-demo"),
  "typewriter": () => import("./primitive-demos/typewriter-demo"),
  "compositing": () => import("./primitive-demos/compositing-demo"),
  "anticipation": () => import("./primitive-demos/anticipation-demo"),
};

const lazyDemos = Object.fromEntries(
  Object.entries(demoLoaders).map(([id, loader]) => [
    id,
    lazy(async () => {
      const module = await loader();
      const Demo = Object.entries(module).find(([name]) => name.endsWith("Demo"))?.[1];
      if (!Demo) throw new Error(`Missing primitive demo export for ${id}`);
      return { default: Demo };
    }),
  ]),
) as Record<string, ReturnType<typeof lazy<ComponentType<PrimitiveDemoProps>>>>;

function PreviewFallback() {
  return <div className="registry-preview-loading" aria-hidden="true" />;
}

export function PrimitivePreview({
  locale,
  recipe,
  values,
  deferred = false,
  compact = false,
  replayKey = 0,
}: {
  locale: Locale;
  recipe: MotionRecipe;
  values: ParamValues;
  deferred?: boolean;
  compact?: boolean;
  replayKey?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(!deferred);
  const Demo = lazyDemos[recipe.id];

  useEffect(() => {
    if (!deferred || !frameRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "180px" });
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [deferred]);

  return (
    <div className="registry-preview primitive-registry-preview" ref={frameRef} data-primitive={recipe.id}>
      {recipe.surfaceType === "guide" ? (
        <PrimitiveGuidePreview locale={locale} recipe={recipe} compact={compact} />
      ) : active && Demo ? (
        <Suspense fallback={<PreviewFallback />}>
          <Demo key={`${recipe.id}:${replayKey}`} locale={locale} values={values} compact={compact} replayKey={replayKey} />
        </Suspense>
      ) : (
        <PreviewFallback />
      )}
    </div>
  );
}
