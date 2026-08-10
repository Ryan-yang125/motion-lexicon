# Motion Lexicon V4.0 Product Strategy

## Product promise

Motion Lexicon gives builders production-ready motion at two useful levels:

- **Components:** complete React interactions that can be previewed, copied, or installed through a shadcn registry.
- **Primitives:** focused React + Motion behaviors that can be previewed, tuned, copied, or installed.

The Agent Skill sits beside the website and recommends, composes, implements,
reviews, and contributes motion from a real product event.

```text
Browse → Preview → Copy or install → Adapt → Review
```

## Audience

- Product builders who want a polished interaction without designing every state from scratch.
- Designers who need a working reference for timing, continuity, focus, and state feedback.
- Engineers who want React source, a registry install command, or portable primitive output.
- AI agents that need explicit motion constraints and a repeatable review method.

## Product structure

| Surface | Job | Public scope |
| --- | --- | --- |
| Landing | Let builders judge the library through working interactions | Live component stage, featured components and primitives, direct collection entry points |
| Components | Deliver complete product interactions | 28 React + Motion components |
| Primitives | Deliver and explain one behavior | 40 installable React + Motion primitives, 4 design guides, and 91 bilingual terms |
| Agent Skill | Design and implement from product context | Recommend, Compose, Implement, Review, Contribute |
| Guides | Teach decisions through real scenarios | 8 bilingual long-form illustrated articles |

Components and Primitives are equal first-level directories. Search spans both
collections. Components link to the primitives that explain their behavior;
primitive workspaces link back to relevant components.

## Component quality bar

Every published component includes:

- one realistic product state and a clear trigger;
- live React preview and the exact source used by that preview;
- shadcn-compatible registry JSON;
- keyboard and focus behavior;
- a reduced-motion result that preserves meaning;
- interruption, repeat action, failure, and recovery handling where applicable;
- compositor-friendly motion and stable layout;
- TypeScript types and a focused public API.

The interaction language follows Interior's material and motion discipline:
warm bezel, raised panel, recessed well, compact travel, stable resting states,
and precise feedback.

## Shared architecture quality bar

Components and Primitives use the same delivery architecture:

- one typed React + Motion implementation per public item;
- one realistic, interactive product demo that imports that implementation;
- one lazy preview entry used by directory cards and detail workbenches;
- one source view and one shadcn Registry response generated from the implementation file;
- one parameter contract connected to the demo's real props;
- one reduced-motion result, keyboard path, and interruption policy.

Primitives keep a narrower behavioral scope. Their implementation, product
scene, material language, code quality, and delivery chain meet the same bar as
Components.

## Content loop

```text
Real product request
  → Agent Skill recommendation or composition
  → Working component or primitive
  → Automated and editorial review
  → Registry publication
  → Better references for the next request
```

Repeated complete interactions become Components. Repeated reusable behaviors
become Primitives after they appear across several product contexts.

## Static product boundary

The website remains a static React application. Content, routes, component
source, registry JSON, localized metadata, and guides build into static files.
No account, server, API key, or paid tier is required.

## Discoverability

The build publishes 174 localized canonical pages, reciprocal hreflang,
structured data, Open Graph images, a sitemap, `llms.txt`, a V4 JSON catalog,
and the shadcn registry index.

## V4.0 acceptance

V4 is complete when:

- Components and Primitives are the only primary product directories.
- Each locale root presents both directories through real, interactive previews.
- All 28 component previews use the same source delivered by code view and registry JSON.
- All 44 primitive workspaces use direct `/primitives/:id/` routes.
- All 40 executable primitives use the same React + Motion preview, source, and registry delivery chain.
- Every executable primitive owns an independent implementation and an independent real-product demo.
- Primitive source views and Registry files read the implementation file directly; generated source strings are absent.
- All 9 parameter tools drive the same typed props used by their live previews.
- Global search, desktop sidebar, and mobile navigation cover both collections.
- The Agent Skill uses the same component and primitive language.
- Old Finder, Pack, Catalog, Director, Playground, and Lab routes are removed.
- Desktop and mobile layouts have no page-level horizontal overflow.
- Lint, typecheck, unit, i18n, SEO, motion, accessibility, build, bundle, crawl, browser, and official shadcn install checks pass.
