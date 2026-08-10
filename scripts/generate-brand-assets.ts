import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const mark = `
  <svg viewBox="0 0 88 88" aria-hidden="true">
    <rect width="88" height="88" rx="23" fill="#151516" />
    <path d="M22 64V24M22 64H66" fill="none" stroke="rgba(255,255,255,.32)" stroke-linecap="round" stroke-width="4" />
    <path d="M23 62C26 35 37 27 65 25" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="6" />
    <circle cx="23" cy="62" r="5" fill="#ffffff" />
    <circle cx="65" cy="25" r="6.5" fill="#0a84ff" />
  </svg>`;

async function captureIcon(size: number, filename: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`
    <style>
      html, body { width: 100%; height: 100%; margin: 0; background: transparent; }
      svg { display: block; width: 100%; height: 100%; }
    </style>
    ${mark}
  `);
  await page.screenshot({ path: path.join(publicDir, filename), omitBackground: true });
  await browser.close();
}

type OgKind = "home" | "components" | "primitives" | "guides" | "method" | "skill" | "vocabulary";

const ogContent: Record<OgKind, Record<"zh" | "en", { title: string; copy: string; preview: string; meta: string }>> = {
  home: {
    zh: { title: "把成熟动效组件，<br>直接带进产品。", copy: "48 个 React 动效组件与 44 个可调节原子动效。", preview: "Motion Lexicon", meta: "48 COMPONENTS · 44 PRIMITIVES · FREE & OPEN" },
    en: { title: "Bring refined motion<br>straight into your product.", copy: "48 React motion components and 44 adjustable motion primitives.", preview: "Motion Lexicon", meta: "48 COMPONENTS · 44 PRIMITIVES · FREE & OPEN" }
  },
  components: {
    zh: { title: "完整交互组件，<br>预览后直接安装。", copy: "真实状态、键盘操作与减弱动效，封装在同一份 React 源码里。", preview: "React Components", meta: "48 COMPONENTS · SHADCN REGISTRY · MIT" },
    en: { title: "Complete interactions,<br>ready to install.", copy: "Real states, keyboard behavior, and reduced motion in one React source.", preview: "React Components", meta: "48 COMPONENTS · SHADCN REGISTRY · MIT" }
  },
  primitives: {
    zh: { title: "一个动效，<br>放进真实场景。", copy: "44 个可预览、可调节的动效基础，覆盖进入、节奏、状态和反馈。", preview: "Motion Primitives", meta: "44 MOTION PRIMITIVES · 91 TERMS · FREE & OPEN" },
    en: { title: "Put one motion<br>in a real context.", copy: "44 previewable, tunable motion primitives for arrival, timing, state, and feedback.", preview: "Motion Primitives", meta: "44 MOTION PRIMITIVES · 91 TERMS · FREE & OPEN" }
  },
  guides: {
    zh: { title: "从真实产品问题，<br>开始设计动效。", copy: "八篇场景指南，连接产品状态、动效基础和可复制的产品瞬间。", preview: "Scenario guides", meta: "8 SCENARIO GUIDES · FREE & OPEN" },
    en: { title: "Design motion from<br>real product questions.", copy: "Eight scenario guides connect product state, motion primitives, and copy-ready moments.", preview: "Scenario guides", meta: "8 SCENARIO GUIDES · FREE & OPEN" }
  },
  method: {
    zh: { title: "内容方法、来源和<br>开源维护方式。", copy: "了解 Motion Lexicon 如何编写、验证和维护每一条公开内容。", preview: "Method and sources", meta: "OPEN SOURCE · BILINGUAL · VERIFIED" },
    en: { title: "Method, sources, and<br>open maintenance.", copy: "See how Motion Lexicon authors, verifies, and maintains public content.", preview: "Method and sources", meta: "OPEN SOURCE · BILINGUAL · VERIFIED" }
  },
  skill: {
    zh: { title: "让 Agent 设计、<br>实现并审查动效。", copy: "从产品场景选择原子动效，组合完整交互，并输出可用代码。", preview: "Agent Skill", meta: "RECOMMEND · COMPOSE · IMPLEMENT · REVIEW" },
    en: { title: "Let your agent design,<br>build, and review motion.", copy: "Choose primitives from product context, compose interactions, and deliver working code.", preview: "Agent Skill", meta: "RECOMMEND · COMPOSE · IMPLEMENT · REVIEW" }
  },
  vocabulary: {
    zh: { title: "91 个中英双语，<br>界面动效术语。", copy: "定义、辨析和对应工作区，帮助团队说清同一段动效。", preview: "Animation vocabulary", meta: "91 MOTION TERMS · BILINGUAL · FREE" },
    en: { title: "91 bilingual terms<br>for interface motion.", copy: "Definitions, distinctions, and matching workspaces help teams name the same motion.", preview: "Animation vocabulary", meta: "91 MOTION TERMS · BILINGUAL · FREE" }
  }
};

