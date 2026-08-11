已完成可运行的项目总览页：健康度、待处理风险、最近活动、项目列表与“新建项目”主操作均已接入。创建成功后，新项目会置顶并显示“刚创建”标记，同时提供 aria-live 提示。

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1 + TypeScript + Vite 7.1.7 — `package.json` |
| Route | 根路径 `/` 渲染 `HomePage` — `src/router.tsx` |
| Component system | 复用并增强原生 `Button`（现支持 ref）— `src/components/ui/Button.tsx` |
| Tokens / theme | CSS 变量与 `:root.dark` 主题切换 — `src/styles.css` |
| Tailwind | Tailwind Vite 插件与样式入口已配置 — `vite.config.ts`, `src/styles.css` |
| Dependencies | 使用已安装的 `motion` 12.23.24 — `package.json` |

## Page Plan

Job: 帮助负责人判断项目组合状态、处理风险并创建项目。  
Archetype: Dashboard / operations surface。  
Primary action: 新建项目。  
Primary state: idle → pending → success/error。

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| 顶栏 | 页面定位、主题与新建入口 | `none` | 紧凑响应式布局 |
| 健康度 | 呈现评分、趋势与项目分布 | `none` | 静态摘要 |
| 项目列表 | 展示项目状态并承接新记录 | `none` | 新记录原位进入 |
| 待处理风险 | 聚焦需要行动的事项 | `none` | 静态优先级 |
| 最近活动 | 保留协作上下文 | `none` | 静态时间线 |
| 新建项目对话框 | 创建、等待、失败和成功确认 | `loading-button` | idle → pending → success/error |

Registry:

- `loading-button` — https://motion-lexicon.pages.dev/r/loading-button.json — [loading-button.tsx](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r3/work/src/components/motion-lexicon/loading-button.tsx) — dependencies: `motion`

Responsive: 320/390 单列；768 起平衡工作区；1440 双栏项目工作台。  
Theme: 支持亮/暗主题；reduced motion 保留反馈与焦点，动画降为静态交接。

改动文件：

- [HomePage.tsx](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r3/work/src/pages/HomePage.tsx)
- [styles.css](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r3/work/src/styles.css)
- [Button.tsx](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r3/work/src/components/ui/Button.tsx)
- [smoke.spec.ts](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r3/work/tests/smoke.spec.ts)
- [index.html](/private/tmp/ml-v420-rerun-qwcVrD/zh-build-page-project-dashboard-r3/work/index.html)

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build`，退出成功 |
| 320 | viewport/document 320/320；最小目标 44×44；0 offenders |
| 390 | viewport/document 390/390；最小目标 44×44；0 offenders |
| 768 | viewport/document 768/768；最小目标 44×44；0 offenders |
| 1440 | viewport/document 1440/1440；最小目标 44×44；0 offenders |
| Light / dark | 点击主题按钮后 `:root.dark` 生效 |
| Keyboard / focus | 聚焦“新建项目”后 Enter，焦点进入 `#project-name`；Escape 后返回“+ 新建项目” |
| Reduced motion | 模拟 `prefers-reduced-motion: reduce`，对话框动画时长为 `0.001s` |
| Targets | 所有可见交互节点最小 44×44 |
| Primary state | 同名项目显示错误并可重试；成功创建“北极星计划”后列表显示“刚创建” |
| Runtime | 浏览器 console 错误数 0 |
| Tests | `npm run test:browser`：2/2 通过 |