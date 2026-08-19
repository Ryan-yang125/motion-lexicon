import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ArrowRightIcon, ComponentLibraryGlyph, MotionPrimitiveGlyph, MotionSkillGlyph } from "../components/icons";
import { Seo } from "../components/Seo";
import { registryBlocks } from "../data/block-registry";
import { componentCategories, registryComponents } from "../data/component-registry";
import { pathFor, text } from "../data/site";
import type { Locale } from "../data/types";
import { RegistryPreview } from "../registry/preview-map";

const sceneFamilies = ["product-mono", "editorial-warm", "spatial-dark"] as const;

function FlagshipStage({ locale, entries }: { locale: Locale; entries: readonly (typeof registryComponents)[number][] }) {
  const reduced = useReducedMotion() === true;
  const [index, setIndex] = useState(0);
  const entry = entries[index] ?? entries[0];
  if (!entry) return null;
  return <section className={`v6-stage is-${entry.sceneFamily}`} aria-label={locale === "zh" ? "旗舰组件预览" : "Flagship component preview"}>
    <div className="v6-stage-meta"><span>{entry.sceneFamily.replace("-", " · ")}</span><code>{entry.runtimeCost ?? "light"} · {(entry.engines ?? ["motion"]).join(" + ")}</code></div>
    <div className="v6-stage-canvas"><AnimatePresence mode="wait" initial={false}><motion.div key={entry.id} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : .26 }}><RegistryPreview id={entry.id} locale={locale} deferred /></motion.div></AnimatePresence></div>
    <div className="v6-stage-controls" role="tablist" aria-label={locale === "zh" ? "旗舰组件" : "Flagship components"}>{entries.slice(0, 4).map((item, itemIndex) => <button type="button" role="tab" aria-selected={itemIndex === index} key={item.id} onClick={() => setIndex(itemIndex)}>{text(item.name, locale)}</button>)}</div>
    <Link className="v6-stage-link" to="/$locale/components/$componentId/" params={{ locale, componentId: entry.id }}><span><strong>{text(entry.name, locale)}</strong><code>{entry.id}</code></span><ArrowRightIcon size={15} aria-hidden="true" /></Link>
  </section>;
}

export function HomePage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const featured = registryComponents.filter((entry) => entry.featured).slice(0, 12);
  const title = zh ? "100 个可直接复制的 React 动效组件" : "100 copy-ready React motion components";
  const description = zh ? "为产品界面、媒体叙事和空间视觉准备的完整实现。" : "Complete implementations for product UI, media narratives, and spatial visuals.";
  const sceneCopy = zh ? { "product-mono": ["Product Mono", "精密产品工作台"], "editorial-warm": ["Editorial Warm", "图像与编辑节奏"], "spatial-dark": ["Spatial Dark", "深色空间与环境光"] } : { "product-mono": ["Product Mono", "Precise working surfaces"], "editorial-warm": ["Editorial Warm", "Image-led editorial rhythm"], "spatial-dark": ["Spatial Dark", "Dark spatial atmosphere"] };
  return <><Seo locale={locale} title={`${title} — Motion Lexicon`} description={description} path={pathFor(locale)} image={`/og-home-${locale}.png`} />
    <div className="v6-home">
      <section className="v6-hero"><div className="v6-hero-copy"><p className="v6-eyebrow">React · Motion · Registry</p><h1>{title}</h1><p>{description}</p><div className="v6-actions"><Link className="v6-primary-action" to="/$locale/components/" params={{ locale }}>{zh ? "浏览组件" : "Browse components"}<ArrowRightIcon size={15} aria-hidden="true" /></Link><code>npx shadcn@latest add</code></div></div><FlagshipStage locale={locale} entries={featured.slice(0, 4)} /></section>
      <section className="v6-scene-rail" aria-label={zh ? "视觉场景" : "Visual scene families"}>{sceneFamilies.map((scene) => <article className={`v6-scene-card is-${scene}`} key={scene}><span>{sceneCopy[scene][0]}</span><strong>{sceneCopy[scene][1]}</strong><i aria-hidden="true" /></article>)}</section>
      <section className="v6-section" aria-labelledby="v6-flagships"><div className="v6-section-head"><div><p className="v6-eyebrow">12 FLAGSHIPS</p><h2 id="v6-flagships">{zh ? "建立视觉基准的组件" : "Components that set the visual bar"}</h2></div><Link to="/$locale/components/" params={{ locale }}>{zh ? `全部 ${registryComponents.length} 个组件` : `All ${registryComponents.length} components`}<ArrowRightIcon size={14} aria-hidden="true" /></Link></div><div className="v6-feature-grid">{featured.map((entry, index) => <article className={`v6-feature-card is-${entry.sceneFamily} ${index === 0 ? "is-large" : ""}`} key={entry.id}><div className="v6-feature-stage"><RegistryPreview id={entry.id} locale={locale} deferred /></div><Link to="/$locale/components/$componentId/" params={{ locale, componentId: entry.id }}><span><strong>{text(entry.name, locale)}</strong><code>{entry.id}</code></span><small>{entry.runtimeCost ?? "light"} · {(entry.engines ?? ["motion"]).join("+")}</small></Link></article>)}</div></section>
      <section className="v6-section" aria-labelledby="v6-categories"><div className="v6-section-head"><div><p className="v6-eyebrow">COLLECTIONS</p><h2 id="v6-categories">{zh ? "从产品任务开始浏览" : "Browse from the product job"}</h2></div></div><div className="v6-category-grid">{componentCategories.map((category) => { const count = registryComponents.filter((entry) => entry.category === category.id).length; return <a key={category.id} href={`${pathFor(locale, ["components"])}?category=${category.id}`}><ComponentLibraryGlyph size={16} aria-hidden="true" /><span>{text(category.name, locale)}</span><code>{count}</code><ArrowRightIcon size={14} aria-hidden="true" /></a>; })}</div></section>
      <section className="v6-section" aria-labelledby="v6-blocks"><div className="v6-section-head"><div><p className="v6-eyebrow">PAGE BLOCKS</p><h2 id="v6-blocks">{zh ? "用完整页面验证组合" : "Composition proved in complete pages"}</h2></div><Link to="/$locale/blocks/" params={{ locale }}>{zh ? `全部 ${registryBlocks.length} 个 Blocks` : `All ${registryBlocks.length} Blocks`}<ArrowRightIcon size={14} aria-hidden="true" /></Link></div><div className="v6-block-grid">{registryBlocks.map((entry) => <Link key={entry.id} to="/$locale/blocks/$blockId/" params={{ locale, blockId: entry.id }}><div><RegistryPreview id={entry.id} locale={locale} deferred /></div><span><strong>{text(entry.name, locale)}</strong><code>{entry.id}</code></span></Link>)}</div></section>
      <section className="v6-secondary"><Link to="/$locale/primitives/" params={{ locale }}><MotionPrimitiveGlyph size={20} aria-hidden="true" /><span><strong>{zh ? "44 个动效原子" : "44 motion primitives"}</strong><small>{zh ? "组合每一个动作" : "Compose every movement"}</small></span><ArrowRightIcon size={15} aria-hidden="true" /></Link><div><code>npx shadcn@latest add https://motion-lexicon.pages.dev/r/copy-button.json</code></div><Link to="/$locale/skill/" params={{ locale }}><MotionSkillGlyph size={20} aria-hidden="true" /><span><strong>Agent Skill</strong><small>{zh ? "规划、构建与评审" : "Plan, build, review"}</small></span><ArrowRightIcon size={15} aria-hidden="true" /></Link></section>
    </div>
  </>;
}
