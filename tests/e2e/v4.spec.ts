import { expect, test } from "@playwright/test";
import { registryBlocks } from "../../src/data/block-registry";
import { registryComponents } from "../../src/data/component-registry";
import { canonicalMotionCatalog } from "../../src/data/motion-catalog";
import { installablePrimitiveEntries } from "../../src/data/primitive-registry";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
}

test("landing page presents live components, primitives, and the Skill entry", async ({ page }, testInfo) => {
  await page.goto("/zh/");
  await expect(page.getByRole("heading", { level: 1, name: "把好动效，直接带进产品。" })).toBeVisible();
  await expect(page.locator('[data-component="reorder-list"]')).toBeVisible();
  const firstTab = page.getByRole("tab", { name: "拖拽排序列表" });
  for (const tab of await page.getByRole("tab").all()) {
    await expect(tab).toHaveAttribute("aria-controls", "landing-stage-panel");
  }
  await expect(page.locator("#landing-stage-panel")).toBeVisible();
  await firstTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "标签页" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "标签页" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-component="tabs"]')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("tabpanel", { name: "标签页" })).toBeVisible();
  await expect(page.locator(".landing-component-card")).toHaveCount(4);
  await expect(page.locator(".landing-primitive-card")).toHaveCount(3);
  for (const [index, id] of [[1, "loading-button"], [3, "value-flash"]] as const) {
    const card = page.locator(".landing-component-card").nth(index);
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator(`[data-component="${id}"]`)).toBeVisible();
    for (const control of await card.locator("button, a, input, select, textarea, [role='button']").all()) {
      const box = await control.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }
  const skill = page.locator(".library-shell-header").getByRole("link", { name: "Skill" });
  await expect(skill).toHaveAttribute("href", "/zh/skill/");
  const github = page.locator(".library-shell-header").getByRole("link", { name: "GitHub" });
  await expect(github).toBeVisible();
  for (const link of [skill, github]) {
    expect(await link.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  }
  const brand = page.locator(".shell-landing-start").getByRole("link", { name: "Motion Lexicon" });
  const brandBox = await brand.boundingBox();
  expect(brandBox?.width).toBeGreaterThanOrEqual(44);
  expect(brandBox?.height).toBeGreaterThanOrEqual(44);
  if (!testInfo.project.name.includes("mobile")) {
    for (const link of await page.locator(".shell-landing-nav a").all()) {
      expect(await link.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    }
  }
  for (const control of await page.locator(".library-shell-header a, .library-shell-header button").all()) {
    if (!await control.isVisible()) continue;
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await expectNoHorizontalOverflow(page);
});

test("landing preview switches instantly with reduced motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Reduced-motion landing contract runs once.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/");
  await page.getByRole("tab", { name: "标签页" }).click();
  const runningTransitions = await page.locator(".landing-stage-motion").evaluate((node) =>
    node.getAnimations().filter((animation) => animation.playState === "running").length
  );
  expect(runningTransitions).toBe(0);
});

