import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Accessibility,
  Check,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet
} from "./icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCategory } from "../data/categories";
import { getGlossaryTermsForCanonical } from "../data/glossary";
import { getMotionGuidance } from "../data/motion-guidance";
import { catalogRecipes, getCanonicalRecipe } from "../data/recipes";
import type { Locale, MotionParam, MotionRecipe } from "../data/types";
import { text } from "../data/site";
import { getParamDisplayValue } from "../lib/motion-engine";
import { useRecipeParams } from "../lib/useRecipeParams";
import { ExportPanel } from "./ExportPanel";
import { MotionPreview } from "./MotionPreview";
import { ParameterControls } from "./ParameterControls";
import { Disclosure } from "./interior/disclosure";
import { SegmentedControl } from "./interior/segmented-control";

type RecipeWorkspaceProps = {
  locale: Locale;
  recipe: MotionRecipe;
  mode?: "embedded" | "tool" | "recipe";
};

type DeviceWidth = "desktop" | "tablet" | "mobile";

const deviceOptions = [
  { value: "desktop", icon: Monitor },
  { value: "tablet", icon: Tablet },
  { value: "mobile", icon: Smartphone }
] as const;

const exportTabs = new Set(["code", "css", "html", "js", "prompt"]);

const guidanceLabels = {
  zh: {
    vocabularyTitle: "术语与辨析",
    definition: "英文定义",
    translation: "中文翻译",
    distinction: "辨析",
    canonical: "核心术语",
    related: "相关术语",
    openVocabulary: "查看全部 91 个术语",
    decisionTitle: "实现前检查",
    purpose: "目的",
    frequency: "频率",
    trigger: "触发",
    enterExit: "进入 / 离开",
    interruptibility: "可打断性",
    gestureRules: "手势与键盘",
    reducedMotionStrategy: "减弱动效策略",
    commonControls: "常用调节",
    moreControls: "更多参数",
    output: "复制实现",
    references: "深入了解",
    understand: "动效词义",
    implementation: "实现规则",
    review: "发布检查",
    accessibility: "可访问性",
    parameters: "参数参考",
    relatedSection: "相关动效"
  },
  en: {
    vocabularyTitle: "Terms and distinctions",
    definition: "English definition",
    translation: "Chinese translation",
    distinction: "Distinction",
    canonical: "Canonical term",
    related: "Related term",
    openVocabulary: "Browse all 91 terms",
    decisionTitle: "Before implementation",
    purpose: "Purpose",
    frequency: "Frequency",
    trigger: "Trigger",
    enterExit: "Enter / exit",
    interruptibility: "Interruptibility",
    gestureRules: "Gesture and keyboard",
    reducedMotionStrategy: "Reduced-motion strategy",
    commonControls: "Essential controls",
    moreControls: "More parameters",
    output: "Copy implementation",
    references: "Learn more",
    understand: "Motion vocabulary",
    implementation: "Implementation rules",
    review: "Ship checklist",
    accessibility: "Accessibility",
    parameters: "Parameter reference",
    relatedSection: "Related motions"
  }
} as const;

function readViewState(): { device: DeviceWidth; reduced: boolean } {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  return {
    device: view === "tablet" || view === "mobile" ? view : "desktop",
    reduced: params.get("motion") === "reduce"
  };
}

function paramDefault(param: MotionParam, locale: Locale) {
  if (param.kind === "segmented") {
    const option = param.options.find((item) => item.value === param.defaultValue);
    return option ? text(option.label, locale) : param.defaultValue;
  }
  if (param.kind === "toggle") {
    return locale === "zh" ? (param.defaultValue ? "开启" : "关闭") : param.defaultValue ? "On" : "Off";
  }
  return getParamDisplayValue(param, param.defaultValue);
}

function paramRange(param: MotionParam, locale: Locale) {
  if (param.kind === "range") {
    return `${param.min}${param.unit}–${param.max}${param.unit}`;
  }
  if (param.kind === "segmented") {
    return param.options.map((option) => text(option.label, locale)).join(" / ");
  }
  return locale === "zh" ? "开启 / 关闭" : "On / Off";
}

