import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import {
  ArrowRightIcon,
  ComponentLibraryGlyph,
  MotionPrimitiveGlyph,
  MotionSkillGlyph,
} from "../components/icons";
import { Seo } from "../components/Seo";
import { useTabs } from "../components/interior/tabs";
import { getRegistryComponent } from "../data/component-registry";
import { getCatalogRecipe } from "../data/recipes";
import { pathFor, text } from "../data/site";
import type { Locale, MotionRecipe } from "../data/types";
import { getDefaultParamValues } from "../lib/motion-engine";
import { PrimitivePreview } from "../registry/primitive-preview-map";
import { RegistryPreview } from "../registry/preview-map";

const stageIds = ["reorder-list", "tabs", "inline-validation"] as const;
const featuredIds = ["copy-button", "loading-button", "expanding-search", "value-flash"] as const;
const primitiveIds = ["spring", "morph", "stagger"] as const;

const featuredComponents = featuredIds.map((id) => {
  const component = getRegistryComponent(id);
  if (!component) throw new Error(`Missing landing component: ${id}`);
  return component;
});

const landingPrimitives = primitiveIds.map((id) => {
  const recipe = getCatalogRecipe(id);
  if (!recipe) throw new Error(`Missing landing primitive: ${id}`);
  return recipe;
});

