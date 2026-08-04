<!-- markdownlint-disable MD013 MD033 MD041 -->

<p align="center">
  <img src="public/brand/motion-lexicon-mark.svg" width="88" height="88" alt="Motion Lexicon 标志" />
</p>

<h1 align="center">Motion Lexicon</h1>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-CN.md"><strong>简体中文</strong></a>
</p>

<p align="center"><strong>产品瞬间、动效基础，以及服务 AI 创作的 Motion Director。</strong></p>

<p align="center">
  面向产品创作者、设计师、开发者和 AI Agent 的免费开源产品动效系统。<br />
  <strong>28 个产品瞬间 · 44 个动效基础 · 一套共同的 Motion Grammar</strong>
</p>

<p align="center">
  <a href="https://motion-lexicon.pages.dev/zh/packs/"><strong>浏览产品瞬间</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/catalog/"><strong>浏览动效基础</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/guides/"><strong>阅读场景指南</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/director/"><strong>认识 Motion Director</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/"><strong>访问网站</strong></a>
</p>

<p align="center">
  <a href="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml"><img src="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-black.svg" alt="代码许可证：MIT" /></a>
  <a href="./CONTENT-LICENSE"><img src="https://img.shields.io/badge/content-CC_BY_4.0-0A84FF.svg" alt="内容许可证：CC BY 4.0" /></a>
</p>

<!-- markdownlint-enable MD013 MD033 MD041 -->

![Motion Lexicon——在真实产品上下文中看动效](docs/assets/readme-v1-home.webp)

## 三个产品表面，一套 Motion Grammar

Motion Lexicon 让浏览和创作共享同一套产品动效语言。网站与 Motion
Director 是平级的产品表面，都基于同一份 Motion Grammar，因此一端做出的
动效决策可以直接延续到另一端。

