# Motion Lexicon Product Design

## Experience Model

Motion Lexicon V1.2 is a static, SEO-friendly product motion system with two
equal collections:

- **Product Moments · Motion Packs:** 28 complete interactions with a context,
  trigger, state transition, completion state, and portable implementation.
- **Motion Primitives:** 44 focused motion workspaces for exact behavior,
  terminology, parameters, and implementation.

Finder connects the two collections for visitors who begin from a description.

```txt
Preview → Trigger → Inspect → Copy
```

- **Preview:** see a familiar product moment inside a calm, complete scene.
- **Trigger:** interact with the Pack and observe the result in context.
- **Inspect:** read the timing, trigger, outcome, and reduced-motion treatment.
- **Copy:** take the Prompt or portable HTML, CSS, and JavaScript.

Motion Primitives use a parallel focused workflow:

```txt
Identify → Preview → Tune → Copy
```

Finder provides cross-collection discovery:

```txt
Describe → Discover → Decide → Use
```

The intended result is calm confidence. Product state carries the visual
interest; the surrounding interface gives that state space and clarity.

## Information Architecture

The header exposes three primary destinations with equal visual weight:

- **Find motion:** `/:locale/finder/` receives a natural-language request and
  returns relevant Motion Primitives together with matching Product Moments.
- **Product Moments:** `/:locale/packs/` is the gallery for 28 real product
  interactions.
- **Motion Primitives:** `/:locale/catalog/` is the catalog for 44 focused
  motion workspaces.

The home route `/:locale/` introduces both collections with equal entry points.
Supporting routes carry implementation depth and acquisition value:

- `/:locale/packs/:packId/`: a live Pack preview, guidance, and export.
- `/:locale/catalog/`: the 44 canonical Motion Primitive workspaces.
- `/:locale/vocabulary/`: the complete bilingual 91-term vocabulary.
- `/:locale/:categoryId/`: indexable motion-family collections.
- `/:locale/:categoryId/:recipeId/`: canonical recipe workspaces.
- Legacy aliases and playground URLs: redirects to canonical destinations or
  meaningful presets.

Pack details link to their related Motion Primitives; primitive workspaces
surface the Pack relationships declared for that behavior. GitHub remains
visible in the desktop header. CLI, Agent Skill, versioned data, vocabulary,
theme, and locale remain available in the resources layer and footer.

## Product Moments · Pack Gallery

- The Pack gallery has a concise product promise, a featured live scene, and
  clear routes to all Packs.
- Four filters organise the set by product intent: Feedback, Choice, Change, and
  Workflow. Each group contains seven Packs.
- Gallery cards present a stable product frame. Hover and focus animate the
  existing scene in place, avoiding a poster-to-preview swap.
- Cards link to dedicated detail routes and keep the gallery as an active
  browsing surface.
- Mobile cards remain vertically readable and avoid horizontal page overflow.

## Pack Detail

- Identity, scenario, and a direct route to Copy sit above or alongside the
  preview.
- The dominant preview stage gives the interaction enough space to communicate
  its before-and-after state.
- A small inspector expresses timing, trigger, result, and reduced-motion
  treatment in plain language.
- The output area has two stable modes: **Prompt** and **Code**. Prompt opens by
  default; the tab row owns the corresponding copy action.
- Related Packs form a lightweight continuation path without competing with the
  active scene.
- Related Motion Primitives explain the behavior used inside the active Pack.

## Motion Primitives · Catalog

- The catalog presents all 44 canonical workspaces with accurate live previews,
  focused categories, and routes into each primitive.
- Recipe workspaces pair a main preview with compact controls, then expose
  Prompt and Code through the same output pattern used by Pack details.
- Each declared primitive relationship links to its Product Moment, so visitors
  can see that behavior inside a complete product context.
- Vocabulary and category pages continue to be indexable acquisition surfaces.

## Finder

- Finder uses one primary preview for the selected candidate. Its other
  candidates remain static choices, and replay only affects the active motion.
- Results visibly distinguish Product Moments from Motion Primitives while
  giving both collections equal relevance in a search result.
- The 91-term vocabulary supplies precise language and close-term distinctions
  for both collections.

## Technical Stack

- Vite, React, TypeScript.
- Tailwind CSS v4 plus project CSS layers.
- shadcn-style local components backed by Radix UI primitives.
- lucide-react for icons.
- TanStack Router for route matching and lazy chunks.
- i18next and react-i18next for Chinese and English UI text.
- react-helmet-async with build-time static prerendering for SEO.
- Vitest for logic tests and Playwright for browser acceptance checks.

`src/motion-packs.css` and `src/components/motion-pack-preview.css` provide the
Pack gallery, detail, and live-scene styling. `src/data/motion-packs.ts` holds
Pack metadata, guidance, prompts, portable output, and its relationships to
Motion Primitives. Existing motion-engine data remains the source for canonical
primitive workspaces and vocabulary.

## Layout System

### Product shell

- The 64px header uses a translucent material, a centered Find motion / Product
  Moments / Motion Primitives control, and a source-anchored resources popover.
