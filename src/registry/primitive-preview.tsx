import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition
} from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import type { Locale, MotionRecipe, ParamValues } from "../data/types";
import { text } from "../data/site";

type PrimitiveRegistryPreviewProps = {
  locale: Locale;
  recipe: MotionRecipe;
  values: ParamValues;
  deferred?: boolean;
  compact?: boolean;
  replayKey?: number;
};

type SceneProps = Pick<PrimitiveRegistryPreviewProps, "locale" | "recipe" | "values" | "compact">;

const arrive = [0.23, 1, 0.32, 1] as const;

function numberValue(values: ParamValues, key: string, fallback: number) {
  const value = values[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringValue(values: ParamValues, key: string, fallback: string) {
  const value = values[key];
  return typeof value === "string" ? value : fallback;
}

function transitionFor(recipe: MotionRecipe, values: ParamValues): Transition {
  if (recipe.id === "spring") {
    return {
      type: "spring",
      stiffness: numberValue(values, "stiffness", 180),
      damping: numberValue(values, "damping", 22),
      mass: numberValue(values, "mass", 1)
    };
  }
  const duration = numberValue(values, "duration", recipe.surfaceType === "playground" ? 520 : 220) / 1000;
  const ease = stringValue(values, "ease", "soft");
  const curves: Record<string, Transition["ease"]> = {
    linear: "linear",
    "ease-in": "easeIn",
    "ease-in-out": "easeInOut",
    soft: arrive,
    crisp: [0.2, 0.8, 0.2, 1],
    smooth: [0.4, 0, 0.2, 1]
  };
  return { duration, ease: curves[ease] ?? arrive };
}

function PreviewFallback() {
  return <div className="primitive-preview-loading" aria-hidden="true"><i /><i /><i /></div>;
}

export function PrimitiveRegistryPreview({
  locale,
  recipe,
  values,
  deferred = false,
  compact = false,
  replayKey = 0
}: PrimitiveRegistryPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(!deferred);

  useEffect(() => {
    if (!deferred || active || !frameRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
        observer.disconnect();
      }
    }, { rootMargin: "220px" });
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [active, deferred]);

  return (
    <div
      className={`primitive-registry-preview${compact ? " is-compact" : ""}`}
      data-primitive={recipe.id}
      ref={frameRef}
    >
      {active ? (
        <PrimitiveScene
          key={`${recipe.id}:${replayKey}`}
          locale={locale}
          recipe={recipe}
          values={values}
          compact={compact}
        />
      ) : <PreviewFallback />}
    </div>
  );
}

function PrimitiveScene(props: SceneProps) {
  switch (props.recipe.categoryId) {
    case "entrances": return <EntranceScene {...props} />;
    case "sequencing": return <SequencingScene {...props} />;
    case "transforms": return <TransformScene {...props} />;
    case "state-transitions": return <StateScene {...props} />;
    case "scroll": return <ScrollScene {...props} />;
    case "feedback": return <FeedbackScene {...props} />;
    case "easing":
    case "springs": return <TimingScene {...props} />;
    case "loops": return <LoopScene {...props} />;
    case "polish-effects": return <EffectScene {...props} />;
    case "performance": return <PerformanceScene {...props} />;
    case "principles": return <PrincipleScene {...props} />;
    default: return <GuideScene {...props} />;
  }
}

function SceneShell({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`primitive-scene ${className}`.trim()}>
      <div className="primitive-scene-chrome">
        <span><i />{label}</span>
        <b /><b />
      </div>
      <div className="primitive-scene-canvas">{children}</div>
    </div>
  );
}

function ProductCard({ title, eyebrow = "Workspace", lines = 2, icon = false }: { title: string; eyebrow?: string; lines?: number; icon?: boolean }) {
  return (
    <article className="primitive-product-card">
      {icon ? <span className="primitive-product-icon" aria-hidden="true" /> : null}
      <div>
        <small>{eyebrow}</small>
        <strong>{title}</strong>
        <span className="primitive-copy-lines" aria-hidden="true">
          {Array.from({ length: lines }, (_, index) => <i key={index} />)}
        </span>
      </div>
    </article>
  );
}

function EntranceScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  const transition = transitionFor(recipe, values);
  const distance = numberValue(values, "distance", 28);
  const scale = numberValue(values, "scale", 92) / 100;
  const variants = {
    "fade-in-fade-out": { opacity: 0 },
    "slide-in": { opacity: 0, x: distance },
    "scale-in": { opacity: 0, scale },
    reveal: { opacity: 0, y: 12, clipPath: "inset(0 0 100% 0)" }
  }[recipe.id] ?? { opacity: 0, y: 12 };

  return (
    <SceneShell label={locale === "zh" ? "新项目" : "New project"} className="primitive-scene-entrance">
      <motion.div
        initial={reduced ? false : variants}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1, clipPath: "inset(0 0 0% 0)" }}
        transition={reduced ? { duration: 0.12 } : transition}
      >
        <ProductCard title={locale === "zh" ? "设计评审已准备" : "Design review ready"} eyebrow="Motion Lexicon" icon />
      </motion.div>
    </SceneShell>
  );
}

function SequencingScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  const transition = transitionFor(recipe, values);
  const stagger = numberValue(values, "stagger", 55) / 1000;
  const items = locale === "zh" ? ["整理交互状态", "校准动效节奏", "检查减弱动效"] : ["Map interface states", "Tune motion rhythm", "Check reduced motion"];

  if (recipe.id === "duration") {
    const distance = numberValue(values, "distance", 110);
    return (
      <SceneShell label={locale === "zh" ? "响应节奏" : "Response timing"}>
        <div className="primitive-timing-rows">
          {[0.72, 1].map((speed, index) => (
            <div key={speed}><span>{index ? "B" : "A"}</span><i><motion.b initial={{ x: 0 }} animate={{ x: reduced ? 0 : distance }} transition={{ ...transition, duration: Number(transition.duration ?? 0.45) * speed }} /></i></div>
          ))}
        </div>
      </SceneShell>
    );
  }

  if (recipe.id === "keyframes") {
    return (
      <SceneShell label={locale === "zh" ? "关键帧" : "Keyframes"}>
        <div className="primitive-keyframe-track">
          <span /><span /><span />
          <motion.i
            initial={{ x: -72, opacity: 0.45, scale: 0.92 }}
            animate={reduced ? { opacity: 1 } : { x: [-72, 0, 72], opacity: [0.45, 1, 1], scale: [0.92, 1.05, 1] }}
            transition={transition}
          />
        </div>
      </SceneShell>
    );
  }

  return (
    <SceneShell label={locale === "zh" ? "发布检查" : "Ship checklist"}>
      <motion.ul
        className="primitive-task-list"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: reduced ? 0 : stagger } } }}
      >
        {items.map((item, index) => (
          <motion.li key={item} variants={{ hidden: { opacity: 0, y: reduced ? 0 : 10 }, visible: { opacity: 1, y: 0 } }} transition={reduced ? { duration: 0.12 } : transition}>
            <span>{index + 1}</span><strong>{item}</strong><i />
          </motion.li>
        ))}
      </motion.ul>
    </SceneShell>
  );
}

function TransformScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  const transition = transitionFor(recipe, values);
  const distance = numberValue(values, "distance", 28);

  if (recipe.id === "origin-aware-animation") {
    return (
      <SceneShell label={locale === "zh" ? "图层" : "Layer"}>
        <div className="primitive-origin-scene">
          <span className="primitive-origin-trigger" />
          <motion.div initial={reduced ? false : { opacity: 0, scale: 0.82, transformOrigin: "18px 12px" }} animate={{ opacity: 1, scale: 1 }} transition={reduced ? { duration: 0.12 } : transition}>
            <strong>{locale === "zh" ? "调整图层" : "Adjust layer"}</strong><i /><i /><i />
          </motion.div>
        </div>
      </SceneShell>
    );
  }

  if (recipe.id === "3d-tilt-flip") {
    return (
      <SceneShell label={locale === "zh" ? "项目卡片" : "Project card"}>
        <div className="primitive-perspective">
          <motion.div initial={reduced ? false : { rotateX: 5, rotateY: -8, y: 8, opacity: 0 }} animate={{ rotateX: 0, rotateY: 0, y: 0, opacity: 1 }} whileHover={reduced ? undefined : { rotateX: -3, rotateY: 6, y: -3 }} transition={{ type: "spring", stiffness: 220, damping: 24 }}>
            <ProductCard title={locale === "zh" ? "组件规范" : "Component spec"} eyebrow="v3.1" icon />
          </motion.div>
        </div>
      </SceneShell>
    );
  }

  return (
    <SceneShell label={locale === "zh" ? "坐标变换" : "Transform"}>
      <div className="primitive-transform-grid">
        <motion.div initial={reduced ? false : { x: distance, rotate: 5, opacity: 0 }} animate={{ x: 0, rotate: 0, opacity: 1 }} transition={reduced ? { duration: 0.12 } : transition}>
          <span /><i /><i />
        </motion.div>
      </div>
    </SceneShell>
  );
}

function StateScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  const [second, setSecond] = useState(false);
  const transition = transitionFor(recipe, values);

  useEffect(() => {
    const timer = window.setTimeout(() => setSecond(true), reduced ? 80 : 360);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  if (recipe.id === "accordion-collapse") {
    return (
      <SceneShell label={locale === "zh" ? "项目设置" : "Project settings"}>
        <div className="primitive-accordion">
          <div><strong>{locale === "zh" ? "成员权限" : "Member access"}</strong><motion.span animate={{ rotate: second && !reduced ? 45 : 0 }}>+</motion.span></div>
          <AnimatePresence initial={false}>
            {second ? <motion.section initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={reduced ? { duration: 0.12 } : transition}><i /><i /><i /></motion.section> : null}
          </AnimatePresence>
        </div>
      </SceneShell>
    );
  }

  if (recipe.id === "morph") {
    return (
      <SceneShell label={locale === "zh" ? "视图" : "View"}>
        <div className="primitive-morph-tabs">
          {["List", "Board"].map((item, index) => <span key={item}>{second === Boolean(index) ? <motion.i layoutId={`primitive-tab-${recipe.id}`} transition={{ type: "spring", stiffness: 360, damping: 32 }} /> : null}<b>{item}</b></span>)}
        </div>
        <motion.div className="primitive-morph-content" layout transition={{ type: "spring", stiffness: 260, damping: 28 }} data-mode={second ? "board" : "list"}><i /><i /><i /></motion.div>
      </SceneShell>
    );
  }

  return (
    <SceneShell label={locale === "zh" ? "同步状态" : "Sync status"}>
      <div className="primitive-state-stack">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={second ? "ready" : "sync"} initial={reduced ? false : { opacity: 0, x: recipe.id === "direction-aware-transition" ? 18 : 0 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }} transition={reduced ? { duration: 0.12 } : transition}>
            <span className={second ? "is-ready" : ""} /><strong>{second ? (locale === "zh" ? "已同步" : "Synced") : (locale === "zh" ? "正在同步" : "Syncing")}</strong><i />
          </motion.div>
        </AnimatePresence>
      </div>
    </SceneShell>
  );
}

function ScrollScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  const distance = numberValue(values, "distance", 42);
  const transition = transitionFor(recipe, values);

  return (
    <SceneShell label={locale === "zh" ? "最近更新" : "Recent updates"} className="primitive-scroll-scene">
      <div className="primitive-scroll-window">
        <motion.div
          initial={reduced ? false : { y: recipe.id === "parallax" ? distance / 2 : distance, opacity: recipe.id === "page-transition" ? 0 : 1 }}
          animate={{ y: recipe.id === "parallax" ? -distance / 3 : 0, opacity: 1 }}
          transition={reduced ? { duration: 0.12 } : transition}
        >
          <ProductCard title={locale === "zh" ? "动效审查完成" : "Motion review complete"} eyebrow="Activity" />
          <ProductCard title={locale === "zh" ? "组件已发布" : "Component published"} eyebrow="Registry" />
          <ProductCard title={locale === "zh" ? "规范已更新" : "Guidelines updated"} eyebrow="Docs" />
        </motion.div>
        {recipe.id === "scroll-driven-animation" ? <motion.i className="primitive-scroll-progress" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={reduced ? { duration: 0.12 } : transition} /> : null}
      </div>
    </SceneShell>
  );
}

function FeedbackScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  const transition = transitionFor(recipe, values);

  if (recipe.id === "drag-to-reorder") {
    return (
      <SceneShell label={locale === "zh" ? "优先级" : "Priority"}>
        <div className="primitive-reorder-list">
          {["Research", "Prototype", "Review"].map((item, index) => (
            <motion.div key={item} initial={reduced ? false : { y: index === 0 ? 18 : -9, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 280, damping: 28, delay: reduced ? 0 : index * 0.04 }}><span>{index + 1}</span><strong>{item}</strong><i>⋮⋮</i></motion.div>
          ))}
        </div>
      </SceneShell>
    );
  }

  if (recipe.id === "swipe-to-dismiss") {
    return (
      <SceneShell label={locale === "zh" ? "通知" : "Notification"}>
        <motion.div className="primitive-notification" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={reduced ? 0 : 0.18} initial={reduced ? false : { x: 34, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}><span /><div><strong>{locale === "zh" ? "版本已发布" : "Release published"}</strong><i /><i /></div></motion.div>
      </SceneShell>
    );
  }

  if (recipe.id === "shake-wiggle") {
    return (
      <SceneShell label={locale === "zh" ? "登录" : "Sign in"}>
        <motion.div className="primitive-error-field" initial={{ x: 0 }} animate={reduced ? { opacity: 1 } : { x: [0, -7, 6, -4, 3, 0] }} transition={transition}><span>{locale === "zh" ? "密码不正确" : "Incorrect password"}</span><i /></motion.div>
      </SceneShell>
    );
  }

  if (recipe.id === "ripple") {
    return (
      <SceneShell label={locale === "zh" ? "操作" : "Action"}>
        <motion.button className="primitive-action-button primitive-ripple-button" type="button" whileTap={reduced ? undefined : { scale: 0.98 }}><motion.i initial={{ scale: 0.15, opacity: 0.28 }} animate={{ scale: reduced ? 1 : 4.6, opacity: 0 }} transition={reduced ? { duration: 0.12 } : { duration: 0.48, ease: "easeOut" }} /><span>{locale === "zh" ? "创建项目" : "Create project"}</span></motion.button>
      </SceneShell>
    );
  }

  const isHold = recipe.id === "hold-to-confirm";
  return (
    <SceneShell label={locale === "zh" ? "确认操作" : "Confirm action"}>
      <motion.button
        className={`primitive-action-button${isHold ? " is-destructive" : ""}`}
        type="button"
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={isHold && !reduced ? { scale: [1, 0.98, 1] } : { opacity: 1, scale: 1 }}
        whileHover={recipe.id === "hover-effect" && !reduced ? { y: -3, scale: 1.01 } : undefined}
        whileTap={!reduced ? { scale: 0.97 } : undefined}
        transition={isHold ? { duration: 0.8, ease: "linear" } : transition}
      >
        {isHold ? <motion.i className="primitive-hold-fill" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={reduced ? { duration: 0.12 } : { duration: 0.8, ease: "linear" }} /> : null}
        <span>{isHold ? (locale === "zh" ? "按住确认" : "Hold to confirm") : (locale === "zh" ? "保存更改" : "Save changes")}</span>
      </motion.button>
    </SceneShell>
  );
}

function TimingScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  const distance = numberValue(values, "distance", 120);
  const transition = transitionFor(recipe, values);
  const [paused, setPaused] = useState(false);

  return (
    <SceneShell label={recipe.id === "spring" ? "Spring" : (locale === "zh" ? "速度曲线" : "Easing curve")}>
      <div className="primitive-curve-board">
        <svg viewBox="0 0 160 86" aria-hidden="true"><path d={recipe.id === "spring" ? "M8 74 C35 73 34 9 68 15 S99 74 119 34 S142 15 152 21" : "M8 74 C43 73 43 15 152 14"} /><line x1="8" y1="74" x2="152" y2="74" /></svg>
        <div className="primitive-motion-track">
          <motion.i
            initial={{ x: -distance / 2 }}
            animate={paused || reduced ? { x: 0 } : { x: distance / 2 }}
            transition={reduced ? { duration: 0.12 } : transition}
          />
        </div>
        <button type="button" onClick={() => setPaused((value) => !value)}>{paused ? (locale === "zh" ? "继续" : "Resume") : (locale === "zh" ? "暂停" : "Pause")}</button>
      </div>
    </SceneShell>
  );
}

function LoopScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  const transition = transitionFor(recipe, values);
  const repeat = reduced ? 0 : Infinity;

  if (recipe.id === "marquee") {
    return (
      <SceneShell label={locale === "zh" ? "团队状态" : "Team status"}>
        <div className="primitive-marquee"><motion.div animate={{ x: reduced ? "0%" : "-50%" }} transition={{ duration: 7, ease: "linear", repeat }}><span>Motion</span><span>Keyboard</span><span>Reduced</span><span>Motion</span><span>Keyboard</span><span>Reduced</span></motion.div></div>
      </SceneShell>
    );
  }

  if (recipe.id === "orbit") {
    return (
      <SceneShell label={locale === "zh" ? "同步中" : "Syncing"}>
        <div className="primitive-orbit"><strong>ML</strong><motion.div animate={{ rotate: reduced ? 0 : 360 }} transition={{ duration: 4.8, ease: "linear", repeat }}><i /></motion.div></div>
      </SceneShell>
    );
  }

  return (
    <SceneShell label={locale === "zh" ? "运行状态" : "Runtime status"}>
      <div className="primitive-idle-card">
        <motion.i animate={recipe.id === "idle-animation" && !reduced ? { y: [-2, 2, -2], scale: [1, 1.04, 1] } : { rotate: reduced ? 0 : [0, 8, -8, 0] }} transition={{ ...transition, duration: 1.8, repeat }} />
        <div><strong>{locale === "zh" ? "服务正常" : "Service healthy"}</strong><span /></div>
      </div>
    </SceneShell>
  );
}

function EffectScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  const transition = transitionFor(recipe, values);

  if (recipe.id === "before-after-slider") {
    return (
      <SceneShell label={locale === "zh" ? "设计对比" : "Design compare"}>
        <div className="primitive-before-after"><div /><motion.i drag="x" dragConstraints={{ left: -72, right: 72 }} dragElastic={0} initial={{ x: -18 }} animate={{ x: reduced ? 0 : 18 }} transition={{ type: "spring", stiffness: 220, damping: 26 }}><b /></motion.i></div>
      </SceneShell>
    );
  }

  if (recipe.id === "line-drawing") {
    return (
      <SceneShell label={locale === "zh" ? "完成" : "Complete"}>
        <div className="primitive-drawn-status"><motion.svg viewBox="0 0 44 44" fill="none"><motion.circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="2" initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={reduced ? { duration: 0.12 } : transition} /><motion.path d="m14 22 5 5 11-12" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={reduced ? { duration: 0.12 } : { ...transition, delay: 0.12 }} /></motion.svg><strong>{locale === "zh" ? "发布成功" : "Published"}</strong></div>
      </SceneShell>
    );
  }

  if (recipe.id === "skeleton-shimmer") {
    return (
      <SceneShell label={locale === "zh" ? "载入项目" : "Loading project"}>
        <div className="primitive-skeleton"><motion.i animate={{ x: reduced ? "0%" : ["-140%", "180%"] }} transition={{ duration: 1.4, ease: "linear", repeat: reduced ? 0 : Infinity }} /><b /><span /><span /><span /></div>
      </SceneShell>
    );
  }

  if (recipe.id === "number-ticker") {
    return (
      <SceneShell label={locale === "zh" ? "本周使用" : "Weekly usage"}>
        <div className="primitive-number"><motion.strong initial={reduced ? false : { y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={reduced ? { duration: 0.12 } : transition}>2,408</motion.strong><span>+18.4%</span></div>
      </SceneShell>
    );
  }

  if (recipe.id === "typewriter") {
    return (
      <SceneShell label={locale === "zh" ? "命令" : "Command"}>
        <div className="primitive-typewriter"><span>›</span><motion.code initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={reduced ? { duration: 0.12 } : { duration: 0.72, ease: "linear" }}>npx shadcn add motion</motion.code></div>
      </SceneShell>
    );
  }

  return (
    <SceneShell label={locale === "zh" ? "状态更新" : "Status update"}>
      <motion.div className="primitive-effect-card" initial={reduced ? false : { opacity: 0, y: 8, filter: recipe.id === "blur" ? "blur(12px)" : "blur(0px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={reduced ? { duration: 0.12 } : transition}>
        <span /><strong>{recipe.id === "text-morph" ? (locale === "zh" ? "已保存" : "Saved") : (locale === "zh" ? "资源已准备" : "Asset ready")}</strong><i /><i />
      </motion.div>
    </SceneShell>
  );
}

function PerformanceScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  if (recipe.surfaceType === "guide") return <GuideScene locale={locale} recipe={recipe} values={values} />;
  const distance = numberValue(values, "distance", 48);
  return (
    <SceneShell label={locale === "zh" ? "渲染路径" : "Render path"}>
      <div className="primitive-performance">
        <div><span>Layout</span><i><motion.b initial={{ scaleX: 0.22 }} animate={{ scaleX: 0.82 }} transition={{ duration: reduced ? 0.12 : 0.56, ease: arrive }} /></i></div>
        <div><span>Composite</span><i><motion.b initial={{ x: -distance / 2, scaleX: 0.18 }} animate={{ x: 0, scaleX: 0.48 }} transition={{ duration: reduced ? 0.12 : 0.34, ease: arrive }} /></i></div>
      </div>
    </SceneShell>
  );
}

function PrincipleScene({ locale, recipe, values }: SceneProps) {
  const reduced = useReducedMotion();
  if (recipe.surfaceType === "guide") return <GuideScene locale={locale} recipe={recipe} values={values} />;
  return (
    <SceneShell label={locale === "zh" ? "动作预备" : "Anticipation"}>
      <div className="primitive-anticipation">
        <motion.button type="button" initial={{ scale: 1 }} animate={reduced ? { opacity: 1 } : { scale: [1, 0.96, 1.045, 1], y: [0, 2, -2, 0] }} transition={{ duration: reduced ? 0.12 : numberValue(values, "duration", 520) / 1000, ease: arrive }}>{locale === "zh" ? "继续" : "Continue"}</motion.button>
        <span><i /><i /><i /></span>
      </div>
    </SceneShell>
  );
}

function GuideScene({ locale, recipe }: SceneProps) {
  const labels = useMemo(() => ({
    "frame-rate": locale === "zh" ? ["帧预算", "主线程", "合成"] : ["Frame budget", "Main thread", "Compositing"],
    "purposeful-animation": locale === "zh" ? ["目的", "频率", "空间"] : ["Purpose", "Frequency", "Space"],
    "perceived-performance": locale === "zh" ? ["即时反馈", "持续进度", "完成"] : ["Immediate", "Progress", "Complete"],
    "reduced-motion": locale === "zh" ? ["移动", "淡化", "保持含义"] : ["Travel", "Fade", "Preserve meaning"]
  }[recipe.id] ?? ["Trigger", "Motion", "Result"]), [locale, recipe.id]);

  return (
    <SceneShell label={text(recipe.name, locale)} className="primitive-guide-scene">
      <div className="primitive-guide-flow">
        {labels.map((label, index) => <div key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong>{index < labels.length - 1 ? <i /> : null}</div>)}
      </div>
    </SceneShell>
  );
}
