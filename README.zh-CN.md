<!-- markdownlint-disable MD013 MD033 MD041 -->

<p align="center">
  <img src="public/brand/motion-lexicon-mark.svg" width="88" height="88" alt="Motion Lexicon 标志" />
</p>

<h1 align="center">Motion Lexicon</h1>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-CN.md"><strong>简体中文</strong></a>
</p>

<p align="center"><strong>把产品瞬间或动效基础，直接带进你的界面。</strong></p>

<p align="center">
  面向产品创作者、设计师、开发者和 AI Agent 的免费开源产品动效系统。<br />
  <strong>产品瞬间 · 动效基础 · Finder</strong>
</p>

<p align="center">
  <a href="https://motion-lexicon.pages.dev/zh/packs/"><strong>浏览产品瞬间</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/catalog/"><strong>浏览动效基础</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/finder/"><strong>使用 Motion Finder</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/"><strong>访问网站</strong></a>
</p>

<p align="center">
  <a href="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml"><img src="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-black.svg" alt="代码许可证：MIT" /></a>
  <a href="./CONTENT-LICENSE"><img src="https://img.shields.io/badge/content-CC_BY_4.0-0A84FF.svg" alt="内容许可证：CC BY 4.0" /></a>
</p>

<!-- markdownlint-enable MD013 MD033 MD041 -->

![Motion Lexicon V1.1——产品瞬间与动效基础](docs/assets/readme-v1-home.webp)

## 两个目录，一套产品动效系统

V1.1 将两个同等重要的目录放进同一套产品动效系统：**产品瞬间 · Motion Packs** 提供完整交互，**动效基础 · Motion Primitives** 提供 44 个聚焦的底层动效工作台。你可以从当前要解决的问题出发，再在两者之间切换，获得完整实现或更精确的调整。

