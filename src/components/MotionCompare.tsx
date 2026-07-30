import { ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale, ParamValues } from "../data/types";
import {
  buildRecipeCss,
  getMotionRuntimeConfig
} from "../lib/motion-engine";
import type { MotionFinderCandidate } from "../lib/motion-finder";
import {
  mountMotionRuntime,
  replayMotionRuntime,
  updateMotionRuntimeConfig
} from "../lib/motion-runtime";
import { Button } from "./ui/button";

type MotionCompareProps = {
  locale: Locale;
  candidates: MotionFinderCandidate[];
  selectedId: string;
  selectedValues: ParamValues | null;
  onSelect: (candidate: MotionFinderCandidate) => void;
};

type ComparisonSceneKind = "entrance" | "continuity" | "sequence";

function comparisonSceneKind(candidate: MotionFinderCandidate): ComparisonSceneKind {
  if (candidate.recipe.categoryId === "state-transitions") return "continuity";
  if (candidate.recipe.categoryId === "sequencing") return "sequence";
  return "entrance";
}

function comparisonCardContent(locale: Locale, kind: ComparisonSceneKind) {
  const title = locale === "zh" ? "产品更新" : "Product update";
  return `<strong>${title}</strong>
    <span class="motion-line"></span>
    <span class="motion-line"></span>${kind === "sequence"
      ? `<ol class="motion-list" aria-label="${title}"><li class="motion-list-item">01</li><li class="motion-list-item">02</li><li class="motion-list-item">03</li></ol>`
      : ""}`;
}

function buildComparisonSceneHtml(
  candidate: MotionFinderCandidate,
  locale: Locale,
  kind: ComparisonSceneKind
) {
  const id = candidate.recipe.canonicalId;
  const content = comparisonCardContent(locale, kind);
  const scene = kind === "continuity"
    ? `<div class="motion-state-stack" data-comparison-scene data-comparison-kind="${kind}">
    <article class="motion-state motion-state--from">${content}</article>
    <article class="motion-state motion-state--to motion-surface">${content}</article>
  </div>`
    : `<article class="motion-surface" data-comparison-scene data-comparison-kind="${kind}" data-spring-target>
    ${content}
  </article>`;

  return `<div class="motion-demo motion-demo--${id}" data-motion="${id}">
  ${scene}
  <button hidden data-motion-replay></button>
</div>`;
}

function buildComparisonSceneCss(
  candidate: MotionFinderCandidate,
  kind: ComparisonSceneKind
) {
  const root = `.motion-demo.motion-demo--${candidate.recipe.canonicalId}`;
  const common = `${root} .motion-list{display:grid;gap:.4rem;margin:0;padding:0;list-style:none}
${root} .motion-list-item{padding:.35rem .5rem;background:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px}
${root} [data-spring-target]{pointer-events:none;cursor:default!important}`;

  if (kind === "continuity") {
    return `${common}
${root} .motion-state{color:#292929;background:#fff}
${root} .motion-state--from{transform:translate3d(-12px,7px,0) scale(.94);background:#f4f4f5}`;
  }

  return common;
}

