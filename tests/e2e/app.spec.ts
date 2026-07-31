import { expect, test } from "@playwright/test";

test("desktop landing page renders without horizontal overflow", async ({ page }) => {
  await page.goto("/zh/");
  await expect(page).toHaveTitle(/Motion Lexicon/);
  await expect(page.getByRole("heading", { name: /说出你要的感觉/ })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "描述你想要的动效" })).toBeVisible();
  await expect(page.locator(".library-card")).toHaveCount(3);

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  expect(hasHorizontalOverflow).toBe(false);
});

test("landing Interior search submits directly to Finder", async ({ page }) => {
  await page.goto("/zh/");
  const search = page.getByRole("searchbox", { name: "描述你想要的动效" });
  await search.fill("卡片切入后慢慢停下来");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/zh\/finder\/\?q=/);
  await expect(page).toHaveURL(/%E5%8D%A1%E7%89%87/);
});

test("english landing page renders english copy", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { name: /Describe the feel/ })).toBeVisible();
  await expect(page.getByText("一个能看")).toHaveCount(0);
});

test("brand mark keeps its easing geometry and theme contrast", async ({ page }) => {
  await page.goto("/en/");
  const marks = page.locator(".brand-mark-svg");
  await expect(marks).toHaveCount(2);
  await expect(marks.first().locator(".brand-mark-curve")).toHaveAttribute(
    "d",
    "M23 62C26 35 37 27 65 25"
  );

  const lightBackground = await marks.first().locator(".brand-mark-background").evaluate(
    (element) => getComputedStyle(element).fill
  );
  expect(lightBackground).toBe("rgb(21, 21, 22)");

  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const darkBackground = await marks.first().locator(".brand-mark-background").evaluate(
    (element) => getComputedStyle(element).fill
  );
  const keyframe = await marks.first().locator(".brand-mark-keyframe").evaluate(
    (element) => getComputedStyle(element).fill
  );
  expect(darkBackground).toBe("rgb(245, 245, 247)");
  expect(keyframe).toBe("rgb(10, 132, 255)");
});

test("recipe output opens on Prompt, exposes only Prompt and Code, and stays in sync with parameters", async ({ page }) => {
  await page.goto("/zh/entrances/slide-in/");
  await expect(page.getByRole("heading", { level: 1, name: "滑入" })).toBeVisible();

  const output = page.locator(".apple-output-disclosure");
  await expect(output).toHaveAttribute("data-open", "true");
  await expect(output.getByRole("button", { name: "复制实现" })).toHaveAttribute("aria-expanded", "true");
  await expect(output.getByRole("tab")).toHaveCount(2);
  const promptTab = output.getByRole("tab", { name: "提示词", exact: true });
  const codeTab = output.getByRole("tab", { name: "代码", exact: true });
  await expect(output.getByRole("button", { name: "复制提示词", exact: true })).toBeVisible();
  await expect(promptTab).toHaveAttribute(
    "aria-selected",
    "true"
  );
  await expect(codeTab).toHaveAttribute(
    "aria-selected",
    "false"
  );
  await expect(page).not.toHaveURL(/(?:\?|&)tab=/);

  await page.getByRole("slider").first().press("ArrowRight");
  await expect(page.getByTestId("prompt-output")).toContainText("260ms");
  await expect(page).toHaveURL(/duration=260/);

  await promptTab.focus();
  await promptTab.press("ArrowRight");
  await expect(codeTab).toHaveAttribute("aria-selected", "true");
  await expect(page).toHaveURL(/tab=code/);
  await expect(output.getByRole("button", { name: "复制全部代码", exact: true })).toBeVisible();
  await expect(output.locator(".library-code-bundle-toolbar")).toHaveCount(0);
  await expect(page.getByTestId("css-output")).toContainText("260ms");
  await expect(page.getByTestId("html-output")).toContainText('data-motion="slide-in"');

  await page.getByRole("radio", { name: /清脆/ }).click();
  await expect(page.getByTestId("css-output")).toContainText("cubic-bezier(0.16, 1, 0.3, 1)");
  await expect(page).toHaveURL(/ease=snap/);
});

test("copy prompt button reports success", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/en/entrances/slide-in/");
  const copyButton = page.getByRole("button", { name: /Copy prompt/ }).first();
  await copyButton.click();
  await expect(copyButton).toHaveAttribute("data-copy-state", "copied");
  await expect(copyButton.getByRole("status")).toHaveText("Copied");
});

