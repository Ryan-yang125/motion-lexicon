import { expect, test } from "@playwright/test";

test("Motion Director is a canonical bilingual creation entry with an overflow-safe surface", async ({ page }) => {
  await page.goto("/zh/director/");

  await expect(page).toHaveTitle(/Motion Director/);
  await expect(page.getByRole("heading", { level: 1, name: "从产品场景出发，写出有判断的动效。" })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://motion-lexicon.pages.dev/zh/director/"
  );
  await expect(page.locator(".director-mode-card")).toHaveCount(5);
  await expect(page.locator(".director-blueprint-sheet")).toContainText("发送请求");
  await page.getByRole("button", { name: "发送请求" }).click();
  await expect(page.getByText("已发送", { exact: true })).toBeVisible({ timeout: 1_500 });
  await expect(page.locator(".director-scene")).toHaveAttribute("data-state", "awaiting");
  await expect(page.locator(".director-scene-record-status")).toHaveText("等待回复");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  await page.goto("/en/director/");
  await expect(page.getByRole("heading", { level: 1, name: "Start with the product scene. Make a considered motion decision." })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://motion-lexicon.pages.dev/en/director/"
  );
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByText("Sent", { exact: true })).toBeVisible({ timeout: 1_500 });
  await expect(page.locator(".director-scene")).toHaveAttribute("data-state", "awaiting");
  await expect(page.locator(".director-scene-record-status")).toHaveText("Awaiting");
});

test("candidate library is reachable, prerendered, and noindex", async ({ page }) => {
  await page.goto("/zh/lab/motion-blueprints/");

  await expect(page.getByRole("heading", { level: 1, name: "候选库" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
  await expect(page.locator(".blueprint-lab-card")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "返回 Motion Director" })).toHaveAttribute("href", "/zh/director/");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("home navigation marks Home active and exposes Finder, Packs, Primitives, Guides, and Director", async ({ page }, testInfo) => {
  await page.goto("/zh/");

  await expect(page.getByRole("link", { name: "进入 Motion Director" })).toHaveAttribute("href", "/zh/director/");
  if (!testInfo.project.name.includes("mobile")) {
    const nav = page.getByRole("navigation", { name: "主导航" });
    await expect(nav.getByRole("link", { name: "首页" })).toHaveAttribute("href", "/zh/");
    await expect(nav.getByRole("link", { name: "首页" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "找动效" })).toHaveAttribute("href", "/zh/finder/");
    await expect(nav.getByRole("link", { name: "产品瞬间" })).toHaveAttribute("href", "/zh/packs/");
    await expect(nav.getByRole("link", { name: "动效基础" })).toHaveAttribute("href", "/zh/catalog/?surface=components");
    await expect(nav.getByRole("link", { name: "场景指南" })).toHaveAttribute("href", "/zh/guides/");
    await expect(page.locator("header.library-header").getByRole("link", { name: "Motion Director" })).toHaveAttribute("href", "/zh/director/");

    await page.setViewportSize({ width: 1100, height: 900 });
    await page.getByRole("button", { name: "资源" }).click();
    const compactNavigation = page.getByRole("navigation", { name: "移动端导航" });
    await expect(compactNavigation.getByRole("link", { name: "首页" })).toHaveAttribute("aria-current", "page");
  }

  await page.getByRole("link", { name: "进入 Motion Director" }).click();
  await expect(page).toHaveURL(/\/zh\/director\/$/);
});

test("primary navigation assigns one current item on home and scenario guide detail routes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The primary navigation is visually hidden on mobile.");

  const primaryNavigation = page.locator("header.library-header .library-primary-nav");

  await page.goto("/zh/");
  await expect(primaryNavigation.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(primaryNavigation.getByRole("link", { name: "首页" })).toHaveAttribute("aria-current", "page");

  await page.goto("/zh/guides/css-motion-jank/");
  await expect(primaryNavigation.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(primaryNavigation.getByRole("link", { name: "场景指南" })).toHaveAttribute("aria-current", "page");
  await expect(primaryNavigation.getByRole("link", { name: "首页" })).not.toHaveAttribute("aria-current", "page");
  await expect(page.locator("header.library-header .library-brand")).not.toHaveAttribute("aria-current", "page");
});

test("English header adopts its compact navigation before labels crowd the action area", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop Chromium exercises the intermediate header widths.");

  for (const width of [1121, 1200, 1250]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en/");

    await expect(page.locator("header.library-header .library-primary-nav"), `${width}px primary navigation`).toBeHidden();
    await expect(page.locator("header.library-header .library-director-link"), `${width}px director link`).toBeHidden();
    await expect(page.locator("header.library-header .library-utility-trigger"), `${width}px resource trigger`).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `English home at ${width}px`).toBeLessThanOrEqual(1);
  }
});

test("resource navigation assigns the vocabulary route one current item", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop Chromium exercises the compact resource navigation.");

  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto("/zh/vocabulary/");
  await page.getByRole("button", { name: "资源" }).click();

  const compactNavigation = page.getByRole("navigation", { name: "移动端导航" });
  await expect(compactNavigation.getByRole("link", { name: "动画词汇" })).toHaveAttribute("aria-current", "page");
  await expect(compactNavigation.getByRole("link", { name: "动效基础" })).not.toHaveAttribute("aria-current", "page");
});

test("Director and candidate layouts stay within every product breakpoint", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop Chromium exercises the full breakpoint range once.");

  for (const width of [320, 390, 768, 820, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/zh/director/", "/en/director/", "/zh/lab/motion-blueprints/"]) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});
