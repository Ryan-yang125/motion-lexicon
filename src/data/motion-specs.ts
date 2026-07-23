import {
  getMotionCatalogMeta,
  type ResolvedMotionCatalogMetadata
} from "./motion-catalog";
import { getGlossaryTerm } from "./glossary";
import { getMotionGuidance } from "./motion-guidance";
import type {
  LocalizedText,
  MotionEntry,
  MotionParam,
  MotionRecipe,
  ParamUnit,
  RangeParam,
  SegmentedParam,
  ToggleParam
} from "./types";

const zhEn = (zh: string, en: string): LocalizedText => ({ zh, en });

function range(
  id: string,
  zh: string,
  en: string,
  defaultValue: number,
  min: number,
  max: number,
  step: number,
  unit: ParamUnit,
  descriptionZh = `调节${zh}。`,
  descriptionEn = `Adjusts ${en.toLowerCase()}.`
): RangeParam {
  return {
    id,
    kind: "range",
    defaultValue,
    min,
    max,
    step,
    unit,
    label: zhEn(zh, en),
    description: zhEn(descriptionZh, descriptionEn)
  };
}

function segmented(
  id: string,
  zh: string,
  en: string,
  defaultValue: string,
  options: ReadonlyArray<readonly [value: string, zh: string, en: string, cssValue?: string]>,
  descriptionZh = `选择${zh}。`,
  descriptionEn = `Selects ${en.toLowerCase()}.`
): SegmentedParam {
  return {
    id,
    kind: "segmented",
    defaultValue,
    label: zhEn(zh, en),
    description: zhEn(descriptionZh, descriptionEn),
    options: options.map(([value, optionZh, optionEn, cssValue = value]) => ({
      value,
      cssValue,
      label: zhEn(optionZh, optionEn)
    }))
  };
}

function toggle(
  id: string,
  zh: string,
  en: string,
  defaultValue: boolean,
  descriptionZh: string,
  descriptionEn: string
): ToggleParam {
  return {
    id,
    kind: "toggle",
    defaultValue,
    label: zhEn(zh, en),
    description: zhEn(descriptionZh, descriptionEn)
  };
}

const duration = (value = 240, max = 1200) =>
  range("duration", "时长", "Duration", value, 80, max, 20, "ms", "控制一次动效完成所需的时间。", "Controls the time required for one motion cycle.");
const explanatoryDuration = (value: number, max: number, min = 300) =>
  range(
    "duration",
    "演示时长",
    "Demo duration",
    value,
    min,
    max,
    20,
    "ms",
    "演示使用较长时长以便观察完整变化；生产界面的即时反馈应收敛到 300ms 内。",
    "Uses a longer demo duration so the full change stays observable; immediate production UI feedback should stay under 300ms."
  );
const deliberateDuration = (value: number, max: number) =>
  range(
    "duration",
    "确认时长",
    "Confirmation duration",
    value,
    600,
    max,
    50,
    "ms",
    "保留足够的按住时间来表达明确意图；松开后的恢复应保持短促。",
    "Leaves enough hold time to express deliberate intent; release recovery should stay brief."
  );
const loopDuration = (value: number, max: number, min = 800) =>
  range(
    "duration",
    "单轮时长",
    "Cycle duration",
    value,
    min,
    max,
    100,
    "ms",
    "控制完整循环的节奏；持续动态需要支持暂停并保持低干扰。",
    "Controls the rhythm of one full cycle; continuous motion should stay pausable and low-distraction."
  );
const delay = (value = 0) =>
  range("delay", "延迟", "Delay", value, 0, 600, 20, "ms", "控制动效开始前的等待时间。", "Controls the wait before motion begins.");
const distance = (value = 24, max = 120) =>
  range("distance", "位移", "Distance", value, 0, max, 2, "px", "控制元素移动的空间距离。", "Controls how far the element travels.");
const scale = (value = 94) =>
  range("scale", "起始缩放", "Start scale", value, 70, 105, 1, "%", "控制元素相对最终尺寸的起始比例。", "Controls the starting size relative to the final state.");

const compactEaseOptions = [
  ["soft", "柔和", "Soft", "cubic-bezier(0.23, 1, 0.32, 1)"],
  ["snap", "清脆", "Snap", "cubic-bezier(0.16, 1, 0.3, 1)"],
  ["calm", "平稳", "Calm", "cubic-bezier(0.33, 1, 0.68, 1)"],
  ["linear", "匀速", "Linear", "linear"]
] as const;

