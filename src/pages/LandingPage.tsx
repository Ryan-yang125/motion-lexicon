import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { MotionPackPreview } from "../components/MotionPackPreview";
import { MotionThumbnail } from "../components/MotionThumbnail";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/button";
import { getRecipe } from "../data/recipes";
import { motionPacks } from "../data/motion-packs";
import { pathFor, siteUrl } from "../data/site";
import type { Locale } from "../data/types";
import { publisherStructuredData } from "../lib/structured-data";

export function LandingPage({ locale }: { locale: Locale }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const featuredPack = motionPacks[0];
  const featuredPrimitive = getRecipe("entrances", "slide-in");
  const labels = locale === "zh"
    ? {
        status: "Motion Lexicon V1.1 · 免费开源",
        title: "把产品动效，\n带进真实界面。",
        copy: "产品瞬间与动效基础，都是可预览、可调节、可复制的产品动效。",
        placeholder: "描述一个界面、动作或感觉",
        submit: "找动效",
        packsKicker: "产品瞬间 · 16",
        packsTitle: "完整交互，直接带走。",
        packsCopy: "从触发到结果，一次看完完整状态和可复制实现。",
        packsAction: "浏览产品瞬间",
        primitivesKicker: "动效基础 · 44",
        primitivesTitle: "一个动效，放进真实场景。",
        primitivesCopy: "查看底层动作、参数和用法，再按需要探索完整产品瞬间。",
        primitivesAction: "浏览动效基础",
        finderKicker: "Motion Finder",
        finderCopy: "用自己的描述，在两条目录中找到合适的起点。"
      }
    : {
        status: "Motion Lexicon V1.1 · Free and open source",
        title: "Bring product motion\ninto a real interface.",
        copy: "Product moments and motion primitives are both previewable, tunable, and ready to copy.",
        placeholder: "Describe an interface, action, or feeling",
        submit: "Find motion",
        packsKicker: "Product moments · 16",
        packsTitle: "A complete interaction, ready to take.",
        packsCopy: "See the full state change from trigger to outcome, then copy the implementation.",
        packsAction: "Browse product moments",
        primitivesKicker: "Motion primitives · 44",
        primitivesTitle: "Put one motion in a real context.",
        primitivesCopy: "Inspect the underlying behavior, parameters, and use, then explore complete product moments when useful.",
        primitivesAction: "Browse motion primitives",
        finderKicker: "Motion Finder",
        finderCopy: "Start with your own words and explore both directories."
      };

  function submitFinder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    const params = value ? `?q=${encodeURIComponent(value)}` : "";
    void navigate({ href: `${pathFor(locale, ["finder"])}${params}` });
  }

  return (
    <>
      <Seo
        locale={locale}
        title={locale === "zh"
          ? "Motion Lexicon | 产品瞬间与动效基础"
          : "Motion Lexicon | Product moments and motion primitives"}
        description={labels.copy}
        path={pathFor(locale)}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Motion Lexicon V1.1",
            description: labels.copy,
            url: `${siteUrl}${pathFor(locale)}`,
            inLanguage: locale === "zh" ? "zh-CN" : "en",
            isAccessibleForFree: true,
            publisher: publisherStructuredData
          }
        ]}
      />
      <div className="dual-library-home">
        <section className="dual-library-intro" aria-labelledby="dual-library-title">
          <span className="motion-pack-kicker">{labels.status}</span>
          <h1 id="dual-library-title">{labels.title}</h1>
          <p>{labels.copy}</p>
          <form className="dual-library-search" role="search" onSubmit={submitFinder}>
            <Search aria-hidden="true" size={16} strokeWidth={1.8} />
            <label className="sr-only" htmlFor="home-finder-query">{labels.placeholder}</label>
            <input
              id="home-finder-query"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder={labels.placeholder}
            />
            <Button type="submit" variant="accent" size="sm">
              {labels.submit}
              <ArrowRight aria-hidden="true" size={14} />
            </Button>
          </form>
          <p className="dual-library-finder-note">
            <span>{labels.finderKicker}</span>
            {labels.finderCopy}
          </p>
        </section>

        <section className="dual-library-directories" aria-label={locale === "zh" ? "两个动效目录" : "Two motion directories"}>
          <article
            className="dual-library-directory-card dual-library-pack-card"
            data-testid="directory-card-packs"
          >
            <div className="dual-library-directory-copy">
              <span className="motion-pack-kicker">{labels.packsKicker}</span>
              <h2>{labels.packsTitle}</h2>
              <p>{labels.packsCopy}</p>
            </div>
            {featuredPack ? (
              <div className="dual-library-directory-stage">
                <MotionPackPreview pack={featuredPack} compact locale={locale} />
              </div>
            ) : null}
            <Link className="dual-library-directory-action" to="/$locale/packs/" params={{ locale }}>
              {labels.packsAction}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </article>

          <article
            className="dual-library-directory-card dual-library-primitive-card library-hero-preview"
            data-testid="directory-card-primitives"
          >
            <div className="dual-library-directory-copy">
              <span className="motion-pack-kicker">{labels.primitivesKicker}</span>
              <h2>{labels.primitivesTitle}</h2>
              <p>{labels.primitivesCopy}</p>
            </div>
            {featuredPrimitive ? (
              <div className="dual-library-directory-stage dual-library-primitive-stage">
                <MotionThumbnail locale={locale} recipe={featuredPrimitive} />
              </div>
            ) : null}
            <Link
              className="dual-library-directory-action"
              to="/$locale/catalog/"
              params={{ locale }}
              search={{ surface: "components" }}
            >
              {labels.primitivesAction}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </article>
        </section>
      </div>
    </>
  );
}
