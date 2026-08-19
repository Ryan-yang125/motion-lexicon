# Motion Lexicon V6 Product Specification

> Status: Draft for implementation
> Version target: 6.0.0
> Updated: 2026-08-19
> Product owner: Motion Lexicon

## 1. Executive summary

Motion Lexicon V6 is a major catalog and visual-quality release centered on one public promise:

> 100 copy-ready React motion components and 10 complete Page Blocks, built to look distinctive, behave correctly, and install directly into real products.

V6 keeps the website shell calm and editorial while giving component previews more expressive art direction, richer assets, stronger typography, and broader visual range. Components become the first discovery surface. Page Blocks demonstrate how the components compose into complete products.

The Agent UI collection remains useful and focused. Registry delivery and the Agent Skill continue as supporting installation and reuse paths.

## 2. Product outcome

V6 succeeds when a developer or design engineer can open Motion Lexicon and quickly conclude that:

1. the catalog is large enough to solve several real product and marketing needs;
2. every visible item feels curated and visually intentional;
3. the interaction can survive production constraints such as keyboard use, mobile layouts, reduced motion, interruption, and asynchronous state;
4. the source can be copied or installed without rebuilding the example from scratch;
5. the library has a recognizable visual point of view.

The shortest V6 workflow is:

```text
Discover → Judge the live result → Inspect behavior → Install → Adapt
```

## 3. Product priorities

Priorities are ordered and should be used to resolve scope conflicts.

1. **Component quality:** interaction correctness, visual finish, responsive behavior, accessibility, and production-ready source.
2. **Component quantity:** exactly 100 public installable components at release.
3. **Aesthetic identity:** a restrained product shell surrounding expressive, memorable component scenes.
4. **Discoverability:** clear categories, immediate visual comparison, fast search, and stable direct routes.
5. **Composition:** 10 Page Blocks that prove the catalog can form complete products.
6. **Distribution:** shadcn Registry, source view, copy brief, SEO pages, and the existing Agent Skill.

## 4. Scope boundaries

### 4.1 Included

- Expand the component catalog from 59 to 100 installable items.
- Consolidate overlapping V5 components and remove weak catalog entries.
- Expand Page Blocks from 5 to 10.
- Redesign all component demos that currently lack a distinctive scene.
- Rework landing and directory hierarchy so Components lead discovery.
- Add three coordinated visual scene families.
- Keep preview, source view, public Registry JSON, and install output connected to the same implementation file.
- Preserve bilingual routes, static prerendering, SEO output, keyboard behavior, reduced motion, and responsive layouts.
- Keep React, TypeScript, Tailwind CSS v4, Motion, GSAP, Three.js, native WebGL, Radix, and the existing static deployment model.

### 4.2 Stable supporting surfaces

- The 44 canonical Primitives and 91 source terms remain stable during V6.
- A new behavior may become a public Primitive when it is independently useful and reused by at least three V6 components.
- The Agent Skill remains independently versioned at `4.2.0` unless a component-contract change requires a small reference update.
- Registry installation remains the primary distribution mechanism.

### 4.3 Outside the V6 release

- Server-side application features, accounts, cloud storage, billing, and paid tiers.
- MCP servers, new agent adapters, and ecosystem-specific integrations.
- A general-purpose design system or replacement for shadcn/ui.
- Large additions to guides, vocabulary, or public Primitives.
- Compatibility routes for entries removed or merged in V6.

## 5. Audience and jobs

### 5.1 Primary audience

- Frontend developers who want a polished interaction they can install and adapt.
- Design engineers who judge motion, layout, and visual finish together.
- Product designers who need a working reference for state continuity and feedback.
- Independent builders creating marketing sites, SaaS products, portfolios, media experiences, and commerce surfaces.

### 5.2 Secondary audience

- Coding agents that consume source, Registry metadata, and explicit acceptance criteria.
- Teams using the Agent Skill to compose complete pages from Motion Lexicon components.

### 5.3 Core jobs

- Find a component by visual result or product job.
- Understand the interaction through a live preview.
- Compare several treatments without opening many pages.
- Inspect implementation cost and dependencies.
- Install the exact previewed source.
- Adapt the component to an existing visual system.

## 6. Market evidence

Research was refreshed on 2026-08-19 using current public catalogs.

