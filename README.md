<!-- markdownlint-disable MD013 MD033 MD041 -->

<p align="center">
  <img src="public/brand/motion-lexicon-mark.svg" width="88" height="88" alt="Motion Lexicon logo" />
</p>

<h1 align="center">Motion Lexicon</h1>

<p align="center">
  <a href="./README.md"><strong>English</strong></a> ·
  <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center"><strong>Copy a complete product moment into your interface.</strong></p>

<p align="center">
  A free, open-source collection of real product interactions for builders, designers, developers, and AI agents.<br />
  <strong>Preview → Trigger → Inspect → Copy</strong>
</p>

<p align="center">
  <a href="https://motion-lexicon.pages.dev/en/packs/"><strong>Explore Motion Packs</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/finder/"><strong>Use Motion Finder</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/"><strong>Visit the Website</strong></a>
</p>

<p align="center">
  <a href="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml"><img src="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-black.svg" alt="Code license: MIT" /></a>
  <a href="./CONTENT-LICENSE"><img src="https://img.shields.io/badge/content-CC_BY_4.0-0A84FF.svg" alt="Content license: CC BY 4.0" /></a>
</p>

<!-- markdownlint-enable MD013 MD033 MD041 -->

![Motion Lexicon V1 — sixteen real product moments](docs/assets/readme-v1-home.webp)

## Motion Packs for real product moments

V1.0 is built around **16 Motion Packs**: complete, small interactions that
already live inside recognisable product surfaces. Trigger each Pack in the
browser, inspect its state changes, then copy the Prompt, HTML, CSS, and
JavaScript into your own product.

Every Pack carries one clear interaction contract:

- A real product context with a visible before-and-after state
- Immediate press and completion feedback
- Short, compositor-friendly timing built from `transform` and `opacity`
- A portable implementation plus reduced-motion treatment
- A stable, shareable detail URL

![Motion Pack detail — preview a save confirmation and copy its implementation](docs/assets/readme-v1-pack.webp)

### The first 16 Packs

| Group | Motion Packs |
| --- | --- |
| Feedback | Save confirmation, Publish release, Copy share link |
| Choice | Card selection, Workspace switch, Template choice |
| Change | Layer insertion, Archive undo, Filter results, Inline validation |
| Workflow | Command menu, Details disclosure, Notification triage, Progress steps, Member invite, Media scrub |

Start with the [Motion Pack gallery](https://motion-lexicon.pages.dev/en/packs/),
then open a detail such as [Save confirmation](https://motion-lexicon.pages.dev/en/packs/save-confirmation/).

## One interaction, end to end

1. **Preview** a complete product moment in its own scene.
2. **Trigger** it yourself and see the state changes in context.
3. **Inspect** the timing, interaction guidance, and reduced-motion behavior.
4. **Copy** the Prompt or portable HTML, CSS, and JavaScript.

The gallery and every Pack detail are static pages. They load fast, work without
an account, and stay easy to share in a design review, issue, or agent task.

## Finder and vocabulary stay with you

Motion Packs are the primary product surface in V1. The original discovery layer
continues to support the full decision path:

| Surface | What it gives you |
| --- | --- |
| [Motion Packs](https://motion-lexicon.pages.dev/en/packs/) | 16 complete, copy-ready product interactions |
| [Motion Finder](https://motion-lexicon.pages.dev/en/finder/) | Explainable candidates from a natural-language motion request |
| [Motion Library](https://motion-lexicon.pages.dev/en/catalog/) | 44 canonical motion workspaces across 12 families |
| [Vocabulary](https://motion-lexicon.pages.dev/en/vocabulary/) | 91 bilingual terms with definitions and close-term distinctions |
| [Versioned data](https://motion-lexicon.pages.dev/data/v1/packs.json) | Machine-readable Packs, catalog, vocabulary, and schema |

Finder helps choose the motion language. A Pack turns that choice into a complete
product interaction. The 44 canonical workspaces and all 91 source terms remain
available for exact search, SEO, and deeper implementation reference.

## Use it from the browser, CLI, or an agent

The website is the fastest visual route. The free CLI exposes the same V1 Pack
data locally:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 packs \
  --locale en --format json

npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 pack save-confirmation \
  --locale en --format bundle
```

Finder and the recipe library remain available through the same CLI:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 recommend \
  "A card enters quickly, then settles into place" \
  --locale en --format json

npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 search \
  "shared element" --locale en
npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 export spring \
  --locale en --format bundle
```

Install the free Motion Lexicon Agent Skill:

```bash
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon
```

Agents can also read the public resources directly:

- [llms.txt](https://motion-lexicon.pages.dev/llms.txt)
- [llms-full.txt](https://motion-lexicon.pages.dev/llms-full.txt)
- [Motion Packs JSON](https://motion-lexicon.pages.dev/data/v1/packs.json)
- [Catalog JSON](https://motion-lexicon.pages.dev/data/v1/catalog.json)
- [Vocabulary JSON](https://motion-lexicon.pages.dev/data/v1/vocabulary.json)
- [JSON Schema](https://motion-lexicon.pages.dev/data/v1/schema.json)

## Free, open, and portable

Motion Lexicon is a static website with free browser access, a local CLI, an
Agent Skill, and public data. Every exported implementation is framework
independent, so it can travel into an existing product stack.

- Source code: [MIT](./LICENSE)
- Project-authored content and data: [CC BY 4.0](./CONTENT-LICENSE)
- Generated code fragments: [0BSD](./CONTENT-LICENSE)
- Interaction primitives: [Interior](https://github.com/ddoemonn/interior),
  adapted under MIT with attribution in [NOTICE](./NOTICE)

## V1.0 snapshot

**V1.0.0 is live.** The public product includes 16 real product Motion Packs,
the bilingual Finder, 44 canonical motion workspaces, 91 source terms, the CLI,
Agent Skill, versioned machine-readable data, localized SEO, and static delivery.

<!-- markdownlint-disable MD013 MD033 -->

<details>
<summary><strong>Engineering reference for contributors</strong></summary>

### Core routes

Every public product route is available in English (`/en/`) and Chinese
(`/zh/`).

| Route shape | Purpose |
| --- | --- |
| `/:locale/` | Motion Pack gallery and product home |
| `/:locale/packs/` | All 16 real product Motion Packs |
| `/:locale/packs/:packId/` | A Pack preview, guidance, and portable export |
| `/:locale/finder/` | Natural-language motion recommendation |
| `/:locale/catalog/` | Full 44-workspace motion library |
| `/:locale/vocabulary/` | Complete 91-term vocabulary |
| `/:locale/:category/:recipe/` | Canonical recipe workspace |
| `/data/v1/*.json` | Versioned Pack, catalog, vocabulary, and schema data |

### Build and static delivery

Motion Lexicon uses React, TypeScript, Vite, TanStack Router, and i18next. A
production build runs this sequence:

```text
tsc -b
→ vite build
→ tsx --tsconfig tsconfig.app.json scripts/prerender.ts
```

The prerender step enumerates canonical routes from `src/data/site.ts`, renders
them through `src/entry-server.tsx`, injects localized metadata, and writes
`dist/<route>/index.html`, `dist/sitemap.xml`, and `dist/robots.txt`. The
finished `dist/` directory contains static HTML, CSS, JavaScript, images, and
data for CDN-backed static hosting.

```bash
npm install
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

**[Explore Motion Packs](https://motion-lexicon.pages.dev/en/packs/)** ·
**[Use Motion Finder](https://motion-lexicon.pages.dev/en/finder/)** ·
**[阅读中文 README](./README.zh-CN.md)**
