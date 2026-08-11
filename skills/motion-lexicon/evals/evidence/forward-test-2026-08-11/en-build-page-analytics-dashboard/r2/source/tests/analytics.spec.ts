import { expect, test } from "@playwright/test";

const interactiveSelector = [
  "button",
  "a[href]",
  "input",
  "select",
  "textarea",
  "[role='button']",
  "[role='radio']",
].join(",");

test("analytics dashboard meets responsive geometry and target requirements", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) console.log(`bad-response ${response.status()} ${response.url()}`);
  });

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 960 });
    await page.goto("/analytics");
    await expect(page.getByRole("heading", { name: "Retention overview" })).toBeVisible();

    const audit = await page.evaluate((selector) => {
      const nodes = Array.from(new Set(document.querySelectorAll<HTMLElement>(selector)));
      const visible = nodes.filter((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
      });
      const sizes = visible.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          node: node.getAttribute("aria-label") || node.textContent?.trim() || node.tagName,
          width: Number(rect.width.toFixed(2)),
          height: Number(rect.height.toFixed(2)),
        };
      });
      return {
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        count: sizes.length,
        minWidth: Math.min(...sizes.map((item) => item.width)),
        minHeight: Math.min(...sizes.map((item) => item.height)),
        offenders: sizes.filter((item) => item.width < 44 || item.height < 44),
      };
    }, interactiveSelector);

    console.log(`viewport-audit ${width}: ${JSON.stringify(audit)}`);
    expect(audit.document).toBeLessThanOrEqual(audit.viewport);
    expect(audit.offenders).toEqual([]);
  }

  expect(runtimeErrors).toEqual([]);
});

test("range, keyboard, theme, export recovery, and interruption are coherent", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  await page.setViewportSize({ width: 768, height: 960 });
  await page.goto("/analytics");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Northstar analytics home" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Export CSV" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("radio", { name: "30 days" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "90 days" })).toBeFocused();

  const surface = page.getByRole("region", { name: "Retention analytics" });
  await page.getByRole("radio", { name: "7 days" }).click();
  await expect(surface).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("status").filter({ hasText: "Updating to Aug 6–12, 2026" })).toBeVisible();
  await page.getByRole("radio", { name: "90 days" }).click();
  await expect(surface).toHaveAttribute("aria-busy", "false");
  await expect(page.getByText("Showing May 15–Aug 12, 2026")).toBeVisible();
  await expect(page.getByText("174,960")).toBeVisible();

  const lightBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const darkBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(darkBackground).not.toBe(lightBackground);
  await expect.poll(() => page.evaluate(() => [".range-control", ".analytics-export", ".context-bar"].map((selector) => getComputedStyle(document.querySelector(selector)!).backgroundColor))).toEqual(["rgb(29, 29, 26)", "rgb(37, 37, 34)", "rgb(29, 29, 26)"]);

  await page.evaluate(() => {
    const scopedWindow = window as typeof window & { originalCreateObjectURL?: typeof URL.createObjectURL };
    scopedWindow.originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = () => { throw new Error("Synthetic export failure"); };
  });
  await page.getByRole("button", { name: "Export CSV" }).click();
  await expect(page.getByRole("button", { name: "Preparing…" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Try export again" })).toBeVisible();
  await page.evaluate(() => {
    const scopedWindow = window as typeof window & { originalCreateObjectURL?: typeof URL.createObjectURL };
    if (scopedWindow.originalCreateObjectURL) URL.createObjectURL = scopedWindow.originalCreateObjectURL;
  });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Try export again" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("retention-overview-90d.csv");
  await expect(page.getByRole("button", { name: "Exported" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Exported" })).toBeFocused();

  expect(runtimeErrors).toEqual([]);
});

test("reduced motion preserves the range update and status", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/analytics");
  await page.getByRole("radio", { name: "7 days" }).click();
  await expect(page.getByText("Showing Aug 6–12, 2026")).toBeVisible();
  await expect(page.getByText("18,420")).toBeVisible();
  const durations = await page.locator(".dashboard-content").evaluate((node) => ({
    animation: getComputedStyle(node).animationDuration,
    transition: getComputedStyle(node).transitionDuration,
  }));
  console.log(`reduced-motion: ${JSON.stringify(durations)}`);
  expect(durations.transition).toMatch(/1e-05s|0\.00001s|0s/);
});
