import { expect, test } from "@playwright/test";

const scene = (page: import("@playwright/test").Page, index: number) =>
  page.locator("[data-status-action]").nth(index);

test("candidate renders three stable, accessible scenes at required widths", async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Done becomes/ })).toBeVisible();
    await expect(page.locator("[data-status-action]")).toHaveCount(3);

    const audit = await page.evaluate(() => {
      const targets = [...document.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")]
        .filter((node) => {
          const style = getComputedStyle(node);
          return style.display !== "none" && style.visibility !== "hidden";
        })
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        });

      return {
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        minimumWidth: Math.min(...targets.map((target) => target.width)),
        minimumHeight: Math.min(...targets.map((target) => target.height)),
        offenders: targets.filter((target) => target.width < 44 || target.height < 44),
      };
    });

    expect(audit.document).toBeLessThanOrEqual(audit.viewport);
    expect(audit.minimumWidth).toBeGreaterThanOrEqual(44);
    expect(audit.minimumHeight).toBeGreaterThanOrEqual(44);
    expect(audit.offenders).toHaveLength(0);
  }
});

test("success hands the same control to the next action without geometry shift", async ({ page }) => {
  await page.goto("/");
  const analytics = scene(page, 0);
  const action = analytics.locator("[data-action]");
  const before = await action.boundingBox();

  await action.click();
  await expect(analytics).toHaveAttribute("data-state", "pending");
  await expect(analytics.locator("[data-status]")).toContainText("Generating");
  await expect(analytics).toHaveAttribute("data-state", "ready", { timeout: 1500 });
  await expect(action).toHaveAccessibleName("Open report");

  const after = await action.boundingBox();
  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(Math.abs(after!.width - before!.width)).toBeLessThan(0.25);
  expect(Math.abs(after!.height - before!.height)).toBeLessThan(0.25);

  await action.click();
  await expect(analytics).toHaveAttribute("data-state", "opened");
  await expect(analytics.locator("[data-result-well]")).toHaveAttribute("data-revealed", "true");
  await expect(analytics.locator("[data-result]")).toContainText("18 pages");
});

test("rapid repeat settles the current request and Escape cancels with focus intact", async ({ page }) => {
  await page.goto("/");
  const member = scene(page, 1);
  const action = member.locator("[data-action]");

  await action.click();
  const firstVersion = await member.getAttribute("data-request-version");
  await action.dispatchEvent("click");
  await expect(member).toHaveAttribute("data-request-version", firstVersion!);
  await expect(member.locator("[data-status]")).toContainText("already being sent");

  await action.press("Escape");
  await expect(member).toHaveAttribute("data-state", "idle");
  await expect(action).toBeFocused();
  await expect(member.locator("[data-status]")).toContainText("cancelled");

  await page.waitForTimeout(700);
  await expect(member).toHaveAttribute("data-state", "idle");
});

test("failure remains recoverable and retry reaches the next action", async ({ page }) => {
  await page.goto("/");
  const backup = scene(page, 2);
  const action = backup.locator("[data-action]");

  await action.click();
  await expect(backup).toHaveAttribute("data-state", "failure", { timeout: 1500 });
  await expect(action).toHaveAccessibleName("Retry backup");
  await expect(backup.locator("[data-status]")).toContainText("interrupted");

  await action.click();
  await expect(backup).toHaveAttribute("data-state", "ready", { timeout: 1800 });
  await expect(action).toHaveAccessibleName("Review backup");

  await action.click();
  await expect(backup).toHaveAttribute("data-state", "opened");
  await expect(backup.locator("[data-result]")).toContainText("Restore point #1842");
});

test("reduced motion preserves the handoff with no travel-duration animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const analytics = scene(page, 0);
  const action = analytics.locator("[data-action]");

  const transitionDuration = await analytics.locator(".sah-label--next").evaluate((node) =>
    getComputedStyle(node).transitionDuration,
  );
  expect(transitionDuration.split(",").every((value) => value.trim() === "0.001s")).toBe(true);

  await action.click();
  await expect(analytics).toHaveAttribute("data-state", "ready", { timeout: 1500 });
  await expect(action).toHaveAccessibleName("Open report");
});

test("portable source runs independently of the React fixture", async ({ page }) => {
  await page.goto("/candidates/status-action-handoff/index.html");
  await expect(page.locator("[data-status-action]")).toHaveCount(3);
  const analytics = scene(page, 0);
  await analytics.locator("[data-action]").click();
  await expect(analytics).toHaveAttribute("data-state", "ready", { timeout: 1500 });
  await expect(analytics.locator("[data-action]")).toHaveAccessibleName("Open report");
});