const fullEaseOptions = [
  ["ease-out", "缓出", "Ease-out", "cubic-bezier(0.16, 1, 0.3, 1)"],
  ["ease-in", "缓入", "Ease-in", "cubic-bezier(0.55, 0, 1, 0.45)"],
  ["ease-in-out", "缓入缓出", "Ease-in-out", "cubic-bezier(0.65, 0, 0.35, 1)"],
  ["linear", "匀速", "Linear", "linear"],
  ["custom", "自定义", "Custom", "cubic-bezier(0.25, 0.9, 0.3, 1)"],
  ["asymmetric", "非对称", "Asymmetric", "cubic-bezier(0.2, 0.8, 0.2, 1)"],
  ...compactEaseOptions.slice(0, 3)
] as const;

const ease = (value = "soft", full = false) =>
  segmented(
    "ease",
    "曲线",
    "Easing",
    value,
    full ? fullEaseOptions : compactEaseOptions,
    "控制速度随时间变化的方式。",
    "Controls how velocity changes over time."
  );

const direction = (value = "up") =>
  segmented("direction", "方向", "Direction", value, [
    ["up", "向上", "Up"],
    ["down", "向下", "Down"],
    ["left", "向左", "Left"],
    ["right", "向右", "Right"],
    ["out", "离开", "Exit"]
  ]);