function Stage({ locale }: { locale: Locale }) {
  const [activeId, setActiveId] = useState<(typeof stageIds)[number]>(stageIds[0]);
  const reduceMotion = useReducedMotion();
  const active = getRegistryComponent(activeId);
  const items = useMemo(() => stageIds.map((id) => ({
    value: id,
    label: text(getRegistryComponent(id)?.name ?? { zh: id, en: id }, locale)
  })), [locale]);
  const tabs = useTabs({
    items,
    value: activeId,
    onValueChange: (value) => setActiveId(value as (typeof stageIds)[number])
  });
  const panelProps = tabs.getPanelProps(activeId);

  return (
    <div className="landing-stage mat-float">
      <div className="landing-stage-bar">
        <span className="landing-stage-lights" aria-hidden="true"><i /><i /><i /></span>
        <span>{locale === "zh" ? "实时组件" : "Live component"}</span>
        <code>React + Motion</code>
      </div>
      <div {...tabs.tabListProps} className="landing-stage-tabs" aria-label={locale === "zh" ? "组件预览" : "Component previews"}>
        {items.map((item, index) => {
          const tabProps = tabs.getTabProps(item, index);
          return (
            <button key={item.value} {...tabProps} aria-controls="landing-stage-panel">
              {item.label}
            </button>
          );
        })}
      </div>
      <div {...panelProps} id="landing-stage-panel" className="landing-stage-canvas">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            className="landing-stage-motion"
            key={activeId}
            initial={reduceMotion ? false : { opacity: 0, transform: "translate3d(0, 8px, 0)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
            exit={reduceMotion ? { opacity: 1, transform: "translate3d(0, 0, 0)" } : { opacity: 0, transform: "translate3d(0, -4px, 0)" }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          >
            <RegistryPreview id={activeId} locale={locale} />
          </motion.div>
        </AnimatePresence>
      </div>
      <Link
        className="landing-stage-footer"
        to="/$locale/components/$componentId/"
        params={{ locale, componentId: activeId }}
      >
        <span><strong>{active ? text(active.name, locale) : activeId}</strong><code>{activeId}.tsx</code></span>
        <span>{locale === "zh" ? "查看源码" : "View source"}<ArrowRightIcon size={14} aria-hidden="true" /></span>
      </Link>
    </div>
  );
}

function PrimitiveCard({ locale, recipe }: { locale: Locale; recipe: MotionRecipe }) {
  return (
    <article className="landing-primitive-card">
      <div className="landing-primitive-stage">
        <PrimitivePreview
          locale={locale}
          recipe={recipe}
          values={getDefaultParamValues(recipe)}
          deferred
          compact
        />
      </div>
      <Link
        className="landing-primitive-footer"
        to="/$locale/primitives/$primitiveId/"
        params={{ locale, primitiveId: recipe.id }}
      >
        <span><strong>{text(recipe.name, locale)}</strong><code>{recipe.id}</code></span>
        <ArrowRightIcon size={14} aria-hidden="true" />
      </Link>
    </article>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const title = zh ? "把好动效，直接带进产品。" : "Bring better motion into your product.";
  const description = zh
    ? "4 个页面 Block、48 个组件、44 个原子动效。预览、复制、安装。"
    : "4 page blocks, 48 components, and 44 motion primitives. Preview, copy, install.";

  return (
    <>
      <Seo
        locale={locale}
        title={`${title} — Motion Lexicon`}
        description={description}
        path={pathFor(locale)}
        image={`/og-home-${locale}.png`}
      />
      <div className="landing-page">
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-hero-copy">
            <h1 id="landing-title">{title}</h1>
            <p>{description}</p>
            <div className="landing-actions">
              <Link className="landing-primary-action press" to="/$locale/components/" params={{ locale }}>
                {zh ? "浏览组件" : "Browse components"}<ArrowRightIcon size={15} aria-hidden="true" />
              </Link>
              <Link className="landing-secondary-action press" to="/$locale/primitives/" params={{ locale }}>
                {zh ? "浏览原子动效" : "Browse primitives"}
              </Link>
            </div>
          </div>
          <Stage locale={locale} />
        </section>

        <section className="landing-section" aria-labelledby="landing-components-title">
          <header className="landing-section-heading">
            <div><ComponentLibraryGlyph size={20} aria-hidden="true" /><h2 id="landing-components-title">{zh ? "产品级动效组件" : "Product-ready motion components"}</h2></div>
            <Link to="/$locale/components/" params={{ locale }}>{zh ? "查看全部 48 个" : "View all 48"}<ArrowRightIcon size={14} aria-hidden="true" /></Link>
          </header>
          <div className="landing-component-grid">
            {featuredComponents.map((entry) => (
              <article className="landing-component-card" key={entry.id}>
                <div className="landing-component-stage"><RegistryPreview id={entry.id} locale={locale} deferred /></div>
                <Link
                  className="landing-component-footer"
                  to="/$locale/components/$componentId/"
                  params={{ locale, componentId: entry.id }}
                >
                  <span><strong>{text(entry.name, locale)}</strong><code>{entry.id}</code></span>
                  <ArrowRightIcon size={14} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" aria-labelledby="landing-primitives-title">
          <header className="landing-section-heading">
            <div><MotionPrimitiveGlyph size={20} aria-hidden="true" /><h2 id="landing-primitives-title">{zh ? "可调节原子动效" : "Tunable motion primitives"}</h2></div>
            <Link to="/$locale/primitives/" params={{ locale }}>{zh ? "查看全部 44 个" : "View all 44"}<ArrowRightIcon size={14} aria-hidden="true" /></Link>
          </header>
          <div className="landing-primitive-grid">
            {landingPrimitives.map((recipe) => <PrimitiveCard key={recipe.id} locale={locale} recipe={recipe} />)}
          </div>
        </section>

        <section className="landing-delivery" aria-labelledby="landing-delivery-title">
          <div className="landing-delivery-copy">
            <h2 id="landing-delivery-title">{zh ? "复制代码，继续调。" : "Copy the code. Keep tuning."}</h2>
            <code>npx shadcn@latest add https://motion-lexicon.pages.dev/r/copy-button.json</code>
          </div>
          <Link className="landing-skill-card" to="/$locale/skill/" params={{ locale }}>
            <MotionSkillGlyph size={24} aria-hidden="true" />
            <span><strong>Agent Skill</strong><small>{zh ? "构建页面、推荐、编排、审查" : "Build pages, recommend, compose, review"}</small></span>
            <ArrowRightIcon size={15} aria-hidden="true" />
          </Link>
        </section>

        <footer className="landing-footer">
          <span>Motion Lexicon</span>
          <span>React · Motion · TypeScript · MIT</span>
        </footer>
      </div>
    </>
  );
}
