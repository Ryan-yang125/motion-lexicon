import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
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
  const config = getMotionRuntimeConfig(recipe, values, false);
  const duration = Math.min(440, Math.max(160, config.duration));
  const animations: Animation[] = [];
  const options: KeyframeAnimationOptions = {
    duration,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    iterations: 2,
    direction: "alternate",
    fill: "both"
  };

  function play(target: Element | null, keyframes: Keyframe[]) {
    if (!target) return;
    const animation = target.animate(keyframes, options);
    animation.pause();
    animation.currentTime = 0;
    animations.push(animation);
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
    play(progress, [
      { clipPath: "inset(0 100% 0 0)", opacity: 1 },
      { clipPath: "inset(0 0 0 0)", opacity: 1 }
    ]);
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
      const ink = button.querySelector<HTMLElement>("[data-catalog-sample-ripple]");
      play(ink, [
        { opacity: 0, transform: "translate(-50%, -50%) scale(0.95)" },
        { opacity: config.rippleOpacity / 100, transform: "translate(-50%, -50%) scale(6)" }
      ]);
    }
  } else if (id === "before-after-slider") {
    const after = root.querySelector<HTMLElement>(".motion-after");
    const destination = config.position >= 62 ? 28 : 76;
    play(after, [
      { clipPath: `inset(0 ${100 - config.position}% 0 0)` },
      { clipPath: `inset(0 ${100 - destination}% 0 0)` }
    ]);
    play(root.querySelector(".motion-divider"), [
      { insetInlineStart: `${config.position}%`, transform: "translate3d(-1px, 0, 0)" },
      { insetInlineStart: `${destination}%`, transform: "translate3d(-1px, 0, 0)" }
    ]);
  } else if (["scroll-reveal", "scroll-driven-animation", "parallax"].includes(id)) {
    play(root.querySelector(".motion-surface"), id === "scroll-reveal"
      ? [
          { transform: "translate3d(0, 0, 0)", opacity: 1 },
          { transform: `translate3d(0, ${Math.max(24, config.distance)}px, 0)`, opacity: 0.2 }
        ]
      : [
          { transform: "translate3d(0, 0, 0)" },
          { transform: `translate3d(0, -${Math.max(24, config.distance)}px, 0)` }
        ]);
  } else if (id === "spring") {
    play(root.querySelector("[data-spring-target]"), [
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
      { transform: `translate3d(0, -${config.distance}px, 0) scale(0.94)`, opacity: 0.78 },
      { transform: `translate3d(0, ${Math.round(config.distance * 0.14)}px, 0) scale(1.02)`, opacity: 1 },
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 }
    ]);
  }

  return () => {
    for (const animation of animations) animation.cancel();
  };
}

const catalogStaticPreviewTime = 5_000;

function freezeCatalogAnimations(animations: readonly Animation[]) {
  for (const animation of animations) {
    const effect = animation.effect;
    const computed = effect?.getComputedTiming();
    const timing = effect?.getTiming();
    const delay = typeof timing?.delay === "number" ? timing.delay : 0;

    animation.pause();
    if (typeof computed?.endTime === "number" && Number.isFinite(computed.endTime)) {
      animation.currentTime = computed.endTime;
    } else if (typeof computed?.endTime === "number") {
      animation.currentTime = Math.max(0, delay + catalogStaticPreviewTime);
    }
  }
}

