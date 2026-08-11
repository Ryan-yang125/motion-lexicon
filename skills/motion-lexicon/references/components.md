# Published component catalog

Generated from `src/data/component-registry.ts` for Motion Lexicon 4.1.1.
Use only the 48 published IDs below. Treat any other ID as a candidate, not a published component.

| ID | 名称 / Name | 产品用途 / Product use | Foundations | Runtime |
| --- | --- | --- | --- | --- |
| `copy-button` | 复制按钮 / Copy button | 复制完成后原位切换状态，宽度保持稳定。 / Reports clipboard state in place without shifting nearby content. | `press-tap-feedback`, `text-morph` | motion; light; deps: motion |
| `loading-button` | 加载按钮 / Loading button | 把等待、成功与失败收进同一个操作位置。 / Keeps pending, success, and error feedback inside one action. | `press-tap-feedback`, `crossfade` | motion; light; deps: motion |
| `hold-to-confirm` | 长按确认 / Hold to confirm | 用可取消进度保护高风险操作。 / Protects destructive actions with cancellable hold progress. | `hold-to-confirm`, `line-drawing` | motion; light; deps: motion |
| `long-press` | 长按操作 / Long press | 兼顾触控、指针和键盘的长按手势。 / A long-press gesture that works across touch, pointer, and keyboard. | `hold-to-confirm`, `press-tap-feedback` | motion; light; deps: motion |
| `command-palette` | 命令面板 / Command palette | 搜索、键盘导航与焦点管理完整配合。 / Combines search, keyboard navigation, and deliberate focus management. | `crossfade`, `stagger` | motion; light; deps: motion |
| `context-menu` | 上下文菜单 / Context menu | 从触发坐标展开，并自动避开视口边缘。 / Opens from the trigger coordinate and stays inside the viewport. | `origin-aware-animation`, `scale-in` | motion; light; deps: motion |
| `drawer` | 抽屉 / Drawer | 支持焦点锁定、拖拽关闭与可中断弹簧。 / Includes focus containment, drag dismissal, and interruptible spring motion. | `spring`, `slide-in` | motion; light; deps: motion |
| `dropdown` | 下拉选择 / Dropdown | 选项高亮连续移动，键盘操作完整。 / Moves selection continuously with full keyboard behavior. | `morph`, `scale-in` | motion; light; deps: motion |
| `modal` | 模态框 / Modal | 稳定处理焦点、遮罩、退出与异步确认。 / Handles focus, backdrop, exit, and async confirmation as one flow. | `scale-in`, `crossfade` | motion; light; deps: motion |
| `popover` | 气泡浮层 / Popover | 根据触发点与空间方向确定展开原点。 / Derives its reveal origin from the trigger and available space. | `origin-aware-animation`, `scale-in` | motion; light; deps: motion |
| `expanding-search` | 展开搜索 / Expanding search | 从工具栏动作自然展开为完整搜索框。 / Expands from a toolbar action into a focused search field. | `morph`, `crossfade` | motion; light; deps: motion |
| `floating-label` | 浮动标签输入框 / Floating label | 输入内容时保留字段标签与上下文。 / Keeps the field label and context visible while typing. | `translate`, `crossfade` | motion; light; deps: motion |
| `inline-validation` | 行内校验 / Inline validation | 把等待、错误和通过状态放在输入旁边。 / Places pending, error, and success states next to the input. | `crossfade`, `shake-wiggle` | motion; light; deps: motion |
| `otp-input` | 验证码输入 / OTP input | 输入、粘贴、错误与成功反馈连续发生。 / Coordinates typing, paste, error, and success feedback. | `shake-wiggle`, `crossfade` | motion; light; deps: motion |
| `password-strength` | 密码强度 / Password strength | 规则检查与强度变化保持清晰节奏。 / Makes rule checks and strength changes legible as one response. | `stagger`, `crossfade` | motion; light; deps: motion |
| `slider-detents` | 刻度滑块 / Slider detents | 拖动时吸附语义刻度，并保留连续值。 / Snaps to meaningful detents while preserving continuous input. | `spring`, `drag-to-reorder` | motion; light; deps: motion |
| `tag-input` | 标签输入 / Tag input | 新增、删除和拒绝状态都有明确反馈。 / Gives clear feedback for adding, removing, and rejecting tags. | `scale-in`, `shake-wiggle` | motion; light; deps: motion |
| `accordion` | 折叠面板 / Accordion | 内容高度与开合状态保持连续。 / Keeps content height and disclosure state visually continuous. | `accordion-collapse`, `crossfade` | motion; light; deps: motion |
| `hide-on-scroll` | 滚动隐藏栏 / Hide on scroll | 跟随滚动方向收起与恢复工具栏。 / Hides and restores a toolbar in response to scroll direction. | `scroll-driven-animation`, `slide-in` | motion; light; deps: motion |
| `pagination` | 分页 / Pagination | 页码范围切换时保持当前页位置清楚。 / Keeps the current page legible while the visible range changes. | `morph`, `crossfade` | motion; light; deps: motion |
| `segmented-control` | 分段控制 / Segmented control | 共享高亮在选项之间连续移动。 / Carries one shared highlight between options. | `morph`, `press-tap-feedback` | motion; light; deps: motion |
| `tabs` | 标签页 / Tabs | 指示器、方向与内容切换保持一致。 / Coordinates the indicator, direction, and panel change. | `direction-aware-transition`, `morph` | motion; light; deps: motion |
| `filter-grid` | 筛选网格 / Filter grid | 筛选结果重新排列时维持空间连续性。 / Preserves spatial continuity as filtered results rearrange. | `morph`, `stagger` | motion; light; deps: motion |
| `reorder-list` | 拖拽排序列表 / Reorder list | 指针拖拽与键盘排序共享清晰落点。 / Provides clear drop position for pointer and keyboard reordering. | `drag-to-reorder`, `spring` | motion; light; deps: motion |
| `sortable-table` | 可排序表格 / Sortable table | 排序变化通过行位置表达，数据保持可读。 / Explains sorting through row position while keeping data readable. | `morph`, `crossfade` | motion; light; deps: motion |
| `progress-bar` | 进度条 / Progress bar | 支持等待、确定进度与完成三个阶段。 / Covers pending, determinate, and complete progress states. | `perceived-performance`, `crossfade` | motion; light; deps: motion |
| `task-steps` | 任务步骤 / Task steps | 让排队、执行、完成与失败状态连成一条流程。 / Connects queued, active, complete, and failed states into one flow. | `stagger`, `line-drawing` | motion; light; deps: motion |
| `value-flash` | 数值变化 / Value flash | 用方向与短暂颜色反馈解释数值变化。 / Explains value changes with direction and brief color feedback. | `number-ticker`, `crossfade` | motion; light; deps: motion |
| `magnetic-action` | 磁吸主按钮 / Magnetic action | 指针靠近时按钮轻量迎向触点，离开后自然回正。 / Lets a primary action lean toward a nearby pointer and settle cleanly on release. | `hover-effect`, `spring` | gsap; light; deps: gsap |
| `radial-actions` | 放射快捷操作 / Radial actions | 围绕主操作展开一组方向清楚的快捷入口。 / Fans a compact set of shortcuts around one anchored action. | `origin-aware-animation`, `stagger` | motion; light; deps: motion |
| `theme-reveal` | 主题揭幕 / Theme reveal | 从切换触点扩散新主题，保持页面内容连续。 / Reveals a new theme outward from the exact toggle point. | `page-transition`, `reveal` | css; light; deps: none |
| `mega-menu` | 大型导航菜单 / Mega menu | 高亮、面板和焦点路径共同维持导航上下文。 / Keeps highlight, panel, and focus movement in one continuous navigation path. | `morph`, `origin-aware-animation` | motion; light; deps: motion |
| `floating-dock` | 浮动程序坞 / Floating dock | 图标随指针距离获得克制的弹性放大。 / Scales nearby destinations with restrained spring response to pointer distance. | `spring`, `hover-effect` | motion; light; deps: motion |
| `voice-capture` | 语音输入器 / Voice capture | 录制、声级、暂停和完成在同一输入器中连续切换。 / Coordinates recording, levels, pause, and completion inside one input surface. | `idle-animation`, `morph` | motion; light; deps: motion |
| `toast-stack` | 通知堆栈 / Toast stack | 通知按层级进入、展开，并支持滑动或键盘关闭。 / Layers incoming notices into a stack that expands and dismisses by swipe or keyboard. | `stagger`, `swipe-to-dismiss` | motion; light; deps: motion |
| `upload-queue` | 文件上传队列 / Upload queue | 把文件接收、逐项进度、重试和完成收拢成一个流程。 / Turns file intake, per-item progress, retry, and completion into one compact flow. | `perceived-performance`, `stagger` | motion; light; deps: motion |
| `skeleton-reveal` | 内容成形加载 / Skeleton reveal | 骨架与真实内容共用稳定几何，载入后进行双层交接。 / Shares stable geometry between skeleton and content for a composed handoff. | `skeleton-shimmer`, `crossfade` | motion; light; deps: motion |
| `activity-feed` | 实时动态流 / Activity feed | 新动态插入、日期分组和未读位置保持连续。 / Preserves date groups and the unread boundary as live activity arrives. | `stagger`, `morph` | motion; light; deps: motion |
| `integration-map` | 集成关系图 / Integration map | 节点、连接路径与流动信号共同解释系统关系。 / Explains system relationships through nodes, routed links, and moving signals. | `line-drawing`, `stagger` | motion; medium; deps: motion |
| `cursor-lens` | 局部对比镜 / Cursor lens | 通过可移动镜片局部比较同一媒体的两个状态。 / Compares two states of the same media through a movable detail lens. | `before-after-slider`, `spring` | motion; light; deps: motion |
| `media-carousel` | 惯性媒体轮播 / Media carousel | 媒体卡片保留原生拖动惯性、吸附位置与键盘导航。 / Keeps native drag inertia, deliberate snap positions, and keyboard navigation across media cards. | `drag-to-reorder`, `parallax` | motion; light; deps: motion |
| `image-lightbox` | 连续画廊灯箱 / Gallery lightbox | 缩略图连续扩展为沉浸画面，并完整管理焦点与键盘浏览。 / Expands a thumbnail into an immersive gallery while managing focus and keyboard browsing. | `morph`, `scale-in` | motion; medium; deps: motion |
| `scroll-story` | 滚动产品叙事 / Scroll story | 将章节进度绑定到局部滚动，逐步改写产品画面。 / Binds local scroll progress to chapters that progressively reshape a product scene. | `scroll-driven-animation`, `stagger` | gsap; medium; deps: gsap |
| `procedural-product-viewer` | 三维产品查看器 / 3D product viewer | 程序化三维产品支持拖拽观察、惯性和回正。 / Presents a procedural 3D product with drag inspection, inertia, and recentering. | `3d-tilt-flip`, `spring` | motion, three; heavy; deps: motion, three |
| `dither-reveal-card` | 抖动显影卡 / Dither reveal card | 像素抖动阈值随交互推进，让图像以材质感逐步显现。 / Advances a pixel-dither threshold so imagery develops with a tactile texture. | `reveal`, `hover-effect` | motion, webgl; heavy; deps: motion |
| `network-globe` | 交互网络地球 / Network globe | 三维地球用节点、弧线和焦点切换展示全球连接。 / Maps global connections across a 3D globe with nodes, arcs, and selectable focus. | `orbit`, `line-drawing` | motion, three; heavy; deps: motion, three |
| `kinetic-logo-exchange` | 动态品牌墙 / Kinetic logo exchange | 品牌标记在队列中换位、显影并自动停在当前选择。 / Reorders and reveals brand marks in a kinetic queue that yields to user selection. | `morph`, `blur` | motion; light; deps: motion |
| `spotlight-bento` | 联动聚光矩阵 / Spotlight bento | 一个连续光场跨越多张卡片，强化矩阵之间的整体关系。 / Carries one continuous spotlight across multiple tiles to unify the bento surface. | `hover-effect`, `compositing` | motion; medium; deps: motion |

## Selection rules

1. Match the user-visible product event to the product-use column.
2. Prefer one component whose published behavior already covers the full event.
3. Use Foundations to explain or tune the component's motion language.
4. State the exact published ID and installation URL: `https://motion-lexicon.pages.dev/r/<id>.json`.
5. If no row fits, recommend primitives or mark a new contribution as `candidate`.
