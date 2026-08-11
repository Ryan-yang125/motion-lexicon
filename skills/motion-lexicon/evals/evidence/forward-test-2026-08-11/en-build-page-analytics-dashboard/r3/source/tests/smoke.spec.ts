import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, height: 900 },
  { width: 390, height: 900 },
  { width: 768, height: 900 },
  { width: 1440, height: 1000 },
];

for (const viewport of viewports) {
  test(`${viewport.width}px layout has no overflow and all targets are at least 44px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/analytics");
    await expect(page.getByRole("heading", { name: "Performance overview" })).toBeVisible();

    const audit = await page.evaluate(() => {
      const selector = "button, a, input, select, textarea, [role='button'], [role='radio'], [tabindex]:not([tabindex='-1'])";
      const unique = Array.from(new Set(Array.from(document.querySelectorAll<HTMLElement>(selector))));
      const visible = unique.filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
      });
      const targets = visible.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          name: element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " ").slice(0, 42) || element.tagName,
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
        };
      });
      return {
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        targets,
        offenders: targets.filter((target) => target.width < 44 || target.height < 44),
        minWidth: Math.min(...targets.map((target) => target.width)),
        minHeight: Math.min(...targets.map((target) => target.height)),
      };
    });

    console.log(`AUDIT ${viewport.width}: ${JSON.stringify(audit)}`);
    expect(audit.document).toBeLessThanOrEqual(audit.viewport);
    expect(audit.offenders).toEqual([]);
  });
}

test("range change updates the full workspace and supports keyboard selection", async ({ page }) => {
  await page.goto("/analytics");
  await page.getByRole("radio", { name: "7 days" }).click();
  await expect(page.getByText("Aug 6–12, 2026", { exact: true })).toBeVisible();
  await expect(page.getByText("12,480", { exact: true })).toBeVisible();
  await expect(page.locator(".dashboard-workspace")).toHaveAttribute("aria-busy", "true");
  await expect(page.locator(".dashboard-workspace")).toHaveAttribute("aria-busy", "false");

  await page.getByRole("radio", { name: "7 days" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "30 days" })).toBeFocused();
  await expect(page.getByText("38,240", { exact: true })).toBeVisible();
});

test("keyboard order enters the page, reaches the range control, and returns to export", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/analytics");
  const focusPath: string[] = [];
  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press("Tab");
    focusPath.push(await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || document.activeElement?.textContent?.trim().replace(/\s+/g, " ") || ""));
  }
  console.log(`FOCUS PATH: ${JSON.stringify(focusPath)}`);
  expect(focusPath).toEqual([
    "Skip to analytics",
    "Overview",
    "Retention",
    "Audiences",
    "Preferences",
    "Switch to dark theme",
    "Export CSV",
    "30 days",
  ]);
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "90 days" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Export CSV" })).toBeFocused();
});

test("theme and reduced-motion paths preserve state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/analytics");
  const theme = page.getByRole("button", { name: "Switch to dark theme" }).first();
  await theme.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("radio", { name: "90 days" }).click();
  await expect(page.getByText("81,960", { exact: true })).toBeVisible();
  await expect(page.locator(".dashboard-workspace")).toHaveAttribute("aria-busy", "false");
});

test("export supports cancel, success, error, and retry", async ({ page }) => {
  await page.goto("/analytics");
  const exportButton = page.getByRole("button", { name: "Export CSV" });
  await exportButton.click();
  await expect(page.getByRole("button", { name: "Preparing…" })).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(exportButton).toBeEnabled();
  await expect(exportButton).toBeFocused();

  await page.evaluate(() => {
    const url = URL as typeof URL & { __originalCreateObjectURL?: typeof URL.createObjectURL };
    url.__originalCreateObjectURL = url.createObjectURL;
    url.createObjectURL = () => { throw new Error("Synthetic export failure"); };
  });
  await exportButton.click();
  await expect(page.getByRole("button", { name: "Retry export" })).toBeVisible();

  await page.evaluate(() => {
    const url = URL as typeof URL & { __originalCreateObjectURL?: typeof URL.createObjectURL };
    if (url.__originalCreateObjectURL) url.createObjectURL = url.__originalCreateObjectURL;
  });
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Retry export" }).click();
  await download;
  await expect(page.getByRole("button", { name: "Exported" })).toBeVisible();
});
