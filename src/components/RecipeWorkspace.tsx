import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Accessibility,
  Check,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCategory } from "../data/categories";
import { getGlossaryTermsForCanonical } from "../data/glossary";
import { getMotionGuidance } from "../data/motion-guidance";
import { catalogRecipes, getCanonicalRecipe } from "../data/recipes";
import type { Locale, MotionParam, MotionRecipe } from "../data/types";
import { text } from "../data/site";
import { buildRecipePrompt, getParamDisplayValue } from "../lib/motion-engine";
import { useRecipeParams } from "../lib/useRecipeParams";
import { CopyButton } from "./CopyButton";
import { ExportPanel } from "./ExportPanel";
import { MotionPreview } from "./MotionPreview";
import { ParameterControls } from "./ParameterControls";

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

const guidanceLabels = {
  zh: {
    vocabulary: "动效词义",
    vocabularyTitle: "术语定义与近义词辨析",
    vocabularyCopy: "Motion Lexicon 独立编写英文技术定义；中文翻译和辨析帮助你选对术语。",
    definition: "英文定义",
    translation: "中文翻译",
    distinction: "辨析",
    canonical: "核心术语",
    related: "相关术语",
    openVocabulary: "查看全部 91 个术语",
    decision: "设计规范",
    decisionTitle: "使用这段动效前的判断",
    decisionCopy: "目的、频率、触发、时序、可打断性和手势规则共同决定实现。",
    purpose: "目的",
    frequency: "频率",
    trigger: "触发",
    enterExit: "进入 / 离开",
    interruptibility: "可打断性",
    gestureRules: "手势与键盘",
    reducedMotionStrategy: "减弱动效策略"
  },
  en: {
    vocabulary: "Motion vocabulary",
    vocabularyTitle: "Definition and close-term distinctions",
    vocabularyCopy: "Motion Lexicon maintains the original English technical definitions; translations and distinctions support precise selection.",
    definition: "English definition",
    translation: "Chinese translation",
    distinction: "Distinction",
    canonical: "Canonical term",
    related: "Related term",
    openVocabulary: "Browse all 91 terms",
    decision: "Design contract",
    decisionTitle: "Decide before this motion ships",
    decisionCopy: "Purpose, frequency, trigger, timing, interruptibility, and gesture rules shape the implementation.",
    purpose: "Purpose",
    frequency: "Frequency",
    trigger: "Trigger",
    enterExit: "Enter / exit",
    interruptibility: "Interruptibility",
    gestureRules: "Gesture and keyboard",
    reducedMotionStrategy: "Reduced-motion strategy"
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

export function RecipeWorkspace({ locale, recipe, mode = "embedded" }: RecipeWorkspaceProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { values, updateValue, resetValues } = useRecipeParams(recipe);
  const [device, setDevice] = useState<DeviceWidth>("desktop");
  const [reduced, setReduced] = useState(false);
  const [focusedTermId, setFocusedTermId] = useState(recipe.id);
  const lastRequestedTermRef = useRef<string | null | undefined>(undefined);
  const SectionTitle = mode === "embedded" ? "h2" : "h1";
  const category = getCategory(recipe.categoryId);
  const isGuide = recipe.surfaceType === "guide";
  const labels = guidanceLabels[locale];
  const glossaryTerms = useMemo(
    () => getGlossaryTermsForCanonical(recipe.canonicalId),
    [recipe.canonicalId]
  );
  const guidance = getMotionGuidance(recipe.canonicalId);
  const surfaceSearch = recipe.surfaceType === "component" ? "components" : recipe.surfaceType === "playground" ? "playgrounds" : "guides";
  const surfaceLabel = isGuide ? t("common.guide") : recipe.surfaceType === "playground" ? t("common.playground") : t("common.motionPattern");
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
    <section className="library-entry" id="workspace" aria-labelledby="workspace-title">
      <div className="library-entry-main">
        <nav className="library-breadcrumbs" aria-label={t("workspace.breadcrumbLabel")}>
          <Link to="/$locale/catalog/" params={{ locale }} search={{ surface: surfaceSearch }}>
            {t(`nav.${surfaceSearch}`)}
          </Link>
          <span aria-hidden="true">/</span>
          {category ? (
            <Link to="/$locale/$categoryId/" params={{ locale, categoryId: category.id }}>
              {text(category.name, locale)}
            </Link>
          ) : null}
        </nav>

        <header className="library-entry-header">
          <div>
            <div className="library-entry-meta">
              <span>{surfaceLabel}</span>
            </div>
            <SectionTitle id="workspace-title">{text(recipe.name, locale)}</SectionTitle>
            <p>{text(recipe.shortDescription, locale)}</p>
          </div>
          {!isGuide ? (
            <CopyButton
              label={t("common.copyCurrentPrompt")}
              getText={() => buildRecipePrompt(recipe, values, locale)}
              variant="accent"
            />
          ) : null}
        </header>

        <nav className="library-entry-tabs" aria-label={t("workspace.pageSectionsLabel")}>
          <a href="#preview">{t("workspace.previewLabel")}</a>
          <a href="#vocabulary">{labels.vocabulary}</a>
          <a href="#decision">{labels.decision}</a>
          {!isGuide ? <a href="#exports">CSS / HTML / JS / Prompt</a> : null}
          {!isGuide ? <a href="#parameters">{t("common.parameter")}</a> : null}
        </nav>

        <section className="library-preview-section" id="preview" aria-labelledby="preview-title">
          <div className="library-doc-section-heading is-compact">
            <div>
              <span>{t("workspace.previewLabel")}</span>
              <h2 id="preview-title">{t("workspace.previewTitle")}</h2>
            </div>
            <p>{text(recipe.definition, locale)}</p>
          </div>

          {!isGuide ? <div className="library-preview-toolbar">
            <div className="library-device-switcher" aria-label={t("workspace.deviceLabel")}>
              {deviceOptions.map(({ value, icon: Icon }) => (
                <button
                  type="button"
                  key={value}
                  className={device === value ? "is-active" : undefined}
                  aria-pressed={device === value}
                  aria-label={t(`workspace.devices.${value}`)}
                  onClick={() => writeViewState(value, reduced)}
                >
                  <Icon aria-hidden="true" size={15} strokeWidth={1.8} />
                </button>
              ))}
            </div>
            <label className="library-reduced-toggle">
              <input
                type="checkbox"
                checked={reduced}
                onChange={(event) => writeViewState(device, event.currentTarget.checked)}
              />
              <span aria-hidden="true"><Check size={12} /></span>
              <Accessibility aria-hidden="true" size={15} strokeWidth={1.8} />
              {t("common.reducedMotion")}
            </label>
          </div> : null}

          <div className={isGuide ? "library-workbench is-guide" : "library-workbench"}>
            <div className={`library-preview-frame is-${device}${reduced ? " force-reduced-motion" : ""}`}>
              <MotionPreview locale={locale} recipe={recipe} values={values} />
            </div>
            {!isGuide ? <aside className="library-parameter-panel" aria-label={t("common.parameter")}>
              <div className="library-sync-status">
                <i aria-hidden="true" />
                {t("common.ready")}
              </div>
              <ParameterControls
                locale={locale}
                recipe={recipe}
                values={values}
                onChange={updateValue}
                onReset={resetValues}
              />
            </aside> : null}
          </div>
        </section>

        <section className="library-content-section" id="vocabulary" aria-labelledby="vocabulary-title">
          <div className="library-doc-section-heading">
            <div>
              <span>{labels.vocabulary}</span>
              <h2 id="vocabulary-title">{labels.vocabularyTitle}</h2>
            </div>
            <p>{labels.vocabularyCopy}</p>
          </div>
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
                <h3 id={`workspace-term-title-${term.id}`}>{text(term.name, locale)}</h3>
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
          <Link className="library-inline-link" to="/$locale/vocabulary/" params={{ locale }}>
            {labels.openVocabulary}
            <ChevronRight aria-hidden="true" size={15} />
          </Link>
        </section>

        {guidance ? (
          <section className="library-content-section" id="decision" aria-labelledby="decision-title">
            <div className="library-doc-section-heading">
              <div>
                <span>{labels.decision}</span>
                <h2 id="decision-title">{labels.decisionTitle}</h2>
              </div>
              <p>{labels.decisionCopy}</p>
            </div>
            <div className="library-guidance-grid">
              {([
                [labels.purpose, guidance.purpose],
                [labels.frequency, guidance.frequency],
                [labels.trigger, guidance.trigger],
                [labels.enterExit, guidance.enterExit],
                [labels.interruptibility, guidance.interruptibility],
                [labels.gestureRules, guidance.gestureRules],
                [labels.reducedMotionStrategy, guidance.reducedMotionStrategy]
              ] as const).map(([label, value]) => (
                <article key={label}>
                  <span>{label}</span>
                  <p>{text(value, locale)}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {!isGuide ? <ExportPanel locale={locale} recipe={recipe} values={values} /> : null}

        <section className="library-content-section" id="review" aria-labelledby="review-title">
          <div className="library-doc-section-heading">
            <div>
              <span>{t("common.reviewNotes")}</span>
              <h2 id="review-title">{t("workspace.reviewTitle")}</h2>
            </div>
          </div>
          <ul className="library-check-list">
            {recipe.reviewNotes.map((item) => (
              <li key={text(item, locale)}><Check aria-hidden="true" size={15} />{text(item, locale)}</li>
            ))}
          </ul>
        </section>

        <section className="library-content-section" id="accessibility" aria-labelledby="accessibility-title">
          <div className="library-doc-section-heading">
            <div>
              <span>{t("common.accessibility")}</span>
              <h2 id="accessibility-title">{t("workspace.accessibilityTitle")}</h2>
            </div>
          </div>
          <div className="library-accessibility-note">
            <Accessibility aria-hidden="true" size={20} strokeWidth={1.7} />
            <div>
              <strong>{t("common.reducedMotion")}</strong>
              <p>{text(recipe.reducedMotion, locale)}</p>
            </div>
          </div>
        </section>

        {!isGuide ? <section className="library-content-section" id="parameters" aria-labelledby="parameters-title">
          <div className="library-doc-section-heading">
            <div>
              <span>{t("common.parameter")}</span>
              <h2 id="parameters-title">{t("workspace.parameterReference")}</h2>
            </div>
          </div>
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
                    <td><code>{param.id}</code></td>
                    <td>{paramRange(param, locale)}</td>
                    <td>{paramDefault(param, locale)}</td>
                    <td>{text(param.description, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section> : null}

        {relatedEntries.length > 0 ? (
          <section className="library-content-section" id="related" aria-labelledby="related-title">
            <div className="library-doc-section-heading">
              <div>
                <span>{t("common.related")}</span>
                <h2 id="related-title">{t("workspace.relatedTitle")}</h2>
              </div>
            </div>
            <div className="library-related-links">
              {relatedEntries.map((entry) => (
                <Link
                  key={entry.id}
                  to="/$locale/$categoryId/$recipeId/"
                  params={{ locale, categoryId: entry.categoryId, recipeId: entry.id }}
                >
                  <span>{text(entry.name, locale)}</span>
                  <ChevronRight aria-hidden="true" size={15} />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <nav className="library-entry-pagination" aria-label={t("workspace.paginationLabel")}>
          {previousRecipe ? (
            <Link
              to="/$locale/$categoryId/$recipeId/"
              params={{ locale, categoryId: previousRecipe.categoryId, recipeId: previousRecipe.id }}
            >
              <ChevronLeft aria-hidden="true" size={16} />
              <span><small>{t("common.previous")}</small>{text(previousRecipe.name, locale)}</span>
            </Link>
          ) : <span />}
          {nextRecipe ? (
            <Link
              to="/$locale/$categoryId/$recipeId/"
              params={{ locale, categoryId: nextRecipe.categoryId, recipeId: nextRecipe.id }}
            >
              <span><small>{t("common.next")}</small>{text(nextRecipe.name, locale)}</span>
              <ChevronRight aria-hidden="true" size={16} />
            </Link>
          ) : null}
        </nav>
      </div>

      <aside className="library-entry-toc" aria-label={t("common.onThisPage")}>
        <strong>{t("common.onThisPage")}</strong>
        <a href="#preview">{t("workspace.previewLabel")}</a>
        <a href="#vocabulary">{labels.vocabulary}</a>
        <a href="#decision">{labels.decision}</a>
        {!isGuide ? <a href="#exports">CSS / HTML / JS / Prompt</a> : null}
        <a href="#review">{t("common.reviewNotes")}</a>
        <a href="#accessibility">{t("common.accessibility")}</a>
        {!isGuide ? <a href="#parameters">{t("workspace.parameterReference")}</a> : null}
        {relatedEntries.length > 0 ? <a href="#related">{t("common.related")}</a> : null}
      </aside>
    </section>
  );
}
