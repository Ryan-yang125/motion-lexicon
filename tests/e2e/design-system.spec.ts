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

type HorizontalLayoutIssue = {
  element: string;
  overflowX: string;
  clientWidth: number;
  scrollWidth: number;
};

async function horizontalLayoutSnapshot(page: Page) {
  return page.evaluate(() => {
    const scrollContainers: HorizontalLayoutIssue[] = [];

    const visit = (root: Document | ShadowRoot) => {
      for (const element of root.querySelectorAll<HTMLElement>("*")) {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const visible = style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;

        if (visible && ["auto", "scroll", "overlay"].includes(style.overflowX)) {
          const className = element.getAttribute("class")?.trim().replace(/\s+/g, ".");
          scrollContainers.push({
            element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${className ? `.${className}` : ""}`,
            overflowX: style.overflowX,
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth
          });
        }

        if (element.shadowRoot) visit(element.shadowRoot);
      }
    };

    visit(document);
    return {
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      scrollContainers
    };
  });
}

async function expectHorizontalFit(page: Page, selector: string, context: string) {
  const locator = page.locator(selector);
  await expect.soft(locator.first(), `${context} is missing ${selector}`).toBeVisible();
  const metrics = await locator.evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    })
    .map((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth
    })));

  expect.soft(metrics.length, `${context} has no visible ${selector}`).toBeGreaterThan(0);
  for (const metric of metrics) {
    expect.soft(
      metric.scrollWidth,
      `${context} ${selector} needs ${metric.scrollWidth}px inside ${metric.clientWidth}px`
    ).toBeLessThanOrEqual(metric.clientWidth + 1);
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

test("key Chinese and English layouts have no horizontal scrolling at product breakpoints", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Explicit responsive widths run once in desktop Chromium.");
  test.setTimeout(150_000);

  const widths = [320, 390, 768, 1024, 1440];
  const routes: Array<{
    route: string;
    selectors: string[];
    codeTab?: string;
    parameterTable?: boolean;
  }> = [
    {
      route: "/en/",
      selectors: [".apple-hero-examples", ".apple-hero-examples button", ".apple-hero-preview"]
    },
    {
      route: "/zh/catalog/?surface=components",
      selectors: [
        ".library-surface-control.library-surface-tabs",
        ".library-category-filter-options",
        ".library-card-grid"
      ]
    },
    {
      route: "/en/catalog/?surface=components",
      selectors: [
        ".library-surface-control.library-surface-tabs",
        ".library-category-filter-options",
        ".library-card-grid"
      ]
    },
    {
      route: productRoutes[2],
      codeTab: "代码",
      selectors: [
        ".finder-workspace-shell",
        ".finder-active-preview",
        ".finder-candidate-switcher",
        ".finder-inspector-controls",
        ".library-code-file pre"
      ]
    },
    {
      route: "/en/finder/?q=make%20a%20card%20feel%20weighty&compare=spring,pop-in,scale-in&selected=spring",
      codeTab: "Code",
      selectors: [
        ".finder-workspace-shell",
        ".finder-active-preview",
        ".finder-candidate-switcher",
        ".finder-inspector-controls",
        ".library-code-file pre"
      ]
    },
    {
      route: "/zh/vocabulary/",
      selectors: [".vocabulary-toolbar", ".vocabulary-index", ".vocabulary-groups"]
    },
    {
      route: "/en/vocabulary/",
      selectors: [".vocabulary-toolbar", ".vocabulary-index", ".vocabulary-groups"]
    },
    {
      route: "/zh/sequencing/stagger/",
      codeTab: "代码",
      parameterTable: true,
      selectors: [".apple-output-disclosure", ".library-code-files", ".library-code-file pre"]
    },
    {
      route: "/en/sequencing/stagger/",
      codeTab: "Code",
      parameterTable: true,
      selectors: [".apple-output-disclosure", ".library-code-files", ".library-code-file pre"]
    }
  ];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });

    for (const item of routes) {
      const context = `${width}px ${item.route}`;
      await page.goto(item.route);
      await expect(page.locator("#main-content"), `${context} did not render`).toBeVisible();

      if (item.codeTab) {
        await page.locator(".apple-code-output").getByRole("tab", { name: item.codeTab, exact: true }).click();
        await expect(page.locator(".library-code-files")).toBeVisible();
      }

      if (item.parameterTable && width <= 390) {
        const disclosure = page.locator("#implementation > .apple-disclosure");
        await disclosure.locator("summary").click();
        await expect(disclosure).toHaveAttribute("open", "");
        const containment = await disclosure.evaluate((element) => {
          const disclosureRect = element.getBoundingClientRect();
          const tableWrapper = element.querySelector<HTMLElement>(".library-table-scroll");
          const table = element.querySelector<HTMLElement>(".library-parameter-table");
          if (!tableWrapper || !table) return null;
          const wrapperRect = tableWrapper.getBoundingClientRect();
          const tableRect = table.getBoundingClientRect();
          return {
            disclosureLeft: disclosureRect.left,
            disclosureRight: disclosureRect.right,
            wrapperLeft: wrapperRect.left,
            wrapperRight: wrapperRect.right,
            tableLeft: tableRect.left,
            tableRight: tableRect.right,
            wrapperClientWidth: tableWrapper.clientWidth,
            wrapperScrollWidth: tableWrapper.scrollWidth
          };
        });
        expect.soft(containment, `${context} parameter table is missing`).not.toBeNull();
        if (containment) {
          expect.soft(containment.wrapperLeft).toBeGreaterThanOrEqual(containment.disclosureLeft - 1);
          expect.soft(containment.wrapperRight).toBeLessThanOrEqual(containment.disclosureRight + 1);
          expect.soft(containment.tableLeft).toBeGreaterThanOrEqual(containment.disclosureLeft - 1);
          expect.soft(containment.tableRight).toBeLessThanOrEqual(containment.disclosureRight + 1);
          expect.soft(containment.wrapperScrollWidth).toBeLessThanOrEqual(containment.wrapperClientWidth + 1);
        }
      }

      for (const selector of item.selectors) await expectHorizontalFit(page, selector, context);

      const snapshot = await horizontalLayoutSnapshot(page);
      expect.soft(
        snapshot.documentScrollWidth,
        `${context} document needs ${snapshot.documentScrollWidth}px inside ${snapshot.documentClientWidth}px`
      ).toBeLessThanOrEqual(snapshot.documentClientWidth);
      expect.soft(snapshot.scrollContainers, `${context} exposes horizontal scroll containers`).toEqual([]);
    }
  }
});

test("vocabulary search stays compact across stacked and horizontal toolbars", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Explicit vocabulary widths run once in desktop Chromium.");

  for (const width of [320, 390, 620, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["zh", "en"] as const) {
      await page.goto(`/${locale}/vocabulary/`);
      const dimensions = await page.locator(".vocabulary-toolbar").evaluate((toolbar) => {
        const label = toolbar.querySelector<HTMLElement>("label")!;
        const toolbarRect = toolbar.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        return {
          toolbarHeight: toolbarRect.height,
          labelWidth: labelRect.width,
          labelHeight: labelRect.height
        };
      });
      expect(dimensions.labelHeight, `${width}px /${locale}/ search grew vertically`).toBeLessThanOrEqual(52);
      expect(dimensions.toolbarHeight, `${width}px /${locale}/ toolbar obscures content`).toBeLessThanOrEqual(110);
      if (width > 620) {
        expect(dimensions.labelWidth, `${width}px /${locale}/ search exceeds its desktop measure`).toBeLessThanOrEqual(521);
      }
    }
  }
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
