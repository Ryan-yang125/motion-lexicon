<!-- markdownlint-disable MD013 MD033 MD041 -->

<p align="center">
  <img src="public/brand/motion-lexicon-mark.svg" width="88" height="88" alt="Motion Lexicon 标志" />
</p>

<h1 align="center">Motion Lexicon</h1>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-CN.md"><strong>简体中文</strong></a>
</p>

<p align="center"><strong>描述你想要的感觉，获得精确、可复制的动效方案。</strong></p>

<p align="center">
  为产品创作者、设计师、开发者和 AI Agent 打造的免费可视化动效选择器。<br />
  <strong>描述 → 选择 → 调整 → 使用</strong>
</p>

<p align="center">
  <a href="https://motion-lexicon.pages.dev/zh/finder/"><strong>体验 Motion Finder</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/catalog/"><strong>浏览动效库</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/"><strong>访问网站</strong></a>
</p>

<p align="center">
  <a href="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml"><img src="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-black.svg" alt="代码许可证：MIT" /></a>
  <a href="./CONTENT-LICENSE"><img src="https://img.shields.io/badge/content-CC_BY_4.0-0A84FF.svg" alt="内容许可证：CC BY 4.0" /></a>
</p>

<!-- markdownlint-enable MD013 MD033 MD041 -->

![Motion Lexicon 首页——描述你想要的动效](docs/assets/readme-home.webp)

## 从模糊感觉走向可用动效

直接说出脑海里的那句话：

> “卡片弹出来要有重量，最后收得住。”

Motion Finder 会把这句话转化成一条清晰的工作流：

1. **描述**感觉、目的或行为，支持中文和英文。
2. **选择**三个排序后的候选，查看匹配原因和关键区别。
3. **调整**选中的动效，在实时预览中确认参数变化。
4. **使用**适合 Agent 的 Prompt，或可移植的 HTML、CSS 和 JavaScript。

完整状态保存在 URL 中，方便分享给团队成员，也能随时回到同一个动效决策。

![Motion Finder——候选推荐与同步比较](docs/assets/readme-finder.webp)

## 每个动效都有一张可视化工作台

每张动效方案都把预览、控制、实现和设计指导放在同一个页面中。

- 大尺寸实时预览，支持重播、设备切换和减少动态效果模式
- 聚焦关键参数的 Inspector 调节面板
- 从同一份动效规范生成 Prompt、HTML、CSS 和框架无关的 JavaScript
- 包含用途、使用频率、交互规则、评审标准和无障碍指导
- 每个方案和参数状态都有稳定、可分享的 URL

![动效方案工作台——预览、Inspector 与可复制实现](docs/assets/readme-workspace.webp)

## 可以探索什么