| 产品表面 | 适合从这里开始 | 你会得到 |
| --- | --- | --- |
| [产品瞬间](https://motion-lexicon.pages.dev/zh/packs/) | 你面对保存、发布、邀请、筛选、审批等明确产品状态 | 完整可交互场景，以及 Prompt、HTML、CSS、JavaScript 和减弱动效说明 |
| [动效基础](https://motion-lexicon.pages.dev/zh/catalog/) | 你需要准确的入场、转场、编排、曲线或交互行为 | 可实时预览和调节的工作台、精确术语、可移植实现 |
| [Motion Director](https://motion-lexicon.pages.dev/zh/director/) | 你正在 AI 协作的设计或开发流程中推进工作 | 贴合上下文的推荐、组合、实现、评审或贡献蓝图 |

网站中的两个目录拥有同等位置：**28 个产品瞬间**展示完整的产品交互，**44
个动效基础**呈现其中的精确行为。双语词汇库保留全部 **91 个术语**，服务
检索、学习和实现讨论。

## 从一个真实产品状态开始

每个产品瞬间都是完整、熟悉的小交互：它包含上下文、触发、状态推进、结果、
可移植实现和减弱动效处理。你可以在浏览器中触发交互、观察状态变化，再复制
适合当前技术栈的内容。

![Motion Pack 详情——在场景中预览保存确认](docs/assets/readme-v1-pack.webp)

当前 Pack 覆盖四类常见产品任务：

| 分组 | 产品瞬间 |
| --- | --- |
| 完成反馈 | 保存确认、发布版本、复制分享链接、行内校验、文件上传完成、同步恢复、删除确认 |
| 选择决策 | 卡片选择、工作区切换、模板选择、命令菜单、负责人选择、权限变更、搜索建议 |
| 内容变化 | 图层插入、归档撤销、筛选结果、详情展开、看板移动、购物车更新、评论回复 |
| 工作流 | 通知处理、进度步骤、成员邀请、媒体拖动、审批请求、支付结账、定时发布 |

## 围绕产品决策的场景指南

[场景指南](https://motion-lexicon.pages.dev/zh/guides/) 从真实产品问题开始：保存反馈、
列表连续性、CSS 动效卡顿、Spring 与 Ease-out、减弱动效、高后果操作、动效需求转规格，
以及 Pack 与动效基础的选择。每篇指南都连接相关的产品瞬间和动效基础，让一次判断可以
继续走到预览与实现。

## Motion Director Agent Skill

在兼容 Agent Skills 的运行环境中安装 Motion Director：

```bash
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon
```

Motion Director 会把产品描述整理成简洁的 **Motion Blueprint**。它读取项目
上下文、尊重已有视觉语言，并让每个动效对应一个有意义的状态变化。

| 模式 | 交付结果 |
| --- | --- |
| 推荐 | 少量可比较的动效方向，以及每个方向贴合当前状态的理由 |
| 组合 | 由多个基础动效协调组成的完整产品瞬间 |
| 实现 | 与所选蓝图对齐的 HTML、CSS、JavaScript 或 React 实现建议 |
| 评审 | 时长、层级、打断、可访问性与感知质量的清晰结论 |
| 贡献 | 可以进入 Motion Lexicon 内容流程的结构化候选内容 |

每份蓝图会记录意图、状态图、视觉角色、动效节拍、可访问性方案、交付格式和
来源。这让推理可检查，也给网站积累新的高质量案例。

## 一套安静、高质量的动效设计语言

Motion Grammar 把产品状态作为主要视觉材料。它吸收
[Interior](https://github.com/ddoemonn/interior) 的交互原则：分层材质、为
状态变化预留空间、事件驱动反馈、短促入场、清晰离场、完整键盘行为，以及保留
结果的减弱动效。

- 入场通常使用 `cubic-bezier(0.23, 1, 0.32, 1)`，在 200–280ms 内落定。
- 离场通常使用 `cubic-bezier(0.4, 0, 1, 1)`，在 110–180ms 内完成。
- 可见位移优先使用 `transform` 与 `opacity`，布局保持稳定。
- 一个主要视觉角色承载状态变化，最多配合两个辅助角色。
- 减弱动效路径保留状态、层级、焦点和操作能力。

这些规则服务于真实产品行为。Pack、动效基础、Motion Director 的输出和被
采纳的社区候选内容都沿用同一套 Grammar。

## 从真实需求走向公开案例

```text
产品描述 → Motion Blueprint → 候选内容 → 质量门槛 → 发布为 Pack 或动效基础
```

Motion Director 可以准备包含上下文、状态模型和实现的候选内容。公开发布需要
经过行为、代码有效性、可访问性、减弱动效、性能、移动端布局和双语表达检查，
再进入目录。

这条流程让目录持续贴近真实产品工作，也让贡献者拥有清晰的参与路径。

## 公共数据与 Agent 资源

- [Motion Grammar JSON](https://motion-lexicon.pages.dev/data/v2/motion-grammar.json)
- [Motion Blueprint Schema](https://motion-lexicon.pages.dev/data/v2/motion-blueprint.schema.json)
- [产品瞬间 JSON](https://motion-lexicon.pages.dev/data/v1/packs.json)
- [动效基础 JSON](https://motion-lexicon.pages.dev/data/v1/catalog.json)
- [词汇 JSON](https://motion-lexicon.pages.dev/data/v1/vocabulary.json)
- [场景指南](https://motion-lexicon.pages.dev/zh/guides/)
- [方法与来源](https://motion-lexicon.pages.dev/zh/method/)
- [JSON Schema](https://motion-lexicon.pages.dev/data/v1/schema.json)
- [llms.txt](https://motion-lexicon.pages.dev/llms.txt)
- [llms-full.txt](https://motion-lexicon.pages.dev/llms-full.txt)
- [价格说明](https://motion-lexicon.pages.dev/pricing.txt)

## 免费、开源、可移植

Motion Lexicon 是静态网站，提供免费浏览器体验、免费 Agent Skill 和公开数据。
生成的实现内容保持框架无关，可以进入已有产品；使用过程无需账号和托管运行时。

- 源码：[MIT](./LICENSE)
- 项目原创内容与数据：[CC BY 4.0](./CONTENT-LICENSE)
- 生成的代码片段：[0BSD](./CONTENT-LICENSE)
- 源于 Interior 的交互组件：[MIT 署名](./NOTICE)

## V2.1.0 快照

**V2.1.0 让视觉系统更贴近动效工作本身。** Iconoir 承担通用操作图标，项目自有的
Motion Glyph 用于识别产品瞬间、动效基础、Motion Director 与创作流程。界面以墨色
和中性色为主，蓝色保留给当前选中与键盘焦点。两个目录继续作为平级产品表面，共享
同一套 Motion Grammar。十二个分类 Hub 和八篇场景指南让这套系统能从真实产品问题
直接进入。

<!-- markdownlint-disable MD013 MD033 -->

<details>
<summary><strong>贡献者工程说明</strong></summary>

### 核心路由

每个公共产品路由均提供英文（`/en/`）与中文（`/zh/`）。

| 路由形式 | 用途 |
| --- | --- |
| `/:locale/` | 产品首页，平等进入两个内容目录 |
| `/:locale/packs/` | 全部 28 个产品瞬间 |
| `/:locale/packs/:packId/` | 一个 Pack 的预览、说明与可移植输出 |
| `/:locale/catalog/` | 全部 44 个动效基础 |
| `/:locale/:category/:recipe/` | 一个标准动效基础工作台 |
| `/:locale/finder/` | 跨两个目录的自然语言发现 |
| `/:locale/guides/` | 连接 Pack 与动效基础的八篇场景指南 |
| `/:locale/guides/:guideId/` | 带决策路径和实现关联的静态双语指南 |
| `/:locale/method/` | 内容方法、许可与维护说明 |
| `/:locale/director/` | Motion Director 与共同创作流程 |
| `/:locale/vocabulary/` | 完整双语 91 术语词汇库 |
| `/data/v2/motion-grammar.json` | Motion Director 与公开动效内容的共同数据源 |
| `/data/v2/motion-blueprint.schema.json` | Motion Director 蓝图的可移植契约 |

### 构建与静态交付

Motion Lexicon 使用 React、TypeScript、Vite、TanStack Router 和 i18next。生产
构建按以下顺序运行：

```text
tsc -b
→ vite build
→ tsx --tsconfig tsconfig.app.json scripts/prerender.ts
```

最终的 `dist/` 目录包含 CDN 静态托管所需的 HTML、CSS、JavaScript、图片和数据。

```bash
npm ci
npm run dev
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

### 质量门槛

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

产品意图与实现决策位于 [PRODUCT.md](./PRODUCT.md) 和 [DESIGN.md](./DESIGN.md)。
贡献规范位于 [CONTRIBUTING.md](./CONTRIBUTING.md)，社区行为遵循
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)，安全报告请参阅
[SECURITY.md](./SECURITY.md)。

</details>

<!-- markdownlint-enable MD013 MD033 -->

---

**[浏览产品瞬间](https://motion-lexicon.pages.dev/zh/packs/)** ·
**[浏览动效基础](https://motion-lexicon.pages.dev/zh/catalog/)** ·
**[阅读场景指南](https://motion-lexicon.pages.dev/zh/guides/)** ·
**[认识 Motion Director](https://motion-lexicon.pages.dev/zh/director/)** ·
**[Read English README](./README.md)**