test("component directory exposes all live registry blocks and components", async ({ page }) => {
  await page.goto("/zh/components/");
  await expect(page.getByRole("heading", { level: 1, name: "可直接复制的 React 动效组件" })).toBeVisible();
  await expect(page.locator(".block-card")).toHaveCount(registryBlocks.length);
  await expect(page.locator(".component-card")).toHaveCount(registryBlocks.length + registryComponents.length);
  await expect(page.locator('.shell-nav-link[aria-current="page"]')).toContainText("组件");
  await expect(page.locator('[data-component="copy-button"]')).toBeVisible();
  await expect(page.locator('[data-page-block="product-landing"]')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("page block workbench previews, resizes, opens fullscreen, and exposes the exact source", async ({ page }, testInfo) => {
  await page.goto("/zh/components/product-landing/");
  await expect(page.getByRole("heading", { level: 1, name: "产品发布页" })).toBeVisible();
  const workbench = page.locator(".block-workbench");
  const block = workbench.locator('[data-page-block="product-landing"]');
  await expect(block).toBeVisible();
  await page.getByRole("tab", { name: "审阅" }).click();
  await expect(page.getByRole("tab", { name: "审阅" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("radio", { name: "平板" }).click();
  await expect(page.locator(".block-detail-stage")).toHaveAttribute("data-block-viewport", "tablet");
  if (!testInfo.project.name.includes("mobile")) {
    await page.getByRole("button", { name: "全屏预览" }).click();
    const dialog = page.getByRole("dialog", { name: "产品发布页 全屏预览" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "关闭预览" }).click();
    await expect(page.getByRole("button", { name: "全屏预览" })).toBeFocused();
  }
  await page.getByRole("radio", { name: "代码" }).click();
  await expect(page.locator(".component-source")).toContainText("export function ProductLandingBlock");
  await expect(page.locator(".component-install-panel code")).toContainText("/r/product-landing.json");
  await expectNoHorizontalOverflow(page);
});

test("all Chinese component routes stay localized, stable, and within the viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The full 59-route scan runs once; mobile contracts have focused coverage.");
  test.setTimeout(180_000);
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  const englishUiLeak = /Drag to reorder|character \d+ of|\d+ of \d+ shown|step \d+ of|connections highlighted|Static network|Live network|Run complete|Run failed|\bchest\b|\blength\b|Use (?:dark|light) theme|Open commands|Command palette|Workspace sections|Inspect restored image detail/i;

  for (const component of registryComponents) {
    runtimeErrors.length = 0;
    await page.goto(`/zh/components/${component.id}/`);
    const preview = page.locator(`[data-component="${component.id}"]`);
    await expect(preview, component.id).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(await preview.ariaSnapshot(), component.id).not.toMatch(englishUiLeak);
    expect(runtimeErrors, component.id).toEqual([]);
  }
});

test("mobile component controls keep 44px targets", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile target sizing runs once.");
  for (const id of [
    "agent-thinking-trace",
    "streaming-answer",
    "tool-call-stack",
    "approval-flow",
    "agent-task-queue",
    "prompt-composer",
    "context-sources",
    "diff-review",
    "agent-recommendation",
    "multi-agent-handoff",
    "expanding-search",
    "inline-validation",
    "otp-input",
    "slider-detents",
    "tag-input",
    "reorder-list",
  ] as const) {
    await page.goto(`/zh/components/${id}/`);
    const controls = page.locator(`[data-component="${id}"]`).locator('button, a, input:not([type="file"]), select, textarea, [role="button"], [role="slider"]');
    for (const control of await controls.all()) {
      if (!await control.isVisible()) continue;
      const box = await control.boundingBox();
      expect(box?.width, `${id}: ${await control.getAttribute("aria-label") ?? await control.textContent()}`).toBeGreaterThanOrEqual(44);
      expect(box?.height, `${id}: ${await control.getAttribute("aria-label") ?? await control.textContent()}`).toBeGreaterThanOrEqual(44);
    }
  }
});

test("component detail keeps preview, source, install, and related primitives together", async ({ page }) => {
  await page.goto("/zh/components/copy-button/");
  await expect(page.getByRole("heading", { level: 1, name: "复制按钮" })).toBeVisible();
  await expect(page.locator('[data-component="copy-button"]')).toBeVisible();
  await page.getByRole("radio", { name: "代码" }).click();
  await expect(page.locator(".component-source")).toContainText("export function CopyButton");
  await expect(page.locator(".component-install-panel code")).toContainText("/r/copy-button.json");
  await expect(page.getByRole("heading", { level: 2, name: "基础动效" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("agent collection exposes a complete workspace and implementation brief", async ({ page }) => {
  await page.goto("/zh/components/agent-workspace/");
  await expect(page.getByRole("heading", { level: 1, name: "Agent 产品工作台" })).toBeVisible();
  const workspace = page.locator('.block-detail-stage [data-page-block="agent-workspace"]');
  await expect(workspace).toBeVisible();
  await workspace.getByRole("button", { name: "开始任务" }).click();
  await expect(workspace.getByText("正在读取需求")).toBeVisible();
  await expect(page.getByRole("button", { name: "复制给 Agent" })).toBeVisible();
  await page.getByRole("radio", { name: "代码" }).click();
  await expect(page.locator(".component-source")).toContainText("export function AgentWorkspaceBlock");
  await expect(page.locator(".component-install-panel code")).toContainText("/r/agent-workspace.json");
  await expectNoHorizontalOverflow(page);

  await page.goto("/zh/components/agent-thinking-trace/");
  await expect(page.locator('[data-component="agent-thinking-trace"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "复制给 Agent" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("desktop component sidebar reveals the active route without moving the page", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop sidebar contract runs once.");
  await page.goto("/en/components/skeleton-reveal/");
  const scroll = page.locator(".library-shell-desktop .shell-nav-scroll");
  const active = page.locator(".library-shell-desktop .shell-nav-link.is-active");
  await expect(active).toHaveText("Skeleton reveal");
  await expect.poll(async () => active.evaluate((node) => {
    const item = node.getBoundingClientRect();
    const viewport = node.closest(".shell-nav-scroll")?.getBoundingClientRect();
    return Boolean(viewport && item.top >= viewport.top && item.bottom <= viewport.bottom);
  })).toBe(true);
  expect(await scroll.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("new component engines stay inside the page viewport", async ({ page }) => {
  for (const id of [
    "dither-reveal-card",
    "procedural-product-viewer",
    "network-globe",
    "scroll-story",
    "media-carousel",
    "image-lightbox",
  ]) {
    await page.goto(`/zh/components/${id}/`);
    await expect(page.locator(`[data-component="${id}"]`)).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test("Three.js components retain a static preview without WebGL", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "WebGL fallback contract runs once.");
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args) {
      const type = args[0];
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null;
      return getContext.apply(this, args as Parameters<typeof getContext>);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });

  await page.goto("/zh/components/network-globe/");
  await expect(page.locator('[data-webgl-fallback="network-globe"]')).toBeVisible();
  const globe = page.locator('[data-webgl-root="network-globe"]');
  await expect(globe).toHaveCSS("touch-action", "pan-y");
  await expect(globe).not.toHaveAttribute("tabindex");
  await expect(globe).toHaveAttribute("aria-label", /静态网络预览|Static network preview/);
  await expect(globe.getByText("静态网络")).toBeVisible();
  const globeActivation = globe.locator('[data-webgl-activation="network-globe"]');
  await expect(globeActivation).toBeVisible();
  expect((await globeActivation.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await globeActivation.click();
  await expect(globeActivation).toBeEnabled();
  await expect(globe.locator("canvas")).toHaveCount(0);
  expect(
    await globe.evaluate((element) =>
      element.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowRight",
          bubbles: true,
          cancelable: true,
        }),
      ),
    ),
  ).toBe(true);

  await page.goto("/zh/components/procedural-product-viewer/");
  await expect(page.locator('[data-webgl-fallback="procedural-product-viewer"]')).toBeVisible();
  const product = page.locator('[data-webgl-root="procedural-product-viewer"]');
  await expect(product).toHaveCSS("touch-action", "pan-y");
  await expect(product).not.toHaveAttribute("tabindex");
  await expect(product).toHaveAttribute("aria-label", /静态产品预览|Static product preview/);
  await expect(product.getByText(/静态预览|STATIC PREVIEW/)).toBeVisible();
  const productActivation = product.locator('[data-webgl-activation="procedural-product-viewer"]');
  await expect(productActivation).toBeVisible();
  expect((await productActivation.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await productActivation.click();
  await expect(productActivation).toBeEnabled();
  await expect(product.locator("canvas")).toHaveCount(0);
  await expect(product.getByRole("button", { name: "重置视角" })).toHaveCount(0);
  expect(
    await product.evaluate((element) =>
      element.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowLeft",
          bubbles: true,
          cancelable: true,
        }),
      ),
    ),
  ).toBe(true);
});

test("Three.js previews wait for intent before their first long task", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Production long-task smoke runs once.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const values: number[] = [];
    (window as typeof window & { __threeLongTasks?: number[] }).__threeLongTasks = values;
    new PerformanceObserver((list) => {
      values.push(...list.getEntries().map((entry) => entry.duration));
    }).observe({ type: "longtask", buffered: true });
  });

  for (const id of ["network-globe", "procedural-product-viewer"] as const) {
    await page.goto(`/zh/components/${id}/`);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => {
      const entries = (window as typeof window & { __threeLongTasks?: number[] }).__threeLongTasks;
      if (entries) entries.length = 0;
    });
    await page.waitForTimeout(700);
    const root = page.locator(`[data-webgl-root="${id}"]`);
    await expect(root.locator("canvas")).toHaveCount(0);
    expect(await page.evaluate(() => (window as typeof window & { __threeLongTasks?: number[] }).__threeLongTasks ?? [])).toEqual([]);

    const activation = root.locator(`[data-webgl-activation="${id}"]`);
    const activationStart = await page.evaluate(() => performance.now());
    await activation.focus();
    await page.keyboard.press("Enter");
    await expect(root.locator("canvas")).toHaveCount(1, { timeout: 10_000 });
    await expect(root).toBeFocused();
    await expect(activation).toHaveCount(0);
    await expect(root.locator("canvas")).toHaveCount(1);
    const activationResult = await page.evaluate((start) => ({
      elapsed: performance.now() - start,
      longTasks: (window as typeof window & { __threeLongTasks?: number[] }).__threeLongTasks ?? [],
    }), activationStart);
    expect(activationResult.elapsed).toBeLessThan(1_000);
    expect(Math.max(0, ...activationResult.longTasks)).toBeLessThanOrEqual(250);
  }
});

test("theme snapshots and dropped files honor their component contracts", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Advanced component contracts run once.");
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: (update: () => void | Promise<void>) => {
        const ready = Promise.resolve(update()).then(() => {
          (window as typeof window & { __snapshotTheme?: string | null }).__snapshotTheme = document.querySelector("[data-theme-reveal-state]")?.getAttribute("data-theme-reveal-state");
        });
        return { ready, finished: ready };
      },
    });
  });
  await page.goto("/zh/components/theme-reveal/");
  await page.getByRole("button", { name: "使用深色主题" }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __snapshotTheme?: string | null }).__snapshotTheme)).toBe("dark");

  await page.goto("/zh/components/upload-queue/");
  const files = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(["image"], "accepted.png", { type: "image/png" }));
    transfer.items.add(new File(["text"], "rejected.txt", { type: "text/plain" }));
    return transfer;
  });
  await page.locator("[data-upload-drop-zone]").dispatchEvent("drop", { dataTransfer: files });
  await expect(page.getByText("accepted.png", { exact: true })).toBeVisible();
  await expect(page.getByText("rejected.txt", { exact: true })).toHaveCount(0);
});

