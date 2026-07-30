# Motion Lexicon Product Design

## Experience Model

Motion Lexicon is a static, SEO-friendly motion finder and recipe library. The catalog curates 91 motion terms into 44 canonical units: 31 components, 9 playgrounds, and 4 guides. The interface turns that depth into one calm, continuous journey:

```txt
Describe → Choose → Tune → Use
```

- **Describe:** the landing page and Finder share one natural-language intake, three grounded examples, and the same product promise. A landing query continues to the Finder with `q` in the URL.
- **Choose:** the Finder focuses the strongest current candidate and keeps two alternatives visible. One synchronized replay action expands all three into a direct comparison.
- **Tune:** the selected recipe stays on the main stage while its parameters update the preview, URL, Prompt, HTML, CSS, and JavaScript together.
- **Use:** Copy Prompt is the primary completion action. Portable output remains available through a disclosure in the same workspace.

The intended emotional result is calm confidence. Purpose, Agency, Simplicity, and Craft guide the hierarchy, feedback, responsive behavior, and visual details.

## Information Architecture

The product header exposes two primary destinations:

- **Find motion:** `/:locale/` and `/:locale/finder/` form one experiential layer. Home carries the Finder intake and representative preview; Finder carries recommendation, comparison, tuning, and export.
- **Library:** `/:locale/catalog/` is the unified browsing entry for components, playgrounds, and guides. Search, surface, and category filters share one toolbar.

Supporting routes preserve discovery depth and static acquisition value:

- `/:locale/vocabulary/`: complete 91-term bilingual vocabulary and distinction layer.
- `/:locale/:categoryId/`: indexable motion-family collection.
- `/:locale/:categoryId/:recipeId/`: canonical recipe workspace.
- Legacy term and playground URLs: generated redirects to canonical destinations or presets.

GitHub stays visible in the desktop header. CLI, Agent Skill, JSON data, vocabulary, theme, and locale live in the resources layer and footer. Mobile keeps Library and the resources menu immediately reachable.

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

`src/styles.css` and `src/library.css` provide shared primitives and library foundations. `src/apple-redesign.css` loads after them and defines the current product shell, workspaces, materials, responsive layouts, and accessibility adaptations. `prototype/motion-lexicon-prototype.html` remains an archived phase-one artifact.

## Layout System

### Product shell

- The 64px header uses a translucent floating material, a centered Find motion / Library control, and a source-anchored resources popover.
- Desktop page width is capped at 1240px with 48px outer breathing room. Mobile uses a 28px total outer gutter.
- The landing hero uses the first viewport for the description input, three example requests, product proof, and one representative live scene. The following section introduces three featured recipes and the complete Library link.
- Footer content stays compact and groups product navigation separately from open-source resources.

### Finder workspace

- An empty Finder gives the description field dominant visual weight.
- A populated Finder compresses the intake and brings recommendation evidence plus the active workspace forward.
- Focus mode uses one large selected candidate and two compact alternatives.
- Compare mode displays three equal desktop columns with the same scene and a shared replay cycle.
- Mobile focus mode places the selected candidate above two compact alternatives. Mobile compare mode uses three scan-friendly rows with concise labels, previews, and selection actions.
- At widths above 1040px, the candidate stage and a 300–340px Inspector sit side by side. Narrower layouts stack the Inspector after the stage.

### Recipe workspace

- Recipe identity and Copy Prompt lead the page.
- The preview stage and Inspector form the primary workbench. Common parameters appear first; additional parameters live in an Advanced controls disclosure.
- Device simulation and reduced-motion preview controls remain attached to the stage.
- Portable output, vocabulary, decision guidance, review criteria, accessibility guidance, parameter reference, and related entries use native disclosures.
- Category and vocabulary acquisition pages use a calmer editorial shell and lead into canonical workspaces.

### Library

- One toolbar combines keyword search, Components / Playgrounds / Guides, and category filtering.
- Results stay grouped by motion family, with the active result count and context visible near the controls.
- Desktop uses a responsive card grid. Mobile uses horizontally scrollable, snap-aligned recipe rows to preserve useful preview size.

## Visual System

The interface applies Apple-inspired web principles through product hierarchy and interaction craft:

- **Purpose:** every state gives the next useful action the strongest position, contrast, and scale.
- **Agency:** the original query remains editable; candidate selection, synchronized replay, parameter changes, reset, output formats, themes, and locales remain user-controlled.
- **Simplicity:** common tasks appear first and advanced content opens in context.
- **Craft:** typography, spacing, radii, focus states, materials, and transitions use deliberate values across desktop and mobile.

The concrete visual grammar is:

