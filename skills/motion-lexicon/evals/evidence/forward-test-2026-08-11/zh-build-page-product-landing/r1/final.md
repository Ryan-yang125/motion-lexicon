已完成 AI 客服产品落地页，包含价值主张、可切换的真实场景演示、价格、FAQ 与注册入口。

改动文件：

- [HomePage.tsx](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-product-landing-r1/work/src/pages/HomePage.tsx)
- [styles.css](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-product-landing-r1/work/src/styles.css)
- [SegmentedControl.tsx](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-product-landing-r1/work/src/components/motion/SegmentedControl.tsx)
- [Accordion.tsx](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-product-landing-r1/work/src/components/motion/Accordion.tsx)
- [smoke.spec.ts](/private/tmp/ml-v420-recorded-pr6ha4/zh-build-page-product-landing-r1/work/tests/smoke.spec.ts)

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1 + TypeScript 5.9.3 — `package.json` |
| Route | `/` renders `HomePage` — `src/router.tsx` |
| Component system | 现有 Button 基础组件 — `src/components/ui/Button.tsx` |
| Tokens / theme | CSS 变量 + `.dark` 根类 — `src/styles.css` |
| Tailwind | 已安装并由 Vite 编译 — `package.json`、`vite.config.ts` |
| Dependencies | 使用 `motion` 12.23.24 — `package.json` |

## Page Plan

Job: 让客户体验团队理解产品价值并注册试用。  
Archetype: 产品落地页。  
Primary action: 创建免费工作区。  
Primary state: 场景演示 `idle → 切换中 → 新场景已呈现`；注册 `idle → pending → success/error`。

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Header | 导航、主题、注册入口 | `none` | 即时主题切换 |
| Hero | 价值主张与 CTA | `none` | 按压反馈 |
| 场景演示 | 售前、订单、异常处理 | `segmented-control` | 共享底座平移、内容平稳交叉淡入 |
| 能力证明 | 知识、操作、人工协同 | `none` | 静态层级 |
| 价格 | 方案比较 | `none` | CTA 反馈 |
| FAQ | 消除疑问 | `accordion` | 连续开合 |
| 注册入口 | 获取试用 | `none` | error / pending / success 原位反馈 |

Registry:

- `segmented-control` — `https://motion-lexicon.pages.dev/r/segmented-control.json` — `src/components/motion/SegmentedControl.tsx` — dependencies: `motion`
- `accordion` — `https://motion-lexicon.pages.dev/r/accordion.json` — `src/components/motion/Accordion.tsx` — dependencies: `motion`

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` 通过 |
| 320 | viewport/document `320/320`；最小目标 `44×44`；offenders `0` |
| 390 | viewport/document `390/390`；最小目标 `44×44`；offenders `0` |
| 768 | viewport/document `768/768`；最小目标 `44×44`；offenders `0` |
| 1440 | viewport/document `1440/1440`；最小目标 `44×44`；offenders `0` |
| Light / dark | 点击主题按钮，`.dark` 正确添加与移除 |
| Keyboard / focus | 场景分段控件聚焦后按 `ArrowRight`，焦点和场景切换至“订单进度” |
| Reduced motion | 模拟 `prefers-reduced-motion: reduce`，异常处理场景仍即时更新且内容可见 |
| Primary state | 场景连续切换；注册验证 error、pending、success 均已验证 |
| Runtime | 浏览器测试中 console/page error 为 `0` |

验证命令：

```bash
npm run build
ML_EVAL_PORT=4456 npm run test:browser
```

结果：6/6 Playwright 测试通过。