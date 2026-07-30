import { useEffect, useMemo, useRef } from "react";
import type { CompactCatalogEntry } from "../data/compact-catalog";
import type { Locale, MotionFamily, MotionRecipe, ParamValues } from "../data/types";
import { text } from "../data/site";
import {
  buildRecipeCss,
  buildRecipeHtml,
  getDefaultParamValues,
  getMotionRuntimeConfig
} from "../lib/motion-engine";
import { mountMotionRuntime } from "../lib/motion-runtime";

type MotionThumbnailProps = {
  locale: Locale;
  recipe: MotionRecipe | CompactCatalogEntry;
};

function isRuntimeRecipe(
  recipe: MotionRecipe | CompactCatalogEntry
): recipe is MotionRecipe {
  return "params" in recipe && "canonicalId" in recipe;
}

function numberParam(values: ParamValues, id: string, fallback: number) {
  const value = values[id];
  return typeof value === "number" ? value : fallback;
}

/**
 * Interaction recipes need a short, pointer-free sample inside catalog cards.
 * The full recipe DOM, CSS, and runtime remain the source of truth; this driver
 * only supplies the gesture that a static card cannot receive.
 */
function mountCatalogSample(
  root: HTMLElement,
  recipe: MotionRecipe,
  values: ParamValues
) {
  const id = recipe.canonicalId;
  const config = getMotionRuntimeConfig(recipe, values, true);
  const duration = Math.min(440, Math.max(160, config.duration));
  const animations: Animation[] = [];
  const resets: Array<() => void> = [];
  const options: KeyframeAnimationOptions = {
    duration,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    iterations: 2,
    direction: "alternate"
  };

  function play(target: Element | null, keyframes: Keyframe[]) {
    if (!target) return;
    animations.push(target.animate(keyframes, options));
  }

  if (id === "hover-effect") {
    const scale = numberParam(values, "scale", 101) / 100;
    play(root.querySelector(".motion-button"), [
      { transform: "translate3d(0, 0, 0) scale(1)" },
      { transform: `translate3d(0, -${config.distance}px, 0) scale(${scale})` }
    ]);
  } else if (id === "press-tap-feedback") {
    const scale = numberParam(values, "scale", 96) / 100;
    play(root.querySelector(".motion-button"), [
      { transform: "scale(1)" },
      { transform: `scale(${scale})` }
    ]);
  } else if (id === "hold-to-confirm") {
    const progress = root.querySelector<HTMLElement>(".motion-progress");
    if (progress) {
      const previousClip = progress.style.clipPath;
      const previousOrigin = progress.style.transformOrigin;
      progress.style.clipPath = "none";
      progress.style.transformOrigin = "left center";
      resets.push(() => {
        progress.style.clipPath = previousClip;
        progress.style.transformOrigin = previousOrigin;
      });
      play(progress, [
        { transform: "scaleX(0)", opacity: 0.65 },
        { transform: "scaleX(1)", opacity: 1 }
      ]);
    }
    play(root.querySelector(".motion-button"), [
      { transform: "scale(1)" },
      { transform: `scale(${numberParam(values, "scale", 98) / 100})` }
    ]);
  } else if (id === "drag-to-reorder") {
    const items = root.querySelectorAll(".motion-list-item");
    play(items.item(0), [
      { transform: "translate3d(0, 0, 0) scale(1)" },
      { transform: "translate3d(0, 52px, 0) scale(1.03)" }
    ]);
    play(items.item(1), [
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(0, -52px, 0)" }
    ]);
  } else if (id === "swipe-to-dismiss") {
    play(root.querySelector(".motion-surface"), [
      { transform: "translate3d(0, 0, 0)", opacity: 1 },
      { transform: `translate3d(${Math.max(72, config.distance)}px, 0, 0)`, opacity: 0.3 }
    ]);
  } else if (id === "ripple") {
    const button = root.querySelector<HTMLElement>("[data-ripple-button]");
    if (button) {
      const bounds = button.getBoundingClientRect();
      button.dispatchEvent(new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        clientX: bounds.left + bounds.width / 2,
        clientY: bounds.top + bounds.height / 2,
        isPrimary: true,
        pointerId: 1
      }));
    }
  } else if (id === "before-after-slider") {
    const comparison = root.querySelector<HTMLElement>(".motion-comparison");
    const after = root.querySelector<HTMLElement>(".motion-after");
    if (after) {
      const previousClip = after.style.clipPath;
      const previousOrigin = after.style.transformOrigin;
      after.style.clipPath = "none";
      after.style.transformOrigin = "left center";
      resets.push(() => {
        after.style.clipPath = previousClip;
        after.style.transformOrigin = previousOrigin;
      });
      play(after, [
        { transform: "scaleX(0.28)" },
        { transform: "scaleX(0.76)" }
      ]);
    }
    const comparisonWidth = comparison?.getBoundingClientRect().width ?? 220;
    play(root.querySelector(".motion-divider"), [
      { transform: `translate3d(${comparisonWidth * 0.28}px, 0, 0)` },
      { transform: `translate3d(${comparisonWidth * 0.76}px, 0, 0)` }
    ]);
  }

  return () => {
    for (const animation of animations) animation.cancel();
    for (const reset of resets) reset();
  };
}

