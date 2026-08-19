# Published component catalog

Generated from `src/data/component-registry.ts` for Motion Lexicon 4.2.0.
Use only the 100 published IDs below. Treat any other ID as a candidate.

| ID | 名称 / Name | 产品用途 / Product use | Foundations | Runtime |
| --- | --- | --- | --- | --- |
| `agent-thinking-trace` | Agent 思考轨迹 / Agent thinking trace | 把推理阶段、当前焦点与耗时组织成一条可展开的证据轨。 / Organizes reasoning phases, current focus, and elapsed time into an expandable evidence trail. | `stagger`, `crossfade` | motion; light; deps: motion |
| `streaming-answer` | 流式回答 / Streaming answer | 让生成文本、引用来源与追问建议在同一回答中逐步到位。 / Brings generated text, cited sources, and follow-up prompts into one progressive answer. | `perceived-performance`, `crossfade` | motion; light; deps: motion |
| `tool-call-stack` | 工具调用堆栈 / Tool call stack | 把搜索、写入、命令和失败状态收拢成可检查的执行记录。 / Collects search, write, command, and failure states into an inspectable execution record. | `accordion-collapse`, `stagger` | motion; light; deps: motion |
| `approval-flow` | 人工审批流程 / Human approval flow | 在 Agent 执行动作前承载推荐项、自定义指令与明确确认。 / Carries recommendations, custom instructions, and explicit confirmation before an agent acts. | `crossfade`, `press-tap-feedback` | motion; light; deps: motion |
| `task-progress` | 任务进度 / Task progress | 在紧凑与展开布局中呈现队列、执行、阻塞、失败、恢复和完成状态。 / Presents queued, active, blocked, failed, recovered, and complete work across compact and expanded layouts. | `stagger`, `perceived-performance` | motion; light; deps: motion |
| `prompt-composer` | Agent 提示词编辑器 / Agent prompt composer | 把来源、附件、模型、语音与发送操作组织成一个清晰输入面。 / Combines sources, attachments, model choice, voice, and sending into one focused input surface. | `origin-aware-animation`, `morph` | motion; light; deps: motion |
| `context-sources` | 上下文来源卡 / Context sources | 展示 Agent 检索到的片段、来源与相关度，并支持局部展开。 / Presents retrieved chunks, provenance, and relevance with focused disclosure. | `accordion-collapse`, `morph` | motion; light; deps: motion |
| `diff-review` | 修改对比评审 / Diff review | 逐项接受或拒绝 Agent 提出的字段修改。 / Reviews agent-proposed field edits with explicit per-change decisions. | `crossfade`, `number-ticker` | motion; light; deps: motion |
| `multi-agent-handoff` | 多 Agent 交接 / Multi-agent handoff | 让任务、产物和下一位负责人沿同一条交接轨连续移动。 / Moves task ownership, artifacts, and the next responsible agent along one continuous relay. | `direction-aware-transition`, `morph` | motion; light; deps: motion |
| `copy-button` | 复制按钮 / Copy button | 复制完成后原位切换状态，宽度保持稳定。 / Reports clipboard state in place without shifting nearby content. | `press-tap-feedback`, `text-morph` | motion; light; deps: motion |
| `loading-button` | 加载按钮 / Loading button | 把等待、成功与失败收进同一个操作位置。 / Keeps pending, success, and error feedback inside one action. | `press-tap-feedback`, `crossfade` | motion; light; deps: motion |
| `hold-action` | 长按操作 / Hold action | 用可取消进度保护触控、指针和键盘触发的高风险操作。 / Protects high-risk actions with cancellable touch, pointer, and keyboard progress. | `hold-to-confirm`, `press-tap-feedback` | motion; light; deps: motion |
| `command-palette` | 命令面板 / Command palette | 搜索、键盘导航与焦点管理完整配合。 / Combines search, keyboard navigation, and deliberate focus management. | `crossfade`, `stagger` | motion; light; deps: motion |
| `context-menu` | 上下文菜单 / Context menu | 从触发坐标展开，并自动避开视口边缘。 / Opens from the trigger coordinate and stays inside the viewport. | `origin-aware-animation`, `scale-in` | motion; light; deps: motion |
| `drawer` | 抽屉 / Drawer | 支持焦点锁定、拖拽关闭与可中断弹簧。 / Includes focus containment, drag dismissal, and interruptible spring motion. | `spring`, `slide-in` | motion; light; deps: motion |
| `dropdown` | 下拉选择 / Dropdown | 选项高亮连续移动，键盘操作完整。 / Moves selection continuously with full keyboard behavior. | `morph`, `scale-in` | motion; light; deps: motion |
| `modal` | 模态框 / Modal | 稳定处理焦点、遮罩、退出与异步确认。 / Handles focus, backdrop, exit, and async confirmation as one flow. | `scale-in`, `crossfade` | motion; light; deps: motion |
| `popover` | 气泡浮层 / Popover | 根据触发点与空间方向确定展开原点。 / Derives its reveal origin from the trigger and available space. | `origin-aware-animation`, `scale-in` | motion; light; deps: motion |
| `expanding-search` | 展开搜索 / Expanding search | 从工具栏动作自然展开为完整搜索框。 / Expands from a toolbar action into a focused search field. | `morph`, `crossfade` | motion; light; deps: motion |
| `inline-validation` | 行内校验 / Inline validation | 把等待、错误和通过状态放在输入旁边。 / Places pending, error, and success states next to the input. | `crossfade`, `shake-wiggle` | motion; light; deps: motion |
| `otp-input` | 验证码输入 / OTP input | 输入、粘贴、错误与成功反馈连续发生。 / Coordinates typing, paste, error, and success feedback. | `shake-wiggle`, `crossfade` | motion; light; deps: motion |
| `password-strength` | 密码强度 / Password strength | 规则检查与强度变化保持清晰节奏。 / Makes rule checks and strength changes legible as one response. | `stagger`, `crossfade` | motion; light; deps: motion |
| `slider-detents` | 刻度滑块 / Slider detents | 拖动时吸附语义刻度，并保留连续值。 / Snaps to meaningful detents while preserving continuous input. | `spring`, `drag-to-reorder` | motion; light; deps: motion |
| `tag-input` | 标签输入 / Tag input | 新增、删除和拒绝状态都有明确反馈。 / Gives clear feedback for adding, removing, and rejecting tags. | `scale-in`, `shake-wiggle` | motion; light; deps: motion |
| `accordion` | 折叠面板 / Accordion | 内容高度与开合状态保持连续。 / Keeps content height and disclosure state visually continuous. | `accordion-collapse`, `crossfade` | motion; light; deps: motion |
| `hide-on-scroll` | 滚动隐藏栏 / Hide on scroll | 跟随滚动方向收起与恢复工具栏。 / Hides and restores a toolbar in response to scroll direction. | `scroll-driven-animation`, `slide-in` | motion; light; deps: motion |
| `segmented-control` | 分段控制 / Segmented control | 共享高亮在选项之间连续移动。 / Carries one shared highlight between options. | `morph`, `press-tap-feedback` | motion; light; deps: motion |
| `tabs` | 标签页 / Tabs | 指示器、方向与内容切换保持一致。 / Coordinates the indicator, direction, and panel change. | `direction-aware-transition`, `morph` | motion; light; deps: motion |
| `filter-grid` | 筛选网格 / Filter grid | 筛选结果重新排列时维持空间连续性。 / Preserves spatial continuity as filtered results rearrange. | `morph`, `stagger` | motion; light; deps: motion |
| `reorder-list` | 拖拽排序列表 / Reorder list | 指针拖拽与键盘排序共享清晰落点。 / Provides clear drop position for pointer and keyboard reordering. | `drag-to-reorder`, `spring` | motion; light; deps: motion |
| `sortable-table` | 可排序表格 / Sortable table | 排序变化通过行位置表达，数据保持可读。 / Explains sorting through row position while keeping data readable. | `morph`, `crossfade` | motion; light; deps: motion |
| `progress-bar` | 进度条 / Progress bar | 支持等待、确定进度与完成三个阶段。 / Covers pending, determinate, and complete progress states. | `perceived-performance`, `crossfade` | motion; light; deps: motion |
| `value-flash` | 数值变化 / Value flash | 用方向与短暂颜色反馈解释数值变化。 / Explains value changes with direction and brief color feedback. | `number-ticker`, `crossfade` | motion; light; deps: motion |
| `magnetic-action` | 磁吸主按钮 / Magnetic action | 指针靠近时按钮轻量迎向触点，离开后自然回正。 / Lets a primary action lean toward a nearby pointer and settle cleanly on release. | `hover-effect`, `spring` | gsap; light; deps: gsap |
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
| `scroll-media-expansion` | 滚动媒体扩展 / Scroll media expansion | 让受限媒体卡在章节滚动中扩展为沉浸式主视觉。 / Expands contained media into an immersive hero through chapter scrolling. | `scroll-driven-animation`, `scale-in` | motion; medium; deps: motion |
| `device-scroll-reveal` | 设备滚动展示 / Device scroll reveal | 在设备框内同步推进产品屏幕、章节文案和产品状态。 / Advances product screens, chapter copy, and product state inside a device frame. | `scroll-driven-animation`, `crossfade` | motion; medium; deps: motion |
| `cinematic-hero` | 电影式主视觉 / Cinematic hero | 用图像、排版和行动按钮建立有节奏的品牌开场。 / Uses image, typography, and action to establish a paced brand opening. | `scale-in`, `reveal` | motion; medium; deps: motion |
| `shader-hero` | 着色器主视觉 / Shader hero | 以低功耗 WebGL 场域让指针在主视觉周围塑造氛围。 / Uses a low-power WebGL field that reshapes around pointer intent. | `hover-effect`, `idle-animation` | motion, webgl; heavy; deps: motion |
| `split-screen-reveal` | 分屏揭示 / Split screen reveal | 用可拖动边界连接两个产品状态或叙事视角。 / Connects two product states or story perspectives with a draggable boundary. | `before-after-slider`, `reveal` | motion; light; deps: motion |
| `screenshot-stack` | 截图层叠 / Screenshot stack | 用前后层次呈现多个产品界面，并维持当前焦点。 / Presents multiple product surfaces in depth while retaining the active focus. | `morph`, `scale-in` | motion; medium; deps: motion |
| `terminal-hero` | 终端主视觉 / Terminal hero | 通过可逐步执行的命令展示开发者工作流和结果。 / Demonstrates a developer workflow and result through progressive commands. | `typewriter`, `perceived-performance` | motion; light; deps: motion |
| `product-orbit-hero` | 产品轨道主视觉 / Product orbit hero | 围绕中心产品对象布置能力，并让焦点与文案同步。 / Arranges capabilities around a central product object with synchronized focus copy. | `orbit`, `spring` | motion; medium; deps: motion |
| `expandable-card` | 展开卡片 / Expandable card | 让紧凑故事卡在原位展开为完整阅读表面。 / Expands a compact story card in place into a full reading surface. | `morph`, `scale-in` | motion; medium; deps: motion |
| `focus-gallery` | 焦点画廊 / Focus gallery | 让一张图片获得焦点，周围媒体同步退让。 / Lets one image gain focus while neighboring media yields. | `morph`, `parallax` | motion; medium; deps: motion |
| `card-stack` | 卡片堆栈 / Card stack | 在紧凑空间中逐张浏览叠放的记录或故事。 / Browses stacked records or stories in a compact space. | `swipe-to-dismiss`, `spring` | motion; medium; deps: motion |
| `animated-testimonials` | 动态客户证言 / Animated testimonials | 让人物、引语、归属和进度作为一个连续证据单元切换。 / Transitions portrait, quote, attribution, and progress as one evidence unit. | `crossfade`, `stagger` | motion; medium; deps: motion |
| `coverflow-gallery` | 封面流画廊 / Coverflow gallery | 以深度、吸附和键盘浏览呈现媒体序列。 / Browses media with depth, snapping, and keyboard control. | `parallax`, `spring` | motion; medium; deps: motion |
| `image-trail` | 图像轨迹 / Image trail | 沿指针或拖动路径生成并自动回收克制的图像碎片。 / Generates and retires restrained image fragments along pointer or drag paths. | `hover-effect`, `stagger` | motion; medium; deps: motion |
| `pixelated-image` | 像素图像 / Pixelated image | 把图像分辨率作为可控的显影和切换材质。 / Uses image resolution as a controllable reveal and transition material. | `reveal`, `crossfade` | motion; medium; deps: motion |
| `chromatic-image` | 色差图像 / Chromatic image | 在聚焦时为编辑图片增加可控的色彩通道位移。 / Adds controlled color-channel displacement to editorial media on focus. | `hover-effect`, `blur` | motion; medium; deps: motion |
| `code-comparison` | 代码对比 / Code comparison | 把实现差异与渲染结果绑定在一个可切换的比较面。 / Binds implementation differences and rendered output inside one switchable comparison surface. | `crossfade`, `morph` | motion; medium; deps: motion |
| `before-after-comparison` | 前后对比 / Before and after comparison | 用稳定边界比较两张完整图像状态。 / Compares two complete image states through a stable boundary. | `before-after-slider`, `spring` | motion; light; deps: motion |
| `split-text-reveal` | 分段文字揭示 / Split text reveal | 按词或字符揭示标题，并在静止状态保持完整可读。 / Reveals a heading by word or character while retaining complete static legibility. | `reveal`, `stagger` | motion; light; deps: motion |
| `text-scramble` | 文字扰动 / Text scramble | 让技术标签与状态通过字符替换快速落定。 / Transitions technical labels and status through quick character substitution. | `typewriter`, `text-morph` | motion; light; deps: motion |
| `text-morph` | 文字变形 / Text morph | 在固定阅读节奏内切换相关短语，保持宽度稳定。 / Moves between related phrases within a fixed reading rhythm and stable width. | `text-morph`, `crossfade` | motion; light; deps: motion |
| `text-loop` | 文字循环 / Text loop | 在紧凑徽标或行内空间中循环可操作的短消息。 / Cycles compact, operable messages inside a badge or inline space. | `loop`, `slide-in` | motion; light; deps: motion |
| `scroll-velocity` | 滚动速度文字 / Scroll velocity | 让背景排版随页面速度短暂响应，停下时回到可读状态。 / Lets background typography respond briefly to page velocity and settle readable at rest. | `scroll-driven-animation`, `spring` | motion; light; deps: motion |
| `kinetic-heading` | 动态标题 / Kinetic heading | 用指针或键盘改变展示标题的字距、权重和张力。 / Changes display-heading spacing, weight, and tension through pointer or keyboard input. | `hover-effect`, `spring` | motion; light; deps: motion |
| `dynamic-toolbar` | 动态工具栏 / Dynamic toolbar | 围绕当前任务展开紧凑操作，并在收起时保留主入口。 / Expands compact actions around the current task while retaining a clear primary entry. | `morph`, `press-tap-feedback` | motion; light; deps: motion |
| `resizable-sidebar` | 可调整侧栏 / Resizable sidebar | 让产品侧栏在调整宽度或折叠时连续保留导航上下文。 / Preserves navigation context while a product sidebar resizes or collapses. | `morph`, `spring` | motion; medium; deps: motion |
| `notification-center` | 通知中心 / Notification center | 将瞬时通知扩展为可阅读、可处理的分组历史。 / Expands transient notices into a readable, actionable grouped history. | `stagger`, `crossfade` | motion; light; deps: motion |
| `mobile-bottom-sheet` | 移动底部面板 / Mobile bottom sheet | 以可拖拽、可聚焦的底部面板承载移动端操作和详情。 / Presents mobile actions and detail in a draggable, focus-managed bottom sheet. | `slide-in`, `spring` | motion; medium; deps: motion |
| `page-transition-stack` | 页面过渡堆栈 / Page transition stack | 通过前后页面的深度关系保留路由来源和目的地意义。 / Preserves route origin and destination meaning through layered page depth. | `page-transition`, `scale-in` | motion; medium; deps: motion |
| `hover-preview` | 悬停预览 / Hover preview | 在不离开当前位置的情况下预览目的地，并支持键盘和触控固定。 / Previews a destination without leaving place, with keyboard and touch pinning support. | `hover-effect`, `origin-aware-animation` | motion; medium; deps: motion |
| `workspace-switcher` | 工作区切换 / Workspace switcher | 在紧凑控制中管理工作区身份、最近状态和选择变化。 / Manages workspace identity, recent state, and selection changes in a compact control. | `morph`, `crossfade` | motion; light; deps: motion |
| `file-dropzone` | 文件拖放区 / File dropzone | 通过拖放、选择器和粘贴接收文件，并给出明确的接收反馈。 / Accepts files through drag, picker, and paste with clear intake feedback. | `scale-in`, `perceived-performance` | motion; light; deps: motion |
| `multi-step-form` | 多步骤表单 / Multi-step form | 在短流程中维持步骤方向、校验、等待和已保存进度。 / Maintains step direction, validation, pending state, and saved progress in a short flow. | `direction-aware-transition`, `perceived-performance` | motion; medium; deps: motion |
| `sign-in-flow` | 登录流程 / Sign-in flow | 协调身份输入、等待、错误和成功，保留已填写内容。 / Coordinates identity input, pending, error, and success while retaining entered context. | `crossfade`, `shake-wiggle` | motion; light; deps: motion |
| `onboarding-checklist` | 引导清单 / Onboarding checklist | 把设置任务转为有完成度和下一步提示的产品表面。 / Turns setup tasks into a product surface with progress and next-step clarity. | `number-ticker`, `press-tap-feedback` | motion; light; deps: motion |
| `date-range-picker` | 日期范围选择 / Date range picker | 在日历网格中区分悬停、暂定、确认范围和预设。 / Distinguishes hover, provisional, confirmed range, and presets inside a calendar grid. | `before-after-slider`, `crossfade` | motion; medium; deps: motion |
| `animated-combobox` | 动态组合框 / Animated combobox | 搜索和选择不断变化的结果集，同时保持键盘位置。 / Searches and selects a changing result set while preserving keyboard position. | `crossfade`, `stagger` | motion; light; deps: motion |
| `inline-edit` | 就地编辑 / Inline edit | 在相同几何中处理阅读、编辑、保存、错误和提交状态。 / Handles read, edit, save, error, and commit states inside shared geometry. | `morph`, `crossfade` | motion; light; deps: motion |
| `animated-empty-state` | 动态空状态 / Animated empty state | 把有效空状态直接导向第一个明确操作和后续结果。 / Moves a valid empty state directly toward one clear first action and result. | `scale-in`, `crossfade` | motion; light; deps: motion |
| `metric-ticker` | 指标滚动数值 / Metric ticker | 把 KPI、涨跌方向和比较周期呈现为一次可读更新。 / Presents KPI, direction, and comparison period as one readable update. | `number-ticker`, `crossfade` | motion; light; deps: motion |
| `animated-chart` | 动态图表 / Animated chart | 比较数据范围与系列变化，保持标签和焦点稳定。 / Compares data ranges and series changes while keeping labels and focus stable. | `line-drawing`, `crossfade` | motion; medium; deps: motion |
| `changelog-timeline` | 更新日志时间线 / Changelog timeline | 以渐进焦点呈现产品或项目的历史记录。 / Presents product or project history with progressive focus. | `crossfade`, `stagger` | motion; light; deps: motion |
| `kanban-board` | 看板 / Kanban board | 让工作在列间移动，同时反馈落点、数量和周围卡片。 / Moves work across columns while responding through destination, count, and surrounding cards. | `drag-to-reorder`, `morph` | motion; medium; deps: motion |
| `pricing-calculator` | 价格计算器 / Pricing calculator | 通过数量、套餐和计费周期解释连续变化的价格。 / Explains changing price through quantity, tier, and billing interval. | `number-ticker`, `press-tap-feedback` | motion; light; deps: motion |
| `add-to-cart-morph` | 加入购物车变形 / Add-to-cart morph | 将产品选择连续连接到持久的购物车确认状态。 / Connects product selection continuously to a persistent cart confirmation state. | `morph`, `press-tap-feedback` | motion; medium; deps: motion |
| `aurora-canvas` | 极光画布 / Aurora canvas | 提供会在可见区域内缓慢呼吸的品牌环境光场。 / Provides a branded atmospheric field that breathes slowly while visible. | `idle-animation`, `compositing` | motion, css; medium; deps: motion |
| `grid-distortion` | 网格扭曲 / Grid distortion | 让网格或媒体表面围绕输入弯曲并平滑返回。 / Bends a grid or media surface around input and returns it smoothly. | `hover-effect`, `compositing` | motion, css; medium; deps: motion |
| `fluid-glass-surface` | 流体玻璃表面 / Fluid glass surface | 为聚焦控制或产品媒体提供保持可读的折射玻璃表面。 / Creates a refractive glass surface for focused controls or media while preserving legibility. | `hover-effect`, `blur` | motion, css; medium; deps: motion |

## Selection rules

1. Match the user-visible product event to the product-use column.
2. Prefer one Component whose published behavior covers the complete event.
3. Use Foundations to explain or tune the Component's motion language.
4. Fetch the exact Registry item at `https://motion-lexicon.pages.dev/r/<id>.json`.
5. Mark an unmatched pattern as a `candidate`.

