import { expect, test, type Page } from "@playwright/test";

const WCAG_AA_NORMAL_TEXT = 4.5;
const directorTargetSelectors = [".director-scene-button", ".director-text-link"];

async function expectMinimumHitArea(page: Page, selector: string) {
  const targets = page.locator(selector);
  await expect(targets.first(), `Missing ${selector}`).toBeVisible();
  const dimensions = await targets.evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    })
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));

  expect(dimensions, `Missing visible target for ${selector}`).not.toEqual([]);
  for (const { width, height } of dimensions) {
    expect(width, `${selector} target is narrower than 44px`).toBeGreaterThanOrEqual(44);
    expect(height, `${selector} target is shorter than 44px`).toBeGreaterThanOrEqual(44);
  }
}

async function labStatusContrast(page: Page) {
  return page.locator(".blueprint-lab-status").evaluate((element) => {
    type Rgb = { r: number; g: number; b: number };

    const parseColor = (value: string): Rgb => {
      const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
      if (channels.length < 3) throw new Error(`Unsupported computed color: ${value}`);
      return { r: channels[0], g: channels[1], b: channels[2] };
    };

    const luminance = ({ r, g, b }: Rgb) => {
      const [red, green, blue] = [r, g, b].map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };

    const style = getComputedStyle(element);
    const foreground = parseColor(style.color);
    const background = parseColor(style.backgroundColor);
    const foregroundLuminance = luminance(foreground);
    const backgroundLuminance = luminance(background);
    return {
      foreground: style.color,
      background: style.backgroundColor,
      ratio: (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
        / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
    };
  });
}

test("Motion Director action targets retain 44 pixel hit areas", async ({ page }) => {
  for (const route of ["/zh/director/", "/en/director/"]) {
    await page.goto(route);
    for (const selector of directorTargetSelectors) {
      await expectMinimumHitArea(page, selector);
    }
  }
});

test("Motion Blueprint lab status maintains normal-text contrast in both themes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Computed contrast only needs one browser audit.");

  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en/lab/motion-blueprints/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const light = await labStatusContrast(page);

  await page.evaluate(() => localStorage.setItem("motion-lexicon-theme:v1", "dark"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const dark = await labStatusContrast(page);

  for (const sample of [{ theme: "light", ...light }, { theme: "dark", ...dark }]) {
    expect(
      sample.ratio,
      `${sample.theme} Blueprint lab status is ${sample.ratio.toFixed(2)}:1 (${sample.foreground} on ${sample.background})`
    ).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
  }
});
