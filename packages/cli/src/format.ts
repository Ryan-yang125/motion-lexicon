import type {
  CatalogDocument,
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
