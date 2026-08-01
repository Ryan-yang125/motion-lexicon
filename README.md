<!-- markdownlint-disable MD013 MD033 MD041 -->

<p align="center">
  <img src="public/brand/motion-lexicon-mark.svg" width="88" height="88" alt="Motion Lexicon logo" />
</p>

<h1 align="center">Motion Lexicon</h1>

<p align="center">
  <a href="./README.md"><strong>English</strong></a> ·
  <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center"><strong>Product moments, motion primitives, and a Motion Director for AI-assisted interfaces.</strong></p>

<p align="center">
  A free, open-source motion system for builders, designers, developers, and AI agents.<br />
  <strong>28 Product Moments · 44 Motion Primitives · one shared Motion Grammar</strong>
</p>

<p align="center">
  <a href="https://motion-lexicon.pages.dev/en/packs/"><strong>Explore Product Moments</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/catalog/"><strong>Explore Motion Primitives</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/director/"><strong>Meet Motion Director</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/"><strong>Visit the Website</strong></a>
</p>

<p align="center">
  <a href="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml"><img src="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-black.svg" alt="Code license: MIT" /></a>
  <a href="./CONTENT-LICENSE"><img src="https://img.shields.io/badge/content-CC_BY_4.0-0A84FF.svg" alt="Content license: CC BY 4.0" /></a>
</p>

<!-- markdownlint-enable MD013 MD033 MD041 -->

![Motion Lexicon — product motion in context](docs/assets/readme-v1-home.webp)

## Three product surfaces, one Motion Grammar

Motion Lexicon gives interface motion a shared language across browsing and
building. The website and Motion Director are peer product surfaces. Both draw
from the same Motion Grammar, so a decision made in one surface carries into the
other.

