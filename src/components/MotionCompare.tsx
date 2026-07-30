import { ArrowUpRight, Check, Minimize2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale, ParamValues } from "../data/types";
import {
  buildRecipeCss,
  getMotionRuntimeConfig
} from "../lib/motion-engine";
import type { MotionFinderCandidate } from "../lib/motion-finder";
import { mountMotionRuntime } from "../lib/motion-runtime";
import { Button } from "./ui/button";

type MotionCompareProps = {
  locale: Locale;
  candidates: MotionFinderCandidate[];
  selectedId: string;
  selectedValues: ParamValues | null;
  onSelect: (candidate: MotionFinderCandidate) => void;
};

type ComparisonSceneKind = "entrance" | "continuity" | "sequence";

function comparisonSceneKind(candidates: MotionFinderCandidate[]): ComparisonSceneKind {
  const categoryId = candidates[0]?.recipe.categoryId;
  if (categoryId === "state-transitions") return "continuity";
  if (categoryId === "sequencing") return "sequence";
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
  const common = `${root} .motion-list{display:grid;gap:.38rem;width:100%;margin:.2rem 0 0;padding:0;list-style:none}
${root} .motion-list-item{padding:.35rem .5rem;background:#f4f4f5;border:1px solid #e4e4e7;border-radius:6px}`;

  if (kind === "continuity") {
    return `${common}
${root} .motion-state{color:#18181b;background:#fff}
${root} .motion-state--from{transform:translate3d(-12px,7px,0) scale(.94);background:#f4f4f5}`;
  }

  return common;
}

function CandidatePreview({
  candidate,
  compact,
  kind,
  locale,
  replayKey,
  values
}: {
  candidate: MotionFinderCandidate;
  compact: boolean;
  kind: ComparisonSceneKind;
  locale: Locale;
  replayKey: number;
  values: ParamValues;
}) {
  const runtimeHostRef = useRef<HTMLDivElement>(null);
  const previousReplayRef = useRef(replayKey);
  const output = useMemo(
    () => ({
      css: `${buildRecipeCss(candidate.recipe, values)}\n\n${buildComparisonSceneCss(candidate, kind)}`,
      html: buildComparisonSceneHtml(candidate, locale, kind)
    }),
    [candidate, kind, locale, values]
  );

  useEffect(() => {
    const host = runtimeHostRef.current;
    if (!host) return;
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    const scene = document.createElement("div");
    style.textContent = `:host { display: grid; place-items: center; width: 100%; min-width: 0; min-height: 0; }
:host > div { display: grid; place-items: center; width: 100%; }
${output.css}
:host([data-compact="true"]) .motion-demo {
  box-sizing: border-box;
  height: 7rem;
  min-height: 7rem;
  padding: 0.75rem;
}`;
    scene.innerHTML = output.html;
    shadow.replaceChildren(style, scene);
    const root = scene.querySelector<HTMLElement>(".motion-demo");
    if (!root) return;
    const autoplay = previousReplayRef.current !== replayKey;
    previousReplayRef.current = replayKey;
    return mountMotionRuntime(
      root,
      getMotionRuntimeConfig(candidate.recipe, values, autoplay)
    );
  }, [candidate.recipe, output.css, output.html, replayKey, values]);

  return (
    <div
      ref={runtimeHostRef}
      className="finder-candidate-stage motion-runtime-stage"
      data-compact={compact ? "true" : undefined}
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
  const [isComparing, setIsComparing] = useState(false);
  const sceneKind = comparisonSceneKind(candidates);

  function replayTogether() {
    setIsComparing(true);
    setReplayKey((current) => current + 1);
  }

  function selectCandidate(candidate: MotionFinderCandidate) {
    setIsComparing(false);
    onSelect(candidate);
  }

  return (
    <div
      className={`finder-compare apple-motion-chooser ${
        isComparing ? "is-comparing" : "is-focused"
      }`}
    >
      <div className="finder-compare-toolbar">
        <div className="finder-compare-status">
          <span>{t("finder.resultCount", { count: candidates.length })}</span>
          <strong>{isComparing ? t("finder.resultTitle") : t("finder.selected")}</strong>
        </div>
        <div className="finder-compare-actions">
          {isComparing ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-controls="finder-candidate-deck"
              onClick={() => setIsComparing(false)}
            >
              <Minimize2 aria-hidden="true" size={15} strokeWidth={1.8} />
              {locale === "zh" ? "聚焦已选" : "Focus selection"}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="soft"
            size="sm"
            aria-controls="finder-candidate-deck"
            aria-pressed={isComparing}
            onClick={replayTogether}
          >
            <RotateCcw aria-hidden="true" size={15} strokeWidth={1.8} />
            {t("finder.replayAll")}
          </Button>
        </div>
      </div>

      <div
        id="finder-candidate-deck"
        className="finder-candidate-grid finder-choice-deck"
        data-layout={isComparing ? "compare" : "focus"}
        aria-live="polite"
      >
        {candidates.map((candidate) => {
          const selected = candidate.variantId === selectedId;
          const previewValues = selected && selectedValues ? selectedValues : candidate.values;
          return (
            <article
              className={`finder-candidate apple-motion-card ${
                selected
                  ? "finder-candidate--primary apple-motion-primary is-selected"
                  : "finder-candidate--alternative apple-motion-alternative"
              }`}
              key={candidate.variantId}
              data-variant-id={candidate.variantId}
              data-rank={candidate.rank}
              aria-labelledby={`finder-candidate-title-${candidate.variantId}`}
            >
              <header className="finder-candidate-header">
                <div>
                  <div className="finder-candidate-meta">
                    <span>{t("finder.candidateLabel", { rank: candidate.rank })}</span>
                    {selected ? <strong>{t("finder.selected")}</strong> : null}
                  </div>
                  <h3 id={`finder-candidate-title-${candidate.variantId}`}>
                    {candidate.name}
                  </h3>
                  <p>{candidate.description}</p>
                </div>
              </header>

              <CandidatePreview
                candidate={candidate}
                compact={isComparing || !selected}
                kind={sceneKind}
                locale={locale}
                replayKey={replayKey}
                values={previewValues}
              />

              <div className="finder-candidate-body">
                <p>{candidate.reason}</p>
                {candidate.distinction ? (
                  <div className="finder-distinction">
                    <span>{t("finder.distinction")}</span>
                    <p>{candidate.distinction}</p>
                  </div>
                ) : null}
              </div>

              <footer className="finder-candidate-actions">
                <button
                  type="button"
                  className={selected ? "finder-select is-selected" : "finder-select"}
                  aria-pressed={selected}
                  onClick={() => selectCandidate(candidate)}
                >
                  {selected ? <Check aria-hidden="true" size={15} /> : null}
                  {selected
                    ? t("finder.selected")
                    : t("finder.select", { name: candidate.name })}
                </button>
                <a href={candidate.recipePath}>
                  {t("finder.openRecipe")}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </a>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
