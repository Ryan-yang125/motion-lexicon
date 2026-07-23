# Motion Lexicon Launch Design

## Product Shape

Motion Lexicon is a static, SEO-friendly motion recipe library. The launch version curates 91 motion terms into 44 canonical units: 31 components, 9 playgrounds, and 4 guides.

The user-facing structure is:

- `/zh/` and `/en/`: landing pages with a curated component-library surface.
- `/:locale/catalog/`: shareable Components, Playgrounds, and Guides catalog filters.
- `/:locale/vocabulary/`: the complete 91-term bilingual vocabulary and distinction layer.
- `/:locale/:categoryId/`: indexable category collections.
- `/:locale/:categoryId/:recipeId/`: canonical detail workspaces with preview, parameters, Prompt, HTML, CSS, and portable JavaScript where interaction requires it.
- Legacy term and playground URLs: generated redirects to canonical destinations or presets.

## Technical Stack

- Vite, React, TypeScript.
- Tailwind CSS v4 as the styling engine.
- shadcn-style local components backed by Radix UI primitives.
- lucide-react for icons.
- TanStack Router for route matching.
- Route-level lazy chunks for catalog, vocabulary, category, and recipe surfaces; prerendering awaits the same lazy route modules before writing HTML.
- i18next and react-i18next for Chinese and English UI text.
- react-helmet-async plus build-time prerendering for SEO metadata and static HTML.
- Vitest for logic tests.
- ESLint and TypeScript build mode for quality gates.
- Playwright for browser acceptance checks.

## Visual System

The production interface follows the established grammar of mature component-library documentation, with shadcn/ui, Motion Primitives, Magic UI, and React Bits used as structural references:

- True white and chroma-zero gray surfaces in light mode; zinc-black surfaces in dark mode.
- Black primary actions, one blue state color for focus, selection, progress, and accessibility cues.
- Thin neutral borders, compact 6-10px radii, and low-contrast secondary text.
- Geist/Inter/system sans-serif typography with small mono metadata and code labels.
- A 60px product header, dense catalog navigation, sticky documentation sidebars, and a restrained page-width system.
- Large grid-backed preview canvases that carry the visual expression of each entry.
- Dark code blocks with fixed format tabs, filenames, copy status, and horizontal scrolling.
- Static catalog thumbnails at rest with one deliberate animation cycle on fine-pointer hover or the featured preview; keyboard focus remains immediate and still.

`prototype/motion-lexicon-prototype.html` remains an archived phase-one artifact. `src/styles.css` and `src/library.css` define the current production system.

## Data And URL State

Categories and entries live as frontend data. Each entry contains a project-maintained glossary definition, product summary, structured design guidance, examples, parameters, review notes, related terms, SEO metadata, content metadata, and code generation inputs.

Data ownership stays explicit across these layers:

- Motion Lexicon independently maintains English definitions, Chinese translations, alias-to-workspace mapping, and bilingual distinction copy in `src/data/glossary.ts`.
- Motion Lexicon maintains the product contracts and review guidance in `src/data/motion-guidance.ts`.
- Preview behavior and portable output are Motion Lexicon implementation artifacts.
- `src/data/compact-catalog.ts` supplies the 44-item landing index and is unit-checked against the project glossary; detailed guidance and editor code stay out of the landing chunk.

Path state identifies stable canonical content:

```txt
/:locale/:categoryId/:recipeId
```

Query state identifies current entry parameters:

```txt
?duration=420&distance=28&delay=80&ease=soft
```

Default parameter values are omitted from the query string. Changed values update the preview, generated HTML/CSS/JavaScript, prompt text, and URL. Alias redirects preserve the focused vocabulary term through `?term=`.

## SEO

The build pipeline renders static HTML for 118 localized canonical routes. Each route receives a self canonical, reciprocal hreflang set, Open Graph metadata, and static JSON-LD. The vocabulary routes publish a `DefinedTermSet` containing all 91 terms.

Landing, catalog, category, and canonical detail pages are indexable. Alias routes redirect and stay out of the sitemap.

## Motion Rules

Each recipe uses one semantic motion specification for its parameter schema, preview markup, generated CSS, generated HTML, Prompt, and reduced-motion behavior. The motion craft rules are:

- Prefer transform and opacity, and use clip, filter, or layout properties only when the named pattern requires them.
- Use custom cubic-bezier curves.
- Keep UI interaction feedback short.
- Keep motion interruptible and directly tied to the named behavior.
- Respect `prefers-reduced-motion` by removing movement and keeping a short fade.
- Gate hover movement behind fine pointer media queries.
- Use Pointer Events and velocity-aware settlement for gesture components.
- Keep keyboard-initiated navigation and repeated parameter editing visually immediate.

## Launch Acceptance

Launch is complete when:

- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run test` passes.
- `npm run i18n:check` passes.
- `npm run vocabulary:check` passes.
- `npm run seo:check` passes.
- `npm run motion:check` passes.
- `npm run a11y:check` passes.
- `npm run build` passes and generates prerendered pages, `sitemap.xml`, and `robots.txt`.
- `npm run bundle:check` passes.
- `npm run crawl:dist` passes.
- `npm run test:visual` passes on desktop and mobile.
- The local dev server runs and the site is available for manual review.
