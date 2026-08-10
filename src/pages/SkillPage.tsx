import { CopyButton } from "../registry/components/copy-button";
import { Seo } from "../components/Seo";
import { CheckIcon, GithubIcon, MotionSkillGlyph } from "../components/icons";
import { pathFor } from "../data/site";
import type { Locale } from "../data/types";

const install = "npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon";

export function SkillPage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const modes = zh
    ? [
        ["推荐", "根据产品场景选择合适的单个动效。"],
        ["编排", "把多个动效组合成完整的产品瞬间。"],
        ["实现", "输出 React、HTML、CSS 或 JavaScript。"],
        ["审查", "检查节奏、连续性、性能与无障碍。"],
        ["贡献", "把真实需求整理为新的组件或原子动效候选。"]
      ]
    : [
        ["Recommend", "Choose a fitting primitive for the product event."],
        ["Compose", "Combine motion into a complete product interaction."],
        ["Implement", "Deliver React, HTML, CSS, or JavaScript."],
        ["Review", "Audit rhythm, continuity, performance, and accessibility."],
        ["Contribute", "Turn a real request into a component or primitive candidate."]
      ];
  const description = zh
    ? "从产品场景出发，推荐、编排、实现和审查界面动效。"
    : "Recommend, compose, implement, and review interface motion from a real product event.";

  return (
    <>
      <Seo locale={locale} title={`Motion Lexicon Agent Skill — Motion Lexicon`} description={description} path={pathFor(locale, ["skill"])} image={`/og-skill-${locale}.png`} />
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
          {modes.map(([name, summary]) => (
            <article key={name}>
              <CheckIcon size={15} aria-hidden="true" />
              <div><h2>{name}</h2><p>{summary}</p></div>
            </article>
          ))}
        </section>

        <section className="skill-contract">
          <h2>{zh ? "每次交付都包含" : "Every delivery includes"}</h2>
          <ul>
            {(zh
              ? ["明确的产品事件与状态变化", "可中断的节奏与最终状态", "键盘、焦点与减弱动效方案", "可直接放进项目的实现"]
              : ["A clear product event and state change", "Interruptible timing and a stable resting state", "Keyboard, focus, and reduced-motion behavior", "Implementation ready for the project"]
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
