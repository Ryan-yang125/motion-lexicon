export const seoGuideIds = [
  "save-submit-publish-feedback",
  "card-list-filter-continuity",
  "css-motion-jank",
  "spring-or-ease-out",
  "reduced-motion",
  "form-validation-delete-permission",
  "from-brief-to-spec",
  "pack-or-primitive"
] as const;

export type SeoGuideId = (typeof seoGuideIds)[number];
