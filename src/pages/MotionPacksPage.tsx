import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MotionPackGallery } from "../components/MotionPackGallery";
import { MotionPackPreview } from "../components/MotionPackPreview";
import { Seo } from "../components/Seo";
import { motionPacks } from "../data/motion-packs";
import { pathFor, siteUrl } from "../data/site";
import type { Locale } from "../data/types";
import { publisherStructuredData } from "../lib/structured-data";

export function MotionPacksPage({ locale, home = false }: { locale: Locale; home?: boolean }) {
  const labels = locale === "zh"
    ? {
        status: "Motion Lexicon V1.0 · 16 个真实产品瞬间",
        title: "把一个产品瞬间，直接带进你的界面。",
        copy: "每个 Motion Pack 都是一段完整交互：亲手触发，查看状态，再复制 HTML、CSS 和 JavaScript。",
        browse: "浏览 16 个 Pack",
        finder: "描述一个产品瞬间",
        stage: "保存确认",
        open: "打开 Pack",
        finderTitle: "Finder 帮你选，Pack 帮你落地。",
        finderCopy: "说清对象、动作和结果，找到适合的实现方向，再带走完整的产品瞬间。",
        finderAction: "打开 Finder"
      }
    : {
        status: "Motion Lexicon V1.0 · 16 real product moments",
        title: "Bring a better product moment into your interface.",
        copy: "Each Motion Pack is a complete interaction to trigger, inspect, and copy as HTML, CSS, and JavaScript.",
        browse: "Explore 16 packs",
        finder: "Describe a product moment",
        stage: "Save confirmation",
        open: "Open pack",
        finderTitle: "Finder helps you choose. Packs help you ship.",
        finderCopy: "Name the object, action, and outcome. Find the right direction, then take a complete product moment with you.",
        finderAction: "Open Finder"
      };
  const featured = motionPacks[0];

  return (
    <>
      <Seo
        locale={locale}
        title={home
          ? locale === "zh" ? "Motion Lexicon | 可复制的真实产品瞬间" : "Motion Lexicon | Copy-ready product moments"
          : locale === "zh" ? "Motion Packs | 可复制的真实产品动效" : "Motion Packs | Copy-ready product moments"}
        description={labels.copy}
        path={home ? pathFor(locale) : pathFor(locale, ["packs"])}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Motion Lexicon — ${labels.status}`,
            description: labels.copy,
            url: `${siteUrl}${home ? pathFor(locale) : pathFor(locale, ["packs"])}`,
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
