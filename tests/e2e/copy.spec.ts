import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const finderCases = [
  {
    locale: "zh",
    query: "让卡片带着重量感进入，最后稳稳收住",
    title: "候选动效",
    output: "复制实现",
    recipeSummaries: ["复制实现", "动效词义", "实现规则", "发布检查"]
  },
  {
    locale: "en",
    query: "Make the card enter with a sense of weight, then settle cleanly",
    title: "Motion candidates",
    output: "Copy implementation",
    recipeSummaries: ["Copy implementation", "Motion vocabulary", "Implementation rules", "Ship checklist"]
  }
] as const;

test("finder and recipe workspaces keep bilingual UI copy concise", async ({ page }) => {
  for (const entry of finderCases) {
    await page.goto(`/${entry.locale}/finder/`);
    await expect(page.locator(".finder-empty")).toHaveCount(0);
    await expect(page.locator(".finder-search > small")).toHaveCount(0);

    await page.goto(`/${entry.locale}/finder/?q=${encodeURIComponent(entry.query)}`);
    await expect(page.locator("#finder-results-title")).toHaveText(entry.title);
    await expect(page.locator(".finder-inspector-copy, .finder-inspector-status")).toHaveCount(0);
    await expect(page.locator(".finder-export-disclosure > summary strong")).toHaveText(entry.output);
    await expect(page.locator(".library-code-status")).toHaveCount(0);

    await page.goto(`/${entry.locale}/entrances/slide-in/`);
    await expect(page.locator(".library-sync-status")).toHaveCount(0);
    await expect(page.locator(".apple-disclosure-copy")).toHaveCount(0);
    await expect(page.locator(".apple-disclosure-summary strong")).toHaveText(entry.recipeSummaries);
  }
});

test("catalog and vocabulary use precise bilingual labels", async ({ page }) => {
  await page.goto("/zh/catalog/?surface=components");
  await expect(page.locator(".library-catalog-hero-unified h1")).toHaveText("动效库");
  await expect(page.locator(".library-catalog-hero-unified > span, .library-catalog-hero-unified > p")).toHaveCount(0);

  await page.goto("/en/catalog/?surface=components");
  await expect(page.locator(".library-catalog-hero-unified h1")).toHaveText("Motion library");

  await page.goto("/zh/vocabulary/");
  await expect(page.locator(".vocabulary-definition").first()).toContainText("英文定义");
  await expect(page.locator(".vocabulary-open-link").first()).toHaveText(/查看工作区/);

  await page.goto("/en/vocabulary/");
  await expect(page.locator(".vocabulary-definition").first()).toContainText("English definition");
  await expect(page.locator(".vocabulary-open-link").first()).toHaveText(/Open workspace/);
});

test("the static 404 page localizes Chinese and English routes", async ({ browser }) => {
  const notFoundHtml = await readFile(new URL("../../public/404.html", import.meta.url), "utf8");
  const cases = [
    {
      path: "/zh/missing/",
      language: "zh-CN",
      title: "页面未找到 | Motion Lexicon",
      message: "页面未找到。返回动效库继续浏览。",
      link: "/zh/catalog/"
    },
    {
      path: "/en/missing/",
      language: "en",
      title: "Page not found | Motion Lexicon",
      message: "This page doesn’t exist. Return to the motion library.",
      link: "/en/catalog/"
    }
  ] as const;

  for (const entry of cases) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.route(`https://motion-lexicon.test${entry.path}`, (route) =>
      route.fulfill({ status: 404, contentType: "text/html", body: notFoundHtml })
    );
    await page.goto(`https://motion-lexicon.test${entry.path}`);

    await expect(page.locator("html")).toHaveAttribute("lang", entry.language);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator("h1")).toHaveText("404");
    await expect(page.locator("p")).toHaveText(entry.message);
    await expect(page.locator("a")).toHaveAttribute("href", entry.link);

    await context.close();
  }
});
