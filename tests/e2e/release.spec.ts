import { expect, test } from "@playwright/test";
import { catalogRecipes } from "../../src/data/recipes";
import { text } from "../../src/data/site";
import {
  buildRecipeCss,
  buildRecipeHtml,
  buildRecipeJs,
  getDefaultParamValues
} from "../../src/lib/motion-engine";

const hydrationError = /hydration|server rendered html|did not match|React error #(?:418|423)/i;

test("query presets hydrate cleanly and become the active output", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && hydrationError.test(message.text())) {
      runtimeErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.goto("/zh/easing/easing/?ease=linear");
  await expect(page.getByRole("tab", { name: "提示词" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByTestId("prompt-output")).toContainText("linear");
  expect(runtimeErrors).toEqual([]);
});

test("legacy output tab URLs open the consolidated code view", async ({ page }) => {
  for (const legacyTab of ["css", "html", "js"] as const) {
    await page.goto(`/zh/springs/spring/?tab=${legacyTab}`);

    const disclosure = page.locator(".apple-output-disclosure");
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(disclosure.getByRole("tab")).toHaveCount(2);
    await expect(disclosure.getByRole("tab", { name: "代码" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("code-output-bundle")).toBeVisible();
    await expect(page.getByTestId(`${legacyTab}-output`)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`tab=${legacyTab}`));
  }
});

test("persisted theme hydrates without a first-render mismatch", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && hydrationError.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    if (hydrationError.test(error.message)) {
      hydrationErrors.push(error.message);
    }
  });
  await page.addInitScript(() => localStorage.setItem("motion-lexicon-theme:v1", "dark"));

  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("data-theme-mode", "dark");
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(hydrationErrors).toEqual([]);
});

test("landing defers editor, guidance, and runtime chunks", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Initial chunk loading is verified once on desktop.");

  await page.goto("/zh/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const resources = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => entry.name)
  );

  expect(resources.some((url) => /editor-vendor|CatalogSidebar|recipe\.lazy|structured-data/.test(url))).toBe(false);

  await page.locator(".library-hero-preview").click();
  await expect(page.getByRole("heading", { level: 1, name: "滑入" })).toBeVisible();
  const afterNavigation = await page.evaluate(() => ({
    resources: performance.getEntriesByType("resource").map((entry) => entry.name),
    documentNavigations: performance.getEntriesByType("navigation").length
  }));
  expect(afterNavigation.resources.some((url) => /CatalogSidebar|recipe\.lazy/.test(url))).toBe(true);
  expect(afterNavigation.documentNavigations).toBe(1);
});

test("parameter edits preserve the reader's scroll position", async ({ page }) => {
  await page.goto("/zh/entrances/slide-in/");
  const slider = page.getByRole("slider").first();
  await slider.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise<void>((resolve) => {
    let previous = window.scrollY;
    let stableFrames = 0;
    const check = () => {
      const current = window.scrollY;
      stableFrames = Math.abs(current - previous) < 0.5 ? stableFrames + 1 : 0;
      previous = current;
      if (stableFrames >= 3) resolve();
      else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }));
  const before = await page.evaluate(() => window.scrollY);

  await slider.press("ArrowRight");
  await expect(page).toHaveURL(/duration=/);
  await page.waitForTimeout(150);

  const after = await page.evaluate(() => window.scrollY);
  expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
});