- Desktop content is capped at 1240px with comfortable outer breathing room.
- Mobile uses a compact outer gutter and keeps the active product workflow ahead
  of reference material.
- Footer content remains compact and groups product navigation separately from
  open-source resources.

### Collection galleries

- The home route presents both collections as equal routes into the product.
- Product Moments use a featured Pack scene and group filters in a compact
  segmented control.
- Motion Primitives use the canonical catalog and category filters.
- Desktop cards form responsive grids; narrow layouts use stable vertical flows
  with no horizontal page scrolling.

### Detail workspace

- At wide widths, preview and Pack inspector form one balanced workbench.
- At narrow widths, the live preview stays first, then context, export, and
  deeper guidance.
- Prompt/Code tabs use a compact horizontal switch with the copy action aligned
  at the opposite edge.

## Visual System

The visual grammar is quiet, precise, and product-led:

- Platform system typography: `-apple-system`, `BlinkMacSystemFont`, SF Pro where
  available, PingFang SC, Helvetica Neue, and Arial fallbacks.
- Type uses 12px, 13px, 14px, and 24px steps with `-0.15px` letter spacing.
- Text hierarchy uses `#292929`, `#5D5D5D`, and `#9E9E9E`.
- Navigation icons are 14px; card icons are 20px.
- Navigation components use 8px radii; cards use 16px radii; primary CTA buttons
  use pill shapes.
- Chroma-zero neutrals establish depth. A restrained blue carries focus,
  selection, and readiness.
- Preview scenes maintain white or warm-neutral solid surfaces for clear visual
  judgement; floating utility chrome can use translucent materials.
- Borders clarify structural changes. Shadows remain shallow and soft.

## Data And URL State

Pack data lives in `src/data/motion-packs.ts`. Each Pack contains:

- stable ID and group;
- bilingual name, summary, scene, use case, prompt, and guidance;
- search keywords and timing;
- portable HTML, CSS, and JavaScript;
- a reduced-motion treatment.
- `foundations`: a related Motion Primitive ID, localized role, and note.

Canonical Pack paths are stable content URLs:

```txt
/:locale/packs/:packId/
```

The public artifact generator publishes the complete Pack data at:

```txt
/data/v1/packs.json
```

The CLI exposes Product Moments through `packs` and `pack <id>` commands and
Motion Primitives through `list`, `search`, `show`, and `export`. Both
collections, their relationships, vocabulary, and Finder documents remain
versioned under `/data/v1/`.

## Interaction And Motion

- Pack scenes use actual interaction state: saving, publishing, selecting,
  inserting, archiving, filtering, validating, progressing, or scrubbing.
- Press feedback appears immediately. Completion lands quickly and confirms the
  resulting state through text, color, hierarchy, or a concise contextual cue.
- Use `transform` and `opacity` for visible motion. Timings remain short and
  deliberate, usually within 160–360ms plus small follow-through when it conveys
  product state.
- Repeated actions return to an understandable state and do not accumulate
  irrelevant visual motion.
- Hover motion runs only under fine-pointer media queries.
- `prefers-reduced-motion` preserves result and control while removing large
  travel, scaling, and looping.
- `prefers-reduced-transparency` uses solid surfaces. Increased contrast
  strengthens key boundaries.

## Accessibility

- Buttons, links, forms, tabs, and controls keep native semantics and keyboard
  access.
- Primary mobile targets are at least 44px.
- Status changes, copy completion, errors, and Pack outcomes have visible text
  or appropriate live-region behavior.
- Light and dark themes retain readable contrast.
- Layouts stay free of horizontal page overflow across supported viewports.

## SEO

The build pipeline renders static HTML for every localized canonical route.
Motion Pack gallery and detail routes, Motion Primitive catalog and workspace
routes, and Finder routes receive self canonicals, reciprocal hreflang values,
Open Graph metadata, and static JSON-LD.

`packs.json`, `catalog.json`, the CLI, Agent Skill, `llms.txt`, and
`llms-full.txt` publish the same V1.2 two-collection model to tools and agents.
Finder query variations remain canonicalized to their localized Finder route.

## Launch Acceptance

Launch is complete when:

- Product Moments and Motion Primitives have equal first-level navigation and
  home-route entry points;
- all 28 Pack gallery and detail routes build in Chinese and English;
- each Pack preview exposes its intended real product interaction;
- Prompt, HTML, CSS, JavaScript, and reduced-motion guidance stay aligned;
- every declared Pack-to-Primitive relationship appears on both detail pages;
- Finder returns relevant Motion Primitives and matching Product Moments;
- README, CLI, Skill, public JSON, `llms.txt`, and website all describe V1.2;
- 44 canonical workspaces and 91 source terms remain searchable and indexable;
- desktop and mobile surfaces have no horizontal overflow;
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run i18n:check`,
  `npm run vocabulary:check`, `npm run seo:check`, `npm run motion:check`,
  `npm run a11y:check`, `npm run build`, `npm run bundle:check`,
  `npm run crawl:dist`, and `npm run test:visual` pass.