- Platform system typography: `-apple-system`, `BlinkMacSystemFont`, SF Pro where available, PingFang SC, Helvetica Neue, and Arial fallbacks.
- Large headings use tight tracking and leading; body copy uses comfortable leading; mono typography is reserved for code and precise metadata.
- Light mode uses warm chroma-zero gray with white surfaces. Dark mode uses black with elevated near-black surfaces.
- One blue state color carries primary actions, focus, selection, readiness, and progress.
- Whitespace, scale, surface elevation, and restrained shadows create hierarchy. Structural boundaries receive quiet lines.
- Major preview surfaces use 22–28px radii; inputs and controls use smaller related radii.
- Translucency is scoped to floating navigation, popovers, toolbars, and Inspectors. Preview canvases and code surfaces retain stable legibility.
- Real motion scenes provide visual character. Supporting chrome stays quiet, predictable, and content-led.

### Brand mark

The Motion Lexicon mark reduces the product to an easing curve rising between two keyframes. The muted axes communicate precision, the white curve keeps the motion legible at favicon scale, and the blue endpoint represents an intentional selection. The surrounding squircle gives the mark a stable app-icon silhouette across the website, GitHub, browsers, and operating-system surfaces.

`src/components/BrandMark.tsx` is the interface implementation. `public/brand/` holds the light and inverse SVG masters, and `npm run assets:brand` generates favicon, Apple Touch Icon, PWA icons, and bilingual social cards from the same geometry. Light mode uses the black mark; dark mode uses the inverse mark while retaining the blue endpoint.

## Data And URL State

Categories and entries live as frontend data. Each entry contains a project-maintained glossary definition, product summary, structured design guidance, examples, parameters, review notes, related terms, SEO metadata, content metadata, and code generation inputs.

Data ownership stays explicit across these layers:

- Motion Lexicon maintains the bilingual intent phrases, comparison groups, scoring weights, match reasons, distinctions, and variant presets used by the Finder and CLI.
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

Finder query state preserves a vague request, comparison variants, and the current selection:

```txt
/:locale/finder/?q=<encoded-intent>&compare=<variant-ids>&selected=<variant-id>
```

The CLI provides `q` plus the ordered `compare` list. The Finder selects the first variant by default and writes `selected` after a user choice. Any non-default recipe parameters follow in the same query string. The canonical Finder URL remains `/:locale/finder/`. Web and CLI recommendations use the same intent data and ranking implementation.

## Interaction And Motion

- Buttons and candidate selectors respond during press with a short scale treatment and retain visible keyboard focus.
- Finder candidates share scene dimensions and replay state, keeping comparison visually direct.
- Selecting a candidate returns the deck to focus mode and updates the URL-backed tuning state.
- Popovers originate near their trigger and use short scale, position, and opacity transitions.
- Workbench controls update their affected preview and generated output immediately.
- UI transitions use restrained, smooth settle curves. Existing gesture recipes keep their Pointer Events, capture, damping, cancellation, velocity-aware settlement, and keyboard alternatives.
- Hover motion runs behind fine-pointer media queries.
- `prefers-reduced-motion` replaces large transitions and illustrative movement with short opacity or color feedback.
- `prefers-reduced-transparency` turns floating materials into solid surfaces and removes backdrop blur.
- `prefers-contrast: more` strengthens key boundaries on the landing experience.

## Accessibility

- Primary mobile controls and navigation targets maintain a 44px minimum touch size.
- Native links, buttons, forms, `details`, and `summary` elements preserve keyboard and assistive-technology semantics.
- Finder status, result count, selection, replay, copy completion, and errors use visible text or appropriate live-region behavior.
- Light and dark themes maintain readable text and state contrast.
- Reduced-motion preview remains directly controllable inside each recipe workspace.
- Layouts support desktop and mobile without horizontal page overflow.

## SEO

The build pipeline renders static HTML for 120 localized canonical routes. Each route receives a self canonical, reciprocal hreflang set, Open Graph metadata, and static JSON-LD. The vocabulary routes publish a `DefinedTermSet` containing all 91 terms. Finder query variations canonicalize to their localized Finder route.

Landing, Finder, catalog, category, and canonical detail pages are indexable. Alias and Finder query variations stay out of the sitemap. The focused product navigation changes visible wayfinding while preserving every static acquisition route.

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
- Web and CLI recommendations agree on ordered variants, reasons, presets, and shareable compare state.
- Focus mode shows one selected candidate with two alternatives, and synchronized comparison remains one action away.
- Desktop workspaces pair the active stage with the Inspector; mobile comparison remains concise and free of horizontal page overflow.
- Landing, Finder, Library, vocabulary, category, and recipe routes keep complete Chinese and English metadata and content.
- Both localized Finder routes are prerendered, canonicalized, crawlable, and free of horizontal overflow.
- The local dev server runs and the site is available for manual review.
