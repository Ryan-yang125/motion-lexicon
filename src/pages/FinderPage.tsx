import { ArrowRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FinderExportDisclosure } from "../components/FinderExportDisclosure";
import { MotionCompare } from "../components/MotionCompare";
import { ParameterControls } from "../components/ParameterControls";
import { CopyButton } from "../components/CopyButton";
import { Seo } from "../components/Seo";
import { pathFor, siteUrl } from "../data/site";
import type { Locale, ParamValue, ParamValues } from "../data/types";
import {
  buildRecipeJs,
  buildRecipePrompt,
  parseParamValues,
  valuesToSearchParams
} from "../lib/motion-engine";
import {
  recommendMotions,
  type MotionFinderCandidate,
  type MotionFinderResult
} from "../lib/motion-finder";

const exampleKeys = ["weight", "continuity", "sequence"] as const;

function orderCandidates(
  result: MotionFinderResult,
  compareValue: string | null
): MotionFinderCandidate[] {
  const candidates = Array.from(result.candidates);
  const requestedIds = Array.from(
    new Set(
      (compareValue ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
  if (requestedIds.length === 0) return candidates;

  const byId = new Map(candidates.map((candidate) => [candidate.variantId, candidate]));
  const requested = requestedIds
    .map((id) => byId.get(id))
    .filter((candidate): candidate is MotionFinderCandidate => Boolean(candidate));
  const requestedSet = new Set(requested.map((candidate) => candidate.variantId));
  return [
    ...requested,
    ...candidates.filter((candidate) => !requestedSet.has(candidate.variantId))
  ].slice(0, 3);
}

function valuesFromUrl(
  candidate: MotionFinderCandidate,
  params: URLSearchParams
): ParamValues {
  const parsed = parseParamValues(candidate.recipe, params);
  const values = { ...candidate.values };
  for (const param of candidate.recipe.params) {
    if (params.has(param.id)) values[param.id] = parsed[param.id];
  }
  return values;
}

export function FinderPage({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<MotionFinderResult | null>(null);
  const [candidates, setCandidates] = useState<MotionFinderCandidate[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [values, setValues] = useState<ParamValues | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const valuesRef = useRef<ParamValues | null>(null);
  const syncedQueryRef = useRef<string | null>(null);

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.variantId === selectedId) ?? null,
    [candidates, selectedId]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("q")?.trim() ?? "";
      const previousQuery = syncedQueryRef.current;
      const isInitialLocationSync = previousQuery === null;
      syncedQueryRef.current = query;
      if ((isInitialLocationSync && query) || (!isInitialLocationSync && previousQuery !== query)) {
        setInput(query);
      }

      if (!query) {
        setResult(null);
        setCandidates([]);
        setSelectedId("");
        valuesRef.current = null;
        setValues(null);
        setIsHydrated(true);
        return;
      }

      const nextResult = recommendMotions(query, locale, 3);
      const nextCandidates = orderCandidates(nextResult, params.get("compare"));
      const requestedSelected = params.get("selected");
      const nextSelected =
        nextCandidates.find((candidate) => candidate.variantId === requestedSelected) ??
        nextCandidates[0] ??
        null;
      const nextValues = nextSelected ? valuesFromUrl(nextSelected, params) : null;

      setResult(nextResult);
      setCandidates(nextCandidates);
      setSelectedId(nextSelected?.variantId ?? "");
      valuesRef.current = nextValues;
      setValues(nextValues);
      setIsHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [locale, location.searchStr]);

  function finderUrl(
    query: string,
    nextCandidates: MotionFinderCandidate[],
    selected: MotionFinderCandidate,
    nextValues: ParamValues
  ) {
    const params = new URLSearchParams();
    params.set("q", query);
    params.set(
      "compare",
      nextCandidates.map((candidate) => candidate.variantId).join(",")
    );
    params.set("selected", selected.variantId);
    const activeTab = new URLSearchParams(window.location.search).get("tab");
    if (
      activeTab === "html" ||
      activeTab === "prompt" ||
      (activeTab === "js" && buildRecipeJs(selected.recipe, nextValues).length > 0)
    ) {
      params.set("tab", activeTab);
    }
    const withValues = valuesToSearchParams(selected.recipe, nextValues, params);
    return `${pathFor(locale, ["finder"])}?${withValues.toString()}`;
  }

  function writeFinderUrl(
    query: string,
    nextCandidates: MotionFinderCandidate[],
    selected: MotionFinderCandidate,
    nextValues: ParamValues
  ) {
    void navigate({
      href: finderUrl(query, nextCandidates, selected, nextValues),
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false
    });
  }

  function runFinder(query: string) {
    const normalized = query.trim();
    if (!normalized) {
      setResult(null);
      setCandidates([]);
      setSelectedId("");
      valuesRef.current = null;
      setValues(null);
      void navigate({
        href: pathFor(locale, ["finder"]),
        replace: true,
        resetScroll: false,
        hashScrollIntoView: false
      });
      return;
    }

    const nextResult = recommendMotions(normalized, locale, 3);
    const nextCandidates = Array.from(nextResult.candidates).slice(0, 3);
    const nextSelected = nextCandidates[0];
    if (!nextSelected) return;

    const nextValues = { ...nextSelected.values };
    setInput(normalized);
    setResult(nextResult);
    setCandidates(nextCandidates);
    setSelectedId(nextSelected.variantId);
    valuesRef.current = nextValues;
    setValues(nextValues);
    writeFinderUrl(normalized, nextCandidates, nextSelected, nextValues);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedQuery = new FormData(event.currentTarget).get("q");
    runFinder(typeof submittedQuery === "string" ? submittedQuery : input);
  }

  function selectCandidate(candidate: MotionFinderCandidate) {
    const nextValues = { ...candidate.values };
    setSelectedId(candidate.variantId);
    valuesRef.current = nextValues;
    setValues(nextValues);
    writeFinderUrl(result?.query ?? input.trim(), candidates, candidate, nextValues);
  }

  function updateValue(paramId: string, value: ParamValue) {
    if (!selectedCandidate || !valuesRef.current) return;
    const nextValues = { ...valuesRef.current, [paramId]: value };
    valuesRef.current = nextValues;
    setValues(nextValues);
    writeFinderUrl(result?.query ?? input.trim(), candidates, selectedCandidate, nextValues);
  }

  function resetValues() {
    if (!selectedCandidate) return;
    const nextValues = { ...selectedCandidate.values };
    valuesRef.current = nextValues;
    setValues(nextValues);
    writeFinderUrl(result?.query ?? input.trim(), candidates, selectedCandidate, nextValues);
  }

  return (
    <>
      <Seo
        locale={locale}
        title={t("seo.finderTitle")}
        description={t("seo.finderDescription")}
        path={pathFor(locale, ["finder"])}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Motion Finder",
            description: t("seo.finderDescription"),
            url: `${siteUrl}${pathFor(locale, ["finder"])}`,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            inLanguage: locale === "zh" ? "zh-CN" : "en",
            isAccessibleForFree: true
          }
        ]}
      />

      <section
        className={`finder-hero apple-finder-intake ${result ? "has-result" : "is-empty"}`}
        aria-labelledby="finder-title"
      >
        <div className="finder-hero-copy">
          <span>{t("finder.eyebrow")}</span>
          <h1 id="finder-title">{t("finder.title")}</h1>
          <p>{t("finder.copy")}</p>
        </div>

        <form className="finder-search apple-search-pill" role="search" onSubmit={handleSubmit}>
          <label htmlFor="finder-query">{t("finder.formLabel")}</label>
          <div className="finder-search-field">
            <Search aria-hidden="true" size={20} strokeWidth={1.7} />
            <input
              id="finder-query"
              name="q"
              type="search"
              autoComplete="off"
              disabled={!isHydrated}
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder={t("finder.placeholder")}
            />
            <button type="submit" disabled={!isHydrated}>
              {t("finder.submit")}
              <ArrowRight aria-hidden="true" size={16} />
            </button>
          </div>
          <small>{t("finder.shortcut")}</small>
        </form>

        <div className="finder-examples" aria-label={t("finder.examplesLabel")}>
          <span>{t("finder.examplesLabel")}</span>
          <div>
            {exampleKeys.map((key) => {
              const example = t(`finder.examples.${key}`);
              return (
                <button type="button" key={key} onClick={() => runFinder(example)}>
                  {example}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {result && candidates.length > 0 ? (
        <section
          className="finder-results finder-workspace apple-finder-workspace"
          aria-labelledby="finder-results-title"
        >
          <div className="library-doc-section-heading finder-results-heading finder-workspace-heading">
            <div>
              <span>{t("finder.resultEyebrow")}</span>
              <h2 id="finder-results-title">{t("finder.resultTitle")}</h2>
            </div>
            <div className="finder-match-summary">
              <strong className={`is-${result.confidence}`}>
                <Sparkles aria-hidden="true" size={14} />
                {t(`finder.confidence.${result.confidence}`)}
              </strong>
              <p>{result.reason}</p>
              {result.matchedTerms.length > 0 ? (
                <div>
                  <span>{t("finder.matchedTerms")}</span>
                  {result.matchedTerms.map((term) => <small key={term}>{term}</small>)}
                </div>
              ) : null}
            </div>
          </div>

          {result.confidence === "low" ? (
            <p className="finder-low-confidence" role="note">{t("finder.lowConfidence")}</p>
          ) : null}

          <div className="finder-workspace-shell apple-workspace-shell">
            <div className="finder-workspace-stage">
              <MotionCompare
                locale={locale}
                candidates={candidates}
                selectedId={selectedId}
                selectedValues={values}
                onSelect={selectCandidate}
              />
            </div>

            {selectedCandidate && values ? (
              <aside
                className="finder-tune finder-inspector apple-inspector"
                aria-labelledby="finder-tune-title"
                aria-label={t("finder.paramsLabel")}
              >
                <header className="finder-inspector-heading">
                  <div>
                    <span>{t("finder.tuneEyebrow")}</span>
                    <h2 id="finder-tune-title">
                      {t("finder.tuneTitle", { name: selectedCandidate.name })}
                    </h2>
                  </div>
                  <SlidersHorizontal aria-hidden="true" size={18} strokeWidth={1.7} />
                </header>

                <p className="finder-inspector-copy">{t("finder.tuneCopy")}</p>
                <div className="library-sync-status finder-inspector-status">
                  <i aria-hidden="true" />
                  {t("finder.readyStatus")}
                </div>
                <div className="finder-inspector-controls">
                  <ParameterControls
                    locale={locale}
                    recipe={selectedCandidate.recipe}
                    values={values}
                    onChange={updateValue}
                    onReset={resetValues}
                  />
                </div>
                <CopyButton
                  className="finder-primary-copy apple-primary-action"
                  label={t("common.copyCurrentPrompt")}
                  getText={() =>
                    buildRecipePrompt(selectedCandidate.recipe, values, locale)
                  }
                />
              </aside>
            ) : null}
          </div>

          {selectedCandidate && values ? (
            <div className="finder-workspace-output">
              <p className="finder-change-hint">{t("finder.changeHint")}</p>
              <FinderExportDisclosure
                locale={locale}
                recipe={selectedCandidate.recipe}
                values={values}
              />
            </div>
          ) : null}
        </section>
      ) : (
        <section className="finder-empty" aria-labelledby="finder-empty-title">
          <Sparkles aria-hidden="true" size={20} strokeWidth={1.6} />
          <h2 id="finder-empty-title">{t("finder.emptyTitle")}</h2>
          <p>{t("finder.emptyCopy")}</p>
        </section>
      )}

    </>
  );
}
