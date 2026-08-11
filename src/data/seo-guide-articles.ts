import cardListFilterContinuity from "./seo-guide-article-data/card-list-filter-continuity.json";
import cssMotionJank from "./seo-guide-article-data/css-motion-jank.json";
import formValidationDeletePermission from "./seo-guide-article-data/form-validation-delete-permission.json";
import fromBriefToSpec from "./seo-guide-article-data/from-brief-to-spec.json";
import componentOrPrimitive from "./seo-guide-article-data/component-or-primitive.json";
import reducedMotion from "./seo-guide-article-data/reduced-motion.json";
import saveSubmitPublishFeedback from "./seo-guide-article-data/save-submit-publish-feedback.json";
import springOrEaseOut from "./seo-guide-article-data/spring-or-ease-out.json";
import type { SeoGuideLongArticle } from "./seo-guide-article-types";

export type {
  SeoGuideArticleCase,
  SeoGuideArticleChecklistItem,
  SeoGuideArticleDiagram,
  SeoGuideArticleDiagramConnector,
  SeoGuideArticleDiagramNode,
  SeoGuideArticleSection,
  SeoGuideArticleText,
  SeoGuideLongArticle
} from "./seo-guide-article-types";

export const seoGuideArticles: readonly SeoGuideLongArticle[] = [
  saveSubmitPublishFeedback,
  cardListFilterContinuity,
  cssMotionJank,
  springOrEaseOut,
  reducedMotion,
  formValidationDeletePermission,
  fromBriefToSpec,
  componentOrPrimitive
] as unknown as readonly SeoGuideLongArticle[];
