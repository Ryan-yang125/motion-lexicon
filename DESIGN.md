# Motion Lexicon V6 Product Design

## Experience model

Motion Lexicon V6 is a Components-first React library. The website lets a
builder judge a complete static frame, interact with a real product state,
inspect the source, and install the same implementation through the Registry.

```text
Components: Browse → Judge → Interact → Inspect → Install
Page Blocks: Browse → Preview by viewport → Inspect → Install
Primitives: Browse → Tune → Inspect → Install
Skill: Understand product job → Select Components → Compose → Review
```

The shell stays quiet and legible. The components carry visual character through
Product Mono, Editorial Warm, and Spatial Dark scenes.

## Information architecture

Primary routes:

- `/:locale/` — component-led showcase and discovery.
- `/:locale/components/` — all 100 Components across 11 categories.
- `/:locale/components/:componentId/` — live preview, source, install command,
  related Primitives, and visual contract.
- `/:locale/blocks/` — ten complete Page Blocks.
- `/:locale/blocks/:blockId/` — responsive Block preview, source, and install command.
- `/:locale/primitives/` — 44 canonical motion Primitives.
- `/:locale/primitives/:primitiveId/` — live preview, props, source, install,
  and related Components.

Resource routes include `/:locale/guides/`, `/:locale/skill/`,
`/:locale/method/`, and `/:locale/vocabulary/`. The domain root opens the
Chinese landing page.

## Navigation and discovery

- Components occupy the first navigation position and the primary directory entry.
- Page Blocks have their own directory and show complete product compositions.
- Category filtering exposes Agent UI, Actions, Overlays & Surfaces, Forms &
  Input, Navigation, Data & Commerce, Feedback, Cards & Media, Visual &
  Ambient, Hero & Story, and Text & Type.
- Primitives remain accessible as stable motion vocabulary: 44 canonical entries
  preserve 91 source terms through mappings and redirects.
- Global search opens with `Cmd/Ctrl + K`; language, theme, and GitHub remain
  compact top-level actions.
- Desktop and mobile navigation preserve the same hierarchy.

## Directory and workbench

Each Component card renders a lazy real demo with an intentional primary frame.
The directory supports scanning by category, scene family, runtime cost, and
search. Narrow layouts place the active work ahead of the full directory.

A Component workbench provides identity, a concise product job, the live
preview, source from the rendered implementation, install command, dependencies,
and relevant motion foundations. Page Block workbenches add desktop, tablet,
mobile, and fullscreen previews.

## Scene families

| Family | Visual direction | Typical use |
| --- | --- | --- |
| Product Mono | quiet neutrals, crisp boundaries, compact mono metadata, exact state color | forms, tools, data, navigation, feedback |
| Editorial Warm | paper and material warmth, expressive type, image-led pacing | media, cards, stories, cultural products |
| Spatial Dark | dark depth, controlled light, dimensional context | technical worlds, visual systems, spatial product stories |

The primary static frame must remain informative without autoplay. Dynamic
behavior starts from intent or a meaningful state transition.

## Material, type, and interaction

- The website shell uses chroma-zero light and dark neutrals, thin boundaries,
  compact radii, black primary actions, restrained blue focus/selection, and
  semantic status colors.
- Components may expand into their scene family while keeping core content,
  controls, focus visibility, and contrast legible.
- Platform system typography and compact mono metadata keep dense implementation
  details scannable; Editorial Warm scenes may use larger display rhythm.
- Motion relies on transform and opacity where possible, preserves final geometry,
  supports interruption, and respects fine-pointer media queries.
- Reduced motion preserves state, focus, content, and the resulting action.

## Registry contract

Component and Block source files are the source of truth for:

1. direct-import live demos;
2. directory and workbench previews;
3. source views;
4. `/r/:id.json`;
5. the public machine-readable catalog and root `registry.json`.

```text
components/:id.tsx
  → demos/:id-demo.tsx
  → directory and Component workbench
  → source view
  → /r/:id.json

blocks/:id.tsx
  → block-demos/:id-demo.tsx
  → Block directory and responsive workbench
  → source view
  → /r/:id.json
```

Registry items declare runtime dependencies. The release workflow generates the
official shadcn schema and verifies fresh representative installs.

## Accessibility, responsiveness, and performance

- Native semantics, labels, focus restoration, keyboard paths, live regions,
  touch targets, and visible focus remain part of the implementation.
- Primary interactive targets use a 44px baseline.
- Components and Blocks hold at 320, 390, 768, and 1440px without page-level
  horizontal overflow.
- Heavy canvas, WebGL, and Three.js scenes initialize only when useful, pause
  when offscreen, respond to resize, dispose resources on unmount, and render a
  meaningful static/reduced-motion frame.
- Each scene supports light and dark context where its product job needs it.

## Static delivery and release

`npm run build` prerenders localized canonical routes and produces the sitemap,
robots file, structured metadata, public catalog, social assets, and shadcn
Registry output. V6 release acceptance verifies those generated assets after the
100-Component and 10-Block catalog passes source, visual, accessibility,
installation, and browser review.
