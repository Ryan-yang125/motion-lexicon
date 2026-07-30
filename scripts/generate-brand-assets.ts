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

function ogMarkup(locale: "zh" | "en") {
  const title = locale === "zh"
    ? "说出感觉，<br>找到准确动效。"
    : "Describe the feeling.<br>Find the right motion.";
  const copy = locale === "zh"
    ? "一个主预览，三个静态候选；选好动效并调参，再复制 Prompt 或前端实现。"
    : "Use one active preview and three static choices, tune the motion, then copy the prompt or implementation.";
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
      .query { height: 48px; display: flex; align-items: center; padding: 0 16px; border-radius: 14px; color: #6e6e73; background: #f5f5f7; font-size: 13px; }
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
    <div class="meta">44 MOTION RECIPES · 91 TERMS · FREE &amp; OPEN</div>
    <div class="preview">
      <div class="preview-head"><strong>Motion Finder</strong><span>${locale === "zh" ? "三个候选" : "3 candidates"}</span></div>
      <div class="preview-body">
        <div class="query">${locale === "zh" ? "卡片弹出来要有重量，最后收得住" : "Make the card feel weighted, then settle"}</div>
        <div class="choice primary"><div><strong>${locale === "zh" ? "弹簧" : "Spring"}</strong><span>${locale === "zh" ? "有重量，落点自然" : "Weighted with a natural settle"}</span></div><i></i></div>
        <div class="choice"><div><strong>${locale === "zh" ? "弹入" : "Pop in"}</strong><span>${locale === "zh" ? "更直接、更有活力" : "Direct and energetic"}</span></div><i></i></div>
        <div class="choice"><div><strong>${locale === "zh" ? "缩放入场" : "Scale in"}</strong><span>${locale === "zh" ? "平稳、克制" : "Calm and restrained"}</span></div><i></i></div>
      </div>
      <div class="steps"><b>Describe</b><span>Choose</span><span>Tune</span><span>Use</span></div>
      <svg class="curve" viewBox="0 0 88 88"><path d="M22 64V24M22 64H66" fill="none" stroke="#1d1d1f" stroke-linecap="round" stroke-width="4"/><path d="M23 62C26 35 37 27 65 25" fill="none" stroke="#1d1d1f" stroke-linecap="round" stroke-width="6"/><circle cx="65" cy="25" r="6.5" fill="#0a84ff"/></svg>
    </div>
  `;
}

async function captureOg(locale: "zh" | "en", filename: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(ogMarkup(locale));
  await page.screenshot({ path: path.join(publicDir, filename) });
  await browser.close();
}

await captureIcon(180, "apple-touch-icon.png");
await captureIcon(192, "icon-192.png");
await captureIcon(512, "icon-512.png");
await captureOg("en", "og-default.png");
await captureOg("en", "og-en.png");
await captureOg("zh", "og-zh.png");

execFileSync("ffmpeg", [
  "-loglevel", "error",
  "-y",
  "-i", path.join(publicDir, "icon-192.png"),
  "-vf", "scale=64:64",
  path.join(publicDir, "favicon.ico")
]);
