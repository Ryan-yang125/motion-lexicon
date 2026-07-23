import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const mark = `
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="14" fill="#0a0a0a" />
    <circle cx="32" cy="32" r="15" fill="none" stroke="#ffffff" stroke-width="3" />
    <path d="m23 37 18-10" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="3" />
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
    ? "看得见、调得动，<br>复制就能用的动效库。"
    : "See it. Tune it.<br>Copy motion ready to use.";
  const copy = locale === "zh"
    ? "实时预览、参数控制、CSS、HTML、JS 和 Agent 提示词。"
    : "Live previews, focused controls, CSS, HTML, JS, and agent-ready prompts.";
  return `
    <style>
      * { box-sizing: border-box; }
      html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
      body {
        position: relative;
        padding: 54px 64px;
        color: #0a0a0a;
        background: #ffffff;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
      }
      .top { display: flex; align-items: center; gap: 14px; font-size: 22px; font-weight: 650; }
      .top svg { width: 36px; height: 36px; }
      h1 { width: 690px; margin: 84px 0 22px; font-size: 62px; line-height: 1.06; letter-spacing: -0.05em; }
      p { width: 680px; margin: 0; color: #525252; font-size: 22px; line-height: 1.55; }
      .meta { position: absolute; left: 64px; bottom: 48px; color: #737373; font: 16px/1.4 ui-monospace, monospace; }
      .preview {
        position: absolute;
        width: 362px;
        height: 382px;
        right: 64px;
        top: 132px;
        overflow: hidden;
        border: 1px solid #d4d4d4;
        border-radius: 12px;
        background:
          linear-gradient(#e5e5e5 1px, transparent 1px),
          linear-gradient(90deg, #e5e5e5 1px, transparent 1px),
          #fafafa;
        background-size: 28px 28px;
        box-shadow: 0 18px 52px rgb(0 0 0 / 8%);
      }
      .preview::before { content: "Preview"; position: absolute; inset: 18px auto auto 20px; color: #737373; font: 14px/1 ui-monospace, monospace; }
      .card {
        position: absolute;
        left: 72px;
        top: 130px;
        width: 218px;
        height: 124px;
        padding: 24px;
        border: 1px solid #d4d4d4;
        border-radius: 9px;
        background: #ffffff;
        box-shadow: 0 1px 2px rgb(0 0 0 / 6%), 0 12px 30px rgb(0 0 0 / 7%);
      }
      .card strong { display: block; margin-bottom: 20px; font-size: 18px; }
      .line { width: 100%; height: 8px; margin-top: 10px; border-radius: 999px; background: #e5e5e5; }
      .line.short { width: 62%; }
      .accent { position: absolute; left: 0; bottom: 0; width: 38%; height: 3px; background: #2563eb; }
    </style>
    <div class="top">${mark}<span>Motion Lexicon</span></div>
    <h1>${title}</h1>
    <p>${copy}</p>
    <div class="meta">31 Components · 9 Playgrounds · 4 Guides</div>
    <div class="preview"><div class="card"><strong>${locale === "zh" ? "滑入" : "Slide in"}</strong><div class="line"></div><div class="line short"></div></div><div class="accent"></div></div>
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