test("resource popover closes on Escape and restores trigger focus", async ({ page }) => {
  await page.goto("/zh/");
  const trigger = page.locator(".library-utility-trigger");

  await trigger.focus();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("dialog", { name: "资源" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("dialog", { name: "资源" })).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("nested theme dropdown consumes its first Escape before the resource popover", async ({ page }) => {
  await page.goto("/zh/");
  const resources = page.locator(".library-utility-trigger");
  await resources.click();

  const theme = page.locator(".library-utility-popover .interior-theme-select > button");
  await theme.click();
  await expect(theme).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(theme).toHaveAttribute("aria-expanded", "false");
  await expect(resources).toHaveAttribute("aria-expanded", "true");
  await expect(theme).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(resources).toHaveAttribute("aria-expanded", "false");
  await expect(resources).toBeFocused();
});

test("recipe disclosures expose their expanded state and keep hidden content inert", async ({ page }) => {
  await page.goto("/zh/sequencing/stagger/");
  const implementation = page.locator("#implementation > [data-interior-disclosure]");
  const trigger = implementation.getByRole("button", { name: "实现规则" });
  const panel = implementation.locator("[role='region']");

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toHaveAttribute("aria-hidden", "true");

  await trigger.click();
  await expect(implementation).toHaveAttribute("data-open", "true");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(panel).not.toHaveAttribute("aria-hidden", "true");
  await expect(panel.locator(".library-guidance-list")).toBeVisible();

  await trigger.click();
  await expect(implementation).toHaveAttribute("data-open", "false");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
});

test("mobile route is readable without horizontal overflow", async ({ page }) => {
  await page.goto("/en/entrances/slide-in/");
  await expect(page.getByRole("heading", { level: 1, name: "Slide in" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  expect(hasHorizontalOverflow).toBe(false);
});

test("catalog category filters keep 44px touch targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/zh/catalog/?surface=components");

  const categoryFilter = page.locator(".library-category-filter-options");
  const trigger = categoryFilter.getByRole("button");
  await expect(trigger).toBeVisible();
  const heights = await trigger.evaluateAll((buttons) =>
    buttons.map((button) => button.getBoundingClientRect().height)
  );
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);

  await trigger.click();
  const options = page.getByRole("listbox", { name: "分类" }).getByRole("option");
  expect(await options.count()).toBeGreaterThan(1);
  await options.nth(1).click();
  await expect(page).toHaveURL(/category=/);
});

test("Chinese catalog surface tabs stay on one line with a compact live result summary", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/zh/catalog/?surface=components");

  const surfaceTabs = page.locator(".library-surface-control.library-surface-tabs");
  const labels = surfaceTabs.locator("[role='radio'] .interior-surface-option > span");
  await expect(labels).toHaveCount(3);

  const labelMetrics = await labels.evaluateAll((elements) =>
    elements.map((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return {
        lineBoxes: range.getClientRects().length,
        whiteSpace: getComputedStyle(element).whiteSpace
      };
    })
  );
  expect(labelMetrics).toEqual([
    { lineBoxes: 1, whiteSpace: "nowrap" },
    { lineBoxes: 1, whiteSpace: "nowrap" },
    { lineBoxes: 1, whiteSpace: "nowrap" }
  ]);
  await expect(page.locator(".library-results-meta")).toHaveCount(0);

  const visibleResultSummary = page.locator(".library-category-filter-heading");
  await expect(visibleResultSummary).toBeVisible();
  await expect(visibleResultSummary).toContainText("全部条目");
  await expect(visibleResultSummary).toContainText("31 个结果");

  const search = page.getByRole("searchbox", { name: "搜索" });
  await search.fill("slide");
  await expect(page).toHaveURL(/q=slide/);
  await expect(visibleResultSummary).toContainText("“slide”");
  const filteredCount = await page.locator(".library-card").count();
  await expect(visibleResultSummary).toContainText(`${filteredCount} 个结果`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("English catalog result summary handles a single match", async ({ page }) => {
  await page.goto("/en/catalog/?surface=components&q=ripple");

  const visibleResultSummary = page.locator(".library-category-filter-heading");
  await expect(visibleResultSummary).toBeVisible();
  await expect(visibleResultSummary).toContainText("“ripple”");
  await expect(visibleResultSummary).toContainText("1 result");
  await expect(visibleResultSummary).not.toContainText("1 results");
  await expect(page.locator(".library-card")).toHaveCount(1);
});

test("long catalog queries keep the desktop result summary compact", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop width cap is covered once.");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en/catalog/?surface=components&q=long%20descriptive%20motion%20query%20for%20a%20product%20interface");

  const visibleResultSummary = page.locator(".library-category-filter-heading");
  await expect(visibleResultSummary).toBeVisible();
  const summaryWidth = await visibleResultSummary.evaluate((element) => element.getBoundingClientRect().width);
  expect(summaryWidth).toBeLessThanOrEqual(256.5);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("Apple product tokens control type, hierarchy, radii, and icon sizes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Token values only need one browser audit.");
  await page.goto("/zh/catalog/?surface=components");

  const tokens = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    return {
      ink: root.getPropertyValue("--apple-ink").trim().toLowerCase(),
      secondary: root.getPropertyValue("--apple-secondary").trim().toLowerCase(),
      tertiary: root.getPropertyValue("--apple-tertiary").trim().toLowerCase(),
      navRadius: root.getPropertyValue("--ui-radius-nav").trim(),
      cardRadius: root.getPropertyValue("--ui-radius-card").trim(),
      ctaRadius: root.getPropertyValue("--ui-radius-cta").trim(),
      fontFamily: body.fontFamily,
      fontSize: body.fontSize,
      fontWeight: body.fontWeight,
      letterSpacing: body.letterSpacing
    };
  });
  expect(tokens).toMatchObject({
    ink: "#292929",
    secondary: "#5d5d5d",
    tertiary: "#9e9e9e",
    navRadius: "8px",
    cardRadius: "16px",
    ctaRadius: "999px",
    fontSize: "14px",
    fontWeight: "400",
    letterSpacing: "-0.15px"
  });
  expect(tokens.fontFamily).toContain("SF Pro Text");

  const typeAndColor = await page.evaluate(() => {
    const read = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing token specimen: ${selector}`);
      const style = getComputedStyle(element);
      return { fontSize: style.fontSize, color: style.color };
    };
    return {
      heading: read(".library-catalog-hero h1"),
      cardHeading: read(".library-card-body h3"),
      body: read(".library-card-body p"),
      metadata: read(".library-card-body small")
    };
  });
  expect(typeAndColor).toEqual({
    heading: { fontSize: "24px", color: "rgb(41, 41, 41)" },
    cardHeading: { fontSize: "14px", color: "rgb(41, 41, 41)" },
    body: { fontSize: "13px", color: "rgb(93, 93, 93)" },
    metadata: { fontSize: "12px", color: "rgb(93, 93, 93)" }
  });

  const navigationButton = page.locator(".library-surface-control button").first();
  await expect(navigationButton).toHaveCSS("border-radius", "6px");
  await expect(navigationButton.locator("svg")).toHaveCSS("width", "14px");
  await expect(navigationButton.locator("svg")).toHaveCSS("height", "14px");
  await expect(page.locator(".library-card").first()).toHaveCSS("border-radius", "16px");

  await page.goto("/zh/catalog/?surface=guides");
  const cardIcon = page.locator(".library-guide-art > svg").first();
  await expect(cardIcon).toHaveCSS("width", "20px");
  await expect(cardIcon).toHaveCSS("height", "20px");

  await page.goto("/zh/entrances/slide-in/");
  await expect(page.locator(".interior-tabs-action .ml-button")).toHaveCSS(
    "border-radius",
    "999px"
  );
});

test("implementation guidance uses one motion timeline and reflows cleanly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop and mobile layouts are audited in one pass.");
  await page.setViewportSize({ width: 1200, height: 1000 });
  await page.goto("/zh/sequencing/stagger/");
  await page.locator("#implementation").getByRole("button", { name: "实现规则" }).click();

  const timeline = page.locator("#implementation .library-guidance-list");
  const rows = timeline.locator(":scope > div");
  await expect(rows).toHaveCount(7);
  const desktop = await timeline.evaluate((element) => {
    const style = getComputedStyle(element);
    const rowElements = Array.from(element.querySelectorAll<HTMLElement>(":scope > div"));
    return {
      borderWidths: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth],
      borderRadius: style.borderRadius,
      rowColumns: getComputedStyle(rowElements[0]).gridTemplateColumns.split(" ").length,
      rowWidths: rowElements.map((row) => row.getBoundingClientRect().width)
    };
  });
  expect(desktop.borderWidths).toEqual(["1px", "0px", "1px", "0px"]);
  expect(desktop.borderRadius).toBe("0px");
  expect(desktop.rowColumns).toBe(2);
  expect(Math.max(...desktop.rowWidths) - Math.min(...desktop.rowWidths)).toBeLessThan(1);

  await page.setViewportSize({ width: 390, height: 900 });
  const mobile = await timeline.evaluate((element) => {
    const rowElements = Array.from(element.querySelectorAll<HTMLElement>(":scope > div"));
    return {
      rowColumns: getComputedStyle(rowElements[0]).gridTemplateColumns.split(" ").length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  expect(mobile.rowColumns).toBe(1);
  expect(mobile.overflow).toBeLessThanOrEqual(0);
});
