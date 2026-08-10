# Motion Lexicon V3 Product Design

## Experience model

Motion Lexicon V3 is a component registry with a motion reference layer.

```text
Components: Browse → Interact → Inspect source → Install
Primitives: Browse → Preview → Tune → Copy
Agent Skill: Understand → Compose → Implement → Review
```

The interface keeps attention on working interactions. Product state supplies
the visual interest; the shell stays calm, compact, and predictable.

## Information architecture

Primary routes:

- `/:locale/components/` — 28 React motion components.
- `/:locale/components/:componentId/` — live preview, source, install command, and related primitives.
- `/:locale/primitives/` — 44 adjustable motion primitives.
- `/:locale/primitives/:primitiveId/` — primitive preview, parameters, prompt/code, and guidance.

Resource routes:

- `/:locale/guides/` and `/:locale/guides/:guideId/`.
- `/:locale/skill/`.
- `/:locale/method/`.
- `/:locale/vocabulary/`.

The domain root and locale roots open Components. Old product routes are removed.

## Navigation

- A fixed 248px desktop sidebar exposes Components, Primitives, Guides, and the Agent Skill.
- Component entries are grouped by product role: actions, overlays, inputs, navigation, data, and feedback.
- Primitive links are grouped by motion family.
- A mobile off-canvas sidebar preserves the same hierarchy.
- Global search opens with `Cmd/Ctrl + K`, searches both collections, and appears immediately.
- Language, theme, and GitHub remain in the compact top bar.

## Component directory

- Every card contains a real lazy-loaded React demo.
- The preview remains interactive; the footer owns navigation to avoid nested interactive controls.
- Two columns provide enough room for realistic component states on desktop.
- Cards collapse to one column on narrow layouts.
- Category counts and identifiers use small mono labels.

## Component workbench

- The header contains identity, one concise description, quality signals, and a copy action.
- Preview and Code form one stable two-option control.
- Code view displays the exact source rendered by the preview.
- The install row publishes `npx shadcn@latest add https://motion-lexicon.pages.dev/r/:id.json`.
- Related Primitives explain the building blocks inside the component.

## Primitive directory and workbench

- Search and category pills filter 44 canonical primitives.
- Gallery previews use the real HTML/CSS runtime and play without replacing their preview root.
- Every direct route uses `/primitives/:id/`.
- Existing parameter, replay, reduced-motion, prompt, code, and long-form guidance remain available.

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

`src/registry/components/:id.tsx` is the source of truth for:

1. the live website preview;
2. the component source view;
3. `/r/:id.json`;
4. the public V3 catalog.

`scripts/generate-registry.ts` publishes the official shadcn schema. A release
must install at least one generated item successfully with `shadcn@latest`.

## Accessibility and responsive behavior

- Native controls, roles, labels, focus restoration, keyboard navigation, and live regions remain part of the component implementation.
- Primary touch targets keep a 44px baseline.
- Light and dark themes preserve readable contrast.
- `html`, `body`, the shell, cards, source blocks, and previews never create page-level horizontal scrolling.

## Static delivery and SEO

The build prerenders 172 localized canonical pages and generates the sitemap,
robots file, security headers, redirects, Open Graph assets, V3 JSON catalog,
and shadcn registry. Each public route carries one H1, one canonical URL,
reciprocal hreflang, first-party social imagery, and WebPage JSON-LD.
