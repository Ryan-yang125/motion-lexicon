# Motion Lexicon V6 component catalog

The published V6 catalog contains exactly 100 Components in
`src/data/component-registry.ts`. Use a published ID and its generated
Registry JSON for implementation work. The Motion Lexicon Skill remains
independently versioned at 4.2.0.

## Components-first selection

1. Identify the user-visible product event and the final state the user needs.
2. Select one published Component that owns that full job.
3. Fetch `https://motion-lexicon.pages.dev/r/<id>.json` and read its files,
   dependencies, and runtime before editing.
4. Install the source as delivered, then adapt its public props, content, and
   callbacks to the host.
5. Use Primitives to explain the motion language; retain the Component's
   implementation for the interaction itself.
6. Mark an unmatched pattern as a candidate.

## Categories

| Category | Count | Use when the page needs |
| --- | ---: | --- |
| Agent UI | 9 | reasoning, tool execution, approval, evidence, or handoff |
| Actions | 5 | copy, confirmation, loading, hold, or primary-action feedback |
| Overlays & Surfaces | 13 | focused temporary work without losing context |
| Forms & Input | 15 | entry, validation, selection, upload, or completion |
| Navigation | 6 | orientation, command access, switching, or hierarchy |
| Data & Commerce | 11 | metrics, records, planning, pricing, or purchase |
| Feedback | 5 | status, progress, notification, or recovery |
| Cards & Media | 15 | media focus, comparison, browsing, or product narrative |
| Visual & Ambient | 7 | visual material, environment, or spatial context |
| Hero & Story | 8 | product opening, feature proof, or narrative progression |
| Text & Type | 6 | expressive heading, stateful copy, or typographic movement |

## Scene family fit

- **Product Mono:** Agent UI, forms, navigation, data, and feedback. Expect
  exact state hierarchy and compact working surfaces.
- **Editorial Warm:** media, cards, stories, and expressive type. Expect real
  image content, material detail, and readable static composition.
- **Spatial Dark:** visual ambient and technical product storytelling. Expect
  dimensional depth with a legible resting state.

Every public Component has a static primary state, keyboard and narrow-layout
behavior where relevant, and a reduced-motion result. Heavy canvas, WebGL, and
Three.js items require viewport gating, resize handling, and cleanup.

## Representative selections

| Product event | Component IDs |
| --- | --- |
| Agent execution and review | `agent-thinking-trace`, `tool-call-stack`, `approval-flow`, `diff-review` |
| Input and onboarding | `multi-step-form`, `file-dropzone`, `animated-combobox`, `inline-validation` |
| Navigation and workspaces | `command-palette`, `mega-menu`, `resizable-sidebar`, `workspace-switcher` |
| Data and commerce | `animated-chart`, `kanban-board`, `pricing-calculator`, `add-to-cart-morph` |
| Media and comparison | `focus-gallery`, `image-lightbox`, `coverflow-gallery`, `before-after-comparison` |
| Hero and story | `cinematic-hero`, `scroll-media-expansion`, `terminal-hero`, `product-orbit-hero` |
| Visual ambience | `aurora-canvas`, `grid-distortion`, `fluid-glass-surface`, `network-globe` |
| Typography | `split-text-reveal`, `kinetic-heading`, `text-morph`, `text-scramble` |

## Page Blocks

The ten Page Blocks are composition references built from published Components:
`agent-workspace`, `product-landing`, `analytics-dashboard`,
`project-dashboard`, `support-inbox`, `creative-portfolio`,
`commerce-storefront`, `developer-docs`, `media-editorial`, and
`onboarding-flow`.

## Primitive vocabulary

The 44 canonical Primitives remain the stable discovery surface for all 91
source terms. Component selection starts with the product job; Primitive
selection refines the motion decision after the Component is chosen.
