import type { SeoGuideLongArticle } from "./seo-guide-article-types";
import type { SeoGuideId } from "./seo-guide-ids";

type ArticleModule = { default: unknown };
type ArticleLoader = () => Promise<ArticleModule>;

const articleLoaders: Record<SeoGuideId, ArticleLoader> = {
  "save-submit-publish-feedback": () => import("./seo-guide-article-data/save-submit-publish-feedback.json"),
  "card-list-filter-continuity": () => import("./seo-guide-article-data/card-list-filter-continuity.json"),
  "css-motion-jank": () => import("./seo-guide-article-data/css-motion-jank.json"),
  "spring-or-ease-out": () => import("./seo-guide-article-data/spring-or-ease-out.json"),
  "reduced-motion": () => import("./seo-guide-article-data/reduced-motion.json"),
  "form-validation-delete-permission": () => import("./seo-guide-article-data/form-validation-delete-permission.json"),
  "from-brief-to-spec": () => import("./seo-guide-article-data/from-brief-to-spec.json"),
  "component-or-primitive": () => import("./seo-guide-article-data/component-or-primitive.json")
};

export async function loadSeoGuideArticle(id?: string | null): Promise<SeoGuideLongArticle | undefined> {
  const loader = id ? articleLoaders[id as SeoGuideId] : undefined;
  if (!loader) return undefined;
  const module = await loader();
  return module.default as SeoGuideLongArticle;
}
