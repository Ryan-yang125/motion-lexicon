# Motion Lexicon V4.4 Product Design

## Experience model

Motion Lexicon V4.4 gives Page Blocks, Components, Primitives, and the Agent Skill one copy-ready React design language, with a complete Agent UI collection for building agent products.

```text
Page Blocks: Browse → Preview responsively → Inspect source → Install
Components: Browse → Interact → Copy for Agent or inspect source → Install
Primitives: Browse → Preview → Tune → Inspect source → Install
Agent Skill: Understand → Plan Page → Build → Review
```

The interface keeps attention on working interactions. Product state supplies
the visual interest; the shell stays calm, compact, and predictable.

## Information architecture

Primary routes:

- `/:locale/` — live product showcase and the shortest path into both collections.
- `/:locale/components/` — 5 React page blocks and 59 React motion components.
- `/:locale/components/:componentId/` — live preview, source, install command, and related primitives; Page Blocks add viewport controls and fullscreen preview.
- `/:locale/primitives/` — 40 installable React motion primitives and 4 design guides.
- `/:locale/primitives/:primitiveId/` — live preview, props, React source, install command, and guidance.

Resource routes:

- `/:locale/guides/` and `/:locale/guides/:guideId/`.
- `/:locale/skill/`.
- `/:locale/method/`.
- `/:locale/vocabulary/`.

The domain root opens the Chinese landing page. Locale roots render the localized landing page. Old product routes are removed.

## Navigation

- The landing page uses a compact top navigation with Components, Primitives, and Guides.
- Skill sits immediately left of GitHub in the top-right actions.
- Internal product pages use a fixed 248px desktop sidebar for Components, Primitives, Guides, and the Agent Skill.
- Page Blocks lead the Components group. Focused component entries follow by product role: actions, overlays, inputs, navigation, data, feedback, media, and visual.
- Primitive links are grouped by motion family.
- A mobile off-canvas sidebar preserves the same hierarchy.
- Global search opens with `Cmd/Ctrl + K`, searches both collections, and appears immediately.
- Language, theme, and GitHub remain in the compact top bar.

## Landing page

- The hero renders one real component at a time and switches among three representative product interactions.
- Components and Primitives receive equal entry points and real working previews.
- Featured cards reuse the same preview registry as the directories and detail pages.
- Installation and Agent Skill complete the path from discovery to implementation.
- Motion supports comprehension and state continuity; reduced motion keeps every route and action intact.

## Component directory

- Four Page Blocks appear first as scaled, interactive page viewports.
- Every card contains a real lazy-loaded React demo.
- The preview remains interactive; the footer owns navigation to avoid nested interactive controls.
- Two columns provide enough room for realistic component states on desktop.
- Cards collapse to one column on narrow layouts.
- Category counts and identifiers use small mono labels.

## Component workbench

- Page Block workbenches switch among desktop, tablet, and mobile widths and open a fullscreen dialog.
- The header contains identity, one concise description, quality signals, and a copy action.
- Preview and Code form one stable two-option control.
- Code view displays the exact source rendered by the preview.
- The install row publishes `npx shadcn@latest add https://motion-lexicon.pages.dev/r/:id.json`.
- Related Primitives explain the building blocks inside the component.

## Primitive directory and workbench

- Search and category pills filter 44 canonical primitives.
- Gallery previews use the real React + Motion renderer and mount only near the viewport.
- Every direct route uses `/primitives/:id/`.
- Forty executable entries expose props, replay, source, reduced motion, and a shadcn install command.
- Four editorial entries remain focused design guides.
- Each executable card mounts its own product demo. Repeated placeholder scenes and shared visual stand-ins are absent.
- Each demo imports its corresponding Primitive, while source and Registry output read that Primitive file directly.

## Material and visual system

The visual language follows Interior's proven material hierarchy:

| Layer | Role |
| --- | --- |
| Bezel | warm page background and navigation context |
| Panel | raised cards, workbenches, and dialogs |
| Well | recessed previews, inputs, and code |

- Platform system typography with SF Pro where available.
- 12px, 13px, 14px, and 24px type steps with `-0.15px` letter spacing.
- `#292929`, `#5D5D5D`, and a quiet tertiary neutral for hierarchy.
- 14px navigation icons, 20px card icons, 8px navigation radii, 16px card radii, pill actions.
- Blue is reserved for focus, selection, and active state.
- Thin neutral boundaries and material shadows replace decorative color blocks.

## Interaction and motion

- Motion begins from a user action or a real system state.
- Frequent keyboard surfaces such as the command palette open immediately.
- State changes reserve space and preserve the final geometry.
- Arrival motion typically resolves in 180–280ms; departure resolves in 110–180ms.
- Direct manipulation uses interruptible springs.
- Transform and opacity carry visible travel.
- Fine-pointer hover behavior stays inside the matching media query.
- Reduced motion preserves state, focus, outcome, and control.

## Registry contract

Page Block, Component, and Primitive implementation files are the source of truth for:

1. the live website preview;
2. component and primitive source views;
3. `/r/:id.json`;
4. the public V4.4 catalog and root `registry.json`.

The Page Block chain is explicit:

```text
blocks/:id.tsx
  → block-demos/:id-demo.tsx
  → directory and responsive workbench preview
  → source view
  → /r/:id.json
```

The Primitive chain is explicit:

```text
primitives/:id.tsx
  → primitive-demos/:id-demo.tsx
  → directory and workbench preview
  → source view
  → /r/primitive-:id.json
```

`scripts/generate-registry.ts` publishes the official shadcn schema. A release
must install at least one generated item successfully with `shadcn@latest`.

## Accessibility and responsive behavior

- Native controls, roles, labels, focus restoration, keyboard navigation, and live regions remain part of the component implementation.
- Primary touch targets keep a 44px baseline.
- Light and dark themes preserve readable contrast.
- `html`, `body`, the shell, cards, source blocks, and previews never create page-level horizontal scrolling.

## Static delivery and SEO

The build prerenders 222 localized canonical pages and generates the sitemap,
robots file, security headers, redirects, Open Graph assets, V4 JSON catalog,
and shadcn registry. Each public route carries one H1, one canonical URL,
reciprocal hreflang, first-party social imagery, and WebPage JSON-LD.
