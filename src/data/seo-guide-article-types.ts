import type { SeoGuideId } from "./seo-guide-ids";

export type SeoGuideArticleText = {
  zh: string;
  en: string;
};

export type SeoGuideArticleSection = {
  id: string;
  title: SeoGuideArticleText;
  paragraphs: readonly [SeoGuideArticleText, SeoGuideArticleText, ...SeoGuideArticleText[]];
};

export type SeoGuideArticleChecklistItem = {
  id: string;
  label: SeoGuideArticleText;
  detail: SeoGuideArticleText;
};

export type SeoGuideArticleCase = {
  title: SeoGuideArticleText;
  context: SeoGuideArticleText;
  code: string;
  explanation: SeoGuideArticleText;
};

export type SeoGuideArticleDiagramNode = {
  id: string;
  label: SeoGuideArticleText;
  detail: SeoGuideArticleText;
  x: number;
  y: number;
  width: number;
  height: number;
  tone: "ink" | "accent" | "success" | "warning" | "surface";
};

export type SeoGuideArticleDiagramConnector = {
  from: string;
  to: string;
  label?: SeoGuideArticleText;
};

export type SeoGuideArticleDiagram = {
  id: string;
  title: SeoGuideArticleText;
  alt: SeoGuideArticleText;
  viewBox: "0 0 960 540";
  nodes: readonly SeoGuideArticleDiagramNode[];
  connectors: readonly SeoGuideArticleDiagramConnector[];
};

export type SeoGuideLongArticle = {
  guideId: SeoGuideId;
  standfirst: SeoGuideArticleText;
  sections: readonly [
    SeoGuideArticleSection,
    SeoGuideArticleSection,
    SeoGuideArticleSection,
    SeoGuideArticleSection,
    SeoGuideArticleSection
  ];
  checklistTitle: SeoGuideArticleText;
  checklist: readonly [
    SeoGuideArticleChecklistItem,
    SeoGuideArticleChecklistItem,
    SeoGuideArticleChecklistItem,
    SeoGuideArticleChecklistItem,
    SeoGuideArticleChecklistItem
  ];
  caseStudy: SeoGuideArticleCase;
  diagrams: readonly [SeoGuideArticleDiagram, SeoGuideArticleDiagram, SeoGuideArticleDiagram];
};
