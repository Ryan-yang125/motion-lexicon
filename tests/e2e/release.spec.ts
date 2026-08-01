import { expect, test, type Page } from "@playwright/test";
import { catalogRecipes } from "../../src/data/recipes";
import { text } from "../../src/data/site";
import {
  buildRecipeCss,
  buildRecipeHtml,
  buildRecipeJs,
  getDefaultParamValues
} from "../../src/lib/motion-engine";

const hydrationError = /hydration|server rendered html|did not match|React error #(?:418|423)/i;

async function expectScrollCatalogContinuity(page: Page, scrollRecipe: string) {
  const scrollCard = page.locator(`a.library-card[href="/zh/scroll/${scrollRecipe}/"]`);
  const scrollRuntime = scrollCard.locator(".motion-thumbnail-runtime");
  await scrollCard.scrollIntoViewIfNeeded();
  await expect(scrollRuntime).toHaveAttribute("data-runtime-ready", "true");
  const continuity = await scrollRuntime.evaluate(async (host) => {
    const card = host.closest<HTMLElement>(".library-card")!;
    const shadow = host.shadowRoot!;
    const surface = shadow.querySelector<HTMLElement>(".motion-surface")!;
    const root = shadow.querySelector(".motion-demo");
    const snapshot = () => {
      const style = getComputedStyle(surface);
      return {
        active: host.hasAttribute("data-runtime-active"),
        opacity: style.opacity,
        transform: style.transform,
        root: shadow.querySelector(".motion-demo")
      };
    };
    const resting = snapshot();
    card.dispatchEvent(new PointerEvent("pointerenter"));
    const entered = snapshot();
    let playing = snapshot();
    for (let frame = 0; frame < 12; frame += 1) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      playing = snapshot();
      if (resting.opacity !== playing.opacity || resting.transform !== playing.transform) break;
    }
    card.dispatchEvent(new PointerEvent("pointerleave"));
    const left = snapshot();
    return {
      activeStates: [resting.active, entered.active, playing.active, left.active],
      enterStable: resting.opacity === entered.opacity && resting.transform === entered.transform,
      moved: resting.opacity !== playing.opacity || resting.transform !== playing.transform,
      leaveStable: playing.opacity === left.opacity && playing.transform === left.transform,
      rootStable: root === resting.root && resting.root === entered.root && entered.root === playing.root && playing.root === left.root
    };
  });
  expect(continuity.activeStates, scrollRecipe).toEqual([false, true, true, false]);
  expect(continuity.enterStable, `${scrollRecipe} jumps on pointer enter`).toBe(true);
  expect(continuity.moved, `${scrollRecipe} does not play on pointer enter`).toBe(true);
  expect(continuity.leaveStable, `${scrollRecipe} jumps on pointer leave`).toBe(true);
  expect(continuity.rootStable, `${scrollRecipe} replaces its preview root`).toBe(true);
}

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
    await expect(disclosure).toHaveAttribute("data-open", "true");
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

