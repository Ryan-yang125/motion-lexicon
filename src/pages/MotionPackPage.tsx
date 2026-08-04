import { ArrowLeft, ArrowRight } from "../components/icons";
import { Link } from "@tanstack/react-router";
import { MotionPackExport } from "../components/MotionPackExport";
import { MotionPackPreview } from "../components/MotionPackPreview";
import { Seo } from "../components/Seo";
import {
  getMotionPack,
  getMotionPackFoundations,
  getMotionPacksForGroup,
  motionPackGroups,
  motionPacks
} from "../data/motion-packs";
import { getCatalogRecipe } from "../data/recipes";
import { pathFor } from "../data/site";
import type { Locale } from "../data/types";
import { motionPackStructuredData } from "../lib/structured-data";

function concisePackDescription(pack: NonNullable<ReturnType<typeof getMotionPack>>, locale: Locale) {
  const tail = locale === "zh" ? " 可复制 HTML、CSS 与 JavaScript。" : " Copy-ready HTML, CSS, and JavaScript.";
  const copy = pack.shortDescription[locale].trim();
  if (locale === "zh" || copy.length + tail.length <= 155) return `${copy}${tail}`;
  const limit = 155 - tail.length - 1;
  return `${copy.slice(0, limit).replace(/[\s,;:.]+$/, "")}…${tail}`;
}

export function MotionPackPage({ locale, packId }: { locale: Locale; packId: string }) {
  const pack = getMotionPack(packId);
  const labels = locale === "zh"
    ? {
        back: "返回产品瞬间",
        preview: "交互预览",
        scene: "产品场景",
        use: "适合使用",
        rules: "动效规则",
        reduced: "减弱动效",
        foundations: "关联动效基础",
        related: "同类产品瞬间",
        source: "可复制实现"
      }
    : {
        back: "Back to product moments",
        preview: "Interactive preview",
        scene: "Product scene",
        use: "Use for",
        rules: "Motion rules",
        reduced: "Reduced motion",
        foundations: "Related motion primitives",
        related: "Related product moments",
        source: "Copy-ready implementation"
      };

  if (!pack) {
    return <MotionPacksFallback locale={locale} />;
  }

  const group = motionPackGroups.find((entry) => entry.id === pack.groupId);
  const index = motionPacks.findIndex((entry) => entry.id === pack.id) + 1;
  const related = getMotionPacksForGroup(pack.groupId).filter((entry) => entry.id !== pack.id).slice(0, 3);
  const foundations = getMotionPackFoundations(pack).flatMap((foundation) => {
    const recipe = getCatalogRecipe(foundation.foundationId);
    return recipe ? [{ foundation, recipe }] : [];
  });
  const seoTitle = locale === "zh"
    ? `${pack.name.zh}产品动效：HTML、CSS、JS 示例 | Motion Lexicon`
    : `${pack.name.en} product motion: HTML, CSS, JS | Motion Lexicon`;
  const seoDescription = concisePackDescription(pack, locale);

  return (
    <>
      <Seo
        locale={locale}
        title={seoTitle}
        description={seoDescription}
        path={pathFor(locale, ["packs", pack.id])}
        image={`/og-packs-${locale}.png`}
        structuredData={[motionPackStructuredData(locale, pack)]}
      />
      <div className="motion-pack-page">
        <Link className="motion-pack-back-link" to="/$locale/packs/" params={{ locale }}>
          <ArrowLeft aria-hidden="true" size={14} />
          {labels.back}
        </Link>

        <header className="motion-pack-page-header">
          <span className="motion-pack-eyebrow">
            Motion Pack {String(index).padStart(2, "0")} · {group?.name[locale]}
          </span>
          <h1>{pack.name[locale]}</h1>
          <p>{pack.shortDescription[locale]}</p>
        </header>

        <section className="motion-pack-workbench" aria-label={labels.preview}>
          <div className="motion-pack-stage">
            <MotionPackPreview pack={pack} locale={locale} />
          </div>
          <aside className="motion-pack-inspector">
            <div className="motion-pack-inspector-header">
              <strong>{labels.preview}</strong>
              <span>{pack.timing}</span>
            </div>
            <dl className="motion-pack-info-list">
              <div>
                <dt>{labels.scene}</dt>
                <dd>{pack.scene[locale]}</dd>
              </div>
              <div>
                <dt>{labels.use}</dt>
                <dd>{pack.useCase[locale]}</dd>
              </div>
              <div>
                <dt>{labels.rules}</dt>
                <dd>{pack.guidance.trigger[locale]}</dd>
              </div>
            </dl>
            <div className="motion-pack-state-list" aria-label={locale === "zh" ? "完整状态" : "Complete states"}>
              {pack.stateLabels.map((state) => <span key={state[locale]}>{state[locale]}</span>)}
            </div>
          </aside>
        </section>

        <div className="motion-pack-page-main">
          <section aria-label={labels.source}>
            <MotionPackExport locale={locale} prompt={pack.prompt[locale]} source={pack.source} />
          </section>
          {foundations.length ? (
            <section className="motion-pack-foundations" aria-labelledby="pack-foundations-title">
              <div className="motion-pack-related-head">
                <h2 id="pack-foundations-title">{labels.foundations}</h2>
              </div>
              <div className="motion-pack-foundation-grid">
                {foundations.map(({ foundation, recipe }) => (
                  <Link
                    className="motion-pack-foundation-link"
                    data-testid={`pack-foundation-${foundation.foundationId}`}
                    key={foundation.foundationId}
                    to="/$locale/$categoryId/$recipeId/"
                    params={{ locale, categoryId: recipe.categoryId, recipeId: recipe.id }}
                  >
                    <span className="motion-pack-foundation-copy">
                      <small>{foundation.roleLabel[locale]}</small>
                      <strong>{recipe.name[locale]}</strong>
                      <em>{foundation.note[locale]}</em>
                    </span>
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          <section className="motion-pack-guidance" aria-label={labels.rules}>
            <div className="motion-pack-rule">
              <span className="motion-pack-rule-label">{labels.rules}</span>
              <p>{pack.guidance.outcome[locale]}</p>
            </div>
            <div className="motion-pack-rule">
              <span className="motion-pack-rule-label">{labels.reduced}</span>
              <p>{pack.guidance.reducedMotion[locale]}</p>
            </div>
            <div className="motion-pack-rule">
              <span className="motion-pack-rule-label">{locale === "zh" ? "实现" : "Implementation"}</span>
              <p>{locale === "zh" ? "HTML、CSS 与行为所需的 JavaScript 一起复制。" : "Copy HTML, CSS, and the JavaScript required for behavior together."}</p>
            </div>
          </section>

          {related.length ? (
            <section className="motion-pack-related" aria-labelledby="related-packs-title">
              <div className="motion-pack-related-head">
                <h2 id="related-packs-title">{labels.related}</h2>
              </div>
              <div className="motion-pack-related-grid">
                {related.map((entry) => (
                  <Link
                    className="motion-pack-related-link"
                    key={entry.id}
                    to="/$locale/packs/$packId/"
                    params={{ locale, packId: entry.id }}
                  >
                    <span>
                      <small>{entry.timing}</small>
                      {entry.name[locale]}
                    </span>
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}

function MotionPacksFallback({ locale }: { locale: Locale }) {
  return (
    <div className="motion-pack-page">
      <Link className="motion-pack-back-link" to="/$locale/packs/" params={{ locale }}>
          <ArrowLeft aria-hidden="true" size={14} />
        {locale === "zh" ? "返回产品瞬间" : "Back to product moments"}
      </Link>
    </div>
  );
}