test("primitive directory and workbench use the direct V4 routes", async ({ page }) => {
  await page.goto("/zh/primitives/");
  await expect(page.getByRole("heading", { level: 1, name: "可调节、可复制的 React 原子动效" })).toBeVisible();
  await expect(page.locator(".primitive-card")).toHaveCount(canonicalMotionCatalog.length);
  await expect(page.locator('[data-primitive="slide-in"]')).toBeVisible();
  await page.locator('.primitive-card-footer[href="/zh/primitives/slide-in/"]').click();
  await expect(page).toHaveURL(/\/zh\/primitives\/slide-in\//);
  await expect(page.getByRole("heading", { level: 1, name: "滑入" })).toBeVisible();
  await expect(page.getByRole("slider").first()).toBeVisible();
  await page.getByRole("radio", { name: "代码" }).click();
  await expect(page.locator(".primitive-source")).toContainText("export function SlideInPrimitive");
  await expect(page.locator(".component-install-panel code")).toContainText("/r/primitive-slide-in.json");
  for (const trigger of await page.locator(".primitive-reference-panel button").all()) {
    expect(await trigger.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  }
  await expectNoHorizontalOverflow(page);
});

test("all Chinese primitive routes stay localized, stable, and within the viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "The full 44-route scan runs once; focused projects cover mobile and WebKit.");
  test.setTimeout(120_000);
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || (message.type() === "warning" && /hydrat|did not match/i.test(message.text()))) {
      runtimeErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  const englishUiLeak = /Design system|\d+ files|\d+ min ago|Motion review|Create new|\bFrame\b|\bPage\b|\bFlow\b|independent React motion interactions|\bTrigger\b|\bMove\b|\bSettle\b|\bWorkspace\b|\bFREE\b|\bPRO\b|\bDetails\b|\bAccess\b|\bReview\b|\bIntroduction\b|\bInteraction\b|\bAccessibility\b|\bShipping\b|\bOverview\b|\bActivity\b|\bFiles\b|PROJECT \/ 04|Quiet product motion|Updated \d+ min ago|\bLive\b|Tool \d+|Research motion|Prototype states|Ship registry|Motion review complete|Swipe to archive|PASSWORD|Motion studies|collaborators|\bActive\b|● online|devices · \d+ changes|Operational|ASSET 04|Product update|pages · \d+ registry items|REGISTRY INSTALLS|\d+ steps|COMPOSITE|LAYOUT/i;

  for (const primitive of canonicalMotionCatalog) {
    runtimeErrors.length = 0;
    await page.goto(`/zh/primitives/${primitive.id}/`);
    const preview = page.locator(`[data-primitive="${primitive.id}"]`);
    await expect(preview, primitive.id).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(await preview.ariaSnapshot(), primitive.id).not.toMatch(englishUiLeak);
    expect(runtimeErrors, primitive.id).toEqual([]);
  }
});

test("mobile guide links keep full touch targets", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile touch-target contract runs once.");
  await page.goto("/zh/guides/");
  for (const link of await page.locator(".seo-guide-grid a").all()) {
    expect(await link.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  }
});

test("global search opens immediately and navigates by keyboard", async ({ page }) => {
  let paletteRequests = 0;
  page.on("request", (request) => {
    if (/\/(?:assets\/command-palette-|src\/registry\/components\/command-palette\.tsx)/.test(request.url())) {
      paletteRequests += 1;
    }
  });
  await page.goto("/zh/components/");
  await page.waitForFunction(() => document.documentElement.dataset.clientReady === "true");
  const trigger = page.locator(".shell-search-trigger");
  await trigger.focus();
  await expect.poll(() => paletteRequests).toBe(1);
  await trigger.click();
  const search = page.getByRole("combobox", { name: "搜索 Motion Lexicon" });
  await expect(search).toBeFocused();
  expect(paletteRequests).toBe(1);
  await page.keyboard.press("Tab");
  await expect(search).toBeFocused();
  await page.locator(".fixed.inset-0.z-50 > .absolute.inset-0").click({ position: { x: 4, y: 4 } });
  await expect(search).toBeHidden();
  await expect(page.locator(".shell-search-trigger")).toBeFocused();
  await trigger.click();
  await expect(search).toBeFocused();
  await search.fill("drawer");
  await expect(page.getByRole("option", { name: /抽屉/ })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/zh\/components\/drawer\//);
  await expect(page.getByRole("heading", { level: 1, name: "抽屉" })).toBeVisible();
});

test("component keyboard and reduced-motion contracts remain intact", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Component keyboard contract runs once.");
  await page.goto("/zh/components/command-palette/");
  await page.getByRole("button", { name: "调用 Agent 命令" }).click();
  await expect(page.getByRole("combobox", { name: "Agent 命令" })).toBeFocused();

  await page.goto("/zh/components/tabs/");
  const tabs = page.getByRole("tablist", { name: "工作区栏目" });
  const overview = tabs.getByRole("tab", { name: "概览" });
  const activity = tabs.getByRole("tab", { name: "动态" });
  await overview.focus();
  await page.keyboard.press("ArrowRight");
  await expect(activity).toBeFocused();
  await expect(activity).toHaveAttribute("aria-selected", "true");

  await page.goto("/zh/components/mega-menu/");
  const productMenu = page.getByRole("button", { name: "产品" });
  await productMenu.hover();
  await expect(productMenu).toHaveAttribute("aria-expanded", "true");
  const menu = page.getByRole("menu", { name: "产品" });
  await expect(menu).toBeVisible();
  const productBox = await productMenu.boundingBox();
  const menuBox = await menu.boundingBox();
  expect(productBox).not.toBeNull();
  expect(menuBox).not.toBeNull();
  await page.mouse.move(productBox!.x + productBox!.width / 2, productBox!.y + productBox!.height - 1);
  await page.mouse.move(menuBox!.x + 20, menuBox!.y + 8, { steps: 4 });
  await page.waitForTimeout(160);
  await expect(menu).toBeVisible();

  await productMenu.focus();
  await page.keyboard.press("ArrowDown");
  const menuItems = menu.getByRole("menuitem");
  await expect(menuItems.nth(0)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menuItems.nth(1)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menuItems.nth(0)).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(menuItems.nth(1)).toBeFocused();
  await page.keyboard.press("Home");
  await expect(menuItems.nth(0)).toBeFocused();
  await page.keyboard.press("End");
  await expect(menuItems.nth(1)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(productMenu).toHaveAttribute("aria-expanded", "false");
  await expect(productMenu).toBeFocused();
  await page.mouse.move(0, 0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/components/hold-to-confirm/");
  const hold = page.getByRole("button", { name: /按住删除工作区/ });
  await hold.focus();
  await page.keyboard.down("Space");
  await page.waitForTimeout(80);
  const initialClip = await hold.locator("[data-hold-fill]").evaluate((node) => (node as HTMLElement).style.clipPath);
  expect(Number(initialClip.match(/inset\(0px ([\d.]+)%/)?.[1])).toBeGreaterThan(0);
  await expect.poll(async () => {
    const clip = await hold.locator("[data-hold-fill]").evaluate((node) => (node as HTMLElement).style.clipPath);
    return Number(clip.match(/inset\(0px ([\d.]+)%/)?.[1]);
  }).toBeLessThan(100);
  await page.keyboard.up("Space");

  await page.goto("/zh/components/cursor-lens/");
  const lensRoot = page.getByRole("group", { name: "查看修复后的图像细节" });
  await lensRoot.evaluate((root) => { root.style.height = "320px"; });
  await lensRoot.focus();
  await page.keyboard.press("ArrowRight");
  const lens = lensRoot.locator("[data-cursor-lens]");
  await expect(lens).toHaveAttribute("data-position-mode", "instant");
  await expect.poll(async () => lensRoot.evaluate((root) => ({
    detail: root.querySelector<HTMLElement>("[data-cursor-lens-detail]")?.clientHeight,
    root: root.clientHeight,
  }))).toEqual({ detail: 320, root: 320 });
  const position = await lensRoot.evaluate((root) => {
    const node = root.querySelector<HTMLElement>("[data-cursor-lens]");
    const detail = root.querySelector<HTMLElement>("[data-cursor-lens-detail]");
    return {
      transform: node?.style.transform,
      detailTransform: detail?.style.transform,
      width: root.clientWidth,
      height: root.clientHeight,
    };
  });
  expect(position.transform).toBe(`translate3d(${position.width / 2 + 10 - 66}px, ${position.height / 2 - 66}px, 0px)`);
  expect(position.detailTransform).toBe(`translate3d(${66 - (position.width / 2 + 10) * 1.35}px, ${66 - (position.height / 2) * 1.35}px, 0px) scale(1.35)`);

  await lensRoot.evaluate((node) => node.blur());
  const rootBox = await lensRoot.boundingBox();
  expect(rootBox).not.toBeNull();
  await lensRoot.dispatchEvent("pointerdown", {
    pointerType: "touch",
    pointerId: 7,
    clientX: rootBox!.x + 20,
    clientY: rootBox!.y + 30,
  });
  await lensRoot.focus();
  await lensRoot.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 7 });
  await lensRoot.dispatchEvent("pointerout", { pointerType: "touch", pointerId: 7 });
  await lensRoot.dispatchEvent("pointerleave", { pointerType: "touch", pointerId: 7 });
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
  await expect(lensRoot.locator("[data-cursor-lens]")).toHaveCSS("transform", "matrix(1, 0, 0, 1, -46, -36)");

  await lensRoot.dispatchEvent("pointerdown", {
    pointerType: "touch",
    pointerId: 8,
    clientX: rootBox!.x + 22,
    clientY: rootBox!.y + 32,
  });
  await lensRoot.dispatchEvent("pointercancel", { pointerType: "touch", pointerId: 8 });
  await lensRoot.dispatchEvent("pointerout", { pointerType: "touch", pointerId: 8 });
  await expect(lensRoot.locator("[data-cursor-lens]")).toBeVisible();

  await lensRoot.dispatchEvent("pointerdown", {
    pointerType: "touch",
    pointerId: 9,
    clientX: rootBox!.x + 24,
    clientY: rootBox!.y + 34,
  });
  await lensRoot.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 9 });
  await lensRoot.dispatchEvent("pointerout", { pointerType: "touch", pointerId: 9 });
  await lensRoot.dispatchEvent("pointerleave", { pointerType: "touch", pointerId: 9 });
  await expect(lensRoot.locator("[data-cursor-lens]")).toHaveCount(0);
});

test("mobile navigation, language, theme, and Agent Skill remain reachable", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile shell contract runs once.");
  await page.goto("/zh/components/");
  await page.getByRole("button", { name: "打开导航" }).click();
  const dialog = page.getByRole("dialog", { name: "站点导航" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "关闭导航" })).toBeFocused();
  await expect(page.locator("#main-content")).toHaveAttribute("aria-hidden", "true");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "打开导航" })).toBeFocused();

  await page.getByRole("button", { name: "打开导航" }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Agent Skill" }).click();
  await expect(page).toHaveURL(/\/zh\/skill\//);
  await expect(page.getByRole("heading", { level: 1, name: "Motion Lexicon" })).toBeVisible();
  await page.goto("/zh/components/copy-button/");
  const copyButton = page.locator(".agent-brief-copy");
  await expect(copyButton).toBeEnabled();
  await expect.poll(async () => (await copyButton.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(44);
  await expectNoHorizontalOverflow(page);
});

test("Agent Skill publishes the complete bilingual six-mode workflow", async ({ page }) => {
  await page.goto("/zh/skill/");
  await expect(page.getByRole("heading", { level: 1, name: "Motion Lexicon" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "构建页面" })).toBeVisible();
  await expect(page.locator(".skill-modes article")).toHaveCount(6);

  await page.goto("/en/skill/");
  await expect(page.getByRole("heading", { level: 2, name: "Build Page" })).toBeVisible();
  await expect(page.locator(".skill-modes article")).toHaveCount(6);
});

test("reduced motion stops non-essential task progress rotation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Reduced-motion runtime contract runs once.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/components/task-steps/");
  await expect(page.locator('[data-component="task-steps"]')).toBeVisible();
  const rotations = await page.locator('[data-component="task-steps"] svg').evaluateAll((icons) =>
    icons.flatMap((icon) => icon.getAnimations()).filter((animation) => animation.playState === "running").length
  );
  expect(rotations).toBe(0);
});

