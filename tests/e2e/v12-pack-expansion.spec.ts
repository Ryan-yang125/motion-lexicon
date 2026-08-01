import { expect, test } from "@playwright/test";

const addedPacks = [
  ["upload-complete", ".mpp-upload"],
  ["sync-recovery", ".mpp-sync"],
  ["delete-confirmation", ".mpp-delete"],
  ["assignee-picker", ".mpp-assignee"],
  ["permission-change", ".mpp-permission"],
  ["search-suggestions", ".mpp-search"],
  ["kanban-move", ".mpp-kanban"],
  ["cart-update", ".mpp-cart"],
  ["comment-reply", ".mpp-comment"],
  ["approval-request", ".mpp-approval"],
  ["checkout-payment", ".mpp-checkout"],
  ["scheduled-publish", ".mpp-schedule"]
] as const;

test("V1.2 Pack detail routes render their distinct interactive scene without overflow", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  for (const [id, sceneSelector] of addedPacks) {
    await page.goto(`/zh/packs/${id}/`);

    const preview = page.locator(`[data-motion-pack-kind="${id}"]`);
    await expect(preview).toBeVisible();
    await expect(preview.locator(sceneSelector)).toBeVisible();
    await expect(preview.locator("button").first()).toBeEnabled();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, id).toBeLessThanOrEqual(1);
  }

  expect(runtimeErrors).toEqual([]);
});

test("V1.2 Pack previews expose the intended state changes", async ({ page }) => {
  await page.goto("/zh/packs/upload-complete/");
  const uploadPreview = page.locator('[data-motion-pack-kind="upload-complete"]');
  await uploadPreview.getByRole("button", { name: /上传$/ }).click();
  await expect(uploadPreview.getByText("已上传").first()).toBeVisible({ timeout: 1_500 });

  await page.goto("/zh/packs/delete-confirmation/");
  const deletePreview = page.locator('[data-motion-pack-kind="delete-confirmation"]');
  await deletePreview.getByRole("button", { name: "删除", exact: true }).click();
  await expect(deletePreview.getByRole("button", { name: "删除", exact: true })).toBeVisible();
  await deletePreview.getByRole("button", { name: "删除", exact: true }).click();
  await expect(deletePreview.getByText("已删除").first()).toBeVisible();

  await page.goto("/zh/packs/permission-change/");
  const permissionPreview = page.locator('[data-motion-pack-kind="permission-change"]');
  await permissionPreview.getByRole("radio", { name: "编辑者" }).click();
  await expect(permissionPreview.getByRole("radio", { name: "编辑者" })).toHaveAttribute("aria-checked", "true");

  await page.goto("/zh/packs/comment-reply/");
  const commentPreview = page.locator('[data-motion-pack-kind="comment-reply"]');
  await commentPreview.getByRole("button", { name: "回复", exact: true }).click();
  await commentPreview.getByRole("textbox", { name: "评论回复" }).fill("已确认。 ");
  await commentPreview.getByRole("button", { name: "回复", exact: true }).click();
  await expect(commentPreview.locator(".mpp-screen-reader-status")).toHaveText("评论回复: 已回复");

  await page.goto("/zh/packs/checkout-payment/");
  const paymentPreview = page.locator('[data-motion-pack-kind="checkout-payment"]');
  await paymentPreview.getByRole("button", { name: "付款", exact: true }).click();
  await expect(paymentPreview.getByText("已付款").first()).toBeVisible({ timeout: 1_500 });
});