function ogMarkup(locale: "zh" | "en", kind: OgKind) {
  const content = ogContent[kind][locale];
  const { title, copy } = content;
  return `
    <style>
      * { box-sizing: border-box; }
      html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
      body {
        position: relative;
        padding: 58px 68px;
        color: #1d1d1f;
        background: #f5f5f7;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
      }
      .top { display: flex; align-items: center; gap: 14px; font-size: 21px; font-weight: 680; letter-spacing: -.025em; }
      .top svg { width: 40px; height: 40px; filter: drop-shadow(0 6px 12px rgb(0 0 0 / 12%)); }
      h1 { width: 650px; margin: 78px 0 22px; font-size: 66px; font-weight: 680; line-height: .98; letter-spacing: -0.058em; }
      p { width: 620px; margin: 0; color: #6e6e73; font-size: 21px; line-height: 1.55; }
      .meta { position: absolute; left: 68px; bottom: 50px; color: #86868b; font-size: 15px; font-weight: 600; letter-spacing: .02em; }
      .preview {
        position: absolute;
        width: 398px;
        height: 430px;
        right: 68px;
        top: 100px;
        overflow: hidden;
        border: 1px solid rgb(29 29 31 / 12%);
        border-radius: 28px;
        background: #ffffff;
        box-shadow: 0 30px 70px rgb(0 0 0 / 11%);
      }
      .preview-head { height: 58px; display: flex; align-items: center; justify-content: space-between; padding: 0 22px; border-bottom: 1px solid rgb(29 29 31 / 9%); color: #86868b; font-size: 13px; }
      .preview-head strong { color: #1d1d1f; font-size: 14px; }
      .preview-body { padding: 20px; }
      .query { height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-radius: 14px; color: #1d1d1f; background: #f5f5f7; font-size: 13px; font-weight: 650; }
      .query span { color: #86868b; font: 600 11px/1 ui-monospace, monospace; }
      .choice { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px; margin-top: 12px; padding: 17px; border: 1px solid rgb(29 29 31 / 9%); border-radius: 17px; }
      .choice.primary { border-color: rgb(10 132 255 / 42%); box-shadow: inset 3px 0 #0a84ff; }
      .choice div { display: grid; gap: 5px; }
      .choice strong { font-size: 16px; }
      .choice span { color: #86868b; font-size: 12px; }
      .choice i { width: 8px; height: 8px; border-radius: 50%; background: #d1d1d6; }
      .choice.primary i { background: #0a84ff; }
      .steps { position: absolute; left: 22px; right: 22px; bottom: 22px; display: flex; align-items: center; justify-content: space-between; color: #86868b; font-size: 11px; font-weight: 650; }
      .steps b { color: #0a84ff; font-weight: 700; }
      .curve {
        position: absolute;
        width: 140px;
        height: 140px;
        right: -18px;
        bottom: -16px;
        opacity: .05;
      }
    </style>
    <div class="top">${mark}<span>Motion Lexicon</span></div>
    <h1>${title}</h1>
    <p>${copy}</p>
    <div class="meta">${content.meta}</div>
    <div class="preview">
      <div class="preview-head"><strong>${content.preview}</strong><span>${locale === "zh" ? "可直接带走" : "ready to take"}</span></div>
      <div class="preview-body">
        <div class="query">${locale === "zh" ? "组件目录" : "Component directory"}<span>48</span></div>
        <div class="choice primary"><div><strong>${locale === "zh" ? "复制按钮" : "Copy button"}</strong><span>React · Motion</span></div><i></i></div>
        <div class="choice"><div><strong>${locale === "zh" ? "抽屉" : "Drawer"}</strong><span>${locale === "zh" ? "焦点 · 拖拽 · 中断" : "Focus · drag · interrupt"}</span></div><i></i></div>
        <div class="choice"><div><strong>${locale === "zh" ? "行内校验" : "Inline validation"}</strong><span>${locale === "zh" ? "等待 · 错误 · 通过" : "Pending · error · success"}</span></div><i></i></div>
      </div>
      <div class="steps"><b>Preview</b><span>Source</span><span>Registry</span><span>Install</span></div>
      <svg class="curve" viewBox="0 0 88 88"><path d="M22 64V24M22 64H66" fill="none" stroke="#1d1d1f" stroke-linecap="round" stroke-width="4"/><path d="M23 62C26 35 37 27 65 25" fill="none" stroke="#1d1d1f" stroke-linecap="round" stroke-width="6"/><circle cx="65" cy="25" r="6.5" fill="#0a84ff"/></svg>
    </div>
  `;
}

async function captureOg(locale: "zh" | "en", kind: OgKind, filename: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(ogMarkup(locale, kind));
  await page.screenshot({ path: path.join(publicDir, filename) });
  await browser.close();
}

await captureIcon(180, "apple-touch-icon.png");
await captureIcon(192, "icon-192.png");
await captureIcon(512, "icon-512.png");
await captureOg("en", "home", "og-default.png");
await captureOg("en", "home", "og-en.png");
await captureOg("zh", "home", "og-zh.png");
for (const kind of ["home", "components", "primitives", "guides", "method", "skill", "vocabulary"] as const) {
  await captureOg("zh", kind, `og-${kind}-zh.png`);
  await captureOg("en", kind, `og-${kind}-en.png`);
}

execFileSync("ffmpeg", [
  "-loglevel", "error",
  "-y",
  "-i", path.join(publicDir, "icon-192.png"),
  "-vf", "scale=64:64",
  path.join(publicDir, "favicon.ico")
]);
