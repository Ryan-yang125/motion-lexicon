已完成可运行的项目总览页，新建成功后会将项目置顶并显示“已创建”标记与无障碍提示。

改动包括：[页面逻辑](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r2/work/src/pages/HomePage.tsx)、[样式](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r2/work/src/styles.css)、[可转发焦点的 Button](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r2/work/src/components/ui/Button.tsx)、[浏览器测试](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r2/work/tests/smoke.spec.ts)、[页面元信息](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r2/work/index.html)。

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1 + TypeScript + Vite — `package.json` |
| Route | `/` 渲染 `HomePage` — `src/router.tsx` |
| Component system | 复用共享 `Button` — `src/components/ui/Button.tsx` |
| Tokens / theme | CSS 变量与 `.dark` 主题 — `src/styles.css` |
| Tailwind | Tailwind 4 由 Vite 编译 — `package.json`, `vite.config.ts` |
| Dependencies | 未新增依赖；Registry 组件未安装 — `package.json` |

## Page Plan

Job: 快速判断健康度、处理风险并新建项目。  
Archetype: dashboard / operations surface  
Primary action: 新建项目  
Primary state: idle → pending → success / validation error / cancelled

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Top bar | 页面定位、主题和主操作 | `none` | 创建状态原位反馈 |
| Health summary | 汇总健康度 | `none` | 静态可扫读 |
| Project list | 展示项目和创建结果 | `none` | 新记录淡入并标记 |
| Risk queue | 展示风险 | `none` | 静态优先级记录 |
| Recent activity | 提供近期上下文 | `none` | 静态时间线 |
| Live notice | 宣布状态变化 | `none` | pending/success/cancelled |

Registry: none。  
Responsive: 320/390 单列；768 两列信息区；1440 内容网格。  
Theme: light/dark；减弱动态下保留状态和焦点、移除位移动画。

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build`，退出 0 |
| Browser tests | `npm run test:browser`，2/2 通过 |
| 320 | 文档宽 320；最小目标 44×44；offenders 0 |
| 390 | 文档宽 390；最小目标 44×44；offenders 0 |
| 768 | 文档宽 768；最小目标 44×44；offenders 0 |
| 1440 | 文档宽 1440；最小目标 44×44；offenders 0 |
| Light / dark | 主题按钮切换，`color-scheme` 实测为 light / dark |
| Keyboard / focus | Enter 打开并聚焦项目名输入；成功和 Esc 取消后均回到“新建项目” |
| Reduced motion | 模拟 `prefers-reduced-motion`，创建面板动画时长为 `0.01ms` |
| Primary state | 空名称显示校验；创建中可见；Esc 可取消；成功后列表顶部出现“已创建” |
| Runtime | 浏览器 console、page error 均为 0 |