已完成 AI 客服产品落地页，包含价值主张、真实客服场景演示、价格方案、FAQ 和注册入口。核心场景切换使用方向感知的平稳内容交接，并支持键盘操作与减少动态偏好。

修改文件：[HomePage.tsx](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-product-landing-r2/work/src/pages/HomePage.tsx)、[styles.css](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-product-landing-r2/work/src/styles.css)、[smoke.spec.ts](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-product-landing-r2/work/tests/smoke.spec.ts)、[index.html](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-product-landing-r2/work/index.html)。

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1 + TypeScript — `package.json` |
| Route | `/` → `HomePage` — `src/router.tsx` |
| Component system | `Button` — `src/components/ui/Button.tsx` |
| Tokens / theme | CSS variables + `.dark` — `src/styles.css` |
| Tailwind | Vite Tailwind plugin — `package.json`, `vite.config.ts` |
| Dependencies | `motion` 12.23.24 — `package.json` |

## Page Plan

Job: 让评估 AI 客服的负责人理解价值并创建工作区。  
Archetype: Product landing。  
Primary action: 免费创建工作区。  
Primary state: 场景 idle → switching → updated；注册 idle → pending → success/error。

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Header | 导航、主题与注册入口 | `none` | 主题切换 |
| Hero | 价值主张与行动 | `none` | 克制进入 |
| Live demo | 工单场景证明 | `none` | 可中断、方向感知切换 |
| Proof / Pricing | 价值与方案 | `none` | 静态层级 |
| FAQ / Signup | 消除疑问并注册 | `none` | 原生折叠、表单反馈 |

Registry: none（为保证演示工作台中的工单、分析和交接信息作为同一状态连续更新，采用页面专用语义 UI）。

## 验证结果

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` 通过 |
| 320 | 文档宽度 320；最小目标 44×44；0 offenders |
| 390 | 文档宽度 390；最小目标 44×44；0 offenders |
| 768 | 文档宽度 768；最小目标 44×44；0 offenders |
| 1440 | 文档宽度 1440；最小目标 44×44；0 offenders |
| Light / dark | 点击主题按钮，`html.dark` 正确切换 |
| Keyboard / focus | 场景 Tab 聚焦后按 `ArrowRight`，焦点与内容均切至下一场景 |
| Reduced motion | 模拟 `prefers-reduced-motion: reduce` 后，场景内容正常更新且 CSS 移除位移动画 |
| Primary state | 已验证快速连续场景切换、表单错误→重试→pending→success |
| Runtime | Playwright 记录 page / console / 请求错误均为 0 |
| Browser test | `npm run test:browser`：1 passed |