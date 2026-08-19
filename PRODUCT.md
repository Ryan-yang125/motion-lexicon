# Motion Lexicon V6 Product Strategy

## Product promise

**Copy-ready React motion components for memorable products.**

Motion Lexicon delivers 100 production-quality React Components, 10 responsive
Page Blocks, live previews, shadcn Registry installs, and meaningful
reduced-motion states. Components are the primary product surface; Page Blocks,
Primitives, and the Motion Lexicon Skill deepen the same workflow.

```text
Discover → Judge the static frame → Interact → Copy or install → Adapt → Review
```

## Audience

- Product builders who need a finished interaction with real states and a focused API.
- Designers who need working references for visual character, timing, focus, and continuity.
- Engineers who want React source and an installable Registry item.
- Agents that need exact component selection, composition rules, and acceptance criteria.

## Public system

| Surface | Job | V6 scope |
| --- | --- | --- |
| Components | Deliver one recognizable product job | 100 components across 11 categories |
| Page Blocks | Demonstrate a complete responsive product page | 10 Blocks composed from published Components |
| Primitives | Explain reusable motion decisions | 44 canonical Primitives and 91 source terms |
| Guides | Turn a visual or product context into a decision | Bilingual scenarios, review guidance, and vocabulary |
| Motion Lexicon Skill | Bring the library into an implementation workflow | Independently versioned Skill 4.2.0 |

Components lead landing-page and directory discovery. Page Blocks hold complete
reference compositions. Primitives remain a stable vocabulary layer that helps
users understand and tune the motion language inside a Component.

## Component categories

| Category | Count | Core product jobs |
| --- | ---: | --- |
| Agent UI | 9 | reasoning, tool execution, approval, and handoff |
| Actions | 5 | deliberate primary and high-consequence actions |
| Overlays & Surfaces | 13 | focused temporary work surfaces |
| Forms & Input | 15 | data entry, validation, selection, and completion |
| Navigation | 6 | orientation, command access, and location changes |
| Data & Commerce | 11 | records, metrics, planning, pricing, and purchase |
| Feedback | 5 | progress, status, notification, and completion |
| Cards & Media | 15 | image, media, comparison, and product-story views |
| Visual & Ambient | 7 | visual texture, spatial context, and environmental motion |
| Hero & Story | 8 | product openings and narrative transitions |
| Text & Type | 6 | expressive and stateful typography |

## Scene families

- **Product Mono** gives product states, data, forms, navigation, and feedback a
  precise, compact, high-contrast working surface.
- **Editorial Warm** gives image-led stories, media, and typography material
  depth, comfortable pacing, and a human visual character.
- **Spatial Dark** gives technical product worlds, dimensional media, and
  ambient visuals depth without obscuring primary actions.

A component must establish a strong static primary state before motion begins.
Motion communicates an action or meaningful state transition. Reduced motion
keeps the same content, outcome, focus path, and controls.

## Quality bar

Every public Component and Page Block provides:

- real content or a documented local/generated asset provenance;
- a direct-import React demo and the exact implementation used by preview, code,
  and Registry delivery;
- a clear trigger, primary state, recovery state where relevant, and focused API;
- keyboard, touch, and narrow-container behavior;
- reduced-motion behavior that preserves meaning;
- responsive visual hierarchy without page-level horizontal overflow;
- viewport gating and disposal for heavy canvas, WebGL, and Three.js work.

The delivery chain stays explicit:

```text
implementation → direct-import demo → preview and code view → Registry JSON
```

## Page Blocks

The ten Blocks apply the same contract at page scale:

- Agent Workspace
- Product Landing
- Analytics Dashboard
- Project Dashboard
- Support Inbox
- Creative Portfolio
- Commerce Storefront
- Developer Docs
- Media Editorial
- Onboarding Flow

Each Block combines published Components where they satisfy a product job. It
keeps desktop, tablet, mobile, keyboard, and reduced-motion flows in one
self-contained implementation.

## Static product boundary

Motion Lexicon remains a static React + TypeScript application. Catalog data,
localized content, source views, Registry JSON, route metadata, sitemap, and
social assets build into static files. The public experience requires no
account, server, API key, or paid tier.

## Release acceptance

V6 is ready for release when:

- the public catalog reports exactly 100 Components, 10 Page Blocks, and all 11 categories;
- Components lead landing-page and directory discovery;
- all public items use the same source for demo, preview, code view, and Registry delivery;
- all Components have an intentional static primary state, reduced-motion path,
  relevant keyboard behavior, and narrow-container behavior;
- heavy scenes are lazy-loaded, viewport-gated, and disposed correctly;
- the 44 canonical Primitives and 91 source terms remain available;
- localized routes, hreflang, structured data, social images, sitemap, robots,
  machine-readable catalog, and Registry artifacts are generated successfully;
- representative Component and Block installs succeed with `shadcn@latest`;
- full quality checks, browser review, visual review, and production crawl pass.

The V6 release phase owns generation and verification of screenshots, social
images, public Registry JSON, machine-readable catalog output, and deployment
artifacts.
