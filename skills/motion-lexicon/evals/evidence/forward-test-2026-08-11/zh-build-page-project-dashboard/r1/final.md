项目总览页已完成并接入根路由。点击“新建项目”后会显示创建状态、新项目置顶、展示“刚刚创建”标签，并写入最近活动。

变更文件：

- [HomePage.tsx](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-project-dashboard-r1/work/src/pages/HomePage.tsx)
- [styles.css](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-project-dashboard-r1/work/src/styles.css)
- [loading-button.tsx](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-project-dashboard-r1/work/src/components/motion-lexicon/loading-button.tsx)
- [activity-feed.tsx](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-project-dashboard-r1/work/src/components/motion-lexicon/activity-feed.tsx)
- [smoke.spec.ts](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-project-dashboard-r1/work/tests/smoke.spec.ts)

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19 + Vite + TypeScript — `package.json` |
| Route | `/` → `HomePage` — `src/router.tsx` |
| Component system | 原生 `Button` — `src/components/ui/Button.tsx` |
| Tokens / theme | CSS 变量与 `:root.dark` — `src/styles.css` |
| Tailwind | Vite 插件已启用 — `vite.config.ts` |
| Dependencies | 复用 `motion`，未新增依赖 — `package.json` |

## Page Plan

Job: 让负责人快速掌握项目组合状态并创建项目。  
Archetype: Dashboard。  
Primary action: 新建项目。  
Primary state: idle → pending → success/error。

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| 顶部栏 | 主操作与主题控制 | `loading-button` | 创建中 / 已创建 / 重试 |
| 健康度 | 项目组合状态 | `none` | 稳定指标 |
| 待处理风险 | 风险优先级 | `none` | 可读风险清单 |
| 项目列表 | 新项目反馈 | `none` | 顶部插入与成功标签 |
| 最近活动 | 动态记录 | `activity-feed` | 新活动插入 |

Registry:

- `loading-button` — https://motion-lexicon.pages.dev/r/loading-button.json — `src/components/motion-lexicon/loading-button.tsx` — dependencies: `motion`
- `activity-feed` — https://motion-lexicon.pages.dev/r/activity-feed.json — `src/components/motion-lexicon/activity-feed.tsx` — dependencies: `motion`

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` 通过 |
| 320 | 文档宽度 320；最小目标 44×44；0 个违规项 |
| 390 | 文档宽度 390；最小目标 44×44；0 个违规项 |
| 768 | 文档宽度 768；最小目标 44×44；0 个违规项 |
| 1440 | 文档宽度 1440；最小目标 44×44；0 个违规项 |
| Light / dark | 点击主题按钮后 `html.dark` 生效 |
| Keyboard / focus | 聚焦“新建项目”后按 Enter，成功创建并保留反馈 |
| Reduced motion | 模拟 reduced motion 后创建反馈正常，无位移动画依赖 |
| Primary state | 验证 pending、success、项目置顶、活动插入 |
| Runtime | 控制台、页面与请求错误均为 0 |
| Browser tests | `ML_EVAL_PORT=4177 npm run test:browser`：3 项通过 |