test("catalog hover mounts one exact recipe runtime at a time while keyboard focus stays static", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Fine-pointer hover is verified once on desktop.");
  test.setTimeout(45_000);
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.goto("/zh/catalog/?surface=components");
  const componentRecipes = catalogRecipes.filter((recipe) => recipe.surfaceType === "component");
  const firstCard = page.locator(
    `a.library-card[href="/zh/${componentRecipes[0].categoryId}/${componentRecipes[0].id}/"]`
  );
  const fallbackActor = firstCard.locator(".thumb-actor").first();

  await firstCard.focus();
  await expect(page.locator('.motion-thumbnail-runtime[data-runtime-active="true"]')).toHaveCount(0);
  await expect.poll(() => fallbackActor.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");

  for (const recipe of componentRecipes) {
    const card = page.locator(
      `a.library-card[href="/zh/${recipe.categoryId}/${recipe.id}/"]`
    );
    const runtimeHost = card.locator(".motion-thumbnail-runtime");

    await card.hover();
    await expect(runtimeHost).toHaveAttribute("data-runtime-active", "true");
    await expect(runtimeHost.locator(".motion-demo")).toHaveAttribute("data-motion", recipe.canonicalId);
    await expect(page.locator('.motion-thumbnail-runtime[data-runtime-active="true"]')).toHaveCount(1);
    await expect(page.locator(".motion-thumbnail-runtime .motion-demo")).toHaveCount(1);

    if ([
      "hover-effect",
      "press-tap-feedback",
      "hold-to-confirm",
      "drag-to-reorder",
      "swipe-to-dismiss",
      "before-after-slider"
    ].includes(recipe.canonicalId)) {
      await expect.poll(() => runtimeHost.locator(".motion-demo").evaluate(
        (root) => root.getAnimations({ subtree: true }).length
      )).toBeGreaterThan(0);
    }
  }

  await page.getByRole("heading", { level: 1 }).hover();
  await expect(page.locator('.motion-thumbnail-runtime[data-runtime-active="true"]')).toHaveCount(0);
  await expect(page.locator(".motion-thumbnail-runtime .motion-demo")).toHaveCount(0);
  expect(runtimeErrors).toEqual([]);
});

test("continuous motion can pause and resume its active animation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Pause playback is verified once on desktop.");

  await page.goto("/en/loops/marquee/");
  const control = page.locator("[data-motion-pause]");
  const track = page.locator(".motion-marquee-track");

  await control.click();
  await expect(control).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => track.evaluate((element) => element.getAnimations()[0]?.playState)).toBe("paused");

  await control.click();
  await expect(control).toHaveAttribute("aria-pressed", "false");
  await expect.poll(() => track.evaluate((element) => element.getAnimations()[0]?.playState)).toBe("running");
});

test("all canonical catalog entries expose a working surface contract", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The complete catalog contract runs once on desktop.");
  test.setTimeout(120_000);

  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  for (const recipe of catalogRecipes) {
    runtimeErrors.length = 0;
    await page.goto(`/zh/${recipe.categoryId}/${recipe.id}/`);
    await expect(page.getByRole("heading", { level: 1, name: text(recipe.name, "zh") })).toBeVisible();
    await expect(page.locator(".motion-preview-runtime .motion-demo")).toHaveAttribute("data-motion", recipe.canonicalId);

    if (recipe.surfaceType === "guide") {
      await expect(page.locator("#exports")).toHaveCount(0);
      await expect(page.locator(".library-parameter-panel")).toHaveCount(0);
    } else {
      const disclosure = page.locator(".apple-output-disclosure");
      const promptTab = disclosure.getByRole("tab", { name: "提示词" });
      const codeTab = disclosure.getByRole("tab", { name: "代码" });

      await expect(disclosure).toHaveAttribute("open", "");
      await expect(disclosure.getByRole("tab")).toHaveCount(2);
      await expect(promptTab).toHaveAttribute("aria-selected", "true");
      await expect(page.getByTestId("prompt-output")).toBeVisible();

      await codeTab.click();
      await expect(codeTab).toHaveAttribute("aria-selected", "true");
      await expect(page).toHaveURL(/(?:\?|&)tab=code(?:&|$)/);
      await expect(page.getByTestId("code-output-bundle")).toBeVisible();
      await expect(page.getByTestId("html-output")).toBeVisible();
      await expect(page.getByTestId("css-output")).toBeVisible();
      if (buildRecipeJs(recipe, getDefaultParamValues(recipe))) {
        await expect(page.getByTestId("js-output")).toBeVisible();
      } else {
        await expect(page.getByTestId("js-output")).toHaveCount(0);
      }
      await expect(page.locator(".library-parameter-panel")).toBeVisible();
    }

    expect(runtimeErrors, `${recipe.id} emitted browser errors`).toEqual([]);
  }
});

