import { expect, test, webkit, type Page } from "@playwright/test";

const productRoutes = [
  "/zh/",
  "/zh/catalog/?surface=components",
  `/zh/finder/?q=${encodeURIComponent("卡片弹出来要有重量，最后收得住")}&compare=spring,pop-in,scale-in&selected=spring`,
  "/zh/sequencing/stagger/",
  "/en/catalog/?surface=components"
];

type TextStyleViolation = {
  element: string;
  text: string;
  value: string;
};

async function textStyleViolations(page: Page) {
  return page.evaluate(() => {
    const allowedSizes = new Set(["12px", "13px", "14px", "24px"]);
    const allowedWeights = new Set(["400", "500"]);
    const sizes: TextStyleViolation[] = [];
    const weights: TextStyleViolation[] = [];
    const tracking: TextStyleViolation[] = [];

    for (const element of document.querySelectorAll<HTMLElement>("body *")) {
      const hasOwnText = Array.from(element.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim())
      );
      if (!hasOwnText) continue;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === "none" || style.visibility === "hidden" || rect.width === 0 || rect.height === 0) continue;

      const identity = `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).trim().replace(/\s+/g, ".")}` : ""}`;
      const text = element.textContent?.trim().slice(0, 60) ?? "";
      if (!allowedSizes.has(style.fontSize)) sizes.push({ element: identity, text, value: style.fontSize });
      if (!allowedWeights.has(style.fontWeight)) weights.push({ element: identity, text, value: style.fontWeight });
      if (!["CODE", "KBD", "PRE"].includes(element.tagName) && style.letterSpacing !== "-0.15px") {
        tracking.push({ element: identity, text, value: style.letterSpacing });
      }
    }
    return { sizes, weights, tracking };
  });
}

async function expectMinimumTargets(page: Page, selector: string) {
  const locator = page.locator(selector);
  await expect(locator.first()).toBeVisible();
  const targets = await locator.evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));

  expect(targets.length, `Missing visible target for ${selector}`).toBeGreaterThan(0);
  for (const target of targets) {
    expect(target.width, `${selector} target is narrower than 44px`).toBeGreaterThanOrEqual(44);
    expect(target.height, `${selector} target is shorter than 44px`).toBeGreaterThanOrEqual(44);
  }
}

test("critical routes keep the four-level SF Pro type system", async ({ page }) => {
  for (const route of productRoutes) {
    await page.goto(route);
    await expect(page.locator("#main-content")).toBeVisible();
    const violations = await textStyleViolations(page);
    expect(violations.sizes, `${route} has unsupported font sizes`).toEqual([]);
    expect(violations.weights, `${route} has unsupported font weights`).toEqual([]);
    expect(violations.tracking, `${route} has unsupported letter spacing`).toEqual([]);
  }
});

test("320, 768, and 1024 pixel layouts keep controls readable without page overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Explicit responsive widths run once in desktop Chromium.");

  const cases = [
    { width: 320, route: "/en/catalog/?surface=components" },
    { width: 768, route: productRoutes[2] },
    { width: 1024, route: "/zh/sequencing/stagger/" }
  ];

  for (const item of cases) {
    await page.setViewportSize({ width: item.width, height: 900 });
    await page.goto(item.route);
    if (item.route.includes("/finder/")) await expect(page.locator(".finder-workspace-shell")).toBeVisible();
    const bounds = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));
    expect(bounds.scrollWidth, `${item.width}px ${item.route} overflows horizontally`).toBeLessThanOrEqual(bounds.clientWidth);
  }

  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/en/catalog/?surface=components");
  const surfaceButtons = page.locator(".library-surface-tabs button");
  await expect(surfaceButtons).toHaveCount(3);
  for (let index = 0; index < await surfaceButtons.count(); index += 1) {
    const button = surfaceButtons.nth(index);
    await expect(button).toHaveCSS("white-space", "nowrap");
    expect((await button.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
  const scrollCue = await page.locator(".library-category-filter-options").evaluate(
    (element) => getComputedStyle(element).maskImage || getComputedStyle(element).webkitMaskImage
  );
  expect(scrollCue).not.toBe("none");
});

test("dark Finder, Catalog, and recipe states render without overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Dark route coverage runs once in desktop Chromium.");
  await page.addInitScript(() => localStorage.setItem("motion-lexicon-theme:v1", "dark"));

  for (const route of [productRoutes[1], productRoutes[2], productRoutes[3]]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${route} overflows in dark mode`).toBeLessThanOrEqual(0);
  }
});

test("primary actions keep a neutral high-contrast treatment in both themes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Theme action tokens only need one browser audit.");

  await page.goto("/zh/");
  const action = page.locator(".apple-hero-finder button");
  await expect(action).toHaveCSS("background-color", "rgb(41, 41, 41)");
  await expect(action).toHaveCSS("color", "rgb(245, 245, 247)");
  await action.hover();
  await expect(action).toHaveCSS("background-color", "rgb(68, 68, 68)");

  await page.evaluate(() => localStorage.setItem("motion-lexicon-theme:v1", "dark"));
  await page.reload();
  await page.mouse.move(0, 0);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(action).toHaveCSS("background-color", "rgb(245, 245, 247)");
  await expect(action).toHaveCSS("color", "rgb(0, 0, 0)");
  await action.hover();
  await expect(action).toHaveCSS("background-color", "rgb(214, 214, 214)");
});

