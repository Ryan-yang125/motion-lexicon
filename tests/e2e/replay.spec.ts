import { expect, test, type Page } from "@playwright/test";

function replayControl(page: Page) {
  return page.locator(".preview-toolbar").getByRole("button");
}

const persistentRecipeRoutes = [
  "/en/feedback/hold-to-confirm/",
  "/en/feedback/drag-to-reorder/",
  "/en/feedback/swipe-to-dismiss/",
  "/en/feedback/ripple/",
  "/en/polish-effects/before-after-slider/",
  "/en/polish-effects/skeleton-shimmer/",
  "/en/springs/spring/",
  "/en/easing/easing/",
  "/en/loops/loop/",
  "/en/loops/marquee/",
  "/en/loops/orbit/",
  "/en/loops/idle-animation/",
  "/en/state-transitions/accordion-collapse/",
  "/en/scroll/scroll-reveal/",
  "/en/scroll/scroll-driven-animation/",
  "/en/scroll/parallax/"
] as const;

test.describe("recipe replay state", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"), "The complete replay reset contract runs once on desktop.");
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  test("replay restores completed drag, hold, and swipe interactions", async ({ page }) => {
    await page.goto("/en/feedback/drag-to-reorder/");
    const dragItems = page.locator("[data-reorder-item]");
    const initialOrder = await dragItems.allTextContents();
    await dragItems.first().focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Space");
    expect(await dragItems.allTextContents()).not.toEqual(initialOrder);

    await replayControl(page).click();
    await expect(dragItems).toHaveText(initialOrder);
    expect(await dragItems.evaluateAll((items) =>
      items.map((item) => item.getAttribute("aria-grabbed"))
    )).toEqual(initialOrder.map(() => "false"));

    await page.goto("/en/feedback/hold-to-confirm/?duration=600");
    const hold = page.locator("[data-hold-button]");
    await hold.focus();
    await page.keyboard.down("Space");
    await expect(hold).toHaveAttribute("data-state", "holding");
    await expect(hold).toHaveAttribute("data-state", "complete", { timeout: 2_000 });
    await page.keyboard.up("Space");
    await expect(hold).toHaveAttribute("aria-pressed", "true");

    await replayControl(page).click();
    await expect(hold).not.toHaveAttribute("data-state", "complete");
    await expect(hold).toHaveAttribute("aria-pressed", "false");
    await expect(hold.locator("[data-hold-label]")).toHaveText("Hold to confirm");
    await expect(hold.locator("[data-hold-progress]")).toHaveCSS(
      "clip-path",
      "inset(0px 100% 0px 0px)"
    );

    await page.goto("/en/feedback/swipe-to-dismiss/");
    const swipeTarget = page.locator("[data-swipe-target]");
    const dismiss = page.locator("[data-swipe-dismiss]");
    const undo = page.locator("[data-swipe-undo]");
    await dismiss.click();
    await expect(swipeTarget).toBeHidden();
    await expect(undo).toBeVisible();

    await replayControl(page).click();
    await expect(swipeTarget).toBeVisible();
    await expect(swipeTarget).not.toHaveAttribute("aria-hidden", "true");
    await expect(dismiss).toBeVisible();
    await expect(undo).toBeHidden();
  });

  test("replay restores pause, comparison, and disclosure controls", async ({ page }) => {
    await page.goto("/en/loops/marquee/");
    const pause = page.locator("[data-motion-pause]");
    const marquee = page.locator(".motion-marquee-track");
    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => marquee.evaluate((element) => element.getAnimations()[0]?.playState)).toBe("paused");

    await replayControl(page).click();
    await expect(pause).toHaveAttribute("aria-pressed", "false");
    await expect.poll(() => marquee.evaluate((element) => element.getAnimations()[0]?.playState)).toBe("running");

    await page.goto("/en/polish-effects/before-after-slider/");
    const comparison = page.locator("[data-comparison-input]");
    const initialValue = await comparison.inputValue();
    await comparison.focus();
    await page.keyboard.press("ArrowRight");
    await expect(comparison).not.toHaveValue(initialValue);

    await replayControl(page).click();
    await expect(comparison).toHaveValue(initialValue);

    await page.goto("/en/state-transitions/accordion-collapse/");
    const disclosure = page.locator(".motion-preview-runtime details");
    await expect(disclosure).toHaveAttribute("open", "");
    await disclosure.locator("summary").click();
    await expect(disclosure).not.toHaveAttribute("open", "");

    await replayControl(page).click();
    await expect(disclosure).toHaveAttribute("open", "");
  });

  test("replay replaces the runtime root for every persistent recipe", async ({ page }) => {
    test.setTimeout(45_000);
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });

    for (const route of persistentRecipeRoutes) {
      await page.goto(route);
      const runtime = page.locator(".motion-preview-runtime .motion-demo");
      await expect(runtime).toHaveCount(1);
      await runtime.evaluate((root) => { root.setAttribute("data-replay-probe", "stale"); });

      await replayControl(page).click();
      await expect(runtime).not.toHaveAttribute("data-replay-probe", "stale");
      await expect(runtime).toHaveCount(1);
    }

    expect(runtimeErrors).toEqual([]);
  });
});