function splitInspectorRecipe(recipe: MotionRecipe) {
  if (recipe.params.length <= 3) {
    return {
      common: recipe,
      advanced: undefined
    };
  }

  const commonParams = recipe.params.slice(0, 2);
  const expressiveParam = recipe.params.find(
    (param) => !commonParams.includes(param) && param.id === "ease"
  ) ?? recipe.params.find(
    (param) => !commonParams.includes(param) && param.id === "distance"
  ) ?? recipe.params[2];
  const commonIds = new Set([...commonParams, expressiveParam].map((param) => param.id));
  const advancedParams = recipe.params.filter((param) => !commonIds.has(param.id));

  return {
    common: { ...recipe, params: recipe.params.filter((param) => commonIds.has(param.id)) },
    advanced: advancedParams.length > 0 ? { ...recipe, params: advancedParams } : undefined
  };
}

export function RecipeWorkspace({ locale, recipe, mode = "embedded" }: RecipeWorkspaceProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { values, updateValue, resetValues } = useRecipeParams(recipe);
  const [device, setDevice] = useState<DeviceWidth>("desktop");
  const [reduced, setReduced] = useState(false);
  const [focusedTermId, setFocusedTermId] = useState(recipe.id);
  const [outputOpen, setOutputOpen] = useState(true);
  const [vocabularyOpen, setVocabularyOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const lastRequestedTermRef = useRef<string | null | undefined>(undefined);
  const SectionTitle = mode === "embedded" ? "h2" : "h1";
  const SectionHeading = mode === "embedded" ? "h3" : "h2";
  const DisclosureHeading = mode === "embedded" ? "h4" : "h3";
  const category = getCategory(recipe.categoryId);
  const isGuide = recipe.surfaceType === "guide";
  const labels = guidanceLabels[locale];
  const glossaryTerms = useMemo(
    () => getGlossaryTermsForCanonical(recipe.canonicalId),
    [recipe.canonicalId]
  );
  const guidance = getMotionGuidance(recipe.canonicalId);
  const inspectorRecipe = useMemo(() => splitInspectorRecipe(recipe), [recipe]);
  const relatedEntries = Array.from(
    new Map(
      recipe.relatedEntries
        .map((entryId) => getCanonicalRecipe(entryId))
        .filter((entry): entry is MotionRecipe => Boolean(entry))
        .filter((entry) => entry.id !== recipe.canonicalId)
        .map((entry) => [entry.id, entry])
    ).values()
  );
  const recipeIndex = catalogRecipes.findIndex((entry) => entry.id === recipe.canonicalId);
  const previousRecipe = recipeIndex > 0 ? catalogRecipes[recipeIndex - 1] : undefined;
  const nextRecipe = recipeIndex >= 0 && recipeIndex < catalogRecipes.length - 1 ? catalogRecipes[recipeIndex + 1] : undefined;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const state = readViewState();
      setDevice(state.device);
      setReduced(state.reduced);
      const requestedTerm = new URLSearchParams(location.searchStr).get("term");
      const validTerm = glossaryTerms.find((term) => term.id === requestedTerm)?.id ?? null;
      setFocusedTermId(validTerm ?? recipe.id);

      if (validTerm && lastRequestedTermRef.current !== validTerm) {
        setVocabularyOpen(true);
        window.requestAnimationFrame(() => {
          const target = document.getElementById(`workspace-term-${validTerm}`);
          target?.focus({ preventScroll: true });
          target?.scrollIntoView({ block: "center" });
        });
      }
      lastRequestedTermRef.current = validTerm;
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [glossaryTerms, location.searchStr, recipe.id]);

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    setOutputOpen(!tab || exportTabs.has(tab));
  }, [recipe.id]);

  useEffect(() => {
    if (!inspectorRecipe.advanced) return;
    const params = new URLSearchParams(window.location.search);
    setAdvancedOpen(inspectorRecipe.advanced.params.some((param) => params.has(param.id)));
  }, [inspectorRecipe.advanced, recipe.id]);

  function writeViewState(nextDevice: DeviceWidth, nextReduced: boolean) {
    setDevice(nextDevice);
    setReduced(nextReduced);
    const params = new URLSearchParams(window.location.search);
    if (nextDevice === "desktop") params.delete("view");
    else params.set("view", nextDevice);
    if (nextReduced) params.set("motion", "reduce");
    else params.delete("motion");
    const query = params.toString();
    void navigate({
      href: `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false
    });
  }

  return (
    <section className="library-entry apple-recipe-workspace" id="workspace" aria-labelledby="workspace-title">
      <div className="library-entry-main apple-recipe-main">
        <nav className="library-breadcrumbs apple-recipe-breadcrumbs" aria-label={t("workspace.breadcrumbLabel")}>
          <Link to="/$locale/primitives/" params={{ locale }}>
            {locale === "zh" ? "原子动效" : "Primitives"}
          </Link>
          <span aria-hidden="true">/</span>
          {category ? (
            <a href={`${locale === "zh" ? "/zh" : "/en"}/primitives/?category=${category.id}`}>
              {text(category.name, locale)}
            </a>
          ) : null}
        </nav>

        <header className="library-entry-header apple-recipe-hero">
          <div className="apple-recipe-identity">
            <div className="library-entry-meta apple-recipe-meta">
              <code>{recipe.id}</code>
            </div>
            <SectionTitle id="workspace-title">{text(recipe.name, locale)}</SectionTitle>
            <p>{text(recipe.shortDescription, locale)}</p>
          </div>
        </header>

        <section className="library-preview-section apple-workbench-stage" id="preview" aria-labelledby="preview-title">
          <div className="library-doc-section-heading is-compact apple-workbench-heading">
            <div>
              <SectionHeading id="preview-title">{t("workspace.previewTitle")}</SectionHeading>
            </div>
            <p>{text(recipe.definition, locale)}</p>
          </div>

          {!isGuide ? (
            <div className="library-preview-toolbar apple-preview-toolbar">
              <SegmentedControl
                value={device}
                onValueChange={(next) => writeViewState(next as DeviceWidth, reduced)}
                label={t("workspace.deviceLabel")}
                className="library-device-switcher interior-device-switcher"
                options={deviceOptions.map(({ value, icon: Icon }) => ({
                  value,
                  ariaLabel: t(`workspace.devices.${value}`),
                  label: <Icon aria-hidden="true" size={15} strokeWidth={1.8} />
                }))}
              />
              <SegmentedControl
                value={reduced ? "reduced" : "full"}
                onValueChange={(next) => writeViewState(device, next === "reduced")}
                label={t("common.reducedMotion")}
                className="library-reduced-toggle interior-motion-mode"
                options={[
                  { value: "full", label: locale === "zh" ? "标准" : "Full" },
                  { value: "reduced", label: locale === "zh" ? "减弱" : "Reduced" }
                ]}
              />
            </div>
          ) : null}

          <div className={isGuide ? "library-workbench apple-workbench is-guide" : "library-workbench apple-workbench"}>
            <div className={`library-preview-frame apple-preview-stage is-${device}${reduced ? " force-reduced-motion" : ""}`}>
              <MotionPreview locale={locale} recipe={recipe} values={values} />
            </div>
            {!isGuide ? (
              <aside className="library-parameter-panel apple-inspector" aria-label={labels.commonControls}>
                <ParameterControls
                  locale={locale}
                  recipe={inspectorRecipe.common}
                  values={values}
                  onChange={updateValue}
                  onReset={resetValues}
                />
                {inspectorRecipe.advanced ? (
                  <Disclosure
                    className="apple-inspector-disclosure"
                    summaryClassName="apple-inspector-disclosure-summary"
                    bodyClassName="apple-inspector-disclosure-body"
                    open={advancedOpen}
                    onOpenChange={setAdvancedOpen}
                    summary={(
                      <>
                      <span>{labels.moreControls}</span>
                      <small>{inspectorRecipe.advanced.params.length}</small>
                      </>
                    )}
                  >
                      <ParameterControls
                        locale={locale}
                        recipe={inspectorRecipe.advanced}
                        values={values}
                        onChange={updateValue}
                        onReset={resetValues}
                      />
                  </Disclosure>
                ) : null}
              </aside>
            ) : null}
          </div>
        </section>

        {!isGuide ? (
          <Disclosure
            className="apple-disclosure apple-output-disclosure"
            open={outputOpen}
            onOpenChange={setOutputOpen}
            summaryClassName="apple-disclosure-summary"
            bodyClassName="apple-disclosure-body apple-output-body"
            summary={<strong>{labels.output}</strong>}
          >
              <ExportPanel locale={locale} recipe={recipe} values={values} />
          </Disclosure>
        ) : null}

        <section className="apple-reference-library" aria-labelledby="reference-library-title">
          <header className="apple-reference-library-heading">
            <SectionHeading id="reference-library-title">{labels.references}</SectionHeading>
          </header>

          <section className="library-content-section apple-reference-section" id="understand" aria-labelledby="understand-summary-title">
            <Disclosure
              className="apple-disclosure"
              open={vocabularyOpen}
              onOpenChange={setVocabularyOpen}
              summaryClassName="apple-disclosure-summary"
              bodyClassName="apple-disclosure-body"
              summary={<strong id="understand-summary-title">{labels.understand}</strong>}
            >
                <section className="apple-reference-topic" aria-labelledby="vocabulary-title">
                  <header className="apple-reference-topic-heading">
                    <DisclosureHeading id="vocabulary-title">{labels.vocabularyTitle}</DisclosureHeading>
                  </header>
                  <div className="library-vocabulary-list">
                    {glossaryTerms.map((term) => (
                      <article
                        key={term.id}
                        id={`workspace-term-${term.id}`}
                        tabIndex={-1}
                        aria-labelledby={`workspace-term-title-${term.id}`}
                        className={`${term.canonical ? "is-canonical" : "is-related"}${focusedTermId === term.id ? " is-focused" : ""}`}
                      >
                        <header>
                          <span>{term.canonical ? labels.canonical : labels.related}</span>
                          <code>{term.id}</code>
                        </header>
                        <h4 id={`workspace-term-title-${term.id}`}>{text(term.name, locale)}</h4>
                        <small lang={locale === "zh" ? "en" : "zh-CN"}>
                          {locale === "zh" ? term.name.en : term.name.zh}
                        </small>
                        <div>
                          <span>{labels.definition}</span>
                          <p lang="en">{term.definition.en}</p>
                        </div>
                        <div>
                          <span>{labels.translation}</span>
                          <p lang="zh-CN">{term.definition.zh}</p>
                        </div>
                        {term.distinction ? (
                          <div className="library-vocabulary-distinction">
                            <span>{labels.distinction}</span>
                            <p>{text(term.distinction, locale)}</p>
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                  <Link className="library-inline-link" to="/$locale/primitives/" params={{ locale }}>
                    {locale === "zh" ? "查看全部原子动效" : "Browse all primitives"}
                    <ChevronRight aria-hidden="true" size={15} />
                  </Link>
                </section>
            </Disclosure>
          </section>

          <section className="library-content-section apple-reference-section" id="implementation" aria-labelledby="implementation-summary-title">
            <Disclosure
              className="apple-disclosure"
              summaryClassName="apple-disclosure-summary"
              bodyClassName="apple-disclosure-body apple-implementation-body"
              summary={<strong id="implementation-summary-title">{labels.implementation}</strong>}
            >
                {guidance ? (
                  <section className="apple-reference-topic" aria-labelledby="decision-title">
                    <header className="apple-reference-topic-heading">
                      <DisclosureHeading id="decision-title">{labels.decisionTitle}</DisclosureHeading>
                    </header>
                    <dl className="library-guidance-list">
                      {([
                        [labels.purpose, guidance.purpose],
                        [labels.frequency, guidance.frequency],
                        [labels.trigger, guidance.trigger],
                        [labels.enterExit, guidance.enterExit],
                        [labels.interruptibility, guidance.interruptibility],
                        [labels.gestureRules, guidance.gestureRules],
                        [labels.reducedMotionStrategy, guidance.reducedMotionStrategy]
                      ] as const).map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{text(value, locale)}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ) : null}

                <section className="apple-reference-topic" aria-labelledby="accessibility-title">
                  <header className="apple-reference-topic-heading">
                    <DisclosureHeading id="accessibility-title">{labels.accessibility}</DisclosureHeading>
                  </header>
                  <div className="library-accessibility-note">
                    <Accessibility aria-hidden="true" size={20} strokeWidth={1.7} />
                    <div>
                      <strong>{t("common.reducedMotion")}</strong>
                      <p>{text(recipe.reducedMotion, locale)}</p>
                    </div>
                  </div>
                </section>

                {!isGuide ? (
                  <section className="apple-reference-topic" aria-labelledby="parameters-title">
                    <header className="apple-reference-topic-heading">
                      <DisclosureHeading id="parameters-title">{labels.parameters}</DisclosureHeading>
                    </header>
                    <div className="library-table-scroll">
                      <table className="library-parameter-table">
                        <thead>
                          <tr>
                            <th>{t("workspace.parameterName")}</th>
                            <th>{t("workspace.parameterRange")}</th>
                            <th>{t("workspace.parameterDefault")}</th>
                            <th>{t("workspace.parameterPurpose")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recipe.params.map((param) => (
                            <tr key={param.id}>
                              <td data-label={t("workspace.parameterName")}><code>{param.id}</code></td>
                              <td data-label={t("workspace.parameterRange")}>{paramRange(param, locale)}</td>
                              <td data-label={t("workspace.parameterDefault")}>{paramDefault(param, locale)}</td>
                              <td data-label={t("workspace.parameterPurpose")}>{text(param.description, locale)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ) : null}
            </Disclosure>
          </section>

          <section className="library-content-section apple-reference-section" id="review" aria-labelledby="review-summary-title">
            <Disclosure
              className="apple-disclosure"
              summaryClassName="apple-disclosure-summary"
              bodyClassName="apple-disclosure-body"
              summary={<strong id="review-summary-title">{labels.review}</strong>}
            >
                <DisclosureHeading className="sr-only" id="review-title">{t("workspace.reviewTitle")}</DisclosureHeading>
                <ul className="library-check-list">
                  {recipe.reviewNotes.map((item) => (
                    <li key={text(item, locale)}><Check aria-hidden="true" size={15} />{text(item, locale)}</li>
                  ))}
                </ul>
            </Disclosure>
          </section>
        </section>

        {relatedEntries.length > 0 ? (
          <section className="apple-related-motion" id="related" aria-labelledby="related-title">
            <header>
              <SectionHeading id="related-title">{labels.relatedSection}</SectionHeading>
            </header>
            <div className="library-related-links">
              {relatedEntries.map((entry) => (
                <Link
                  key={entry.id}
                  to="/$locale/primitives/$primitiveId/"
                  params={{ locale, primitiveId: entry.id }}
                >
                  <span>{text(entry.name, locale)}</span>
                  <ChevronRight aria-hidden="true" size={15} />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <nav className="library-entry-pagination apple-recipe-pagination" aria-label={t("workspace.paginationLabel")}>
          {previousRecipe ? (
            <Link
              to="/$locale/primitives/$primitiveId/"
              params={{ locale, primitiveId: previousRecipe.id }}
            >
              <ChevronLeft aria-hidden="true" size={16} />
              <span><small>{t("common.previous")}</small>{text(previousRecipe.name, locale)}</span>
            </Link>
          ) : <span />}
          {nextRecipe ? (
            <Link
              to="/$locale/primitives/$primitiveId/"
              params={{ locale, primitiveId: nextRecipe.id }}
            >
              <span><small>{t("common.next")}</small>{text(nextRecipe.name, locale)}</span>
              <ChevronRight aria-hidden="true" size={16} />
            </Link>
          ) : null}
        </nav>
      </div>
    </section>
  );
}
