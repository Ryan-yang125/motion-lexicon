import { catalogRecipes } from "./recipes";
import type { Locale, MotionRecipe } from "./types";

export type PrimitiveRegistryEntry = {
  id: string;
  registryId: string;
  exportName: string;
  recipe: MotionRecipe;
  installable: boolean;
};

function pascalCase(value: string) {
  const name = value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
  return /^\d/.test(name) ? `Motion${name}` : name;
}

export const primitiveRegistryEntries: readonly PrimitiveRegistryEntry[] = catalogRecipes.map((recipe) => ({
  id: recipe.id,
  registryId: `primitive-${recipe.id}`,
  exportName: `${pascalCase(recipe.id)}Primitive`,
  recipe,
  installable: recipe.surfaceType !== "guide"
}));

const primitiveRegistryById = new Map(
  primitiveRegistryEntries.map((entry) => [entry.id, entry])
);

export const installablePrimitiveEntries = primitiveRegistryEntries.filter(
  (entry) => entry.installable
);

export function getPrimitiveRegistryEntry(id: string) {
  return primitiveRegistryById.get(id);
}

export function primitiveInstallCommand(id: string) {
  return `npx shadcn@latest add https://motion-lexicon.pages.dev/r/primitive-${id}.json`;
}

export function primitiveSurfaceLabel(recipe: MotionRecipe, locale: Locale) {
  const labels = {
    component: { zh: "动效", en: "Motion" },
    playground: { zh: "参数工具", en: "Playground" },
    guide: { zh: "设计指南", en: "Guide" }
  } as const;
  return labels[recipe.surfaceType][locale];
}
