<!-- markdownlint-disable MD013 MD033 MD041 -->

<p align="center">
  <img src="public/brand/motion-lexicon-mark.svg" width="80" height="80" alt="Motion Lexicon" />
</p>

<h1 align="center">Motion Lexicon</h1>

<p align="center">
  <strong>为有记忆点的产品准备、可直接复制的 React 动效组件。</strong><br />
  100 个组件 · 10 个页面 Block · 实时预览 · shadcn Registry · 减弱动效。
</p>

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.zh-CN.md"><strong>简体中文</strong></a>
</p>

<p align="center">
  <a href="https://motion-lexicon.pages.dev/zh/"><strong>官网</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/components/"><strong>组件</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/blocks/"><strong>页面 Block</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/primitives/"><strong>原子动效</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/skill/"><strong>Motion Lexicon Skill</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/zh/guides/"><strong>场景指南</strong></a>
</p>

<p align="center">
  <a href="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml"><img src="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-292929.svg" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/components-100-292929.svg" alt="100 components" />
  <img src="https://img.shields.io/badge/page_blocks-10-111111.svg" alt="10 page blocks" />
  <img src="https://img.shields.io/badge/primitives-44-737373.svg" alt="44 primitives" />
</p>

<!-- markdownlint-enable MD013 MD033 MD041 -->

## 从组件开始

Motion Lexicon 是一个面向产品交互的 React 组件库。每个组件都有清晰的静态首帧、
可辨识的动效签名、真实内容和可安装的交付路径。组件是发现入口；页面 Block、原子动效
和 Skill 在同一系统上延展。

| 内容 | 适合场景 | 交付 |
| --- | --- | --- |
| [组件](https://motion-lexicon.pages.dev/zh/components/) | 一个完整的产品交互 | 实时预览、源码、类型化 API 与 shadcn Registry 安装 |
| [页面 Block](https://motion-lexicon.pages.dev/zh/blocks/) | 由组件组合而成的一张响应式产品页面 | 独立 React 页面、视口预览、源码与 Registry 安装 |
| [原子动效](https://motion-lexicon.pages.dev/zh/primitives/) | 一条可复用的动效规则或节奏决策 | 覆盖 91 个源术语的 44 个规范工作台 |
| [Motion Lexicon Skill](https://motion-lexicon.pages.dev/zh/skill/) | 基于产品任务完成组件编排和实现 | 组件选择、页面计划、实现与审查工作流 |

100 个组件覆盖 11 个分类：Agent UI、操作、浮层与界面、表单与输入、导航、数据与商业、
反馈、卡片与媒体、视觉与环境、主视觉与叙事、文字与排版。

## 三种场景

- **Product Mono**：精确呈现产品状态、数据、表单、导航与反馈。
- **Editorial Warm**：用图像叙事、材质细节、舒展排版和文化气质建立记忆点。
- **Spatial Dark**：用立体产品世界、技术深度和克制光线组织视觉焦点。

每个场景都从有意设计的静态首帧开始。动效用于解释用户操作或关键状态变化；减弱动效
保留相同的信息和结果。

## 安装

每个组件和页面 Block 都遵循同一条源码链路：

```text
实现源码 → 直接导入 Demo → 预览与代码视图 → /r/:id.json
```

```bash
npx shadcn@latest add https://motion-lexicon.pages.dev/r/cinematic-hero.json
npx shadcn@latest add https://motion-lexicon.pages.dev/r/focus-gallery.json
npx shadcn@latest add https://motion-lexicon.pages.dev/r/onboarding-flow.json
```

也可以在 `components.json` 中配置命名空间：

```json
{
  "registries": {
    "@motion-lexicon": "https://motion-lexicon.pages.dev/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @motion-lexicon/cinematic-hero
```

Registry 条目会声明实际运行时依赖。组件按任务使用 React、Motion、GSAP、Three.js、
WebGL、SVG 与 CSS；重型场景在视口内启动，并在卸载时释放图形资源。

## Motion Lexicon Skill 4.2.0

Skill 与网站包独立发版。它适合为 Agent 提供页面计划、准确的 Registry 组件选择、
实现约束和动效与无障碍审查。

```bash
# 安装到当前项目
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon

# 安装到用户级
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon --global

# 只安装到 Codex；需要时把 codex 替换为其他受支持的 Agent ID
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon --agent codex
```

使用 `npx skills list` 检查项目安装，使用 `npx skills list --global`
检查用户级安装。

## 开发

```text
src/registry/components/       100 个 React 组件实现
src/registry/demos/            直接导入组件的真实产品 Demo
src/registry/blocks/           10 个 React 页面 Block 实现
src/registry/block-demos/      直接导入 Block 的响应式 Demo
src/registry/primitives/       44 个规范原子动效
src/data/                      目录、路由、i18n 与 SEO 源数据
skills/motion-lexicon/         独立版本的 Skill 4.2.0
scripts/                       Registry、预渲染与质量检查
```

项目是静态 React + TypeScript 应用。`npm run build` 会生成网站、本地化预渲染页面、
sitemap、公开目录数据，以及 `/r/` 下兼容 shadcn 的 Registry。

```bash
npm ci
npm run dev
npm run build
```

## 质量门禁

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

## 发布资产

V6 截图、社交图片、机器可读目录输出与公开 Registry JSON 会在目录和视觉审查完成后，
由发布验收阶段重新生成。

## 许可与来源

- 应用与组件代码：[MIT](./LICENSE)
- 项目原创内容：[CC BY 4.0](./CONTENT-LICENSE)
- Interior 衍生交互：[MIT attribution](./NOTICE)

组件集合吸收了 [Interior](https://github.com/ddoemonn/interior) 的交互原则和 MIT 许可实现。
