import { ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale, ParamValues } from "../data/types";
import {
  buildRecipeCss,
  buildRecipeHtml,
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

function CandidatePreview({
  candidate,
  locale,
  replayKey,
  values
}: {
  candidate: MotionFinderCandidate;
  locale: Locale;
  replayKey: number;
  values: ParamValues;
}) {
  const runtimeHostRef = useRef<HTMLDivElement>(null);
  const previousReplayRef = useRef(replayKey);
  const output = useMemo(
    () => ({
      css: buildRecipeCss(candidate.recipe, values),
      html: buildRecipeHtml(candidate.recipe, values, locale, candidate.name)
    }),
    [candidate.name, candidate.recipe, locale, values]
  );

  useEffect(() => {
    const host = runtimeHostRef.current;
    if (!host) return;
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    const scene = document.createElement("div");
    style.textContent = `:host { display: grid; place-items: center; width: 100%; height: 100%; }
:host > div { display: grid; place-items: center; width: 100%; }
${output.css}`;
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

  return (
    <div className="finder-compare">
      <div className="finder-compare-toolbar">
        <span>{t("finder.resultCount", { count: candidates.length })}</span>
        <Button
          type="button"
          variant="soft"
          size="sm"
          onClick={() => setReplayKey((current) => current + 1)}
        >
          <RotateCcw aria-hidden="true" size={15} strokeWidth={1.8} />
          {t("finder.replayAll")}
        </Button>
      </div>

      <div className="finder-candidate-grid" aria-live="polite">
        {candidates.map((candidate) => {
          const selected = candidate.variantId === selectedId;
          const previewValues = selected && selectedValues ? selectedValues : candidate.values;
          return (
            <article
              className={selected ? "finder-candidate is-selected" : "finder-candidate"}
              key={candidate.variantId}
              data-variant-id={candidate.variantId}
            >
              <header className="finder-candidate-header">
                <div>
                  <span>{t("finder.candidateLabel", { rank: candidate.rank })}</span>
                  <h3>{candidate.name}</h3>
                  <p>{candidate.description}</p>
                </div>
              </header>

              <CandidatePreview
                candidate={candidate}
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
                  onClick={() => onSelect(candidate)}
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
