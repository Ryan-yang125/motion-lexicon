import { seoGuideArticlesA } from "./seo-guide-articles-a";
import { seoGuideArticlesB, type SeoGuideLongArticle } from "./seo-guide-articles-b";
import { seoGuideArticlesC } from "./seo-guide-articles-c";
import type { SeoGuideId } from "./seo-guide-ids";

export type {
  SeoGuideArticleCase,
  SeoGuideArticleChecklistItem,
  SeoGuideArticleDiagram,
  SeoGuideArticleDiagramConnector,
  SeoGuideArticleDiagramNode,
  SeoGuideArticleSection,
  SeoGuideArticleText,
  SeoGuideLongArticle
} from "./seo-guide-articles-b";

export const seoGuideArticles: readonly SeoGuideLongArticle[] = [
  ...seoGuideArticlesA,
  ...seoGuideArticlesB,
  ...seoGuideArticlesC
];

const articleByGuideId = new Map<SeoGuideId, SeoGuideLongArticle>(
  seoGuideArticles.map((article) => [article.guideId, article])
);

export function getSeoGuideArticle(id?: string | null): SeoGuideLongArticle | undefined {
  return id ? articleByGuideId.get(id as SeoGuideId) : undefined;
}