function ThumbnailVisual({ family, label }: { family: MotionFamily; label: string }) {
  if (family === "entrance") {
    return (
      <div className="thumb-card thumb-actor">
        <small>{label}</small>
        <i />
        <i />
      </div>
    );
  }

  if (family === "timeline") {
    return (
      <div className="thumb-timeline">
        <span className="thumb-actor" />
        <span className="thumb-actor" />
        <span className="thumb-actor" />
        <span className="thumb-actor" />
      </div>
    );
  }

  if (family === "transform") {
    return (
      <div className="thumb-transform-grid">
        <span aria-hidden="true" />
        <strong className="thumb-actor">{label}</strong>
      </div>
    );
  }

  if (family === "state") {
    return (
      <div className="thumb-state">
        <span />
        <strong className="thumb-actor">{label}</strong>
      </div>
    );
  }

  if (family === "scroll") {
    return (
      <div className="thumb-scroll">
        <i />
        <i />
        <strong className="thumb-actor">{label}</strong>
      </div>
    );
  }

  if (family === "feedback") {
    return (
      <div className="thumb-feedback">
        <span className="thumb-feedback-control thumb-actor">
          {label}
          <i aria-hidden="true" />
        </span>
      </div>
    );
  }

  if (family === "easing") {
    return (
      <div className="thumb-easing">
        <span className="thumb-easing-curve" />
        <i className="thumb-actor" />
        <strong>{label}</strong>
      </div>
    );
  }

  if (family === "spring") {
    return (
      <div className="thumb-spring">
        <span />
        <i className="thumb-actor" />
        <strong>{label}</strong>
      </div>
    );
  }

  if (family === "loop") {
    return (
      <div className="thumb-loop">
        <span />
        <i className="thumb-actor" />
        <strong>{label}</strong>
      </div>
    );
  }

  if (family === "effect") {
    return (
      <div className="thumb-effect">
        <strong>{label}</strong>
        <span className="thumb-actor" />
      </div>
    );
  }

  if (family === "performance") {
    return (
      <div className="thumb-performance">
        <span />
        <span />
        <span className="thumb-actor" />
        <span className="thumb-actor" />
        <span className="thumb-actor" />
      </div>
    );
  }

  return (
    <div className="thumb-principle">
      <span />
      <i className="thumb-actor" />
      <strong>{label}</strong>
    </div>
  );
}

export function MotionThumbnail({ locale, recipe }: MotionThumbnailProps) {
  const runtimeHostRef = useRef<HTMLDivElement>(null);
  const runtimeRecipe = isRuntimeRecipe(recipe) ? recipe : null;
  const values = useMemo(
    () => runtimeRecipe ? getDefaultParamValues(runtimeRecipe) : null,
    [runtimeRecipe]
  );
  const output = useMemo(
    () => runtimeRecipe && values ? ({
      css: buildRecipeCss(runtimeRecipe, values),
      html: buildRecipeHtml(runtimeRecipe, values, locale)
    }) : null,
    [locale, runtimeRecipe, values]
  );

  useEffect(() => {
    if (!runtimeRecipe || !values || !output) return;
    const activeRecipe = runtimeRecipe;
    const activeValues = values;
    const activeOutput = output;
    const host = runtimeHostRef.current;
    const thumbnail = host?.closest<HTMLElement>(".library-motion-thumb");
    const card = host?.closest<HTMLElement>(".library-card, .library-hero-preview");
    if (!host || !thumbnail || !card) return;
    const runtimeHost = host;
    const runtimeThumbnail = thumbnail;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanupRuntime: (() => void) | undefined;
    let cleanupSample: (() => void) | undefined;

    function stopPreview() {
      cleanupSample?.();
      cleanupSample = undefined;
      cleanupRuntime?.();
      cleanupRuntime = undefined;
      runtimeHost.shadowRoot?.replaceChildren();
      runtimeHost.removeAttribute("data-runtime-active");
      runtimeThumbnail.classList.remove("is-runtime-active");
    }

    function startPreview() {
      if (!finePointer.matches || reducedMotion.matches) return;
      stopPreview();
      const shadow = runtimeHost.shadowRoot ?? runtimeHost.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      const canvas = document.createElement("div");
      style.textContent = `:host{position:absolute;inset:0;display:block;overflow:hidden;pointer-events:none}
.motion-thumbnail-canvas{width:200%;height:200%;display:grid;place-items:center;transform:scale(.5);transform-origin:top left}
.motion-thumbnail-canvas>.motion-demo{width:100%;height:100%;min-height:20rem}
.motion-thumbnail-canvas .motion-action-row{display:none!important}
${activeOutput.css}`;
      canvas.className = "motion-thumbnail-canvas";
      canvas.innerHTML = activeOutput.html;
      shadow.replaceChildren(style, canvas);
      const root = canvas.querySelector<HTMLElement>(".motion-demo");
      if (!root) return;
      cleanupRuntime = mountMotionRuntime(
        root,
        getMotionRuntimeConfig(activeRecipe, activeValues, true)
      );
      cleanupSample = mountCatalogSample(root, activeRecipe, activeValues);
      runtimeHost.setAttribute("data-runtime-active", "true");
      runtimeThumbnail.classList.add("is-runtime-active");
    }

    card.addEventListener("pointerenter", startPreview);
    card.addEventListener("pointerleave", stopPreview);
    reducedMotion.addEventListener("change", stopPreview);
    return () => {
      card.removeEventListener("pointerenter", startPreview);
      card.removeEventListener("pointerleave", stopPreview);
      reducedMotion.removeEventListener("change", stopPreview);
      stopPreview();
    };
  }, [output, runtimeRecipe, values]);

  return (
    <div
      className={`motion-thumb library-motion-thumb family-${recipe.family} entry-${recipe.id}`}
      data-motion-family={recipe.family}
      aria-hidden="true"
    >
      <div className="motion-thumbnail-fallback">
        <ThumbnailVisual family={recipe.family} label={text(recipe.name, locale)} />
      </div>
      <div
        ref={runtimeHostRef}
        className="motion-thumbnail-runtime"
        data-motion-thumbnail={runtimeRecipe?.canonicalId ?? recipe.id}
      />
    </div>
  );
}
