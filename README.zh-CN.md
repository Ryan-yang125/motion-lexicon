<!-- markdownlint-disable MD013 MD033 MD041 -->

<p align="center">
  <img src="public/brand/motion-lexicon-mark.svg" width="88" height="88" alt="Motion Lexicon 标志" />
</p>

<h1 align="center">Motion Lexicon</h1>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-CN.md"><strong>简体中文</strong></a>
</p>

<p align="center"><strong>把一段完整的产品交互，直接带进你的界面。</strong></p>

<p align="center">
  面向产品创作者、设计师、开发者和 AI Agent 的免费开源真实产品交互合集。<br />
  <strong>预览 → 触发 → 理解 → 复制</strong>
</p>

<p align="center">
  <a href="https://motion-lexicon.pages.dev/zh/packs/"><strong>浏览 Motion Packs</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/finder/"><strong>使用 Motion Finder</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/"><strong>访问网站</strong></a>
</p>

<p align="center">
  <a href="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml"><img src="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-black.svg" alt="代码许可证：MIT" /></a>
  <a href="./CONTENT-LICENSE"><img src="https://img.shields.io/badge/content-CC_BY_4.0-0A84FF.svg" alt="内容许可证：CC BY 4.0" /></a>
</p>

<!-- markdownlint-enable MD013 MD033 MD041 -->

![Motion Lexicon V1——16 个真实产品瞬间](docs/assets/readme-v1-home.webp)

## 为真实产品瞬间准备的 Motion Pack

V1.0 围绕 **16 个 Motion Pack** 构建：每一个都是能在产品里直接识别的完整小交互。你可以在浏览器里亲手触发、查看状态变化，再复制 Prompt、HTML、CSS 和 JavaScript，接入自己的产品。

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
| 完成反馈 | 保存确认、发布版本、复制分享链接 |
| 选择决策 | 卡片选择、工作区切换、模板选择 |
| 内容变化 | 图层插入、归档撤销、筛选结果、行内校验 |
| 工作流表面 | 命令菜单、展开详情、通知处理、步骤进度、成员邀请、媒体拖动 |

从 [Motion Pack 画廊](https://motion-lexicon.pages.dev/zh/packs/) 开始，再打开像 [保存确认](https://motion-lexicon.pages.dev/zh/packs/save-confirmation/) 这样的完整详情页。

## 一段交互，从头到尾

1. **预览**一段完整产品瞬间和它所在的界面。
2. **触发**交互，观察状态如何在上下文中变化。
3. **理解**时长、触发条件、结果和减少动态效果处理。
4. **复制**Prompt，或可移植的 HTML、CSS、JavaScript。

画廊和所有 Pack 详情页都是静态页面，加载快速、无需账号，也方便放进设计评审、Issue 或 Agent 任务里分享。

## Finder 与词典继续服务完整决策

Motion Pack 是 V1 的主产品界面。原有的动效选择和词典能力继续覆盖完整路径：

| 产品界面 | 可以获得什么 |
| --- | --- |
| [Motion Packs](https://motion-lexicon.pages.dev/zh/packs/) | 16 段完整、可复制的产品交互 |
| [Motion Finder](https://motion-lexicon.pages.dev/zh/finder/) | 根据自然语言需求给出可解释的动效候选 |
| [动效库](https://motion-lexicon.pages.dev/zh/catalog/) | 12 个动效类别中的 44 张标准工作台 |
| [动效词汇](https://motion-lexicon.pages.dev/zh/vocabulary/) | 91 个中英双语术语、定义和近义词区别 |
| [版本化数据](https://motion-lexicon.pages.dev/data/v1/packs.json) | 供工具和 Agent 使用的 Pack、目录、词汇和 Schema |

Finder 帮你选择动效语言，Pack 把这份选择做成完整产品交互。44 张标准工作台和 91 个源术语继续承担精准检索、SEO 与深入实现参考。

## 在浏览器、CLI 或 Agent 中使用

网站提供最快的可视化路径。免费 CLI 也能在本地读取 V1 Pack 数据：

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 packs \
  --locale zh --format json

npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 pack save-confirmation \
  --locale zh --format bundle
```

Finder 和词典工作台继续通过同一套 CLI 使用：

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 recommend \
  "一张卡片切入进来，然后慢慢停下来" \
  --locale zh --format json

npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 search \
  "共享元素" --locale zh
npx -y github:Ryan-yang125/motion-lexicon#v1.0.0 export spring \
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

## V1.0 快照

**V1.0.0 已上线。** 公共产品包含 16 个真实产品 Motion Pack、双语 Finder、44 张标准动效工作台、91 个源术语、CLI、Agent Skill、版本化机器可读数据、本地化 SEO 和静态交付。

<!-- markdownlint-disable MD013 MD033 -->

<details>
<summary><strong>面向贡献者的工程参考</strong></summary>

### 核心路由

所有公共产品路由都提供英文版（`/en/`）和中文版（`/zh/`）。

| 路由形式 | 用途 |
| --- | --- |
| `/:locale/` | Motion Pack 画廊和产品首页 |
| `/:locale/packs/` | 全部 16 个真实产品 Motion Pack |
| `/:locale/packs/:packId/` | 单个 Pack 的预览、指导和可移植实现 |
| `/:locale/finder/` | 自然语言动效推荐 |
| `/:locale/catalog/` | 包含 44 张工作台的完整动效库 |
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

**[浏览 Motion Packs](https://motion-lexicon.pages.dev/zh/packs/)** ·
**[使用 Motion Finder](https://motion-lexicon.pages.dev/zh/finder/)** ·
**[Read the English README](./README.md)**
