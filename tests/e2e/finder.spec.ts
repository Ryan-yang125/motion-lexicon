import { expect, test } from "@playwright/test";

const query = "卡片弹出来要有重量，最后收得住";

test("Finder restores a shared comparison and keeps variant CSS isolated", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The complete comparison contract runs once on desktop.");

  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  await page.goto(
    `/zh/finder/?q=${encodeURIComponent(query)}&compare=scale-in,pop-in,spring&selected=pop-in`
  );

  await expect(page).toHaveTitle(/动效选择器/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator(".finder-candidate")).toHaveCount(3);
  await expect(page.locator(".finder-candidate").nth(0)).toHaveAttribute("data-variant-id", "scale-in");
  await expect(page.locator("[data-variant-id='pop-in']")).toHaveClass(/is-selected/);

  const isolatedStyles = await page.locator(".finder-candidate-stage").evaluateAll((stages) =>
    stages.map((stage) => ({
      hasShadowRoot: Boolean(stage.shadowRoot),
      css: stage.shadowRoot?.querySelector("style")?.textContent ?? ""
    }))
  );
  expect(isolatedStyles.every((stage) => stage.hasShadowRoot)).toBe(true);
  expect(isolatedStyles[0].css).toContain("scale(0.92)");
  expect(isolatedStyles[1].css).toContain("scale(0.86)");
  const previewLabels = await page.locator(".finder-candidate-stage").evaluateAll((stages) =>
    stages.map((stage) => stage.shadowRoot?.querySelector("strong")?.textContent ?? "")
  );
  expect(previewLabels).toEqual(["缩放入场", "弹入", "弹簧"]);

  await page.getByRole("button", { name: "同步重播" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /调节.*弹入/ })).toBeVisible();

  await page.goto(
    `/zh/finder/?q=${encodeURIComponent(query)}&compare=scale-in,scale-in,pop-in&selected=scale-in`
  );
  await expect(page.locator(".finder-candidate")).toHaveCount(3);
  const normalizedVariants = await page.locator(".finder-candidate").evaluateAll((candidates) =>
    candidates.map((candidate) => candidate.getAttribute("data-variant-id"))
  );
  expect(normalizedVariants).toEqual(["scale-in", "pop-in", "spring"]);
  expect(new Set(normalizedVariants).size).toBe(3);
  expect(runtimeErrors).toEqual([]);
});

test("Finder creates a shareable selection and parameter state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Form, selection, and parameters run once on desktop.");

  await page.goto("/zh/finder/");
  const finderInput = page.getByRole("searchbox", { name: "描述你想要的动效" });
  await expect(finderInput).toBeEnabled();
  await finderInput.fill(query);
  await page.getByRole("button", { name: "查找候选" }).click();

  await expect(page).toHaveURL(/q=/);
  await expect(page).toHaveURL(/compare=/);
  await expect(page).toHaveURL(/selected=spring/);

  await page.getByRole("button", { name: /选择.*弹入/ }).click();
  await expect(page).toHaveURL(/selected=pop-in/);
  await expect(page.locator("[data-variant-id='pop-in']")).toHaveClass(/is-selected/);

  const firstSlider = page.locator(".finder-tune").getByRole("slider").first();
  await firstSlider.press("ArrowRight");
  await expect(page).toHaveURL(/duration=/);

  await page.getByRole("tab", { name: "Prompt" }).click();
  await expect(page).toHaveURL(/tab=prompt/);
  await firstSlider.press("ArrowRight");
  await expect(page).toHaveURL(/tab=prompt/);
  await page.reload();
  await expect(page.getByRole("tab", { name: "Prompt" })).toHaveAttribute("aria-selected", "true");

  const draft = "列表需要更轻、更连续地出现";
  await page.getByRole("searchbox", { name: "描述你想要的动效" }).fill(draft);
  await page.locator(".finder-tune").getByRole("slider").first().press("ArrowRight");
  await expect(page.getByRole("searchbox", { name: "描述你想要的动效" })).toHaveValue(draft);

  const selectButton = page.locator("[data-variant-id='pop-in'] .finder-select");
  const box = await selectButton.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test("Finder remains readable on a mobile viewport", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile layout runs once in the mobile project.");

  await page.goto(`/en/finder/?q=${encodeURIComponent("bring in a list one by one")}`);
  await expect(page.getByRole("heading", { level: 1, name: /Describe the feel/ })).toBeVisible();
  await expect(page.locator(".finder-candidate")).toHaveCount(3);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  expect(hasHorizontalOverflow).toBe(false);
});
