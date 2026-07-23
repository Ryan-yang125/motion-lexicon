# Motion Lexicon

[![CI](https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg)](https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml)
[![Code license: MIT](https://img.shields.io/badge/code-MIT-black.svg)](./LICENSE)
[![Content license: CC BY 4.0](https://img.shields.io/badge/content-CC_BY_4.0-2457ff.svg)](./CONTENT-LICENSE)

**[Live website](https://motion-lexicon.pages.dev/)** · **[44-recipe catalog](https://motion-lexicon.pages.dev/en/catalog/)** · **[91-term vocabulary](https://motion-lexicon.pages.dev/en/vocabulary/)** · **[Versioned JSON API](https://motion-lexicon.pages.dev/data/v1/catalog.json)**

Motion Lexicon is a visual motion recipe library. It helps users find a production-ready motion pattern, inspect its real behavior, tune relevant parameters, and copy agent-ready prompt text plus portable HTML, CSS, and interaction JavaScript.

The launch catalog contains 44 canonical units across 12 categories: 31 copy-ready components, 9 focused playgrounds, and 4 guides. A dedicated bilingual vocabulary surface covers all 91 motion terms with original English technical definitions, accurate Chinese translations, and close-term distinctions. The 47 related terms resolve into the curated workspaces without duplicating components.

## Current Status

- Static React + TypeScript application is implemented.
- 44 canonical catalog units and all 91 source terms are available in Chinese and English.
- Motion Lexicon independently maintains all 91 English definitions; every term includes a specific Chinese translation and every alias includes a bilingual distinction.
- Preview, parameters, prompt, HTML, CSS, JavaScript, and reduced-motion output share one semantic motion specification.
- Gesture components use real pointer and keyboard behavior, including pointer capture, damping, velocity thresholds, cancellation, and accessible alternatives.
- Every canonical workspace includes a specific purpose, frequency, trigger, enter/exit, interruptibility, gesture, reduced-motion, and review contract.
- Light and dark themes are available.
- Entry query state is shareable through the URL.
- Landing, catalog, category, and canonical entry routes are prerendered during build.
- Legacy vocabulary URLs redirect to their canonical recipe or playground preset.
- `sitemap.xml`, `robots.txt`, favicon assets, OG images, manifest, `404.html`, `_headers`, and `_redirects` are generated or copied into `dist`.

## Documentation

- `PRODUCT.md`: product promise, users, phase strategy, content rules, interaction rules, and quality bar.
- `DESIGN.md`: launch design, routing, SEO plan, motion rules, and acceptance criteria.
- `AGENTS.md`: working instructions for future agents.
- `prototype/motion-lexicon-prototype.html`: archived phase-one visual reference.
- `src/styles.css` and `src/library.css`: current neutral component-library design system.

## Free CLI and Agent Skill

Run the versioned CLI directly from GitHub:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.1.0 search "shared element" --locale en --format json
npx -y github:Ryan-yang125/motion-lexicon#v0.1.0 show slide-in --locale en --format json
npx -y github:Ryan-yang125/motion-lexicon#v0.1.0 export slide-in --locale en --format bundle
```

Install the Agent Skill:

```bash
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon
```

Agent and tool integrations can use [llms.txt](https://motion-lexicon.pages.dev/llms.txt), [llms-full.txt](https://motion-lexicon.pages.dev/llms-full.txt), the [catalog JSON](https://motion-lexicon.pages.dev/data/v1/catalog.json), [vocabulary JSON](https://motion-lexicon.pages.dev/data/v1/vocabulary.json), and [JSON Schema](https://motion-lexicon.pages.dev/data/v1/schema.json).

## Routes

```txt
/zh/
/en/
/zh/catalog/
/en/catalog/
/zh/vocabulary/
/en/vocabulary/
/zh/:categoryId/
/en/:categoryId/
/zh/:categoryId/:recipeId/
/en/:categoryId/:recipeId/
```

Compatibility routes remain available through generated redirects:

```txt
/zh/playground/
/en/playground/
/:locale/:categoryId/:legacyTerm/
```

The seed entry route is:

```txt
/zh/entrances/slide-in
```

Recipe parameters live in the query string:

```txt
?duration=420&distance=28&delay=0&ease=soft
```

Default values are omitted from the URL.

## SEO Architecture

SEO is handled through build-time static prerendering.

The app uses `react-helmet-async` in `src/components/Seo.tsx` for:

- `<title>`
- meta description
- canonical URL
- hreflang alternates
- Open Graph tags
- Twitter card tag
- JSON-LD BreadcrumbList
- JSON-LD ItemList on catalog/category compatibility pages
- JSON-LD TechArticle or DefinedTerm on entry pages

`npm run build` runs this sequence:

```bash
tsc -b
vite build
tsx --tsconfig tsconfig.app.json scripts/prerender.ts
```

`scripts/prerender.ts` reads static paths from `src/data/site.ts`, calls `src/entry-server.tsx`, injects Helmet output into route HTML, then writes:

```txt
dist/index.html
dist/zh/index.html
dist/zh/catalog/index.html
dist/zh/entrances/slide-in/index.html
dist/sitemap.xml
dist/robots.txt
```

The public sitemap contains 118 canonical URLs: localized landing pages, catalogs, vocabulary pages, 12 category pages, and 44 canonical entries. Alias routes stay out of the sitemap.

The deployed site is static HTML, CSS, and JavaScript. A Node server is not required at runtime. The code uses a React server renderer during the build step only.

Catalog, vocabulary, category, and recipe code is split at the TanStack Router boundary. The landing page uses `src/data/compact-catalog.ts`, so detailed guidance, the editor, Radix controls, and portable runtime source load only when a user opens the library. The verified landing JavaScript entry is about 116 KiB gzip including the shared vendor chunk; the full published JavaScript remains inside the 220 KiB gzip budget.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS v4
- Local shadcn-style components with Radix UI primitives
- lucide-react
- TanStack Router
- i18next and react-i18next
- react-helmet-async
- Vitest
- Playwright

## Development

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Default local URL:

```txt
http://127.0.0.1:5173/zh
```

Build static output:

```bash
npm run build
```

Preview production output:

```bash
npm run preview -- --host 127.0.0.1 --port 4173
```

## Quality Gates

Run these before handing work back:

```bash
npm run lint
npm run typecheck
npm run test
npm run i18n:check
npm run vocabulary:check
npm run seo:check
npm run motion:check
npm run a11y:check
npm run build
npm run bundle:check
npm run crawl:dist
npm run test:visual
npx impeccable --json src
```

Current expected test surface:

- Unit tests verify motion parameter and export generation.
- Playwright checks desktop and mobile rendering, URL state updates, copy behavior, and horizontal overflow.
- Static checks verify i18n coverage, SEO route coverage, motion rules, accessibility baseline, bundle budget, and built dist crawl.

## Content Standards

Motion Lexicon maintains a self-contained content contract:

- `src/data/glossary.ts` contains 91 independently written English technical definitions, Chinese translations, and bilingual close-term distinctions.
- `src/data/motion-catalog.ts` preserves a stable 44-unit canonical discovery surface and maps 47 related terms into those workspaces.
- `src/data/motion-guidance.ts` defines purpose, frequency, physicality, gestures, interruptibility, performance, accessibility, and review guidance.
- Preview behavior, parameters, prompts, portable output, and reduced-motion behavior share one project-owned motion specification.

Canonical runtime data lives in:

- `src/data/glossary.ts`
- `src/data/compact-catalog.ts`
- `src/data/motion-guidance.ts`
- `src/data/motion-catalog.ts`
- `src/data/motion-specs.ts`
- `src/data/categories.ts`
- `src/data/recipes.ts`

The landing surface reads the validated 44-item compact index. Detailed routes assemble runtime recipes from the 91-term glossary, 44-unit catalog, and specific guidance contracts.

Every canonical unit includes a Motion Lexicon definition, localized summary, term distinctions, a structured design contract, motion-specific parameters, reduced-motion behavior, SEO metadata, and synchronized Prompt/HTML/CSS/JavaScript generation. React remains an implementation detail of the website; user-facing exports stay framework-independent.

## Licensing

- Project source code is available under the [MIT License](./LICENSE).
- Motion Lexicon written content and data are available under [CC BY 4.0](./CONTENT-LICENSE).
- Code fragments generated by the website, CLI, or Skill are available under the [Zero-Clause BSD License](./CONTENT-LICENSE).
- [NOTICE](./NOTICE) records project inspiration, ownership, attribution guidance, and third-party boundaries.

Contributions are welcome through [CONTRIBUTING.md](./CONTRIBUTING.md). Community participation follows [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md), and security reports follow [SECURITY.md](./SECURITY.md).