test("landing defers recipe and Pack-detail chunks until the reader opens a product moment", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Initial chunk loading is verified once on desktop.");

  await page.goto("/zh/");
  await expect(page.getByRole("heading", { level: 1, name: /把产品动效/ })).toBeVisible();
  const resources = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => entry.name)
  );

  expect(resources.some((url) => /editor-vendor|CatalogSidebar|recipe\.lazy|motion-pack\.lazy|structured-data/.test(url))).toBe(false);

  await page.getByTestId("directory-card-packs").getByRole("link", { name: "浏览产品瞬间" }).click();
  await expect(page).toHaveURL(/\/zh\/packs\//);
  await page.getByTestId("motion-pack-card-save-confirmation").getByRole("link", { name: "查看产品瞬间", exact: true }).click();
  await expect(page).toHaveURL(/\/zh\/packs\/save-confirmation\//);
  await expect(page.getByRole("heading", { level: 1, name: "保存确认" })).toBeVisible();
  const afterNavigation = await page.evaluate(() => ({
    resources: performance.getEntriesByType("resource").map((entry) => entry.name),
    documentNavigations: performance.getEntriesByType("navigation").length
  }));
  expect(afterNavigation.resources.some((url) => /motion-pack\.lazy/.test(url))).toBe(true);
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

test("catalog HTML contains every exact recipe preview without JavaScript", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The server-rendered catalog contract is verified once on desktop.");

  const baseURL = testInfo.project.use.baseURL as string;
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1100 }
  });
  const page = await context.newPage();
  await page.goto("/zh/catalog/?surface=components");

  const componentRecipes = catalogRecipes.filter((recipe) => recipe.surfaceType === "component");
  const runtimeHosts = page.locator(".motion-thumbnail-runtime");
  await expect(runtimeHosts).toHaveCount(componentRecipes.length);
  await expect(page.locator(".motion-thumbnail-runtime .motion-demo")).toHaveCount(componentRecipes.length);
  await expect(page.locator(".motion-thumbnail-fallback")).toHaveCount(0);

  const serverRenderedRecipes = await runtimeHosts.evaluateAll((hosts) => hosts.map((host) => ({
    hostId: host.getAttribute("data-motion-thumbnail"),
    canonicalId: host.shadowRoot?.querySelector<HTMLElement>(".motion-demo")?.dataset.motion ?? null,
    rootCount: host.shadowRoot?.querySelectorAll(".motion-demo").length ?? 0,
    runningAnimations: host.shadowRoot
      ? host.shadowRoot.querySelector<HTMLElement>(".motion-demo")
        ?.getAnimations({ subtree: true })
        .filter((animation) => animation.playState !== "paused")
        .length ?? 0
      : 0
  })));
  expect(serverRenderedRecipes.every(({ hostId, canonicalId, rootCount, runningAnimations }) =>
    rootCount === 1 && hostId === canonicalId && runningAnimations === 0
  )).toBe(true);
  expect(serverRenderedRecipes.map(({ canonicalId }) => canonicalId).sort()).toEqual(
    componentRecipes.map(({ canonicalId }) => canonicalId).sort()
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth)
  );

  await context.close();
});

test("catalog hydration preserves server preview nodes and first-frame styles", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The production hydration boundary is verified once on desktop.");
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.route("**/zh/catalog/**", async (route) => {
    if (route.request().resourceType() !== "document") {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    const body = (await response.text()).replace(
      '<script type="module" crossorigin src=',
      '<script type="application/x-motion-delayed" data-delayed-module crossorigin src='
    );
    await route.fulfill({ response, body });
  });

  await page.goto("/zh/catalog/?surface=components");
  const runtimeHosts = page.locator(".motion-thumbnail-runtime");
  await expect(runtimeHosts).toHaveCount(31);
  const firstRuntime = runtimeHosts.first();

  const serverRoots = await runtimeHosts.evaluateAll((hosts) => hosts.map((host) => {
    const root = host.shadowRoot?.querySelector<HTMLElement>(".motion-demo") ?? null;
    (host as HTMLElement & { __motionLexiconServerRoot?: HTMLElement | null }).__motionLexiconServerRoot = root;
    return root?.dataset.motion ?? null;
  }));
  expect(serverRoots.filter(Boolean)).toHaveLength(31);

  const visualSnapshot = () => firstRuntime.evaluate((host) => {
    const hostRect = host.getBoundingClientRect();
    return Array.from(host.shadowRoot?.querySelectorAll<HTMLElement>("*") ?? []).map((element) => {
      const style = getComputedStyle(element);
      const before = getComputedStyle(element, "::before");
      const after = getComputedStyle(element, "::after");
      const rect = element.getBoundingClientRect();
      const pseudo = (value: CSSStyleDeclaration) => ({
        content: value.content,
        opacity: value.opacity,
        transform: value.transform,
        clipPath: value.clipPath,
        backgroundImage: value.backgroundImage
      });
      return {
        tag: element.tagName,
        className: element.getAttribute("class"),
        opacity: style.opacity,
        transform: style.transform,
        clipPath: style.clipPath,
        filter: style.filter,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        rect: [
          Math.round((rect.left - hostRect.left) * 100) / 100,
          Math.round((rect.top - hostRect.top) * 100) / 100,
          Math.round(rect.width * 100) / 100,
          Math.round(rect.height * 100) / 100
        ],
        before: pseudo(before),
        after: pseudo(after)
      };
    });
  });
  const beforeHydration = await visualSnapshot();
  const moduleSource = await page.locator("script[data-delayed-module]").getAttribute("src");
  expect(moduleSource).toBeTruthy();
  await page.addScriptTag({
    type: "module",
    url: new URL(moduleSource!, testInfo.project.use.baseURL as string).href
  });
  await expect(firstRuntime).toHaveAttribute("data-runtime-ready", "true");

  expect(await runtimeHosts.evaluateAll((hosts) => hosts.every((host) =>
    host.shadowRoot?.querySelector(".motion-demo") ===
      (host as HTMLElement & { __motionLexiconServerRoot?: HTMLElement | null }).__motionLexiconServerRoot
  ))).toBe(true);
  expect(await visualSnapshot()).toEqual(beforeHydration);
  expect(runtimeErrors).toEqual([]);
});