| Surface | Start here when | It gives you |
| --- | --- | --- |
| [Product Moments](https://motion-lexicon.pages.dev/en/packs/) | You have a familiar product state such as save, publish, invite, filter, or approval | A complete interactive scene with Prompt, HTML, CSS, JavaScript, and reduced-motion guidance |
| [Motion Primitives](https://motion-lexicon.pages.dev/en/catalog/) | You need an exact entrance, transition, sequence, easing, or interaction behavior | A live, adjustable workspace with precise terminology and portable output |
| [Motion Director](https://motion-lexicon.pages.dev/en/director/) | You are designing or implementing inside an AI-assisted workflow | A context-aware recommendation, composition, implementation, review, or contribution blueprint |

The two website collections carry equal weight: **28 Product Moments** show
complete product interactions, while **44 Motion Primitives** expose the
precise behaviors within them. The bilingual vocabulary preserves all **91
terms** for search, learning, and implementation discussions.

## Start with a real product state

Each Product Moment is a complete, recognisable interaction: it has a context,
trigger, state progression, outcome, portable implementation, and a
reduced-motion treatment. Trigger the interaction in the browser, inspect the
state changes, then copy the material that fits your stack.

![Motion Pack detail — a save confirmation in context](docs/assets/readme-v1-pack.webp)

The current Pack collection covers four common product groups:

| Group | Product Moments |
| --- | --- |
| Feedback | Save confirmation, Publish release, Share link, Inline validation, Upload complete, Sync recovery, Delete confirmation |
| Choice | Card selection, Workspace switch, Template choice, Command menu, Assignee picker, Permission change, Search suggestions |
| Change | Layer insertion, Archive undo, Filter results, Details disclosure, Kanban move, Cart update, Comment reply |
| Workflow | Notification triage, Progress steps, Member invite, Media scrub, Approval request, Checkout payment, Scheduled publish |

## Motion Director Agent Skill

Install Motion Director in a compatible Agent Skills runtime:

```bash
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon
```

Motion Director turns a product brief into a concise **Motion Blueprint**. It
reads the project context, respects the existing visual language, and keeps
motion tied to a meaningful state change.

| Mode | Outcome |
| --- | --- |
| Recommend | A small set of motion directions with the reason each fits the product state |
| Compose | A complete product moment assembled from coordinated primitives |
| Implement | Portable HTML, CSS, JavaScript, or React guidance aligned to the chosen blueprint |
| Review | Clear findings on timing, hierarchy, interruption, accessibility, and perceived quality |
| Contribute | A structured candidate that can enter the Motion Lexicon content loop |

Every blueprint records the intent, state graph, visual actors, motion beats,
accessibility plan, delivery format, and provenance. This makes the reasoning
inspectable and gives the website a clear path for future examples.

## A design language for quiet, high-quality motion

Motion Grammar treats product state as the main visual material. Its rules draw
from the interaction principles that shaped
[Interior](https://github.com/ddoemonn/interior): layered materials, reserved
space for changing states, event-driven feedback, compact arrivals, crisp
departures, full keyboard behavior, and reduced motion that preserves the
result.

- Arrivals typically use `cubic-bezier(0.23, 1, 0.32, 1)` and land within
  200–280ms.
- Departures typically use `cubic-bezier(0.4, 0, 1, 1)` and resolve within
  110–180ms.
- Visible travel relies on `transform` and `opacity`; layout stays stable.
- One primary actor carries the state change, with up to two supporting actors.
- A reduced-motion path preserves status, hierarchy, focus, and control.

These working constraints keep every Motion Pack, Primitive, Motion Director
answer, and accepted community candidate on the same grammar.

## From a real request to a published example

```text
Product brief → Motion Blueprint → Candidate → Quality gate → Published Pack or Primitive
```

Motion Director can prepare a candidate with its context, state model, and
implementation. Publication stays intentional: every candidate receives a
review for behavior, code validity, accessibility, reduced motion, performance,
mobile layout, and bilingual clarity before it enters the public collection.

This keeps the catalog grounded in real product work while giving contributors a
concrete way to improve it.

## Public data and agent resources

- [Motion Grammar JSON](https://motion-lexicon.pages.dev/data/v2/motion-grammar.json)
- [Motion Blueprint Schema](https://motion-lexicon.pages.dev/data/v2/motion-blueprint.schema.json)
- [Product Moments JSON](https://motion-lexicon.pages.dev/data/v1/packs.json)
- [Motion Primitives JSON](https://motion-lexicon.pages.dev/data/v1/catalog.json)
- [Vocabulary JSON](https://motion-lexicon.pages.dev/data/v1/vocabulary.json)
- [JSON Schema](https://motion-lexicon.pages.dev/data/v1/schema.json)
- [llms.txt](https://motion-lexicon.pages.dev/llms.txt)
- [llms-full.txt](https://motion-lexicon.pages.dev/llms-full.txt)
- [Pricing](https://motion-lexicon.pages.dev/pricing.txt)

## Free, open, and portable

Motion Lexicon is a static website with free browser access, a free Agent Skill,
and public data. The generated implementation material remains framework
independent and travels into existing products without an account or hosted
runtime.

- Source code: [MIT](./LICENSE)
- Project-authored content and data: [CC BY 4.0](./CONTENT-LICENSE)
- Generated code fragments: [0BSD](./CONTENT-LICENSE)
- Interior-derived interaction components: [MIT attribution](./NOTICE)

## V2.0 snapshot

**V2.0.0 brings Motion Director into the product.** Product Moments, Motion
Primitives, the bilingual vocabulary, the public Motion Grammar, and the Agent
Skill now form one content-and-creation system. The browser remains the visual
reference; Motion Director carries the same decisions into active product work.

<!-- markdownlint-disable MD013 MD033 -->

<details>
<summary><strong>Engineering reference for contributors</strong></summary>

### Core routes

Every public product route is available in English (`/en/`) and Chinese
(`/zh/`).

| Route shape | Purpose |
| --- | --- |
| `/:locale/` | Product home with equal paths into both collections |
| `/:locale/packs/` | All 28 Product Moments |
| `/:locale/packs/:packId/` | A Pack preview, guidance, and portable output |
| `/:locale/catalog/` | The 44 Motion Primitives |
| `/:locale/:category/:recipe/` | A canonical Primitive workspace |
| `/:locale/finder/` | Natural-language discovery across both collections |
| `/:locale/director/` | Motion Director and the shared creation workflow |
| `/:locale/vocabulary/` | The complete bilingual 91-term vocabulary |
| `/data/v2/motion-grammar.json` | Public source of truth for Motion Director and published motion content |
| `/data/v2/motion-blueprint.schema.json` | Portable contract for a Motion Director blueprint |

### Build and static delivery

Motion Lexicon uses React, TypeScript, Vite, TanStack Router, and i18next. A
production build runs this sequence:

```text
tsc -b
→ vite build
→ tsx --tsconfig tsconfig.app.json scripts/prerender.ts
```

The finished `dist/` directory contains static HTML, CSS, JavaScript, images,
and data for CDN-backed static hosting.

```bash
npm ci
npm run dev
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

### Quality gates

```bash
npm run lint
npm run typecheck
npm run test
npm run i18n:check
npm run vocabulary:check
npm run artifacts:check
npm run motion-grammar:check
npm run skill:check
npm run seo:check
npm run motion:check
npm run a11y:check
npm run build
npm run bundle:check
npm run crawl:dist
npm run test:visual
```

Product intent and implementation decisions live in [PRODUCT.md](./PRODUCT.md)
and [DESIGN.md](./DESIGN.md). Contribution guidelines are in
[CONTRIBUTING.md](./CONTRIBUTING.md), community participation follows
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md), and security reports follow
[SECURITY.md](./SECURITY.md).

</details>

<!-- markdownlint-enable MD013 MD033 -->

---

**[Explore Product Moments](https://motion-lexicon.pages.dev/en/packs/)** ·
**[Explore Motion Primitives](https://motion-lexicon.pages.dev/en/catalog/)** ·
**[Meet Motion Director](https://motion-lexicon.pages.dev/en/director/)** ·
**[阅读中文 README](./README.zh-CN.md)**