| Product | Observed strength | V6 lesson |
| --- | --- | --- |
| [21st.dev](https://21st.dev/community/components?tab=home) | Popular results concentrate on scroll expansion, cinematic heroes, shader scenes, cards, testimonials, and image-led interactions. | Give V6 more high-impact Hero, Media, Card, and visual-storytelling components. |
| [React Bits](https://reactbits.dev/get-started/index) | Broad creative catalog across text, backgrounds, animated UI, cursors, and media; strong live visual tooling. | Add meaningful Text and Visual categories and let the preview dominate. |
| [Magic UI](https://magicui.design/) | 150+ free components and effects with a clear design-engineer audience. | Catalog breadth affects perceived usefulness; every addition still needs a clear product job. |
| [Aceternity UI](https://ui.aceternity.com/ai-recommendations) | 109 free components plus deep Hero, Card, effect, and Block coverage. | Complete visual compositions create stronger recall than isolated utility controls. |
| [Motion Primitives](https://motion-primitives.com/docs) | Practical component anatomy, detailed examples, and high-quality interaction foundations. | Keep V6 APIs focused and the behavior useful outside the demo scene. |
| [Motion UI](https://motion.dev/magazine/introducing-motion-ui) | Unified motion roles, performance grading, semantic design tokens, and strong art direction. | Surface runtime cost and tune the catalog through shared motion roles. |

The market signal is used as an attention and taste indicator. Public catalogs do not expose reliable installation, retention, or production-usage data.

## 7. V5 baseline

V5 currently contains:

- 5 Page Blocks;
- 59 Components;
- 44 canonical Primitives;
- 104 Registry items across Blocks, Components, and installable Primitives;
- 11 Agent UI components;
- 5 Media components;
- 4 Visual components.

The 59 component implementations already contain reduced-motion handling and accessible semantics. The V6 opportunity is concentrated in catalog balance, visual differentiation, real asset use, and memorable preview direction.

## 8. V5 component audit

### 8.1 Preserve the interaction core: 31

These components retain their public job and core interaction. Their demo content, styling, and documentation still receive the shared V6 visual pass.

| Category | Components |
| --- | --- |
| Agent UI | `agent-thinking-trace`, `streaming-answer`, `tool-call-stack`, `diff-review` |
| Actions | `copy-button`, `loading-button`, `magnetic-action`, `theme-reveal` |
| Overlays | `command-palette`, `context-menu`, `drawer`, `dropdown`, `modal`, `popover` |
| Forms and input | `inline-validation`, `otp-input`, `password-strength`, `slider-detents`, `tag-input` |
| Navigation | `accordion`, `segmented-control`, `tabs`, `floating-dock` |
| Data | `reorder-list`, `sortable-table`, `activity-feed` |
| Feedback | `progress-bar`, `value-flash`, `toast-stack`, `upload-queue`, `skeleton-reveal` |

### 8.2 Rebuild the visual scene: 18

These components keep their product purpose and receive new art direction, realistic content, improved composition, and a stronger paused frame.

| Category | Components |
| --- | --- |
| Agent UI | `prompt-composer`, `context-sources`, `multi-agent-handoff` |
| Product UI | `expanding-search`, `voice-capture`, `hide-on-scroll`, `mega-menu`, `filter-grid`, `integration-map` |
| Media | `cursor-lens`, `media-carousel`, `image-lightbox`, `scroll-story`, `procedural-product-viewer` |
| Visual | `dither-reveal-card`, `network-globe`, `kinetic-logo-exchange`, `spotlight-bento` |

### 8.3 Consolidate six entries into three

V6 removes the old overlapping entries and publishes one stronger canonical implementation for each product job.

| V5 entries | V6 canonical entry | Required outcome |
| --- | --- | --- |
| `approval-flow` + `agent-recommendation` | `approval-flow` | Recommendation, evidence, alternatives, custom instruction, and explicit approval in one flow. |
| `agent-task-queue` + `task-steps` | `task-progress` | Queued, active, blocked, failed, recovered, and complete states across compact and expanded layouts. |
| `hold-to-confirm` + `long-press` | `hold-action` | Pointer, touch, and keyboard support with cancellable progress and clear completion. |

### 8.4 Remove four entries

| Entry | Reason |
| --- | --- |
| `agent-status-orbit` | Decorative state encoding has limited product clarity. |
| `radial-actions` | Usage frequency is narrow and mobile placement is fragile. |
| `floating-label` | The interaction is broadly available and carries a weak Motion Lexicon signature. |
| `pagination` | The current behavior offers limited motion value and visual distinction. |

After consolidation and removal, V6 begins with 52 retained canonical components.

## 9. V6 catalog architecture

The final catalog contains exactly 100 installable components across 11 public categories.

| Category | Final count | Role |
| --- | ---: | --- |
| Agent UI | 9 | Visible reasoning, tools, approval, evidence, review, and handoff. |
| Actions | 5 | High-frequency actions with clear pending, completion, and direct-manipulation feedback. |
| Overlays & Surfaces | 13 | Dialogs, menus, sheets, toolbars, sidebars, and workspace surfaces. |
| Forms & Input | 15 | Input, validation, onboarding, editing, selection, and file intake. |
| Navigation | 6 | Stable orientation and transitions across product structure. |
| Data & Commerce | 11 | Data change, workflow boards, pricing, and transactional interaction. |
| Feedback | 5 | Progress, loading, notification, completion, and state change. |
| Cards & Media | 15 | Image, gallery, card, comparison, testimonial, and product media. |
| Visual & Ambient | 7 | High-character spatial, material, generative, and environmental effects. |
| Hero & Story | 8 | Product introductions and scroll-led narrative sections. |
| Text & Type | 6 | Typographic transition, emphasis, rhythm, and transformation. |
| **Total** | **100** | |

The directory uses these categories for navigation and filtering. Component slugs stay technology-independent and describe the visible product behavior.

## 10. New V6 components: 48

### 10.1 Hero & Story: 8

| Slug | Product job | Signature moment |
| --- | --- | --- |
| `scroll-media-expansion` | Expand media from contained card to immersive hero while scrolling. | The viewport and media resolve into one continuous frame. |
| `device-scroll-reveal` | Reveal a product through a laptop or phone frame. | Device chrome, screen content, and section copy advance together. |
| `cinematic-hero` | Introduce a brand or product with image-led pacing. | Type, media, and CTA arrive in a deliberate sequence. |
| `shader-hero` | Use a performant shader field as an interactive hero environment. | Pointer or scroll input reshapes the field around the message. |
| `split-screen-reveal` | Connect two product states or two sides of a story. | The split boundary becomes the narrative transition. |
| `screenshot-stack` | Present several product surfaces with depth and focus changes. | The active screenshot moves forward while context remains visible. |
| `terminal-hero` | Demonstrate a developer workflow through a live command sequence. | Command, output, and product result complete one loop. |
| `product-orbit-hero` | Arrange product capabilities around a central object. | Orbit position and copy focus remain synchronized. |

### 10.2 Cards & Media: 10

| Slug | Product job | Signature moment |
| --- | --- | --- |
| `expandable-card` | Expand a compact card into a detailed surface. | Shared geometry preserves origin and context. |
| `focus-gallery` | Let one image gain focus while neighboring images yield. | Focus, scale, crop, and caption change together. |
| `card-stack` | Browse layered stories or records in a compact area. | The current card exits and exposes the next layer. |
| `animated-testimonials` | Present changing customer evidence with portrait and quote continuity. | Portrait, quote, attribution, and progress transition as one unit. |
| `coverflow-gallery` | Browse media with depth, snapping, and keyboard control. | The active item rotates into a stable frontal position. |
| `image-trail` | Create a restrained image trail from pointer or drag movement. | Images appear along the path and retire without visual debris. |
| `pixelated-image` | Reveal or transition imagery through controlled pixel structure. | Resolution becomes the transition material. |
| `chromatic-image` | Apply interactive color-channel separation to editorial media. | Color displacement follows focus and settles cleanly. |
| `code-comparison` | Compare implementation approaches or before-and-after code. | The selected difference controls both code and rendered result. |
| `before-after-comparison` | Compare two full image states with pointer and keyboard input. | A stable boundary exposes either state without layout change. |

### 10.3 Text & Type: 6

| Slug | Product job | Signature moment |
| --- | --- | --- |
| `split-text-reveal` | Reveal a heading by line, word, or character. | Segments assemble into a stable final heading. |
| `text-scramble` | Transition labels or technical status through character substitution. | Noise resolves quickly into readable text. |
| `text-morph` | Move between related phrases while preserving rhythm. | Letterforms and width settle without surrounding layout shift. |
| `text-loop` | Cycle compact messages in a stable line or badge. | Entry and exit direction explains sequence. |
| `scroll-velocity` | Let typographic movement respond to scroll speed and direction. | Velocity influences travel while resting text remains readable. |
| `kinetic-heading` | Give a display heading responsive weight, spacing, or depth. | Pointer or scroll input changes the heading as one coherent object. |

### 10.4 Overlays & Surfaces: 7

| Slug | Product job | Signature moment |
| --- | --- | --- |
| `dynamic-toolbar` | Expand a compact toolbar around the current task. | Tools reorganize around selection and available space. |
| `resizable-sidebar` | Resize or collapse a product sidebar while preserving context. | Labels, icons, and content width transition continuously. |
| `notification-center` | Review grouped notifications beyond transient toasts. | The stack expands into a readable history. |
| `mobile-bottom-sheet` | Present mobile actions and detail through a draggable sheet. | Snap points, backdrop, focus, and dismissal stay coordinated. |
| `page-transition-stack` | Connect route-level surfaces through shared depth. | The outgoing page becomes spatial context for the incoming page. |
| `hover-preview` | Preview a destination or entity without losing place. | The preview emerges from the focused anchor and follows keyboard focus. |
| `workspace-switcher` | Move among projects or workspaces in a compact control. | Identity, recent state, and selection transition together. |

### 10.5 Forms & Onboarding: 8

| Slug | Product job | Signature moment |
| --- | --- | --- |
| `file-dropzone` | Accept files through drag, picker, and paste. | Intake becomes an itemized, reversible queue handoff. |
| `multi-step-form` | Guide a user through a short structured flow. | Step direction, validation, and saved progress remain clear. |
| `sign-in-flow` | Coordinate identity method, pending state, error, and success. | The card moves through methods without losing entered context. |
| `onboarding-checklist` | Turn setup tasks into a progressive product surface. | Completion updates progress and reveals the next useful action. |
| `date-range-picker` | Select and compare date ranges with spatial continuity. | Hover, provisional range, confirmed range, and presets stay distinct. |
| `animated-combobox` | Search and select from a changing result set. | Highlight and result ordering move without losing keyboard position. |
| `inline-edit` | Edit displayed content in place and resolve save states. | Read, edit, saving, error, and committed states share one geometry. |
| `animated-empty-state` | Turn a valid empty state into the next clear action. | Context, lightweight illustration, and CTA arrive in one purposeful sequence. |

### 10.6 Data & Commerce: 6

| Slug | Product job | Signature moment |
| --- | --- | --- |
| `metric-ticker` | Present a changing KPI with direction and context. | Number, delta, and period update as one readable event. |
| `animated-chart` | Compare changing data ranges and series. | Geometry morphs while labels and focus remain stable. |
| `changelog-timeline` | Present product or project history with progressive focus. | The active entry connects date, media, and detail. |
| `kanban-board` | Move work across columns with pointer and keyboard support. | Drop destination, column count, and surrounding cards respond together. |
| `pricing-calculator` | Explain a changing price from quantity, tier, and billing interval. | Controls, breakdown, and total update in one continuous calculation. |
| `add-to-cart-morph` | Connect product selection to a persistent cart state. | The selected item resolves into cart count and confirmation. |

### 10.7 Visual & Ambient: 3

| Slug | Product job | Signature moment |
| --- | --- | --- |
| `aurora-canvas` | Provide a calm branded atmospheric field. | Layered color responds subtly and pauses outside the viewport. |
| `grid-distortion` | Distort a media or grid surface around input. | The field bends around interaction and returns without snapping. |
| `fluid-glass-surface` | Create a refractive surface for focused controls or product media. | Refraction, highlight, and content movement preserve legibility. |

## 11. Page Blocks: 10

### 11.1 Existing Blocks retained and refreshed

| Slug | V6 role | Scene family |
| --- | --- | --- |
| `agent-workspace` | Agent mission, tool execution, approval, and evidence. | Product Mono |
| `product-landing` | Product release positioning and launch workflow. | Editorial Warm |
| `analytics-dashboard` | Metrics, trends, segments, and date-range analysis. | Product Mono |
| `project-dashboard` | Milestones, task flow, ownership, and team activity. | Product Mono |
| `support-inbox` | Queue, conversation, customer context, and resolution. | Product Mono |

### 11.2 New Blocks

| Slug | Product job | Required component coverage | Scene family |
| --- | --- | --- | --- |
| `creative-portfolio` | Present projects, media, identity, and case-study transitions. | Hero, Text, Cards, Media, Visual | Editorial Warm |
| `commerce-storefront` | Present a product, explore media, configure purchase, and confirm cart state. | Hero, Media, Forms, Data & Commerce | Editorial Warm |
| `developer-docs` | Explain installation, compare code, navigate documentation, and preview output. | Text, Navigation, Overlays, Code Comparison | Product Mono |
| `media-editorial` | Browse a visual story through chapters, galleries, and related content. | Hero, Text, Cards, Media | Editorial Warm |
| `onboarding-flow` | Complete account setup, workspace selection, import, and first success. | Forms, Feedback, Navigation, Surfaces | Product Mono |

Every Page Block must compose published catalog components where their product jobs match. Block-specific layout code may connect those components but should not duplicate a catalog component under a private name.

## 12. Visual direction

### 12.1 Core principle

The website shell remains quiet, precise, and predominantly neutral. Component canvases carry the expressive color, imagery, material, typography, and spatial depth.

This separation gives Motion Lexicon a stable brand while allowing 100 components to demonstrate a meaningful visual range.

### 12.2 Scene families

#### Product Mono

- Dense product UI, real data, compact controls, and stable working surfaces.
- Black primary actions, neutral hierarchy, semantic state color, and precise borders.
- Best for Agent, forms, overlays, data, navigation, and feedback.

#### Editorial Warm

- Photography, expressive typography, warm neutrals, deliberate whitespace, and image-led composition.
- Best for Hero, Media, Testimonials, Portfolio, Commerce, and Editorial Blocks.
- Color should come from assets and content before decoration.

#### Spatial Dark

- Dark canvases, luminous focus, shaders, 3D scenes, atmospheric depth, and controlled color.
- Best for high-character Visual, Ambient, spatial media, and selected Hero components.
- Continuous animation pauses outside the viewport and respects reduced motion.

### 12.3 Static-frame standard

Every component must remain visually convincing when motion is paused at its primary state. The primary directory image should communicate hierarchy, content, and purpose without relying on the user to trigger an animation.

### 12.4 Asset standard

- Use real, appropriately licensed photography, product imagery, icons, type, data, and code.
- Store required production assets locally and include attribution where applicable.
- Match asset crop, aspect ratio, palette, and density to the component slot.
- Use project icon dependencies for interface icons.
- Reserve generated imagery for scenes that require original visual assets.

### 12.5 Visual restraint

- Each component has one dominant visual idea.
- Shadows, glow, blur, grain, glass, and gradients must support that idea.
- Text remains readable throughout interaction.
- Decorative motion yields to direct manipulation and product state.
- Repeated card shells, placeholder geometry, and identical demo compositions should be removed.

## 13. Motion system

V6 uses five shared motion roles. Individual components may tune values inside the role while preserving its intent.

| Role | Purpose | Typical behavior |
| --- | --- | --- |
| `snap` | Press, selection, compact confirmation | 90–140ms or a stiff, low-travel spring |
| `ui` | Menus, tabs, inputs, overlays, local state | 150–240ms, interruptible, short travel |
| `gentle` | Cards, large surfaces, shared geometry | 260–420ms, composed acceleration and settling |
| `lively` | Celebration, expressive product reveal | Spring or staged sequence with a stable resting state |
| `ambient` | Background and environmental motion | Slow loop, viewport-gated, visually quiet at rest |

Rules:

- User input and system state initiate meaningful motion.
- Enter and exit direction should explain origin or destination.
- Layout space is reserved before asynchronous content resolves.
- Direct manipulation stays interruptible.
- Transform and opacity carry most visible travel.
- Paint-heavy work is isolated, lazy-mounted, and marked with runtime cost.
- Reduced motion removes spatial travel and continuous loops while preserving state, focus, and outcome.

## 14. Component contract

Every public V6 component must include:

1. one typed React implementation as the source of truth;
2. one realistic live demo importing that implementation;
3. one static primary state suitable for directory capture;
4. one public Registry JSON generated from the implementation;
5. one source view reading the implementation file directly;
6. one stable route in each locale;
7. one concise description and one visible product job;
8. a focused public API with useful defaults;
9. explicit runtime dependencies and runtime cost;
10. keyboard interaction and visible focus where applicable;
11. a reduced-motion result;
12. mobile and narrow-container behavior;
13. loading, error, recovery, repeat action, or interruption handling when the product job requires it;
14. localized metadata, canonical URL, hreflang, and social preview;
15. related components and related Primitives.

### 14.1 Catalog admission test

A candidate enters the public 100 only when all answers are positive:

- Does it solve a recognizable product or marketing job?
- Does it have a clear motion signature?
- Does its paused frame look intentional?
- Does it remain useful after restyling?
- Does it have a distinct boundary from existing catalog entries?
- Can a user install and run the exact previewed source?

## 15. Information architecture

### 15.1 Primary navigation

- `Components`
- `Page Blocks`
- `Primitives`
- `Guides`

Skill and GitHub remain compact utility actions.

### 15.2 Landing page

The V6 landing page leads with the component catalog:

1. one large flagship component stage;
2. concise promise: `100 copy-ready React motion components`;
3. direct actions for browsing components and installing one item;
4. a visual rail covering Product Mono, Editorial Warm, and Spatial Dark;
5. the 12 flagship components;
6. category entry points;
7. Page Blocks as composition proof;
8. Primitives, Registry installation, and Agent Skill as supporting paths.

### 15.3 Component directory

- Components open as the selected collection.
- The 12 flagship items appear in a varied featured grid.
- The complete catalog follows in a dense two-column desktop layout and one-column mobile layout.
- Search and category filtering stay immediately available.
- Cards use a prepared primary state and mount live interaction near the viewport.
- Each card exposes name, slug, runtime cost, and engine without descriptive clutter.
- Page Blocks use a distinct collection view and no longer occupy the first catalog rows.

### 15.4 Component workbench

The stable order is:

1. identity, one-line job, runtime cost, engines, and install action;
2. large live preview;
3. Preview and Code switch;
4. focused props and states;
5. reduced-motion and accessibility behavior;
6. related components and Primitives.

The workbench should let visual components use larger and darker canvases while product controls retain compact documentation density.

## 16. Runtime and performance

The existing `light`, `medium`, and `heavy` runtime classifications remain part of component metadata and become visible in the workbench.

- Heavy Three.js and WebGL components load through independent lazy chunks.
- Continuous animation starts only while the component is visible.
- Directory cards prefer prepared primary states and delay expensive live mounting.
- Canvas and WebGL resources are disposed when previews unmount.
- Mobile layouts may simplify fidelity while preserving the product meaning.
- Existing bundle checks remain release gates and should be updated only with measured justification.
- V6 should preserve responsive interaction during route changes, search, filtering, and preview mounting.

## 17. Accessibility and responsive behavior

- Use native controls and established Radix primitives where they reduce complexity.
- Preserve focus entry, focus containment, focus restoration, and escape behavior for overlays.
- Support keyboard parity for drag, comparison, carousel, selection, and long-press interactions.
- Keep primary touch targets at least 44px.
- Keep important product meaning available without hover.
- Preserve readable contrast across all three scene families.
- Remove page-level horizontal overflow at every public route.
- Test every flagship component at desktop and mobile widths.
- Test every component under `prefers-reduced-motion: reduce`.

## 18. Registry and source architecture

The current single-source chain remains mandatory:

```text
registry implementation
  → live demo
  → directory and workbench preview
  → source view
  → public Registry JSON
  → root registry catalog
```

Generated source strings and duplicate preview implementations are excluded.

Removed or consolidated V5 entries are deleted from source maps, routes, Registry output, search, sitemap, and documentation. V6 does not publish compatibility aliases for obsolete component slugs.

## 19. Delivery plan

### Phase 0 — Catalog foundation

- Apply the merge and removal decisions.
- Add the 11-category schema.
- Add shared scene-family and motion-role contracts.
- Define asset provenance and primary-state capture fields.
- Update directory information architecture with Components first.

Exit condition: the retained 52-item catalog builds, installs, searches, and routes correctly under the V6 schema.

### Phase 1 — Twelve flagship components

New components:

- `scroll-media-expansion`
- `shader-hero`
- `device-scroll-reveal`
- `expandable-card`
- `animated-testimonials`
- `image-trail`

Rebuilt components:

- `scroll-story`
- `procedural-product-viewer`
- `dither-reveal-card`
- `network-globe`
- `image-lightbox`
- `spotlight-bento`

Exit condition: all 12 pass static-frame review, live interaction review, mobile review, reduced-motion review, Registry installation, and side-by-side visual acceptance.

### Phase 2 — Product breadth

- Complete Forms & Input, Overlays & Surfaces, Data & Commerce, and Text & Type.
- Refresh the 31 retained interaction cores.
- Complete the three consolidated components.

Exit condition: at least 80 public components meet the V6 contract.

### Phase 3 — Catalog completion

- Complete the remaining Hero, Cards & Media, and Visual & Ambient items.
- Finish realistic assets, localized metadata, social images, related-item mapping, and performance classification.

Exit condition: exactly 100 public components meet the V6 contract.

### Phase 4 — Page Blocks and website

- Refresh the 5 existing Blocks.
- Build the 5 new Blocks from published V6 components.
- Finish landing page, component directory, Block directory, workbench updates, and navigation.

Exit condition: 10 responsive Page Blocks and all public discovery surfaces are complete.

### Phase 5 — Release acceptance

- Run the full quality suite.
- Perform fresh shadcn installs for representative light, medium, heavy, and Page Block items.
- Verify generated routes, sitemap, catalog JSON, Registry JSON, social assets, and production crawl.
- Inspect landing, component directory, flagship workbenches, Page Blocks, and mobile navigation in a browser.

Exit condition: V6 release artifacts and production deployment satisfy Section 20.

## 20. Release acceptance criteria

V6 is complete when:

- The public catalog reports exactly 100 Components and 10 Page Blocks.
- The 100 Components are distributed across the 11 categories defined in Section 9.
- Components lead landing-page and directory discovery.
- The 12 flagship components establish the approved visual bar across all three scene families.
- Every public Component and Block uses the same source for preview, code, and Registry delivery.
- Every component has an intentional static primary state.
- Every component supports reduced motion and relevant keyboard interaction.
- Every component has mobile or narrow-container behavior.
- Every heavy component is lazy-loaded, viewport-gated, and correctly disposed.
- Every removed or merged V5 slug is absent from public routes, search, sitemap, Registry output, and documentation.
- The 5 new Page Blocks compose published V6 components and contain no duplicate private replacements.
- The 44 canonical Primitives and 91 source terms remain accessible.
- Chinese and English canonical routes, hreflang, structured data, social images, sitemap, robots, and machine-readable catalogs are generated successfully.
- Fresh shadcn installs succeed for representative Components and Page Blocks.
- Desktop and mobile layouts contain no page-level horizontal overflow.
- The following checks pass:

```bash
npm run lint
npm run typecheck
npm run test
npm run i18n:check
npm run vocabulary:check
npm run motion-grammar:check
npm run skill:check
npm run artifacts:check
npm run seo:check
npm run motion:check
npm run a11y:check
npm run build
npm run bundle:check
npm run crawl:dist
npm run test:visual
```

## 21. Decision rules during implementation

- Protect the quality of the 12 flagship components before increasing catalog count.
- Prefer an established dependency already present in the project when it satisfies the interaction.
- Keep one component focused on one recognizable product job.
- Merge candidates that share the same state model and user outcome.
- Remove entries that lack a clear product job, motion signature, or production-quality scene.
- Keep visual effects reusable outside the supplied demo.
- Use real content and assets early enough for visual review.
- Build Page Blocks from accepted components after their APIs and visual scenes are stable.
- Treat accessibility, reduced motion, mobile behavior, Registry installation, and visual finish as one acceptance bar.

## 22. V6 positioning

Primary product line:

> Copy-ready React motion components for memorable products.

Supporting proof:

> 100 components · 10 Page Blocks · live previews · shadcn Registry · reduced motion.

The website, README, metadata, social images, and release notes should lead with component quantity, quality, and visual character. Agent UI, Primitives, Registry, and Skill remain visible as supporting capabilities.
