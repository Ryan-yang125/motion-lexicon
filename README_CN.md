[English](README.md) | **简体中文**

# Motionboard

拆解苹果、Linear 宣传片的镜头语言，用代码复刻，交给你的 Agent 做同款。

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code skill](https://img.shields.io/badge/Claude%20Code-skill-d97757)](#安装)
[![Codex skill](https://img.shields.io/badge/Codex-skill-111111)](#安装)

[motionboard.app](https://motionboard.app/zh/) · [全部配方](https://motionboard.app/zh/#recipes)

[![Motionboard 宣传片，由六个配方拼成](assets/readme/film.gif)](https://motionboard.app/zh/)

Motionboard 把真实的宣传片拆成 38 个镜头。每个镜头都用代码复刻成约 10 秒的 [HyperFrames](https://github.com/heygen-com/hyperframes) 短片（HTML 加 GSAP，渲染成视频），网站上每个配方都把原片和复刻并排放在一起。这个 skill 让你的 Agent 掌握全部 38 个配方，可以只做一个镜头，也可以为你的产品规划并做出完整的宣传片。

环境要求：Node 22+、HyperFrames（`npx hyperframes`）、ffmpeg。

## 安装

```sh
npx skills add krisyangdev/motionboard
```

也可以把链接交给你的 Agent：

> Install this skill: https://github.com/krisyangdev/motionboard

在 Claude Code 中作为插件安装：

```sh
/plugin marketplace add krisyangdev/motionboard
/plugin install motionboard@motionboard
```

在 Claude Code 和 Codex 中手动安装：

```sh
git clone https://github.com/krisyangdev/motionboard.git ~/motionboard
ln -s ~/motionboard/skills/motionboard ~/.claude/skills/motionboard
ln -s ~/motionboard/skills/motionboard ~/.codex/skills/motionboard
```

## 使用

| 你说 | 发生什么 |
| --- | --- |
| 用 Motionboard 给我的产品做一支宣传片。 | Agent 先了解你的产品，给出 4 到 6 个镜头的分镜表和预览链接，等你确认后逐个做出镜头，再拼成一个 MP4。 |
| 用 match-cut 配方，从我的 logo 切到应用界面。 | Agent 用你的品牌和界面做出这一个镜头，渲染后对照预览片检查。 |
| 给这个落地页做「斜拍景深界面」镜头。 | Agent 把配方里的 GSAP 时间线移植到你的网站，做成首屏动效。 |

你也可以在 [motionboard.app](https://motionboard.app/zh/) 复制单个配方的指令，粘贴给 Claude Code，不需要安装。

## 配方

38 个配方，按它们在宣传片中的位置分组。

<!-- recipes:start -->

### 开场 (7)

| 配方 | 镜头 |
| --- | --- |
| [暗场显影](https://motionboard.app/zh/recipes/light-reveal/) | 产品从全黑中靠提高曝光逐步显出，镜头只有极轻的推近，片尾同镜头反向熄灭。 |
| [作品墙漂移](https://motionboard.app/zh/recipes/showcase-wall/) | 满屏作品卡片斜向匀速漂移并慢放大，结尾加速推近一张。 |
| [逐词点亮](https://motionboard.app/zh/recipes/word-by-word-highlight/) | 黑场小字按顺序由灰变白，一次点亮一个词，字本身不位移。 |
| [节奏打字](https://motionboard.app/zh/recipes/rhythmic-typing/) | 等宽字加光标逐字打出，速度不均匀，可打出、停住、删除再重打。 |
| [分叉生长](https://motionboard.app/zh/recipes/branching-growth/) | 一个点逐层分叉长成网络，前慢后快；或一个点按翻倍节奏分裂铺满画面。 |
| [圆窗蒙太奇](https://motionboard.app/zh/recipes/iris-window-montage/) | 固定圆形取景窗，窗里快切图像或重看同一张图，圆窗大小随节奏跳变。 |
| [手绘抖线](https://motionboard.app/zh/recipes/line-boil/) | 手绘线条每 2–3 帧换一版描线，动作按低帧率逐帧，没有补间。 |

### 产品亮相 (7)

| 配方 | 镜头 |
| --- | --- |
| [实物推进聚焦](https://motionboard.app/zh/recipes/device-push-in-focus/) | 线稿风 3D 笔记本合盖转正、开盖、推近键盘，再随右侧选项逐次平移到对应按键并按下。 |
| [微距拉出](https://motionboard.app/zh/recipes/macro-pull-out-reveal/) | 镜头贴着局部超近距离慢移，最后一次后拉把整机或整页交代出来。 |
| [透视叠化](https://motionboard.app/zh/recipes/x-ray-dissolve/) | 内部结构和外壳在同一机位对位叠化，随后镜头拉远成整机。 |
| [字物穿插](https://motionboard.app/zh/recipes/text-object-interleave/) | 文字和实物在深度上互相穿插：文字出现在产品后面，设备插入句子中间，或文字穿过实物变成另一种文字。 |
| [描边显形](https://motionboard.app/zh/recipes/outline-to-solid/) | 先出线框或光线勾出的轮廓，再填成实心或材质。 |
| [斜拍景深界面](https://motionboard.app/zh/recipes/tilted-ui-with-depth-of-field/) | UI 平面倾斜 10–15° 贴近拍摄，只有当前操作行在焦内，其余行虚化。 |
| [Dock 登场](https://motionboard.app/zh/recipes/dock-arrival/) | 放大的 Dock 撑开空位长出新图标，冒一次小火花，光标点击后开窗。 |

### 功能展示 (15)

| 配方 | 镜头 |
| --- | --- |
| [吐出排列](https://motionboard.app/zh/recipes/dispense-line-up/) | 配件从主体里逐个滑出排成一行，文案逐词同步出现，停留后对称收回。 |
| [推近操作再拉回](https://motionboard.app/zh/recipes/auto-zoom/) | 镜头 0.4–0.8s 快推到要操作的元素，完成一次点击或输入后拉回全景。 |
| [形变接力](https://motionboard.app/zh/recipes/morph-relay/) | 同一个元素连续变形成下一个元素，代替切镜，整段没有硬切。 |
| [线框重排](https://motionboard.app/zh/recipes/wireframe-re-layout/) | 内容退成线框，线框 Flip 重排成新布局，各格依次填入新内容。 |
| [翻面看代码](https://motionboard.app/zh/recipes/card-flip-to-code/) | 预览卡绕 Y 轴翻转 180°，背面是代码。 |
| [控件驱动](https://motionboard.app/zh/recipes/control-driven-change/) | 控件（取色器、开关、调节盘）一到位，页面结果同帧变化，可分屏左控件右结果。 |
| [多人光标](https://motionboard.app/zh/recipes/multiplayer-cursors/) | 放大的双色带名字光标在画布上移动、评论、拖动重排。 |
| [焦点跳格](https://motionboard.app/zh/recipes/focus-hop/) | 高亮块或焦点框随光标一格一停跳动，焦点框可取框内图标的颜色。 |
| [堆积清空](https://motionboard.app/zh/recipes/pile-up-and-clear/) | 任务、标签或事件逐个堆满画面，然后一次清空成一个结果状态。 |
| [提示词轮播](https://motionboard.app/zh/recipes/prompt-carousel/) | 标题下一条线加厚成胶囊再变输入框，框内逐条打提示词并上下滚动。 |
| [散排参数](https://motionboard.app/zh/recipes/scattered-spec-type/) | 参数句拆成单词落在拉开的位置，连接词字母阶梯错开，正斜体混排。 |
| [玻璃透镜](https://motionboard.app/zh/recipes/glass-lens/) | 透明玻璃圆、放大镜或控件在内容上移动，折射放大下方内容，边缘带色散。 |
| [地图落钉](https://motionboard.app/zh/recipes/map-pin-drop/) | 定位钉回弹落下并爆出碎片，镜头拉远到全国，轨迹线划向下一座城市。 |
| [点阵量化](https://motionboard.app/zh/recipes/dot-matrix-glyph/) | 图形被量化到圆形点阵屏上，旋转或变化时每一帧都对齐到点阵。 |
| [确认爆发](https://motionboard.app/zh/recipes/confirmation-burst/) | 点击或付款那一帧，接触点外扩线条、方块、圆点，或图标回弹弹出并扩散同形描边。 |

### 转场 (5)

| 配方 | 镜头 |
| --- | --- |
| [同版换肤快切](https://motionboard.app/zh/recipes/locked-layout-reskin/) | 布局位置不变，每 6–10 帧硬切换一套配色和字体。 |
| [玻璃水滴分离](https://motionboard.app/zh/recipes/glass-droplet-split/) | 玻璃片拉长成水滴，颈部收细断开，留下一颗圆珠；同类形式是色散玻璃环向中心收束。 |
| [波浪翻转](https://motionboard.app/zh/recipes/domino-wave/) | 一排方块按相位差依次翻转 90°，镜头沿队列平移。 |
| [同位替换](https://motionboard.app/zh/recipes/match-cut/) | 在同一个锚点把一个东西换成另一个，视线位置不动。 |
| [遮挡与闪白](https://motionboard.app/zh/recipes/foreground-wipe-flash/) | 场景内虚焦大物体横扫遮满画面切场，或中心光晕吹白后切场。 |

### 结尾 (4)

| 配方 | 镜头 |
| --- | --- |
| [旋转落定](https://motionboard.app/zh/recipes/rotate-to-lockup/) | 物体在缓出旋转中停下，停止那一帧的角度正好是 logo 轮廓或产品的主视角。 |
| [收束成标](https://motionboard.app/zh/recipes/converge-to-mark/) | 片尾把多个元素收拢、压缩成一个图标或 logo，位置始终在画面中心。 |
| [符号展开字标](https://motionboard.app/zh/recipes/mark-to-wordmark-unfold/) | logo 符号居中，字标从符号背后或中心向两侧展开，可带乱码定格。 |
| [色散拉伸](https://motionboard.app/zh/recipes/chromatic-stretch/) | 字标局部字母被横向拉长并分出 RGB 重影，阶跃式扭曲后回正。 |

<!-- recipes:end -->

## 网站

网站使用 TanStack Start，构建时预渲染成静态 HTML，部署在 Cloudflare Workers。

```sh
npm install
npm run dev        # http://127.0.0.1:3000
npm run build      # 生成配方文件，预渲染所有页面，写入 sitemap.xml
npm run deploy     # 构建后执行 cf deploy
```

`scripts/recipes.mjs` 在每次 dev 和 build 之前运行。它根据 `src/data/` 生成给 Agent 读的配方文件，网站用 `public/r/`，skill 用 `skills/motionboard/recipes/`，并把 `skills/motionboard/source/` 复制到 `public/source/`。

影片和封面放在 R2，地址是 https://media.motionboard.app。源文件放在 `media/`（不进 git），用 `scripts/upload-media.sh [file ...]` 上传。复制、点赞和想要的计数存在 D1，本地首次运行需执行 `npx wrangler d1 migrations apply DB --local`。

## 许可证

MIT，见 [LICENSE](LICENSE)。`skills/motionboard/source/` 里的复刻是原创作品。原片归各自所有者，网站只在复刻旁边展示很短的参考片段。详见 [NOTICE](NOTICE)。