test("bordered product surfaces keep card geometry without decorative depth", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Surface treatment needs one browser audit.");

  const routes = [
    {
      route: "/zh/",
      surfaces: [
        { selector: ".apple-hero-finder > div", radius: "16px" },
        { selector: ".apple-hero-preview.library-hero-preview", radius: "16px" },
        { selector: ".apple-scene-card", radius: "16px" }
      ]
    },
    {
      route: productRoutes[2],
      surfaces: [
        { selector: ".apple-search-pill .finder-search-field", radius: "16px" },
        { selector: ".apple-inspector.finder-inspector", radius: "16px" },
        { selector: ".apple-export-disclosure", radius: "16px" }
      ]
    },
    {
      route: "/zh/catalog/?surface=components",
      surfaces: [{ selector: ".library-catalog-toolbar", radius: "16px" }]
    },
    {
      route: "/zh/sequencing/stagger/",
      surfaces: [
        { selector: ".apple-preview-stage.library-preview-frame", radius: "0px 0px 16px 16px" },
        { selector: ".library-parameter-panel.apple-inspector", radius: "16px" },
        { selector: ".apple-output-disclosure.apple-disclosure", radius: "16px" }
      ]
    },
    {
      route: "/zh/vocabulary/",
      surfaces: [{ selector: ".vocabulary-toolbar", radius: "16px" }]
    }
  ];

  for (const item of routes) {
    await page.goto(item.route);
    for (const surface of item.surfaces) {
      const locator = page.locator(surface.selector).first();
      await expect(locator).toHaveCSS("border-radius", surface.radius);
      await expect(locator).toHaveCSS("box-shadow", "none");
    }
  }

  await page.goto("/zh/catalog/?surface=components");
  await page.locator(".library-utility-menu > summary").click();
  await expect(page.locator(".library-utility-popover")).toHaveCSS("border-radius", "16px");
  await expect(page.locator(".library-utility-popover")).toHaveCSS("box-shadow", "none");

  await page.emulateMedia({ contrast: "more" });
  await page.goto("/zh/");
  await expect(page.locator(".apple-motion-card.library-card").first()).toHaveCSS("box-shadow", "none");
});

test("fine-pointer parameter primitives preserve the 44 pixel target baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Fine-pointer sizing runs in desktop Chromium.");
  await page.goto("/zh/entrances/slide-in/");
  await expectMinimumTargets(page, ".controls-head .ml-button");
  await expectMinimumTargets(page, ".ml-toggle-item");
  await expect(page.locator(".controls-head .ml-button").first()).toHaveCSS("border-radius", "8px");
  await expect(page.locator(".ml-toggle-group").first()).toHaveCSS("border-radius", "8px");
  await expect(page.locator(".ml-toggle-item").first()).toHaveCSS("border-radius", "8px");
});

test("coarse-pointer product controls preserve 44 pixel targets", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Target sizing uses the coarse-pointer project.");

  await page.goto(productRoutes[2]);
  for (const selector of [
    ".finder-active-preview-header .ml-button",
    ".finder-active-preview-copy > a",
    ".apple-code-output .ml-tabs-trigger"
  ]) await expectMinimumTargets(page, selector);
  await page.getByRole("tab", { name: "代码" }).click();
  await expectMinimumTargets(page, ".apple-code-output .library-code-filebar .ml-button");

  await page.goto("/zh/sequencing/stagger/");
  for (const selector of [
    ".library-device-switcher button",
    ".apple-preview-stage .preview-toolbar .ml-button",
    ".apple-code-output .ml-tabs-trigger"
  ]) await expectMinimumTargets(page, selector);

  await page.goto("/zh/vocabulary/");
  await expectMinimumTargets(page, ".vocabulary-index a");

  await page.goto("/zh/catalog/?surface=components");
  await expectMinimumTargets(page, ".library-footer-links a, .library-footer-resources a");
  await page.locator(".library-utility-menu > summary").click();
  await expectMinimumTargets(page, ".library-utility-popover nav a");
  await expectMinimumTargets(page, ".library-utility-settings .theme-select, .library-utility-settings .icon-link");
});

test("coarse-pointer layouts hide the keyboard-only slash hint", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Coarse pointer behavior uses the mobile project.");
  await page.goto("/zh/finder/");
  await expect(page.locator(".finder-search > small")).toBeHidden();
});

test("WebKit renders the critical catalog and recipe paths cleanly", async ({ baseURL }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The dedicated WebKit audit runs once.");
  const browser = await webkit.launch();
  const context = await browser.newContext({ viewport: { width: 1024, height: 900 } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  try {
    for (const route of ["/en/catalog/?surface=components", "/zh/sequencing/stagger/"]) {
      await page.goto(`${baseURL ?? "http://127.0.0.1:4173"}${route}`);
      await page.locator("#main-content").waitFor({ state: "visible" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `WebKit ${route} overflows`).toBeLessThanOrEqual(0);
    }
    expect(errors).toEqual([]);
  } finally {
    await browser.close();
  }
});