function parametersFor(canonicalId: string): MotionParam[] {
  switch (canonicalId) {
    case "fade-in-fade-out":
      return [duration(220), range("opacity", "起始透明度", "Start opacity", 0, 0, 80, 5, "%"), delay(), ease("calm")];
    case "slide-in":
      return [duration(240), distance(28), direction(), delay(), ease()];
    case "scale-in":
      return [
        duration(200),
        scale(92),
        toggle("overshoot", "轻微过冲", "Subtle overshoot", false, "开启后在落点前轻微超过最终尺寸。", "Briefly exceeds the final size before settling."),
        delay(),
        ease("snap")
      ];
    case "reveal":
      return [duration(260), distance(20), segmented("reveal", "揭示材质", "Reveal mode", "clip", [["clip", "裁切", "Clip"], ["mask", "遮罩", "Mask"], ["blur", "模糊", "Blur"]]), delay(), ease()];
    case "stagger":
      return [duration(220), range("stagger", "间隔", "Stagger", 50, 20, 120, 10, "ms"), range("count", "项目数", "Item count", 4, 2, 8, 1, ""), distance(18), ease()];
    case "keyframes":
      return [explanatoryDuration(720, 2400), segmented("mode", "编排方式", "Timeline mode", "keyframes", [["keyframes", "关键帧", "Keyframes"], ["tween", "补间", "Tween"], ["steps", "步进", "Steps"]]), range("steps", "步数", "Steps", 4, 2, 12, 1, ""), segmented("fill", "结束状态", "Fill mode", "both", [["none", "无", "None"], ["forwards", "保持结束", "Forwards"], ["both", "前后保持", "Both"]]), ease()];
    case "duration":
      return [duration(240), delay(), ease("snap")];
    case "translate":
      return [duration(280), segmented("transform", "变换", "Transform", "translate", [["translate", "位移", "Translate"], ["scale", "缩放", "Scale"], ["rotate", "旋转", "Rotate"], ["skew", "倾斜", "Skew"], ["perspective", "透视", "Perspective"]]), distance(36), range("angle", "角度", "Angle", 12, -45, 45, 1, "deg"), scale(92), segmented("origin", "原点", "Origin", "center", [["center", "中心", "Center"], ["top", "顶部", "Top"], ["bottom", "底部", "Bottom"], ["left", "左侧", "Left"], ["right", "右侧", "Right"]]), ease()];
    case "3d-tilt-flip":
      return [duration(280), range("angle", "翻转角度", "Flip angle", 180, 45, 180, 5, "deg"), range("perspective", "透视距离", "Perspective", 800, 320, 1400, 40, "px"), ease()];
    case "origin-aware-animation":
      return [duration(220), scale(88), segmented("origin", "动作来源", "Motion origin", "top-left", [["top-left", "左上", "Top left"], ["top-right", "右上", "Top right"], ["bottom-left", "左下", "Bottom left"], ["bottom-right", "右下", "Bottom right"], ["center", "中心", "Center"]]), ease()];
    case "crossfade":
      return [duration(200), range("overlap", "重叠", "Overlap", 50, 0, 100, 5, "%"), ease("calm")];
    case "morph":
      return [
        duration(260),
        segmented("mode", "连续方式", "Continuity mode", "morph", [
          ["morph", "形状形变", "Shape morph"],
          ["continuity", "连续过渡", "Continuity transition"],
          ["shared", "共享元素", "Shared element"],
          ["layout", "布局变化", "Layout change"]
        ], "选择前后状态保持连续的方式。", "Selects how continuity is preserved between states."),
        distance(48),
        scale(86),
        ease()
      ];
    case "accordion-collapse":
      return [duration(220), range("height", "内容高度", "Content height", 140, 60, 320, 10, "px"), ease()];
    case "direction-aware-transition":
      return [duration(240), distance(40), direction("left"), ease()];
    case "scroll-reveal":
      return [duration(260), range("threshold", "触发阈值", "Threshold", 20, 0, 80, 5, "%"), distance(28), ease()];
    case "scroll-driven-animation":
      return [range("start", "开始位置", "Start", 10, 0, 90, 5, "%"), range("end", "结束位置", "End", 80, 10, 100, 5, "%"), distance(80, 240), segmented("axis", "轴向", "Axis", "y", [["y", "垂直", "Vertical"], ["x", "水平", "Horizontal"]])];
    case "parallax":
      return [distance(48, 160), range("speed", "速度差", "Speed ratio", 35, 10, 80, 5, "%"), segmented("axis", "轴向", "Axis", "y", [["y", "垂直", "Vertical"], ["x", "水平", "Horizontal"]])];
    case "page-transition":
      return [duration(280), distance(32), direction("left"), ease()];
    case "hover-effect":
      return [duration(150), distance(4, 16), scale(101), ease("snap")];
    case "press-tap-feedback":
      return [duration(120), scale(96), ease("snap")];
    case "hold-to-confirm":
      return [deliberateDuration(1200, 2400), scale(98), ease("linear")];
    case "drag-to-reorder":
      return [duration(180), distance(48), scale(103), ease("snap")];
    case "swipe-to-dismiss":
      return [duration(240), distance(96, 240), range("resistance", "阻尼", "Resistance", 65, 0, 90, 5, "%"), ease("snap")];
    case "shake-wiggle":
      return [duration(240), distance(10, 30), range("cycles", "摆动次数", "Cycles", 3, 1, 6, 1, "")];
    case "ripple":
      return [duration(160), range("size", "扩散尺寸", "Ripple size", 220, 120, 360, 10, "%"), range("opacity", "波纹强度", "Ripple opacity", 24, 8, 40, 2, "%")];
    case "easing":
      return [explanatoryDuration(520, 1200), distance(120, 240), ease("ease-out", true)];
    case "spring":
      return [range("stiffness", "刚度", "Stiffness", 220, 60, 500, 10, ""), range("damping", "阻尼", "Damping", 24, 5, 60, 1, ""), range("mass", "质量", "Mass", 1, 0.5, 3, 0.1, "x"), range("velocity", "初速度", "Initial velocity", 0, -20, 20, 1, ""), distance(48, 160)];
    case "loop":
      return [loopDuration(1200, 4000), range("pause", "循环停顿", "Loop pause", 160, 0, 800, 20, "ms"), segmented("direction", "循环方向", "Loop direction", "normal", [["normal", "正向", "Normal"], ["alternate", "往返", "Alternate"], ["reverse", "反向", "Reverse"]]), range("iterations", "次数", "Iterations", 3, 1, 8, 1, "x"), toggle("infinite", "持续循环", "Infinite", false, "开启后持续循环。", "Keeps the motion looping.")];
    case "marquee":
      return [loopDuration(8000, 20000, 2000), range("gap", "内容间距", "Content gap", 32, 8, 80, 4, "px"), segmented("direction", "方向", "Direction", "left", [["left", "向左", "Left"], ["right", "向右", "Right"]]), toggle("pauseOnHover", "悬停暂停", "Pause on hover", true, "悬停或聚焦时暂停滚动。", "Pauses motion on hover or focus.")];
    case "orbit":
      return [loopDuration(6000, 16000, 2000), range("radius", "轨道半径", "Orbit radius", 56, 24, 96, 4, "px"), segmented("direction", "方向", "Direction", "normal", [["normal", "顺时针", "Clockwise"], ["reverse", "逆时针", "Counterclockwise"]])];
    case "idle-animation":
      return [loopDuration(2200, 6000, 1000), distance(8, 24), segmented("style", "方式", "Idle style", "float", [["float", "漂浮", "Float"], ["pulse", "呼吸", "Pulse"]]), range("pause", "停顿", "Pause", 300, 0, 1200, 50, "ms")];
    case "blur":
      return [duration(260), range("blur", "模糊半径", "Blur radius", 14, 0, 32, 1, "px"), segmented("reveal", "揭示方式", "Reveal mode", "blur", [["blur", "模糊", "Blur"], ["clip", "裁切", "Clip"], ["mask", "遮罩", "Mask"]]), ease()];
    case "before-after-slider":
      return [range("position", "分割位置", "Divider position", 50, 10, 90, 1, "%"), duration(180)];
    case "line-drawing":
      return [explanatoryDuration(1000, 3000, 500), delay(), ease("calm")];
    case "text-morph":
      return [duration(240), range("blur", "过渡模糊", "Transition blur", 8, 0, 20, 1, "px"), delay(120), ease()];
    case "skeleton-shimmer":
      return [loopDuration(1400, 3000), range("intensity", "扫光强度", "Shimmer intensity", 14, 5, 30, 1, "%")];
    case "number-ticker":
      return [duration(240), distance(24, 60), ease("snap")];
    case "typewriter":
      return [explanatoryDuration(1200, 4000, 600), range("characters", "字符数", "Characters", 18, 6, 36, 1, ""), toggle("caret", "显示光标", "Show caret", true, "显示闪烁输入光标。", "Shows a blinking text caret.")];
    case "compositing":
      return [explanatoryDuration(520, 1200), distance(80, 180), segmented("property", "对比属性", "Compared property", "transform", [["transform", "Transform", "Transform"], ["left", "Left", "Left"], ["opacity", "Opacity", "Opacity"]]), ease("linear")];
    case "anticipation":
      return [explanatoryDuration(520, 1200), distance(32, 80), range("anticipation", "预备幅度", "Anticipation", 18, 0, 40, 2, "%"), range("followThrough", "跟随幅度", "Follow-through", 12, 0, 30, 2, "%"), ease("snap")];
    case "frame-rate":
    case "purposeful-animation":
    case "perceived-performance":
    case "reduced-motion":
      return [];
    default:
      return [duration(), distance(), delay(), ease()];
  }
}

