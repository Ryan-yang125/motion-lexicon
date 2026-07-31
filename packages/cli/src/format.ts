import type {
  CatalogDocument,
  MotionPackDocument,
  MotionPacksDocument,
  RecommendDocument,
  RecipeDocument,
  SearchDocument
} from "./types.js";

function escapeCell(value: string) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function displayAliases(aliases: string[]) {
  return aliases.length ? aliases.join(", ") : "—";
}

export function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function formatCatalogText(document: CatalogDocument) {
  return document.items
    .map((item) => `${item.id}\t${item.name}\t${item.categoryId}\t${item.surfaceType}\t${item.description}`)
    .join("\n");
}

export function formatCatalogMarkdown(document: CatalogDocument) {
  const rows = document.items.map(
    (item) => `| ${escapeCell(item.id)} | ${escapeCell(item.name)} | ${escapeCell(item.categoryId)} | ${item.surfaceType} | ${escapeCell(displayAliases(item.aliases))} |`
  );
  return [
    "| ID | Name | Category | Surface | Aliases |",
    "| --- | --- | --- | --- | --- |",
    ...rows
  ].join("\n");
}

export function formatMotionPacksText(document: MotionPacksDocument) {
  return document.items
    .map((item) => `${item.id}\t${item.name}\t${item.groupName}\t${item.description}`)
    .join("\n");
}

export function formatMotionPacksMarkdown(document: MotionPacksDocument) {
  const rows = document.items.map(
    (item) => `| ${escapeCell(item.id)} | ${escapeCell(item.name)} | ${escapeCell(item.groupName)} | ${escapeCell(item.description)} |`
  );
  return [
    "| ID | Motion Pack | Group | Description |",
    "| --- | --- | --- | --- |",
    ...rows
  ].join("\n");
}

export function formatMotionPackText(document: MotionPackDocument) {
  return [
    `${document.name} (${document.id})`,
    document.description,
    `group: ${document.groupName}`,
    `path: ${document.path}`,
    `timing: ${document.timing}`,
    `trigger: ${document.guidance.trigger}`,
    `reduced motion: ${document.guidance.reducedMotion}`
  ].join("\n");
}

export function formatMotionPackMarkdown(document: MotionPackDocument) {
  return [
    `# ${document.name}`,
    "",
    document.description,
    "",
    `- ID: \`${document.id}\``,
    `- Group: ${document.groupName}`,
    `- Scene: ${document.scene}`,
    `- Use case: ${document.useCase}`,
    `- Timing: ${document.timing}`,
    `- Path: \`${document.path}\``,
    "",
    "## Motion guidance",
    "",
    `- Trigger: ${document.guidance.trigger}`,
    `- Outcome: ${document.guidance.outcome}`,
    `- Reduced motion: ${document.guidance.reducedMotion}`
  ].join("\n");
}

export function formatSearchText(document: SearchDocument) {
  return document.items
    .map((item) => `${item.id}\t${item.name}\t${item.score}\t${item.description}`)
    .join("\n");
}

export function formatSearchMarkdown(document: SearchDocument) {
  const rows = document.items.map(
    (item) => `| ${escapeCell(item.id)} | ${escapeCell(item.name)} | ${item.score} | ${escapeCell(item.description)} |`
  );
  return [
    "| ID | Name | Score | Description |",
    "| --- | --- | ---: | --- |",
    ...rows
  ].join("\n");
}

export function formatRecommendText(document: RecommendDocument) {
  const heading = `${document.groupName}\t${document.confidence}\t${document.compareUrl}`;
  const items = document.items.map(
    (item) => `${item.rank}\t${item.variantId}\t${item.name}\t${item.score}\t${item.confidence}\t${item.reason}`
  );
  return [heading, ...items].join("\n");
}

export function formatRecommendMarkdown(document: RecommendDocument) {
  const rows = document.items.map(
    (item) => `| ${item.rank} | ${escapeCell(item.variantId)} | ${escapeCell(item.name)} | ${item.score} | ${item.confidence} | ${escapeCell(item.reason)} |`
  );
  return [
    `# ${escapeCell(document.groupName)}`,
    "",
    document.reason,
    "",
    `- Confidence: \`${document.confidence}\` (${document.confidenceScore})`,
    `- Finder: ${document.compareUrl}`,
    "",
    "| Rank | Variant | Name | Score | Confidence | Reason |",
    "| ---: | --- | --- | ---: | ---: | --- |",
    ...rows
  ].join("\n");
}

export function formatRecipeText(document: RecipeDocument) {
  const lines = [
    `${document.name} (${document.id})`,
    document.shortDescription,
    `category: ${document.categoryId}`,
    `surface: ${document.surfaceType}`,
    `path: ${document.path}`,
    `aliases: ${displayAliases(document.aliases)}`
  ];
  if (document.presetQuery) lines.push(`preset: ${document.presetQuery}`);
  if (document.params.length) {
    lines.push("parameters:");
    for (const param of document.params) {
      lines.push(`  ${param.id}=${String(param.value)} (default ${String(param.defaultValue)})`);
    }
  }
  return lines.join("\n");
}

export function formatRecipeMarkdown(document: RecipeDocument) {
  const lines = [
    `# ${document.name}`,
    "",
    document.shortDescription,
    "",
    `- ID: \`${document.id}\``,
    `- Category: \`${document.categoryId}\``,
    `- Surface: \`${document.surfaceType}\``,
    `- Path: \`${document.path}\``,
    `- Aliases: ${document.aliases.map((alias) => `\`${alias}\``).join(", ") || "—"}`
  ];
  if (document.presetQuery) lines.push(`- Preset: \`${document.presetQuery}\``);
  lines.push("", "## Parameters", "");
  if (!document.params.length) {
    lines.push("This guide has no tunable parameters.");
  } else {
    lines.push("| Parameter | Value | Default | Description |", "| --- | --- | --- | --- |");
    for (const param of document.params) {
      lines.push(`| \`${param.id}\` | \`${String(param.value)}\` | \`${String(param.defaultValue)}\` | ${escapeCell(param.description)} |`);
    }
  }
  lines.push("", "## Reduced motion", "", document.reducedMotion);
  return lines.join("\n");
}
