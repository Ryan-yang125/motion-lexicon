import { expect, test, type Page } from "@playwright/test";

const WCAG_AA_NORMAL_TEXT = 4.5;

async function catalogTextContrastSamples(page: Page) {
  return page.evaluate(() => {
    type Rgba = { r: number; g: number; b: number; a: number };

    const parseColor = (value: string): Rgba => {
      const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
      if (channels.length < 3) throw new Error(`Unsupported computed color: ${value}`);
      return {
        r: channels[0],
        g: channels[1],
        b: channels[2],
        a: channels[3] ?? 1
      };
    };

    const composite = (foreground: Rgba, background: Rgba): Rgba => {
      const alpha = foreground.a + background.a * (1 - foreground.a);
      if (alpha === 0) return { r: 255, g: 255, b: 255, a: 1 };
      return {
        r: (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) / alpha,
        g: (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) / alpha,
        b: (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) / alpha,
        a: alpha
      };
    };

    const effectiveBackground = (element: Element): Rgba => {
      const layers: Rgba[] = [];
      let current: Element | null = element;
      while (current) {
        const background = parseColor(getComputedStyle(current).backgroundColor);
        if (background.a > 0) layers.push(background);
        current = current.parentElement;
      }
      return layers.reverse().reduce(
        (background, layer) => composite(layer, background),
        { r: 255, g: 255, b: 255, a: 1 }
      );
    };

    const luminance = (color: Rgba) => {
      const [red, green, blue] = [color.r, color.g, color.b].map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };

    const ratio = (foreground: Rgba, background: Rgba) => {
      const foregroundLuminance = luminance(foreground);
      const backgroundLuminance = luminance(background);
      return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
        / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
    };

    const samples: Array<{
      label: string;
      selector: string;
      pseudo?: string;
      reportSelector?: string;
    }> = [
      { label: "hero title", selector: ".library-catalog-hero-unified h1" },
      { label: "search text", selector: ".library-catalog-search input" },
      { label: "category count", selector: ".library-category-filter-heading" },
      { label: "card description", selector: ".library-card-body p" },
      { label: "card alias", selector: ".library-card-body small" },
      {
        label: "search placeholder",
        selector: ".library-catalog-search input",
        pseudo: "::placeholder",
        reportSelector: ".library-catalog-search input::placeholder"
      }
    ];

    return samples.map(({ label, selector, pseudo, reportSelector }) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing contrast sample: ${selector}`);
      const foreground = parseColor(getComputedStyle(element, pseudo).color);
      const background = effectiveBackground(element);
      return {
        label,
        selector: reportSelector ?? selector,
        foreground: getComputedStyle(element, pseudo).color,
        background: `rgb(${Math.round(background.r)}, ${Math.round(background.g)}, ${Math.round(background.b)})`,
        ratio: ratio(foreground, background)
      };
    });
  });
}

test("catalog announces localized result changes for category, surface, and search controls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Announcement semantics only need one browser audit.");

  await page.goto("/zh/catalog/?surface=components");
  const status = page.locator("#catalog-result-count");
  const search = page.getByRole("searchbox", { name: "搜索" });
  const cards = page.locator(".library-card");

  await expect(status).toHaveClass("sr-only");
  await expect(status).toHaveAttribute("role", "status");
  await expect(status).toHaveAttribute("aria-live", "polite");
  await expect(status).toHaveAttribute("aria-atomic", "true");
  await expect(search).toHaveAttribute("aria-controls", "catalog-content");
  await expect(search).toHaveAttribute("aria-describedby", "catalog-result-count");
  await expect(status).toHaveText("动效组件，全部条目，31 个结果");

  const categoryButtons = page.locator(".library-category-filter-options button");
  expect(await categoryButtons.count()).toBeGreaterThan(1);
  const categoryName = (await categoryButtons.nth(1).locator("span").innerText()).trim();
  await categoryButtons.nth(1).click();
  await expect(page).toHaveURL(/category=/);
  await expect(status).toContainText(categoryName);
  const categoryResultCount = await cards.count();
  await expect(status).toContainText(`${categoryName}，${categoryResultCount} 个结果`);

  await page.getByRole("button", { name: /参数工具/ }).click();
  await expect(page).toHaveURL(/surface=playgrounds/);
  await expect(status).toHaveText("参数实验室，全部条目，9 个结果");

  await page.keyboard.press("/");
  await expect(search).toBeFocused();
  await search.fill("stagger");
  await expect(status).toContainText("“stagger”");
  const searchResultCount = await cards.count();
  await expect(status).toHaveText(`参数实验室，全部条目，“stagger”，${searchResultCount} 个结果`);

  await page.goto("/en/catalog/?surface=guides");
  await expect(page.locator("#catalog-result-count")).toHaveText(
    "Design and performance guides, All entries, 4 results"
  );
});

test("catalog text keeps WCAG AA computed contrast in light and dark themes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Computed theme contrast only needs one browser audit.");

  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en/catalog/?surface=components");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".library-catalog-hero-unified h1")).toBeVisible();
  await expect(page.locator(".library-card-body small").first()).toBeVisible();

  const lightSamples = await catalogTextContrastSamples(page);

  await page.evaluate(() => localStorage.setItem("motion-lexicon-theme:v1", "dark"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".library-catalog-hero-unified h1")).toBeVisible();

  const darkSamples = await catalogTextContrastSamples(page);
  const failures = [
    ...lightSamples.map((sample) => ({ theme: "light", ...sample })),
    ...darkSamples.map((sample) => ({ theme: "dark", ...sample }))
  ].filter((sample) => sample.ratio < WCAG_AA_NORMAL_TEXT);
  expect(
    failures,
    failures
      .map((sample) => `${sample.theme} ${sample.label} (${sample.selector}) is ${sample.ratio.toFixed(2)}:1: ${sample.foreground} on ${sample.background}`)
      .join("\n")
  ).toEqual([]);
});

test("catalog reflows and preserves keyboard feedback at a 200 percent zoom-equivalent viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The explicit zoom-equivalent viewport runs once on desktop.");

  await page.setViewportSize({ width: 640, height: 450 });
  await page.goto("/en/catalog/?surface=components");

  const search = page.getByRole("searchbox", { name: "Search" });
  await expect(search).toHaveAttribute("aria-describedby", "catalog-result-count");
  const surfaceTabs = page.locator(".library-surface-tabs button");
  await surfaceTabs.nth(1).click();
  await expect(page).toHaveURL(/surface=playgrounds/);
  await surfaceTabs.nth(0).click();
  await expect(page).toHaveURL(/surface=components/);
  await page.keyboard.press("/");
  await expect(search).toBeFocused();
  await page.keyboard.type("slide");
  await expect(page.locator("#catalog-result-count")).toContainText("“slide”");

  await page.keyboard.press("Tab");
  const activeSurface = page.locator(".library-surface-tabs button[aria-pressed='true']");
  await expect(activeSurface).toBeFocused();
  await expect(activeSurface).toHaveCSS("outline-style", "solid");
  await expect(activeSurface).toHaveCSS("outline-width", "2px");

  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
});