export type MotionScene =
  | "card"
  | "list"
  | "button"
  | "disclosure"
  | "scroll"
  | "comparison"
  | "line"
  | "text"
  | "skeleton"
  | "number"
  | "orbit"
  | "guide";

export type MotionSpec = {
  canonicalId: string;
  metadata: ResolvedMotionCatalogMetadata;
  scene: MotionScene;
  params: MotionParam[];
};

function sceneFor(canonicalId: string): MotionScene {
  if (canonicalId === "stagger" || canonicalId === "drag-to-reorder") return "list";
  if (["hover-effect", "press-tap-feedback", "hold-to-confirm", "ripple"].includes(canonicalId)) return "button";
  if (canonicalId === "accordion-collapse") return "disclosure";
  if (["scroll-reveal", "scroll-driven-animation", "parallax", "page-transition"].includes(canonicalId)) return "scroll";
  if (canonicalId === "before-after-slider") return "comparison";
  if (canonicalId === "line-drawing") return "line";
  if (["text-morph", "typewriter", "marquee"].includes(canonicalId)) return "text";
  if (canonicalId === "skeleton-shimmer") return "skeleton";
  if (canonicalId === "number-ticker") return "number";
  if (["orbit", "loop", "idle-animation"].includes(canonicalId)) return "orbit";
  if (["frame-rate", "purposeful-animation", "perceived-performance", "reduced-motion"].includes(canonicalId)) return "guide";
  return "card";
}

function cloneParams(params: MotionParam[]) {
  return params.map((param) =>
    param.kind === "segmented"
      ? { ...param, options: param.options.map((option) => ({ ...option, label: { ...option.label } })), label: { ...param.label }, description: { ...param.description } }
      : { ...param, label: { ...param.label }, description: { ...param.description } }
  );
}