| 产品界面 | 可以获得什么 |
| --- | --- |
| [Motion Finder](https://motion-lexicon.pages.dev/zh/finder/) | 根据自然语言需求给出三个可解释的推荐 |
| [动效库](https://motion-lexicon.pages.dev/zh/catalog/) | 12 个动效类别中的 44 张精选可视化工作台 |
| [动效词汇](https://motion-lexicon.pages.dev/zh/vocabulary/) | 91 个中英双语术语、精确定义和近义词区别 |
| [方案工作台](https://motion-lexicon.pages.dev/zh/entrances/slide-in/) | 实时预览、参数、Prompt、可移植代码和评审指导 |
| [版本化数据](https://motion-lexicon.pages.dev/data/v1/catalog.json) | 供工具和 Agent 使用的结构化词典、目录与 Schema |

44 张标准工作台由 31 个可复制组件、9 个专项 Playground 和 4 份实用指南组成。全部 91 个源术语都会进入这套精选体系，让探索范围足够广，也让实现路径保持聚焦。

## 适合谁使用

- **产品创作者**：已经知道想要什么感觉，希望找到准确的动效语言
- **设计师**：需要通过可视化方式比较相近的动画模式
- **开发者**：希望获得具体参数和可移植的实现代码
- **AI Agent**：通过精确 Prompt、结构化数据和明确约束提高实现质量

## 在浏览器、CLI 和 Agent 中使用

网站提供最快的可视化路径。免费 CLI 可以在终端里调用同一套推荐模型：

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 recommend \
  "卡片弹出来要有重量，最后收得住" \
  --locale zh \
  --format json
```

继续完成搜索、查看和实现导出：

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 search \
  "共享元素" --locale zh
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 show spring --locale zh
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 export spring \
  --locale zh --format bundle
```

`recommend` 最多返回三个排序后的候选，包含匹配原因、差异说明、完整预设、预览链接和可分享的比较链接。

安装免费的 Motion Lexicon Agent Skill：

```bash
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon
```

Skill 会引导 Agent 从模糊需求进入候选推荐、视觉比较、参数选择、无障碍检查和实现输出。Agent 也可以直接读取：

- [llms.txt](https://motion-lexicon.pages.dev/llms.txt)
- [llms-full.txt](https://motion-lexicon.pages.dev/llms-full.txt)
- [Catalog JSON](https://motion-lexicon.pages.dev/data/v1/catalog.json)
- [Vocabulary JSON](https://motion-lexicon.pages.dev/data/v1/vocabulary.json)
- [JSON Schema](https://motion-lexicon.pages.dev/data/v1/schema.json)

## 免费、开源、方便迁移

Motion Lexicon 以静态网站运行，完整公共产品永久免费。浏览器体验、CLI、Agent Skill、目录数据和生成结果都可以轻松进入不同团队与工具。

- 源代码：[MIT](./LICENSE)
- 项目原创内容与数据：[CC BY 4.0](./CONTENT-LICENSE)
- 生成的代码片段：[0BSD](./CONTENT-LICENSE)

## 当前版本

**v0.2.0 已上线。** 当前版本包含双语 Finder、44 张标准工作台、全部 91
个源术语、CLI、Agent Skill、版本化机器可读数据、本地化 SEO，以及 120
条预渲染标准路由。

- Finder 比较状态和动效方案的非默认参数保存在 URL 中，随时可以分享。
- 预览、参数、Prompt、可移植代码和减少动态效果输出来自同一份语义化动效规范。
- 浅色与深色主题、键盘与指针交互、减少动态效果和响应式工作台已经覆盖公共体验。

<!-- markdownlint-disable MD013 MD033 -->

<details>
<summary><strong>面向贡献者的工程参考</strong></summary>

### 核心路由

所有公共产品路由都提供英文版（`/en/`）和中文版（`/zh/`）。

| 路由形式 | 用途 |
| --- | --- |
| `/:locale/` | 产品首页 |
| `/:locale/finder/` | 自然语言动效推荐与比较 |
| `/:locale/catalog/` | 包含 44 张工作台的完整动效库 |
| `/:locale/vocabulary/` | 包含 91 个术语的完整词汇表 |
| `/:locale/:category/` | 动效类别发现页 |
| `/:locale/:category/:recipe/` | 标准动效方案工作台 |
| `/data/v1/*.json` | 版本化目录、词汇与 Schema |

### 构建与静态交付

Motion Lexicon 使用 React、TypeScript、Vite、TanStack Router 和 i18next。生产构建依次执行：

```text
tsc -b
→ vite build
→ tsx --tsconfig tsconfig.app.json scripts/prerender.ts
```

预渲染步骤从 `src/data/site.ts` 枚举标准路由，通过 `src/entry-server.tsx` 完成渲染并注入本地化元数据，最终写入 `dist/<route>/index.html`。同一流程也会生成 `dist/sitemap.xml`、`dist/robots.txt` 和静态重定向规则。

构建流程还会把 favicon、双语社交分享图、Web App Manifest、`404.html` 和静态响应头写入 `dist/`。

最终的 `dist/` 目录包含静态 HTML、CSS、JavaScript、图片和数据，可以部署到 Cloudflare Pages、Vercel 静态托管、Netlify 或任意使用 CDN 的文件服务器。React 服务端渲染只在构建阶段运行，生产环境无需 Node 服务器。

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

**[描述一个动效](https://motion-lexicon.pages.dev/zh/finder/)** ·
**[浏览全部方案](https://motion-lexicon.pages.dev/zh/catalog/)** ·
**[Read the English README](./README.md)**