test("every production copy runtime executes independently and cleans up reentrantly", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Copied runtime execution is verified once on desktop.");
  test.setTimeout(90_000);

  const runtimeRecipes = catalogRecipes.filter((recipe) =>
    buildRecipeJs(recipe, getDefaultParamValues(recipe)).length > 0
  );
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  for (const recipe of runtimeRecipes) {
    runtimeErrors.length = 0;
    const values = getDefaultParamValues(recipe);
    await page.goto(`/en/${recipe.categoryId}/${recipe.id}/?tab=js`);
    const js = await page.getByTestId("js-output").textContent();
    const css = buildRecipeCss(recipe, values);
    const html = buildRecipeHtml(recipe, values, "en");

    expect(css, recipe.id).toBeTruthy();
    expect(html, recipe.id).toBeTruthy();
    expect(js, recipe.id).toBeTruthy();
    expect(js, recipe.id).not.toContain("toString(");
    expect(js, recipe.id).not.toContain("__name");

    await page.setContent(`<style>${css}</style>${html}`);
    await page.addScriptTag({ content: js! });
    await expect.poll(() => page.locator(".motion-demo").evaluate((root) =>
      typeof (root as HTMLElement & { __motionLexiconCleanup?: unknown }).__motionLexiconCleanup
    ), { message: `${recipe.id} did not mount its copied runtime` }).toBe("function");

    let dragOrder: string[] | null = null;
    if (recipe.id === "drag-to-reorder") {
      const items = page.locator("[data-reorder-item]");
      dragOrder = await items.allTextContents();
      const first = await items.nth(0).boundingBox();
      const last = await items.nth(2).boundingBox();
      if (!first || !last) throw new Error("Drag specimen has no measurable items");
      await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2);
      await page.mouse.down();
      await page.mouse.move(last.x + last.width / 2, last.y + last.height / 2, { steps: 4 });
      await page.keyboard.press("Escape");
      await page.mouse.up();
      await expect(items).toHaveText(dragOrder);

      const nextFirst = await items.nth(0).boundingBox();
      const nextLast = await items.nth(2).boundingBox();
      if (!nextFirst || !nextLast) throw new Error("Drag specimen lost measurable items");
      await page.mouse.move(nextFirst.x + nextFirst.width / 2, nextFirst.y + nextFirst.height / 2);
      await page.mouse.down();
      await page.mouse.move(nextLast.x + nextLast.width / 2, nextLast.y + nextLast.height / 2, { steps: 4 });
    }

    if (recipe.id === "hold-to-confirm") {
      await page.locator("body").evaluate((body) => body.classList.add("force-reduced-motion"));
      const hold = page.locator("[data-hold-button]");
      await hold.hover();
      await page.mouse.down();
      await expect(hold).toHaveAttribute("data-state", "holding");
      await expect(hold.locator("[data-hold-label]")).toHaveText(/holding|keep/i);
      await expect(hold.locator("[data-hold-progress]")).not.toHaveCSS("clip-path", "inset(0px 100% 0px 0px)");
    }

    if (recipe.id === "spring") {
      const spring = page.locator("[data-spring-target]");
      await spring.click();
      await expect.poll(() => spring.evaluate((target) => target.style.transform)).not.toBe("");
      await page.locator("body").evaluate((body) => body.classList.add("force-reduced-motion"));
      await expect.poll(() => spring.evaluate((target) => target.style.transform)).toBe("");
    }

    await page.locator(".motion-demo").evaluate((root) => {
      const cleanup = (root as HTMLElement & { __motionLexiconCleanup?: () => void }).__motionLexiconCleanup;
      cleanup?.();
      cleanup?.();
    });
    if (recipe.id === "drag-to-reorder" && dragOrder) {
      await page.mouse.up();
      await expect(page.locator("[data-reorder-item]")).toHaveText(dragOrder);
    }
    if (recipe.id === "hold-to-confirm") {
      await page.mouse.up();
      await expect(page.locator("[data-hold-button]")).toHaveAttribute("data-state", "idle");
      await expect(page.locator("[data-hold-button]")).toHaveAttribute("aria-pressed", "false");
    }
    await page.locator("body").evaluate((body) => body.classList.remove("force-reduced-motion"));
    await page.addScriptTag({ content: js! });
    expect(runtimeErrors, `${recipe.id} emitted a copied-runtime browser error`).toEqual([]);
  }
});
