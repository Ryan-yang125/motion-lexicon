<!-- markdownlint-disable MD013 MD033 MD041 -->

<p align="center">
  <img src="public/brand/motion-lexicon-mark.svg" width="88" height="88" alt="Motion Lexicon logo" />
</p>

<h1 align="center">Motion Lexicon</h1>

<p align="center"><strong>Describe how motion should feel. Leave with an exact, copy-ready recipe.</strong></p>

<p align="center">
  A free visual motion finder for product builders, designers, developers, and AI agents.<br />
  <strong>Describe → Choose → Tune → Use</strong>
</p>

<p align="center">
  <a href="https://motion-lexicon.pages.dev/en/finder/"><strong>Try Motion Finder</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/catalog/"><strong>Explore the Library</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/">中文</a> ·
  <a href="https://motion-lexicon.pages.dev/en/">English</a>
</p>

<p align="center">
  <a href="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml"><img src="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-black.svg" alt="Code license: MIT" /></a>
  <a href="./CONTENT-LICENSE"><img src="https://img.shields.io/badge/content-CC_BY_4.0-0A84FF.svg" alt="Content license: CC BY 4.0" /></a>
</p>

<!-- markdownlint-enable MD013 MD033 MD041 -->

![Motion Lexicon home — describe the motion you want](docs/assets/readme-home.webp)

## From a vague feeling to a usable motion

You can start with the words already in your head:

> “The card should pop in with weight, then settle cleanly.”

Motion Finder turns that request into a focused workflow:

1. **Describe** the feeling, purpose, or behavior in Chinese or English.
2. **Choose** from three ranked candidates with clear match reasons and distinctions.
3. **Tune** the selected motion while watching the preview update in real time.
4. **Use** the result as an agent-ready prompt or portable HTML, CSS, and JavaScript.

The full state lives in the URL, so a motion decision can be shared with a
teammate or reopened later.

![Motion Finder — ranked candidates and synchronized comparison](docs/assets/readme-finder.webp)

## A visual workbench for every recipe

Each recipe brings the motion, controls, implementation, and design guidance
into one place.

- Large live preview with replay, device, and reduced-motion controls
- Focused Inspector for the parameters that matter most
- Prompt, HTML, CSS, and framework-independent JavaScript generated from one
  motion specification
- Purpose, usage frequency, interaction rules, review criteria, and
  accessibility guidance
- Stable, shareable URLs for every recipe and parameter state

![Motion recipe workspace — preview, Inspector, and copy-ready output](docs/assets/readme-workspace.webp)

## What you can explore

| Surface | What it gives you |
| --- | --- |
| [Motion Finder](https://motion-lexicon.pages.dev/en/finder/) | Three explainable recommendations from a natural-language request |
| [Motion Library](https://motion-lexicon.pages.dev/en/catalog/) | 44 curated, visual workspaces across 12 motion families |
| [Vocabulary](https://motion-lexicon.pages.dev/en/vocabulary/) | 91 bilingual motion terms with precise definitions and close-term distinctions |
| [Recipe workspaces](https://motion-lexicon.pages.dev/en/entrances/slide-in/) | Live previews, parameters, prompts, portable code, and review guidance |
| [Versioned data](https://motion-lexicon.pages.dev/data/v1/catalog.json) | Structured catalog, vocabulary, and schema for tools and agents |

The 44 canonical workspaces include 31 copy-ready components, 9 focused
playgrounds, and 4 practical guides. All 91 source terms resolve into this
curated surface, keeping discovery broad and implementation focused.

## Who it is for

- **Product builders** who know the desired feeling and want the right motion language
- **Designers** who need a visual reference for comparing close animation patterns
- **Developers** who want concrete parameters and portable implementation code
- **AI agents** that work better with precise prompts, structured data, and
  explicit constraints

## Free CLI

Use the same recommendation model from your terminal:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 recommend \
  "卡片弹出来要有重量，最后收得住" \
  --locale zh \
  --format json
```

Continue from discovery to implementation:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 search \
  "shared element" --locale en
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 show spring --locale en
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 export spring \
  --locale en --format bundle
```

`recommend` returns up to three ranked variants with match reasons,
distinctions, resolved presets, preview URLs, and a shareable comparison URL.

## Free Agent Skill

Install Motion Lexicon as an Agent Skill:

```bash
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon
```

The Skill guides an agent from a vague request through recommendation, visual
comparison, parameter choices, accessibility checks, and implementation output.

Agent integrations can also read:

- [llms.txt](https://motion-lexicon.pages.dev/llms.txt)
- [llms-full.txt](https://motion-lexicon.pages.dev/llms-full.txt)
- [Catalog JSON](https://motion-lexicon.pages.dev/data/v1/catalog.json)
- [Vocabulary JSON](https://motion-lexicon.pages.dev/data/v1/vocabulary.json)
- [JSON Schema](https://motion-lexicon.pages.dev/data/v1/schema.json)

## Free, open, and portable

Motion Lexicon runs as a static website and keeps the public product available
free of charge. The browser experience, CLI, Agent Skill, catalog data, and
generated output are designed to travel easily between people and tools.

- Source code: [MIT](./LICENSE)
- Project-authored content and data: [CC BY 4.0](./CONTENT-LICENSE)
- Generated code fragments: [0BSD](./CONTENT-LICENSE)

## For contributors

Motion Lexicon is built with React, TypeScript, Vite, TanStack Router, i18next,
and a build-time static rendering pipeline. The production site ships as static
HTML, CSS, and JavaScript with localized metadata for 120 canonical routes.

```bash
npm install
npm run dev
```

Create and inspect the production build:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

The main verification commands are:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:visual
```

Product intent and implementation decisions live in [PRODUCT.md](./PRODUCT.md)
and [DESIGN.md](./DESIGN.md). Contribution guidelines are in
[CONTRIBUTING.md](./CONTRIBUTING.md), community participation follows
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md), and security reports follow
[SECURITY.md](./SECURITY.md).

---

**[Describe a motion](https://motion-lexicon.pages.dev/en/finder/)** ·
**[Browse all recipes](https://motion-lexicon.pages.dev/en/catalog/)** ·
**[Open the Chinese site](https://motion-lexicon.pages.dev/zh/)**