| 目录 | 适合从这里开始 | 可以复制什么 |
| --- | --- | --- |
| [产品瞬间 · Motion Packs](https://motion-lexicon.pages.dev/zh/packs/) | 保存、发布、邀请、筛选等一个明确的产品状态 | 完整场景、交互契约、Prompt、HTML、CSS 和 JavaScript |
| [动效基础 · Motion Primitives](https://motion-lexicon.pages.dev/zh/catalog/) | 入场、缓动、编排、转场或一个具体参数 | 精确工作台、术语、参数和可移植实现 |
| [Motion Finder](https://motion-lexicon.pages.dev/zh/finder/) | 能描述感觉或目标，还没有准确术语 | 同一条检索路径中的产品瞬间与动效基础 |

## 为真实产品瞬间准备的 Motion Pack

首批 16 个 Motion Pack 是能在产品里直接识别的完整小交互。你可以在浏览器里亲手触发、查看状态变化，再复制 Prompt、HTML、CSS 和 JavaScript，接入自己的产品。

每个 Pack 都有一份清晰的交互契约：

- 真实产品上下文，以及看得见的前后状态
- 点击、进行中、完成后的即时反馈
- 基于 `transform` 与 `opacity` 的短时、顺滑节奏
- 可移植实现和减少动态效果处理
- 稳定、可分享的详情页 URL

![Motion Pack 详情页——预览保存确认并复制实现](docs/assets/readme-v1-pack.webp)

### 首批 16 个 Pack

| 分组 | Motion Pack |
| --- | --- |
| 完成反馈 | 保存确认、发布版本、分享链接、行内校验 |
| 选择决策 | 卡片选择、工作区切换、模板选择、命令菜单 |
| 内容变化 | 图层插入、归档撤销、筛选结果、展开详情 |
| 工作流表面 | 通知处理、步骤进度、成员邀请、媒体拖动 |

从 [Motion Pack 画廊](https://motion-lexicon.pages.dev/zh/packs/) 开始，再打开像 [保存确认](https://motion-lexicon.pages.dev/zh/packs/save-confirmation/) 这样的完整详情页。

## 一段交互，从头到尾

1. **预览**一段完整产品瞬间和它所在的界面。
2. **触发**交互，观察状态如何在上下文中变化。
3. **理解**时长、触发条件、结果和减少动态效果处理。
4. **复制**Prompt，或可移植的 HTML、CSS、JavaScript。

画廊和所有 Pack 详情页都是静态页面，加载快速、无需账号，也方便放进设计评审、Issue 或 Agent 任务里分享。

## 通过 Finder 与关联动效连成一体

Motion Finder 横跨两个目录。Pack 详情页会呈现构成产品瞬间的相关动效基础；已建立 Pack 关联的动效基础工作台会呈现对应产品瞬间。两条内容线各自解决清晰的问题，同时共同组成一套可浏览、可拆解、可复制的产品动效系统。

| 产品界面 | 可以获得什么 |
| --- | --- |
| [Motion Packs](https://motion-lexicon.pages.dev/zh/packs/) | 16 段完整、可复制的产品交互 |
| [Motion Finder](https://motion-lexicon.pages.dev/zh/finder/) | 根据自然语言需求给出可解释的动效候选 |
| [动效基础 · Motion Primitives](https://motion-lexicon.pages.dev/zh/catalog/) | 12 个动效类别中的 44 张标准工作台 |
| [动效词汇](https://motion-lexicon.pages.dev/zh/vocabulary/) | 91 个中英双语术语、定义和近义词区别 |
| [版本化数据](https://motion-lexicon.pages.dev/data/v1/packs.json) | 供工具和 Agent 使用的 Pack、目录、词汇和 Schema |

Finder 帮你找到合适的动效语言、产品瞬间，或两者的组合。44 张标准工作台和 91 个源术语继续承担精准检索、SEO 与深入实现参考。

## 在浏览器、CLI 或 Agent 中使用

网站提供最快的可视化路径。免费 CLI 通过并列的 `packs` 与 `list` 命令读取同一套 V1.1 数据：

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.1.0 packs \
  --locale zh --format json

npx -y github:Ryan-yang125/motion-lexicon#v1.1.0 pack save-confirmation \
  --locale zh --format bundle

npx -y github:Ryan-yang125/motion-lexicon#v1.1.0 list \
  --locale zh --format json
```

动效基础的检索与导出继续通过同一套 CLI 使用：

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.1.0 recommend \
  "一张卡片切入进来，然后慢慢停下来" \
  --locale zh --format json

npx -y github:Ryan-yang125/motion-lexicon#v1.1.0 search \
  "共享元素" --locale zh
npx -y github:Ryan-yang125/motion-lexicon#v1.1.0 export spring \
  --locale zh --format bundle
```

安装免费的 Motion Lexicon Agent Skill：

```bash
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon
```

Agent 也可以直接读取公开资源：

- [llms.txt](https://motion-lexicon.pages.dev/llms.txt)
- [llms-full.txt](https://motion-lexicon.pages.dev/llms-full.txt)
- [Motion Packs JSON](https://motion-lexicon.pages.dev/data/v1/packs.json)
- [Catalog JSON](https://motion-lexicon.pages.dev/data/v1/catalog.json)
- [Vocabulary JSON](https://motion-lexicon.pages.dev/data/v1/vocabulary.json)
- [JSON Schema](https://motion-lexicon.pages.dev/data/v1/schema.json)

## 免费、开源、方便迁移

Motion Lexicon 以静态网站运行，提供免费浏览器体验、本地 CLI、Agent Skill 和公开数据。每份导出实现都保持框架无关，可以直接进入已有产品技术栈。

- 源代码：[MIT](./LICENSE)
- 项目原创内容与数据：[CC BY 4.0](./CONTENT-LICENSE)
- 生成的代码片段：[0BSD](./CONTENT-LICENSE)
- 交互组件：[Interior](https://github.com/ddoemonn/interior)，按 MIT 许可证改造，署名与许可正文见 [NOTICE](./NOTICE)

## V1.1 快照

**V1.1.0 已上线。** 公共产品包含两个同等重要的目录：16 个真实产品 Motion Pack 与 44 张标准动效基础工作台。Finder、双语词汇、CLI、Agent Skill、版本化机器可读数据、本地化 SEO 和静态交付将它们连成完整系统。

<!-- markdownlint-disable MD013 MD033 -->

<details>
<summary><strong>面向贡献者的工程参考</strong></summary>

### 核心路由

所有公共产品路由都提供英文版（`/en/`）和中文版（`/zh/`）。

| 路由形式 | 用途 |
| --- | --- |
| `/:locale/` | 产品首页，平等进入两个目录 |
| `/:locale/packs/` | 全部 16 个真实产品 Motion Pack |
| `/:locale/packs/:packId/` | 单个 Pack 的预览、指导和可移植实现 |
| `/:locale/finder/` | 自然语言动效推荐 |
| `/:locale/catalog/` | 包含 44 张工作台的完整动效基础目录 |
| `/:locale/vocabulary/` | 包含 91 个术语的完整词汇表 |
| `/:locale/:category/:recipe/` | 标准动效方案工作台 |
| `/data/v1/*.json` | 版本化 Pack、目录、词汇和 Schema 数据 |

### 构建与静态交付

Motion Lexicon 使用 React、TypeScript、Vite、TanStack Router 和 i18next。生产构建依次执行：

```text
tsc -b
→ vite build
→ tsx --tsconfig tsconfig.app.json scripts/prerender.ts
```

预渲染步骤从 `src/data/site.ts` 枚举标准路由，通过 `src/entry-server.tsx` 完成渲染并注入本地化元数据，最终写入 `dist/<route>/index.html`、`dist/sitemap.xml` 与 `dist/robots.txt`。`dist/` 目录包含适合 CDN 静态托管的 HTML、CSS、JavaScript、图片和数据。

```bash
npm install
npm run dev
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

### 质量门禁

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

产品目标与实现决策记录在 [PRODUCT.md](./PRODUCT.md) 和 [DESIGN.md](./DESIGN.md) 中。参与贡献请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)，社区行为规范见 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)，安全问题报告方式见 [SECURITY.md](./SECURITY.md)。

</details>

<!-- markdownlint-enable MD013 MD033 -->

---

**[浏览产品瞬间](https://motion-lexicon.pages.dev/zh/packs/)** ·
**[浏览动效基础](https://motion-lexicon.pages.dev/zh/catalog/)** ·
**[使用 Motion Finder](https://motion-lexicon.pages.dev/zh/finder/)** ·
**[Read the English README](./README.md)**