function CandidatePreview({
  candidate,
  kind,
  locale,
  replayKey,
  values
}: {
  candidate: MotionFinderCandidate;
  kind: ComparisonSceneKind;
  locale: Locale;
  replayKey: number;
  values: ParamValues;
}) {
  const runtimeHostRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const runtimeRootRef = useRef<HTMLElement | null>(null);
  const previousReplayRef = useRef(replayKey);
  const sceneHtml = useMemo(
    () => buildComparisonSceneHtml(candidate, locale, kind),
    [candidate, kind, locale]
  );
  const css = useMemo(
    () => `${buildRecipeCss(candidate.recipe, values)}\n\n${buildComparisonSceneCss(candidate, kind)}`,
    [candidate, kind, values]
  );
  const runtimeConfig = useMemo(
    () => getMotionRuntimeConfig(candidate.recipe, values, false),
    [candidate.recipe, values]
  );
  const latestCssRef = useRef(css);
  const runtimeConfigRef = useRef(runtimeConfig);

  useEffect(() => {
    latestCssRef.current = css;
    runtimeConfigRef.current = runtimeConfig;
  }, [css, runtimeConfig]);

  useEffect(() => {
    const host = runtimeHostRef.current;
    if (!host) return;
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    const scene = document.createElement("div");
    style.textContent = `:host { display:grid;place-items:center;width:100%;min-width:0;min-height:0; }
:host > div { display:grid;place-items:center;width:100%; }
${latestCssRef.current}`;
    scene.innerHTML = sceneHtml;
    shadow.replaceChildren(style, scene);
    const root = scene.querySelector<HTMLElement>(".motion-demo");
    if (!root) return;
    styleRef.current = style;
    runtimeRootRef.current = root;
    const cleanup = mountMotionRuntime(root, {
      ...runtimeConfigRef.current,
      autoplay: true
    });
    return () => {
      cleanup();
      styleRef.current = null;
      runtimeRootRef.current = null;
    };
  }, [sceneHtml]);

  useEffect(() => {
    const style = styleRef.current;
    const root = runtimeRootRef.current;
    if (style) {
      style.textContent = `:host { display:grid;place-items:center;width:100%;min-width:0;min-height:0; }
:host > div { display:grid;place-items:center;width:100%; }
${css}`;
    }
    if (root) updateMotionRuntimeConfig(root, runtimeConfig);
  }, [css, runtimeConfig]);

  useEffect(() => {
    if (previousReplayRef.current === replayKey) return;
    previousReplayRef.current = replayKey;
    if (runtimeRootRef.current) replayMotionRuntime(runtimeRootRef.current);
  }, [replayKey]);

  return (
    <div
      ref={runtimeHostRef}
      className="finder-candidate-stage motion-runtime-stage"
      aria-label={`${candidate.name} — ${candidate.description}`}
    />
  );
}

export function MotionCompare({
  locale,
  candidates,
  selectedId,
  selectedValues,
  onSelect
}: MotionCompareProps) {
  const { t } = useTranslation();
  const [replayKey, setReplayKey] = useState(0);
  const selectedCandidate = candidates.find(
    (candidate) => candidate.variantId === selectedId
  ) ?? candidates[0];

  if (!selectedCandidate) return null;

  const sceneKind = comparisonSceneKind(selectedCandidate);
  const previewValues = selectedValues ?? selectedCandidate.values;

  return (
    <div className="finder-compare apple-motion-chooser">
      <article
        id="finder-active-preview"
        className="finder-active-preview"
        data-variant-id={selectedCandidate.variantId}
        aria-labelledby={`finder-active-title-${selectedCandidate.variantId}`}
      >
        <header className="finder-active-preview-header">
          <div>
            <span>{t("finder.candidateLabel", { rank: selectedCandidate.rank })}</span>
            <h3 id={`finder-active-title-${selectedCandidate.variantId}`}>
              {selectedCandidate.name}
            </h3>
            <p>{selectedCandidate.description}</p>
          </div>
          <Button
            type="button"
            variant="soft"
            size="sm"
            onClick={() => setReplayKey((current) => current + 1)}
          >
            <RotateCcw aria-hidden="true" size={14} strokeWidth={1.8} />
            {t("common.replay")}
          </Button>
        </header>

        <CandidatePreview
          key={selectedCandidate.variantId}
          candidate={selectedCandidate}
          kind={sceneKind}
          locale={locale}
          replayKey={replayKey}
          values={previewValues}
        />

        <div className="finder-active-preview-copy">
          <p>{selectedCandidate.reason}</p>
          {selectedCandidate.distinction ? (
            <div className="finder-distinction">
              <span>{t("finder.distinction")}</span>
              <p>{selectedCandidate.distinction}</p>
            </div>
          ) : null}
          <a href={selectedCandidate.recipePath}>
            {t("finder.openRecipe")}
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
        </div>
      </article>

      <div className="finder-candidate-switcher" aria-label={t("finder.resultTitle")}>
        {candidates.map((candidate) => {
          const selected = candidate.variantId === selectedCandidate.variantId;
          return (
            <button
              type="button"
              className={`finder-candidate-choice${selected ? " is-selected" : ""}`}
              key={candidate.variantId}
              data-variant-id={candidate.variantId}
              data-rank={candidate.rank}
              aria-controls="finder-active-preview"
              aria-pressed={selected}
              onClick={() => onSelect(candidate)}
            >
              <span>{t("finder.candidateLabel", { rank: candidate.rank })}</span>
              <strong>{candidate.name}</strong>
              <small>{candidate.description}</small>
              {selected ? <Check aria-hidden="true" size={14} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