test("English routes and the shadcn registry are publishable", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Registry contract runs once.");
  await page.goto("/en/components/");
  await expect(page.getByRole("heading", { level: 1, name: "Copy-ready React motion components" })).toBeVisible();
  const registry = await request.get("/r/registry.json");
  expect(registry.ok()).toBe(true);
  const index = await registry.json() as { items: Array<{ name: string }> };
  expect(index.items).toHaveLength(registryBlocks.length + registryComponents.length + installablePrimitiveEntries.length);
  const productLanding = await request.get("/r/product-landing.json");
  expect(productLanding.ok()).toBe(true);
  expect(await productLanding.json()).toMatchObject({
    name: "product-landing",
    type: "registry:block",
    dependencies: ["motion"],
    files: [{ type: "registry:component", target: "components/motion-lexicon/blocks/product-landing.tsx" }],
  });
  const copyButton = await request.get("/r/copy-button.json");
  expect(copyButton.ok()).toBe(true);
  expect(await copyButton.json()).toMatchObject({ name: "copy-button", type: "registry:ui" });
  const slideIn = await request.get("/r/primitive-slide-in.json");
  expect(slideIn.ok()).toBe(true);
  expect(await slideIn.json()).toMatchObject({ name: "primitive-slide-in", type: "registry:ui" });
  const scrollStory = await request.get("/r/scroll-story.json");
  expect(await scrollStory.json()).toMatchObject({ dependencies: ["gsap"], meta: { engines: ["gsap"], runtimeCost: "medium" } });
  const productViewer = await request.get("/r/procedural-product-viewer.json");
  expect(await productViewer.json()).toMatchObject({ dependencies: ["motion", "three"], devDependencies: ["@types/three"], meta: { engines: ["motion", "three"], runtimeCost: "heavy" } });
  const networkGlobe = await request.get("/r/network-globe.json");
  expect(await networkGlobe.json()).toMatchObject({ dependencies: ["motion", "three"], devDependencies: ["@types/three"], meta: { engines: ["motion", "three"], runtimeCost: "heavy" } });
});
