import { CopyButton } from "../registry/components/copy-button";
import { Seo } from "../components/Seo";
import { CheckIcon, GithubIcon, MotionSkillGlyph } from "../components/icons";
import { motionSkillModes } from "../data/motion-grammar";
import { pathFor } from "../data/site";
import type { Locale } from "../data/types";

const install = "npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon";

export function SkillPage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const description = zh
    ? "从产品任务出发，构建完整页面并设计可交付的界面动效。"
    : "Build complete product pages and delivery-ready interface motion from a real product job.";

  return (
    <>
      <Seo locale={locale} title={zh ? "Motion Lexicon 智能体技能 — Motion Lexicon" : "Motion Lexicon Agent Skill — Motion Lexicon"} description={description} path={pathFor(locale, ["skill"])} image={`/og-skill-${locale}.png`} />
      <article className="skill-page">
        <header className="skill-hero">
          <MotionSkillGlyph size={28} aria-hidden="true" />
          <span>Agent Skill</span>
          <h1>Motion Lexicon</h1>
          <p>{description}</p>
          <div className="skill-install">
            <code>{install}</code>
            <CopyButton value={install} label={zh ? "复制命令" : "Copy command"} copiedLabel={zh ? "已复制" : "Copied"} errorLabel={zh ? "复制失败" : "Copy failed"} />
          </div>
        </header>

        <section className="skill-modes" aria-label={zh ? "Skill 模式" : "Skill modes"}>
          {motionSkillModes.map((mode) => (
            <article key={mode.id}>
              <CheckIcon size={15} aria-hidden="true" />
              <div><h2>{mode.title[locale]}</h2><p>{mode.description[locale]}</p></div>
            </article>
          ))}
        </section>

        <section className="skill-contract">
          <h2>{zh ? "每次交付都包含" : "Every delivery includes"}</h2>
          <ul>
            {(zh
              ? ["完整页面计划与精确信息层级", "已发布组件与 Registry 来源", "键盘、焦点与减弱动效方案", "响应式实现与验收记录"]
              : ["A complete page plan and precise hierarchy", "Published components with Registry sources", "Keyboard, focus, and reduced-motion behavior", "Responsive implementation and acceptance evidence"]
            ).map((item) => <li key={item}><CheckIcon size={14} aria-hidden="true" />{item}</li>)}
          </ul>
          <a href="https://github.com/Ryan-yang125/motion-lexicon/tree/main/skills/motion-lexicon" target="_blank" rel="noreferrer">
            <GithubIcon size={15} aria-hidden="true" />
            {zh ? "查看 Skill 源码" : "View Skill source"}
          </a>
        </section>
      </article>
    </>
  );
}