function playCatalogAnimations(animations: readonly Animation[]) {
  const finishListeners: Array<[Animation, () => void]> = [];

  for (const animation of animations) {
    animation.pause();
    const endTime = animation.effect?.getComputedTiming().endTime;
    if (typeof endTime === "number" && Number.isFinite(endTime)) {
      const currentTime = animation.currentTime;
      const speed = Math.max(0.01, Math.abs(animation.playbackRate || 1));
      if (typeof currentTime === "number" && currentTime >= endTime - 1) {
        animation.updatePlaybackRate(-speed);
      } else if (typeof currentTime === "number" && currentTime <= 1) {
        animation.updatePlaybackRate(speed);
      }

      const bounce = () => {
        const nextSpeed = Math.max(0.01, Math.abs(animation.playbackRate || 1));
        animation.updatePlaybackRate(animation.playbackRate >= 0 ? -nextSpeed : nextSpeed);
        void animation.play();
      };
      animation.addEventListener("finish", bounce);
      finishListeners.push([animation, bounce]);
    }
    void animation.play();
  }

  return () => {
    for (const [animation, listener] of finishListeners) {
      animation.removeEventListener("finish", listener);
    }
    for (const animation of animations) animation.pause();
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

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function buildThumbnailShadowMarkup(recipe: MotionRecipe, css: string, html: string) {
  const previewHtml = recipe.canonicalId === "ripple"
    ? html.replace(
        "</button>",
        '<span class="motion-ripple-ink" data-catalog-sample-ripple aria-hidden="true" style="left:50%;top:50%"></span></button>'
      )
    : html;
  const shadowCss = `:host{position:absolute;inset:0;display:block;overflow:hidden;pointer-events:none}
:host(:not([data-runtime-initialized])) .motion-thumbnail-canvas *,
:host(:not([data-runtime-initialized])) .motion-thumbnail-canvas *::before,
:host(:not([data-runtime-initialized])) .motion-thumbnail-canvas *::after{animation-delay:-${catalogStaticPreviewTime}ms!important;animation-play-state:paused!important;transition:none!important}
:host([data-runtime-initialized]:not([data-runtime-active])) .motion-thumbnail-canvas *,
:host([data-runtime-initialized]:not([data-runtime-active])) .motion-thumbnail-canvas *::before,
:host([data-runtime-initialized]:not([data-runtime-active])) .motion-thumbnail-canvas *::after{animation-play-state:paused!important}
[data-motion="scroll-reveal"] .motion-surface,
[data-motion="scroll-driven-animation"] .motion-surface,
[data-motion="parallax"] .motion-surface{animation:none!important}
:host(:not([data-runtime-initialized])) [data-motion="scroll-reveal"] .motion-surface,
:host(:not([data-runtime-initialized])) [data-motion="scroll-driven-animation"] .motion-surface,
:host(:not([data-runtime-initialized])) [data-motion="parallax"] .motion-surface{opacity:1!important;transform:none!important}
.motion-thumbnail-canvas{width:200%;height:200%;display:grid;place-items:center;transform:scale(.5);transform-origin:top left}
.motion-thumbnail-canvas>.motion-demo{width:100%;height:100%;min-height:20rem}
.motion-thumbnail-canvas .motion-action-row{display:none!important}
${css}`.replace(/<\/style/gi, "<\\/style");

  return `<template shadowrootmode="open" data-motion-shadow-template><style>${shadowCss}</style><div class="motion-thumbnail-canvas" inert>${previewHtml}</div></template>`;
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
  const shadowMarkup = useMemo(
    () => runtimeRecipe && output ? buildThumbnailShadowMarkup(runtimeRecipe, output.css, output.html) : null,
    [output, runtimeRecipe]
  );

  useBrowserLayoutEffect(() => {
    if (!runtimeRecipe || !values || !shadowMarkup) return;
    const activeRecipe = runtimeRecipe;
    const activeValues = values;
    const host = runtimeHostRef.current;
    const thumbnail = host?.closest<HTMLElement>(".library-motion-thumb");
    const card = host?.closest<HTMLElement>(".library-card, .library-hero-preview");
    if (!host || !thumbnail || !card) return;
    const runtimeHost = host;
    const runtimeThumbnail = thumbnail;
    runtimeHost.setAttribute("inert", "");

    const template = runtimeHost.querySelector<HTMLTemplateElement>(
      ":scope > template[data-motion-shadow-template]"
    );
    let shadow = runtimeHost.shadowRoot;
    if (template) {
      shadow ??= runtimeHost.attachShadow({ mode: "open" });
      shadow.replaceChildren(template.content);
      template.remove();
    }
    if (!shadow) return;
    const canvas = shadow.querySelector<HTMLElement>(".motion-thumbnail-canvas");
    const root = canvas?.querySelector<HTMLElement>(".motion-demo");
    if (!canvas || !root) return;
    const runtimeRoot = root;
    canvas.setAttribute("inert", "");
    for (const interactive of canvas.querySelectorAll<HTMLElement>(
      'a[href],button,input,select,textarea,summary,[tabindex],[contenteditable="true"]'
    )) {
      interactive.tabIndex = -1;
    }

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const runtimeConfig = getMotionRuntimeConfig(activeRecipe, activeValues, false);
    let disposed = false;
    let initialized = false;
    let wantsPlayback = false;
    let catalogAnimations: Animation[] = [];
    let cleanupRuntime: (() => void) | undefined;
    let cleanupSample: (() => void) | undefined;
    let cleanupPlayback: (() => void) | undefined;
    let visibilityObserver: IntersectionObserver | undefined;

    function stopPreview() {
      wantsPlayback = false;
      cleanupPlayback?.();
      cleanupPlayback = undefined;
      runtimeHost.removeAttribute("data-runtime-active");
      runtimeThumbnail.classList.remove("is-runtime-active");
    }

    function startPreview() {
      wantsPlayback = true;
      if (!initialized) {
        initializePreview();
        return;
      }
      if (!finePointer.matches || reducedMotion.matches || runtimeHost.hasAttribute("data-runtime-active")) return;
      runtimeHost.setAttribute("data-runtime-active", "true");
      runtimeThumbnail.classList.add("is-runtime-active");
      cleanupPlayback = playCatalogAnimations(catalogAnimations);
    }

    function initializePreview() {
      if (disposed || initialized) return;
      initialized = true;
      visibilityObserver?.disconnect();
      cleanupRuntime = mountMotionRuntime(runtimeRoot, runtimeConfig);
      cleanupSample = mountCatalogSample(runtimeRoot, activeRecipe, activeValues);
      runtimeHost.setAttribute("data-runtime-initialized", "true");
      catalogAnimations = runtimeRoot.getAnimations({ subtree: true });
      freezeCatalogAnimations(catalogAnimations);
      runtimeHost.setAttribute("data-runtime-ready", "true");
      runtimeThumbnail.classList.add("is-runtime-ready");
      if (wantsPlayback) startPreview();
    }

    card.addEventListener("pointerenter", startPreview);
    card.addEventListener("pointerleave", stopPreview);
    finePointer.addEventListener("change", stopPreview);
    reducedMotion.addEventListener("change", stopPreview);

    if ("IntersectionObserver" in window) {
      visibilityObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) initializePreview();
      }, { rootMargin: "240px 0px" });
      visibilityObserver.observe(card);
    } else {
      initializePreview();
    }

    return () => {
      disposed = true;
      visibilityObserver?.disconnect();
      card.removeEventListener("pointerenter", startPreview);
      card.removeEventListener("pointerleave", stopPreview);
      finePointer.removeEventListener("change", stopPreview);
      reducedMotion.removeEventListener("change", stopPreview);
      stopPreview();
      cleanupSample?.();
      cleanupSample = undefined;
      cleanupRuntime?.();
      cleanupRuntime = undefined;
      runtimeHost.removeAttribute("data-runtime-ready");
      runtimeHost.removeAttribute("data-runtime-initialized");
      runtimeThumbnail.classList.remove("is-runtime-ready");
    };
  }, [runtimeRecipe, shadowMarkup, values]);

  return (
    <div
      className={`motion-thumb library-motion-thumb family-${recipe.family} entry-${recipe.id} ${runtimeRecipe ? "has-runtime-preview" : "has-compact-preview"}`}
      data-motion-family={recipe.family}
      aria-hidden="true"
    >
      {!runtimeRecipe ? (
        <div className="motion-thumbnail-fallback">
          <ThumbnailVisual family={recipe.family} label={text(recipe.name, locale)} />
        </div>
      ) : null}
      {runtimeRecipe && shadowMarkup ? (
        <div
          ref={runtimeHostRef}
          className="motion-thumbnail-runtime"
          data-motion-thumbnail={runtimeRecipe.canonicalId}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: shadowMarkup }}
        />
      ) : null}
    </div>
  );
}
