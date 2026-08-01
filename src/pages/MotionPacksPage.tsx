import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MotionPackGallery } from "../components/MotionPackGallery";
import { MotionPackPreview } from "../components/MotionPackPreview";
import { Seo } from "../components/Seo";
import { motionPacks } from "../data/motion-packs";
import { pathFor, siteUrl } from "../data/site";
import type { Locale } from "../data/types";
import { publisherStructuredData } from "../lib/structured-data";

export function MotionPacksPage({ locale }: { locale: Locale }) {
  const labels = locale === "zh"
    ? {
        status: "Motion Lexicon V1.1 · 16 个产品瞬间",
        title: "一段完整交互，直接带进你的界面。",
        copy: "每个 Motion Pack 都是一段完整交互：亲手触发，查看状态，再复制 HTML、CSS 和 JavaScript。",
        browse: "浏览 16 个产品瞬间",
        finder: "描述一个产品瞬间",
        stage: "保存确认",
        open: "打开产品瞬间",
        finderTitle: "Finder 同时连接两条目录。",
        finderCopy: "说清对象、动作和结果，在产品瞬间与动效基础中继续找到合适的实现方向。",
        finderAction: "打开 Finder"
      }
    : {
        status: "Motion Lexicon V1.1 · 16 product moments",
        title: "Bring a complete interaction into your interface.",
        copy: "Each Motion Pack is a complete interaction to trigger, inspect, and copy as HTML, CSS, and JavaScript.",
        browse: "Explore 16 product moments",
        finder: "Describe a product moment",
        stage: "Save confirmation",
        open: "Open product moment",
        finderTitle: "Finder connects both directories.",
        finderCopy: "Name the object, action, and outcome to continue through product moments and motion primitives.",
        finderAction: "Open Finder"
      };
  const featured = motionPacks[0];

  return (
    <>
      <Seo
        locale={locale}
        title={locale === "zh" ? "产品瞬间 | Motion Lexicon" : "Product moments | Motion Lexicon"}
        description={labels.copy}
        path={pathFor(locale, ["packs"])}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Motion Lexicon — ${labels.status}`,
            description: labels.copy,
            url: `${siteUrl}${pathFor(locale, ["packs"])}`,
            isAccessibleForFree: true,
            inLanguage: locale === "zh" ? "zh-CN" : "en",
            publisher: publisherStructuredData
          }
        ]}
      />
      <div className="motion-packs-page">
        <section className="motion-pack-hero" aria-labelledby="motion-pack-home-title">
          <div>
            <span className="motion-pack-kicker">{labels.status}</span>
            <h1 id="motion-pack-home-title">{labels.title}</h1>
            <p>{labels.copy}</p>
            <div className="motion-pack-hero-actions">
              <a href="#packs">
                {labels.browse}
                <ArrowDown aria-hidden="true" size={15} />
              </a>
              <Link to="/$locale/finder/" params={{ locale }}>
                {labels.finder}
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </div>
          </div>

          {featured ? (
            <div className="motion-pack-hero-stage">
              <MotionPackPreview pack={featured} locale={locale} />
              <div className="motion-pack-hero-stage-footer">
                <span>{featured.timing}</span>
                <strong>{labels.stage} · {labels.open} <ArrowRight aria-hidden="true" size={13} /></strong>
              </div>
            </div>
          ) : null}
        </section>

        <MotionPackGallery locale={locale} />

        <section className="motion-pack-finder-callout" aria-labelledby="motion-pack-finder-title">
          <div>
            <span className="motion-pack-kicker">Motion Finder</span>
            <h2 id="motion-pack-finder-title">{labels.finderTitle}</h2>
            <p>{labels.finderCopy}</p>
          </div>
          <Link to="/$locale/finder/" params={{ locale }}>
            {labels.finderAction}
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </section>
      </div>
    </>
  );
}