function applyPresetDefaults(params: MotionParam[], entryId: string) {
  const aliases: Record<string, Record<string, string | number | boolean>> = {
    "enter-exit": { direction: "out" },
    "pop-in": { scale: 86, overshoot: true },
    "interpolation-tween": { mode: "tween" },
    "fill-mode": { fill: "both" },
    "stepped-animation": { mode: "steps" },
    delay: { delay: 120 },
    scale: { transform: "scale" },
    rotate: { transform: "rotate" },
    skew: { transform: "skew" },
    perspective: { transform: "perspective" },
    "transform-origin": { transform: "rotate", origin: "top" },
    "continuity-transition": { mode: "continuity" },
    "shared-element-transition": { mode: "shared" },
    "layout-animation": { mode: "layout" },
    "rubber-banding": { resistance: 65 },
    "ease-out": { ease: "ease-out" },
    "ease-in": { ease: "ease-in" },
    "ease-in-out": { ease: "ease-in-out" },
    linear: { ease: "linear" },
    "cubic-bezier": { ease: "custom" },
    "asymmetric-easing": { ease: "asymmetric" },
    alternate: { direction: "alternate" },
    pulse: { style: "pulse" },
    float: { style: "float" },
    "clip-path": { reveal: "clip" },
    mask: { reveal: "mask" }
  };
  const preset = aliases[entryId];
  if (!preset) return params;
  return params.map((param) =>
    Object.hasOwn(preset, param.id)
      ? { ...param, defaultValue: preset[param.id] } as MotionParam
      : param
  );
}

export function getMotionSpec(entryOrId: string | { id: string }): MotionSpec {
  const entryId = typeof entryOrId === "string" ? entryOrId : entryOrId.id;
  const metadata = getMotionCatalogMeta(entryId);
  if (!metadata) {
    throw new Error(`Missing canonical motion metadata for: ${entryId}`);
  }
  return {
    canonicalId: metadata.canonicalId,
    metadata,
    scene: sceneFor(metadata.canonicalId),
    params: applyPresetDefaults(cloneParams(parametersFor(metadata.canonicalId)), entryId)
  };
}

export function enrichMotionEntry(entry: MotionEntry): MotionRecipe {
  const spec = getMotionSpec(entry.id);
  const summary = spec.metadata.summary;
  const glossary = getGlossaryTerm(entry.id);
  const guidance = getMotionGuidance(spec.canonicalId);
  if (!glossary) {
    throw new Error(`Missing Motion Lexicon glossary term: ${entry.id}`);
  }
  if (!guidance) {
    throw new Error(`Missing motion guidance: ${spec.canonicalId}`);
  }
  const outputDescription = spec.metadata.surfaceType === "guide"
    ? {
        zh: `${summary.zh} 包含判断标准、常见风险、减少动态建议和可执行的评审清单。`,
        en: `${summary.en} Includes review criteria, common risks, and reduced-motion guidance.`
      }
    : {
        zh: `${summary.zh} 可调节相关参数，复制同源的提示词、HTML、CSS 与交互 JS，并包含减弱动效方案。`,
        en: `${summary.en} Tune relevant parameters and copy synchronized prompt, HTML, CSS, and interaction JavaScript with reduced-motion guidance.`
      };
  return {
    ...entry,
    source: {
      skill: "motion-lexicon",
      glossarySection: glossary.section,
      term: glossary.name.en,
      definition: glossary.definition.en
    },
    name: glossary.name,
    params: spec.params,
    shortDescription: summary,
    definition: glossary.definition,
    usage: [guidance.purpose, guidance.frequency, guidance.trigger],
    examples: [guidance.enterExit, guidance.interruptibility],
    reviewNotes: [...guidance.reviewNotes],
    reducedMotion: guidance.reducedMotionStrategy,
    seo: {
      ...entry.seo,
      title: {
        zh: `${glossary.name.zh}｜Motion Lexicon 动效词典`,
        en: `${glossary.name.en} | Motion Lexicon`
      },
      description: outputDescription
    },
    canonicalId: spec.canonicalId,
    family: spec.metadata.family,
    surfaceType: spec.metadata.surfaceType,
    aliases: [...spec.metadata.aliases]
  };
}
