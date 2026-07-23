import { expect, test } from "@playwright/test";

test("vocabulary publishes all 91 independently maintained terms", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The complete vocabulary contract runs once on desktop.");

  await page.goto("/en/vocabulary/");
  await expect(page.getByRole("heading", { level: 1, name: "Animation vocabulary" })).toBeVisible();
  await expect(page.locator(".vocabulary-term-list article")).toHaveCount(91);
  await expect(page.locator("#term-fade-in-fade-out")).toContainText(
    "An opacity transition brings an element into view"
  );
  await expect(page.locator("#term-pop-in")).toContainText(
    "Pop in overshoots and settles"
  );
  await expect(page.locator("#term-pop-in .vocabulary-translation")).toContainText(
    "元素出现时略微越过最终状态"
  );
});

test("vocabulary search finds aliases and links to their working component", async ({ page }) => {
  await page.goto("/zh/vocabulary/");
  const search = page.getByRole("searchbox", { name: "搜索动画词汇" });
  await search.fill("共享元素");

  const visibleTerms = page.locator(".vocabulary-term-list article");
  await expect(visibleTerms).toHaveCount(2);
  const sharedElementTerm = page.locator("#term-shared-element-transition");
  await expect(sharedElementTerm).toContainText("共享元素过渡");
  const workspaceLink = sharedElementTerm.getByRole("link", {
    name: "打开对应工作区: 共享元素过渡"
  });
  await expect(workspaceLink).toHaveAttribute(
    "href",
    /\/zh\/state-transitions\/morph\/\?mode=shared&term=shared-element-transition#workspace-term-shared-element-transition/
  );

  await workspaceLink.focus();
  await expect(workspaceLink).toBeFocused();
  await workspaceLink.press("Enter");

  await expect(page).toHaveURL(
    /\/zh\/state-transitions\/morph\/\?mode=shared&term=shared-element-transition#workspace-term-shared-element-transition/
  );
  const focusedTerm = page.locator("#workspace-term-shared-element-transition");
  await expect(focusedTerm).toHaveClass(/is-focused/);
  await expect(focusedTerm).toBeFocused();
  await expect(focusedTerm).toContainText("同一个元素从一个位置移动并变换到另一个位置");
  await expect(page.getByRole("radio", { name: "共享元素" })).toBeChecked();
});
