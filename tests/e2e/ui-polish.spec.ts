import { expect, test } from "@playwright/test";

test("recipe controls use stable components and compact geometry", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop geometry is covered once.");
  await page.goto("/zh/entrances/slide-in/");

  const mobileDevice = page.getByRole("radio", { name: "手机宽度" });
  await mobileDevice.hover();
  await expect(mobileDevice).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

  const heroSpacing = await page.evaluate(() => {
    const breadcrumbs = document.querySelector(".apple-recipe-breadcrumbs")!.getBoundingClientRect();
    const identity = document.querySelector(".apple-recipe-identity")!.getBoundingClientRect();
    const hero = document.querySelector(".apple-recipe-hero")!;
    return {
      gap: identity.top - breadcrumbs.bottom,
      minHeight: getComputedStyle(hero).minHeight
    };
  });
  expect(heroSpacing.gap).toBeGreaterThanOrEqual(16);
  expect(heroSpacing.gap).toBeLessThanOrEqual(40);
  expect(heroSpacing.minHeight).toBe("0px");

  const sliders = page.getByRole("slider");
  await expect(sliders).toHaveCount(2);
  const commonControls = page.locator(".library-parameter-panel > .controls");
  await expect(commonControls.locator(".ml-slider-track")).toHaveCount(2);
  await expect(commonControls.locator(".ml-slider-range")).toHaveCount(2);
  await expect(commonControls.locator(".ml-slider-thumb")).toHaveCount(2);
  await sliders.first().press("ArrowRight");
  await expect(page).toHaveURL(/duration=260/);
  await expect(page.getByTestId("prompt-output")).toContainText("260ms");

  const toolbarInsets = await page.evaluate(() => {
    const toolbar = document.querySelector(".apple-preview-toolbar.library-preview-toolbar")!.getBoundingClientRect();
    const mode = document.querySelector(".interior-motion-mode")!.getBoundingClientRect();
    const device = document.querySelector(".interior-device-switcher")!.getBoundingClientRect();
    const selected = document.querySelector(".interior-motion-mode .interior-segment-thumb")!.getBoundingClientRect();
    return {
      height: toolbar.height,
      top: mode.top - toolbar.top,
      bottom: toolbar.bottom - mode.bottom,
      controlHeightDelta: Math.abs(device.height - mode.height),
      selectedTop: selected.top - mode.top,
      selectedBottom: mode.bottom - selected.bottom
    };
  });
  expect(toolbarInsets.height).toBeLessThanOrEqual(54);
  expect(Math.abs(toolbarInsets.top - toolbarInsets.bottom)).toBeLessThanOrEqual(1);
  expect(Math.min(toolbarInsets.top, toolbarInsets.bottom)).toBeGreaterThanOrEqual(4);
  expect(toolbarInsets.controlHeightDelta).toBeLessThanOrEqual(1);
  expect(Math.min(toolbarInsets.selectedTop, toolbarInsets.selectedBottom)).toBeGreaterThanOrEqual(2);

  const outputTabs = page.locator(".interior-output-tabs");
  const promptTab = page.getByRole("tab", { name: "提示词" });
  await expect(outputTabs).toHaveCSS("border-top-width", "0px");
  await expect(outputTabs).toHaveCSS("box-shadow", "none");
  await expect(promptTab).toHaveCSS("border-top-width", "0px");
  await expect(outputTabs.getByRole("tablist")).toHaveCSS("border-radius", "8px");
  await expect(outputTabs.locator(".interior-tabs-toolbar > .interior-tabs-action")).toContainText("复制提示词");

  const related = page.locator(".apple-related-motion .library-related-links");
  for (const side of ["top", "right", "bottom", "left"] as const) {
    await expect(related).toHaveCSS(`border-${side}-width`, "0px");
  }
});

test("dense recipe choices wrap inside the shared segmented control", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The dense inspector layout is covered once.");
  await page.goto("/zh/easing/easing/?duration=580&view=tablet");

  const easing = page.getByRole("radiogroup", { name: "曲线" });
  await expect(easing).toHaveAttribute("data-segmented-layout", "wrapped");
  const geometry = await easing.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    rows: new Set(
      Array.from(element.querySelectorAll<HTMLElement>("[role='radio']"))
        .map((button) => Math.round(button.getBoundingClientRect().top))
    ).size
  }));
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
  expect(geometry.rows).toBeGreaterThan(1);

  const easeIn = easing.getByRole("radio", { name: "缓入", exact: true });
  await easeIn.click();
  await expect(page).toHaveURL(/ease=ease-in/);
  await expect(easeIn).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(easeIn.locator(".interior-segment-option")).toHaveCSS("color", "rgb(239, 238, 234)");
});

test("resource popover grows with its inline theme menu", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop popover has enough room for a geometry check.");
  await page.goto("/zh/");
  await page.locator(".library-utility-trigger").click();

  const dialog = page.getByRole("dialog", { name: "资源与设置" });
  const before = await dialog.evaluate((element) => element.getBoundingClientRect().height);
  await page.locator(".library-utility-popover .interior-theme-select > button").click();
  const listbox = page.getByRole("listbox", { name: "主题" });
  await expect(listbox).toBeVisible();

  const geometry = await dialog.evaluate((element) => {
    const content = element.querySelector<HTMLElement>(":scope > div")!;
    return {
      height: element.getBoundingClientRect().height,
      contentClientHeight: content.clientHeight,
      contentScrollHeight: content.scrollHeight
    };
  });
  expect(geometry.height).toBeGreaterThan(before + 80);
  expect(geometry.contentScrollHeight).toBeLessThanOrEqual(geometry.contentClientHeight + 1);
});

test("landing uses one direct Interior search shell without horizontal overflow", async ({ page }) => {
  await page.goto("/zh/");
  await expect(page.locator(".apple-hero-finder > .interior-hero-search")).toHaveCount(1);
  await expect(page.locator(".apple-hero-finder > div > .ml-button")).toHaveCount(0);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