test("catalog keeps every exact recipe preview mounted while hover only changes playback", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Fine-pointer hover is verified once on desktop.");
  test.setTimeout(60_000);
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.goto("/zh/catalog/?surface=components");
  const componentRecipes = catalogRecipes.filter((recipe) => recipe.surfaceType === "component");
  const runtimeHosts = page.locator(".motion-thumbnail-runtime");

  await expect(runtimeHosts).toHaveCount(componentRecipes.length);
  await expect(page.locator(".motion-thumbnail-runtime .motion-demo")).toHaveCount(componentRecipes.length);

  const mountedBeforeHover = await runtimeHosts.evaluateAll((hosts) => hosts.map((host) => {
    const root = host.shadowRoot?.querySelector<HTMLElement>(".motion-demo") ?? null;
    (host as HTMLElement & { __motionLexiconRoot?: HTMLElement | null }).__motionLexiconRoot = root;
    return {
      canonicalId: root?.dataset.motion ?? null,
      rootCount: host.shadowRoot?.querySelectorAll(".motion-demo").length ?? 0,
      nodeCount: root?.querySelectorAll("*").length ?? 0
    };
  }));
  expect(mountedBeforeHover.every(({ rootCount }) => rootCount === 1)).toBe(true);
  expect(mountedBeforeHover.map(({ canonicalId }) => canonicalId).sort()).toEqual(
    componentRecipes.map(({ canonicalId }) => canonicalId).sort()
  );

  const firstCard = page.locator(
    `a.library-card[href="/zh/${componentRecipes[0].categoryId}/${componentRecipes[0].id}/"]`
  );
  const firstRuntime = firstCard.locator(".motion-thumbnail-runtime");
  const lastRuntime = page.locator(
    `a.library-card[href="/zh/${componentRecipes.at(-1)?.categoryId}/${componentRecipes.at(-1)?.id}/"] .motion-thumbnail-runtime`
  );

  await expect(firstRuntime).toHaveAttribute("data-runtime-ready", "true");
  await expect(lastRuntime).not.toHaveAttribute("data-runtime-ready", "true");
  const initialReadyCount = await page.locator('.motion-thumbnail-runtime[data-runtime-ready="true"]').count();
  expect(initialReadyCount).toBeGreaterThan(0);
  expect(initialReadyCount).toBeLessThan(componentRecipes.length);

  await firstCard.focus();
  await expect(page.locator('.motion-thumbnail-runtime[data-runtime-active="true"]')).toHaveCount(0);
  expect(await firstRuntime.evaluate((host) =>
    host.shadowRoot?.querySelector(".motion-demo") ===
      (host as HTMLElement & { __motionLexiconRoot?: HTMLElement | null }).__motionLexiconRoot
  )).toBe(true);
  const restingAnimationStates = await firstRuntime.locator(".motion-demo").evaluate((root) =>
    root.getAnimations({ subtree: true }).map((animation) => animation.playState)
  );
  expect(restingAnimationStates.length).toBeGreaterThan(0);
  expect(restingAnimationStates.every((state) => state === "paused")).toBe(true);
  const restingTimeline = await firstRuntime.locator(".motion-demo").evaluate((root) => {
    const currentTime = root.getAnimations({ subtree: true })[0]?.currentTime;
    return typeof currentTime === "number" ? currentTime : null;
  });

  await firstCard.hover();
  const enteredTimeline = await firstRuntime.locator(".motion-demo").evaluate((root) => {
    const animation = root.getAnimations({ subtree: true })[0];
    return {
      currentTime: typeof animation?.currentTime === "number" ? animation.currentTime : null,
      playState: animation?.playState ?? null
    };
  });
  expect(enteredTimeline.playState).toBe("running");
  if (restingTimeline !== null && enteredTimeline.currentTime !== null) {
    expect(Math.abs(enteredTimeline.currentTime - restingTimeline)).toBeLessThan(50);
  }
  await page.getByRole("heading", { level: 1 }).hover();
  await expect(firstRuntime).not.toHaveAttribute("data-runtime-active", "true");

  const comparisonCard = page.locator(
    'a.library-card[href="/zh/polish-effects/before-after-slider/"]'
  );
  const comparisonRuntime = comparisonCard.locator(".motion-thumbnail-runtime");
  await expect(comparisonRuntime).not.toHaveAttribute("data-runtime-ready", "true");
  const comparisonBeforeHover = await comparisonRuntime.evaluate((host) => {
    const shadow = host.shadowRoot;
    const surface = shadow?.querySelector<HTMLElement>(".motion-comparison");
    const divider = shadow?.querySelector<HTMLElement>(".motion-divider");
    if (!surface || !divider) return null;
    const surfaceRect = surface.getBoundingClientRect();
    const dividerRect = divider.getBoundingClientRect();
    return {
      dividerRatio: (dividerRect.left - surfaceRect.left) / surfaceRect.width,
      rootCount: shadow?.querySelectorAll(".motion-demo").length ?? 0
    };
  });
  await comparisonCard.scrollIntoViewIfNeeded();
  await expect(comparisonRuntime).toHaveAttribute("data-runtime-ready", "true");
  const comparisonAfterInitialization = await comparisonRuntime.evaluate((host) => {
    const shadow = host.shadowRoot;
    const surface = shadow?.querySelector<HTMLElement>(".motion-comparison");
    const divider = shadow?.querySelector<HTMLElement>(".motion-divider");
    if (!surface || !divider) return null;
    const surfaceRect = surface.getBoundingClientRect();
    const dividerRect = divider.getBoundingClientRect();
    return {
      dividerRatio: (dividerRect.left - surfaceRect.left) / surfaceRect.width,
      rootCount: shadow?.querySelectorAll(".motion-demo").length ?? 0
    };
  });
  expect(comparisonBeforeHover).not.toBeNull();
  expect(comparisonAfterInitialization).not.toBeNull();
  if (comparisonBeforeHover && comparisonAfterInitialization) {
    expect(Math.abs(comparisonAfterInitialization.dividerRatio - comparisonBeforeHover.dividerRatio)).toBeLessThan(0.005);
    expect(comparisonAfterInitialization.rootCount).toBe(comparisonBeforeHover.rootCount);
  }

  const comparisonContinuity = await comparisonRuntime.evaluate(async (host) => {
    const card = host.closest<HTMLElement>(".library-card")!;
    const shadow = host.shadowRoot!;
    const surface = shadow.querySelector<HTMLElement>(".motion-comparison")!;
    const divider = shadow.querySelector<HTMLElement>(".motion-divider")!;
    const after = shadow.querySelector<HTMLElement>(".motion-after")!;
    const snapshot = () => {
      const surfaceRect = surface.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();
      return {
        active: host.hasAttribute("data-runtime-active"),
        clipPath: getComputedStyle(after).clipPath,
        dividerRatio: (dividerRect.left - surfaceRect.left) / surfaceRect.width,
        root: shadow.querySelector(".motion-demo")
      };
    };
    const resting = snapshot();
    card.dispatchEvent(new PointerEvent("pointerenter"));
    const entered = snapshot();
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const playing = snapshot();
    card.dispatchEvent(new PointerEvent("pointerleave"));
    const left = snapshot();
    return {
      activeStates: [resting.active, entered.active, playing.active, left.active],
      enterClipStable: resting.clipPath === entered.clipPath,
      enterDividerDelta: Math.abs(resting.dividerRatio - entered.dividerRatio),
      leaveClipStable: playing.clipPath === left.clipPath,
      leaveDividerDelta: Math.abs(playing.dividerRatio - left.dividerRatio),
      rootStable: resting.root === entered.root && entered.root === playing.root && playing.root === left.root
    };
  });
  expect(comparisonContinuity.activeStates).toEqual([false, true, true, false]);
  expect(comparisonContinuity.enterClipStable).toBe(true);
  expect(comparisonContinuity.enterDividerDelta).toBeLessThan(0.005);
  expect(comparisonContinuity.leaveClipStable).toBe(true);
  expect(comparisonContinuity.leaveDividerDelta).toBeLessThan(0.005);
  expect(comparisonContinuity.rootStable).toBe(true);

  await expect(comparisonRuntime).toHaveAttribute("inert", "");
  expect(await comparisonRuntime.evaluate((host) =>
    host.shadowRoot?.querySelector(".motion-demo") ===
      (host as HTMLElement & { __motionLexiconRoot?: HTMLElement | null }).__motionLexiconRoot
  )).toBe(true);
  expect(await comparisonRuntime.evaluate((host) =>
    Array.from(host.shadowRoot?.querySelectorAll<HTMLElement>(
      'a[href],button,input,select,textarea,summary,[tabindex],[contenteditable="true"]'
    ) ?? []).map((element) => element.tabIndex)
  )).toEqual(expect.arrayContaining([-1]));
  expect(await comparisonRuntime.evaluate((host) =>
    Array.from(host.shadowRoot?.querySelectorAll<HTMLElement>(
      'a[href],button,input,select,textarea,summary,[tabindex],[contenteditable="true"]'
    ) ?? []).every((element) => element.tabIndex === -1)
  )).toBe(true);
  expect(await comparisonRuntime.evaluate((host) => {
    host.shadowRoot?.querySelector<HTMLElement>("input,button,[tabindex]")?.focus();
    return host.shadowRoot?.activeElement?.tagName ?? null;
  })).toBeNull();
  await comparisonCard.focus();
  for (let index = 0; index < 3; index += 1) {
    await page.keyboard.press("Tab");
    expect(await comparisonRuntime.evaluate((host) =>
      host.shadowRoot?.activeElement?.tagName ?? null
    )).toBeNull();
  }

  const rippleCard = page.locator('a.library-card[href="/zh/feedback/ripple/"]');
  const rippleRuntime = rippleCard.locator(".motion-thumbnail-runtime");
  const rippleStyle = () => rippleRuntime.evaluate((host) => {
    const ink = host.shadowRoot?.querySelector<HTMLElement>("[data-catalog-sample-ripple]");
    if (!ink) return null;
    const style = getComputedStyle(ink);
    return { opacity: style.opacity, transform: style.transform };
  });
  const rippleBeforeInitialization = await rippleStyle();
  await rippleCard.scrollIntoViewIfNeeded();
  await expect(rippleRuntime).toHaveAttribute("data-runtime-ready", "true");
  expect(await rippleStyle()).toEqual(rippleBeforeInitialization);

  for (const scrollRecipe of ["scroll-reveal", "parallax"]) {
    await expectScrollCatalogContinuity(page, scrollRecipe);
  }

  for (const recipe of componentRecipes) {
    const card = page.locator(
      `a.library-card[href="/zh/${recipe.categoryId}/${recipe.id}/"]`
    );
    const runtimeHost = card.locator(".motion-thumbnail-runtime");

    await card.hover();
    await expect(runtimeHost).toHaveAttribute("data-runtime-ready", "true");
    await expect(runtimeHost).toHaveAttribute("data-runtime-active", "true");
    await expect(runtimeHost.locator(".motion-demo")).toHaveAttribute("data-motion", recipe.canonicalId);
    expect(await runtimeHost.evaluate((host) =>
      host.shadowRoot?.querySelector(".motion-demo") ===
        (host as HTMLElement & { __motionLexiconRoot?: HTMLElement | null }).__motionLexiconRoot
    )).toBe(true);
    await expect(page.locator('.motion-thumbnail-runtime[data-runtime-active="true"]')).toHaveCount(1);
    await expect(page.locator(".motion-thumbnail-runtime .motion-demo")).toHaveCount(componentRecipes.length);

    if (recipe.canonicalId === componentRecipes[0].canonicalId) {
      await expect.poll(() => runtimeHost.locator(".motion-demo").evaluate((root) =>
        root.getAnimations({ subtree: true }).some((animation) => animation.playState === "running")
      )).toBe(true);
    }

    if (recipe.canonicalId === "ripple") {
      const beforeNodeCount = mountedBeforeHover.find(({ canonicalId }) => canonicalId === "ripple")?.nodeCount;
      expect(await runtimeHost.locator(".motion-demo").evaluate((root) => root.querySelectorAll("*").length))
        .toBe(beforeNodeCount);
    }

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
  await expect(page.locator(".motion-thumbnail-runtime .motion-demo")).toHaveCount(componentRecipes.length);
  expect(await firstRuntime.locator(".motion-demo").evaluate((root) =>
    root.getAnimations({ subtree: true }).every((animation) => animation.playState === "paused")
  )).toBe(true);
  expect(await runtimeHosts.evaluateAll((hosts) => hosts.every((host) =>
    host.shadowRoot?.querySelector(".motion-demo") ===
      (host as HTMLElement & { __motionLexiconRoot?: HTMLElement | null }).__motionLexiconRoot
  ))).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test("scroll-driven playground preview keeps continuous hover playback", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Fine-pointer hover is verified once on desktop.");
  await page.goto("/zh/catalog/?surface=playgrounds");
  await expectScrollCatalogContinuity(page, "scroll-driven-animation");
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

      await expect(disclosure).toHaveAttribute("data-open", "true");
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
      await expect.poll(() => spring.evaluate((target) => {
        const match = target.style.transform.match(/translate3d\(0(?:px)?,\s*(-?[\d.]+)px,/);
        return match ? Math.abs(Number(match[1])) : Number.POSITIVE_INFINITY;
      })).toBeLessThan(24);
      await page.locator("[data-motion-replay]").click();
      const restartedDisplacement = await spring.evaluate(async (target) => {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        return Math.abs(Number(
          target.style.transform.match(/translate3d\(0(?:px)?,\s*(-?[\d.]+)px,/)?.[1] ?? 0
        ));
      });
      expect(restartedDisplacement).toBeGreaterThan(36);
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
