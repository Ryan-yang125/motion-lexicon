已完成一页完整的 AI 客服产品落地页，包含价值主张、三类真实场景演示、效果数据、价格方案、FAQ、深浅主题及完整注册入口。主交互使用 Motion Lexicon 的方向感标签页切换，支持键盘、快速打断和 reduced motion。

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1 + TypeScript 5.9.3 + Vite 7.1.7 — `package.json` |
| Route | `/` 指向 `HomePage` — `src/router.tsx`, `src/pages/HomePage.tsx` |
| Component system | 原生按钮封装，无其他页面组件库 — `src/components/ui/Button.tsx` |
| Tokens / theme | CSS 变量与 `.dark` 双主题 — `src/styles.css` |
| Tailwind | Tailwind 4.1.14 已由 Vite 插件编译 — `vite.config.ts`, `src/styles.css` |
| Dependencies | 使用现有 React、Motion、Tailwind，无新增运行依赖 — `package.json` |

## Page Plan

Job: 帮助客服负责人理解产品价值、验证真实业务表现并进入免费试用。  
Archetype: Product landing  
Primary action: 使用工作邮箱创建 14 天免费工作区。  
Primary state: 场景选择 → 演示区定向更新；注册 idle → pending → success/error → retry。

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| 顶部导航 | 品牌定位、主题和注册入口 | `none` | 响应式导航与主题切换 |
| 价值主张 | 解释价值并引导行动 | `none` | 稳定层级与按压反馈 |
| 场景演示 | 展示零售、SaaS、物流服务流程 | `tabs` | 指示器 morph、面板定向更新 |
| 结果证据 | 展示解决率、响应速度、上线周期 | `none` | 稳定数据布局 |
| 价格方案 | 支持套餐比较 | `none` | 三档响应式卡片 |
| FAQ | 回答部署、计费和数据问题 | `accordion` | 连续高度展开 |
| 注册入口 | 创建试用工作区 | `loading-button` | pending、success、error、retry |

Registry:

- `tabs` — https://motion-lexicon.pages.dev/r/tabs.json — `src/components/motion-lexicon/tabs.tsx` — dependencies: `motion`
- `accordion` — https://motion-lexicon.pages.dev/r/accordion.json — `src/components/motion-lexicon/accordion.tsx` — dependencies: `motion`
- `loading-button` — https://motion-lexicon.pages.dev/r/loading-button.json — `src/components/motion-lexicon/loading-button.tsx` — dependencies: `motion`

Responsive: 320/390 单列；768 自适应布局；1440 使用 1180px 内容壳。  
Theme: 暖中性色浅色主题、语义一致的深色主题；reduced motion 使用即时状态交接。

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build`，退出码 0；435 modules transformed |
| 320 | viewport/document `320/320`；24 个目标；最小 `44×44px`；0 offenders |
| 390 | viewport/document `390/390`；24 个目标；最小 `44×44px`；0 offenders |
| 768 | viewport/document `768/768`；27 个目标；最小 `44×44px`；0 offenders |
| 1440 | viewport/document `1440/1440`；27 个目标；最小 `44×44px`；0 offenders |
| Light / dark | 点击主题按钮激活 `.dark`；实际背景、文字颜色均发生语义切换 |
| Keyboard / focus | 零售标签聚焦 → `ArrowRight` → SaaS 标签聚焦并选中；快速切换后焦点回到最终标签 |
| Reduced motion | 模拟 `prefers-reduced-motion: reduce`；物流内容即时出现，tabpanel opacity 为 1 |
| Targets | 所有可见链接、按钮、输入框和自定义交互节点均不小于 `44×44px` |
| Primary state | 已验证场景快速打断；注册错误 → 自动复位 → pending → success |
| Runtime | console 0、page error 0、request error 0、hydration error 0 |
| Browser suite | `npm run test:browser`：8/8 passed |

主要文件：

- [HomePage.tsx](/private/tmp/ml-v420-last-Nfc9CK/zh-build-page-product-landing-r3/work/src/pages/HomePage.tsx)
- [styles.css](/private/tmp/ml-v420-last-Nfc9CK/zh-build-page-product-landing-r3/work/src/styles.css)
- [tabs.tsx](/private/tmp/ml-v420-last-Nfc9CK/zh-build-page-product-landing-r3/work/src/components/motion-lexicon/tabs.tsx)
- [accordion.tsx](/private/tmp/ml-v420-last-Nfc9CK/zh-build-page-product-landing-r3/work/src/components/motion-lexicon/accordion.tsx)
- [loading-button.tsx](/private/tmp/ml-v420-last-Nfc9CK/zh-build-page-product-landing-r3/work/src/components/motion-lexicon/loading-button.tsx)
- [smoke.spec.ts](/private/tmp/ml-v420-last-Nfc9CK/zh-build-page-product-landing-r3/work/tests/smoke.spec.ts)
- [index.html](/private/tmp/ml-v420-last-Nfc9CK/zh-build-page-product-landing-r3/work/index.html)

附注：`npm audit --omit=dev` 仍报告项目锁定的 Vite 7.1.7 存在一项高危开发服务器公告；修复需要升级到锁定范围外的 7.3.6，因此未擅自改动工具链。