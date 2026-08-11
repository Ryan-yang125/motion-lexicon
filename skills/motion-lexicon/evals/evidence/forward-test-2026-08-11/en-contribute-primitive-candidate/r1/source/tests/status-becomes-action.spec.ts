import { expect, test, type Locator, type Page } from "@playwright/test";

const candidatePath = "/candidates/status-becomes-action/portable/";

async function stateOf(scene: Locator) {
  return scene.getAttribute("data-state");
}

async function waitForState(scene: Locator, state: string) {
  await expect.poll(() => stateOf(scene)).toBe(state);
}

function sceneByHeading(page: Page, name: string) {
  return page.locator("[data-status-action]").filter({
    has: page.getByRole("heading", { name }),
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto(candidatePath);
});

test("renders three independent product scenes without overflow", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Quarterly field notes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Invite Amina Mensah" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Transaction export" })).toBeVisible();

  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});

test("keeps control geometry stable while status becomes the next action", async ({ page }) => {
  const scene = sceneByHeading(page, "Quarterly field notes");
  const control = scene.getByRole("button", { name: "Publish draft" });
  const before = await control.boundingBox();

  await control.click();
  await waitForState(scene, "pending");
  await waitForState(scene, "complete");
  await waitForState(scene, "action-ready");

  const ready = scene.getByRole("button", { name: "View live" });
  const after = await ready.boundingBox();
  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(after?.width).toBeCloseTo(before?.width ?? 0, 4);
  expect(after?.height).toBeCloseTo(before?.height ?? 0, 4);
  await expect(scene.locator("[role=status]")).toHaveText(
    "Draft published. View live is ready.",
  );

  await ready.click();
  await waitForState(scene, "next");
  await expect(scene.getByRole("button", { name: "Live page opened" })).toBeFocused();
});

test("settles rapid repeat input and Escape cancellation on one focus target", async ({ page }) => {
  const scene = sceneByHeading(page, "Invite Amina Mensah");
  const control = scene.getByRole("button", { name: "Send invitation" });

  await control.focus();
  await control.evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });
  await waitForState(scene, "pending");
  await expect(scene).toHaveAttribute("data-attempts", "1");
  await page.keyboard.press("Escape");
  await waitForState(scene, "idle");
  await expect(control).toBeFocused();
  await expect(scene.locator("[role=status]")).toHaveText("Operation canceled.");

  await page.keyboard.press("Enter");
  await waitForState(scene, "action-ready");
  await expect(scene).toHaveAttribute("data-attempts", "2");
  await expect(scene.getByRole("button", { name: "Open member profile" })).toBeFocused();
});

test("exposes failure, retry recovery, success, and the export action", async ({ page }) => {
  const scene = sceneByHeading(page, "Transaction export");
  await scene.getByRole("button", { name: "Generate export" }).click();
  await waitForState(scene, "failure");
  await expect(scene.locator("[role=status]")).toHaveText(
    "The export failed. Retry export.",
  );

  await scene.getByRole("button", { name: "Retry export" }).click();
  await waitForState(scene, "recovery");
  await waitForState(scene, "pending");
  await waitForState(scene, "complete");
  await waitForState(scene, "action-ready");
  await expect(scene).toHaveAttribute("data-attempts", "2");

  await scene.getByRole("button", { name: "Download CSV" }).click();
  await waitForState(scene, "next");
  await expect(scene.locator("[role=status]")).toHaveText(
    "The CSV download started.",
  );
});

test("reduced motion removes travel while preserving confirmation and next action", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const scene = sceneByHeading(page, "Invite Amina Mensah");

  await scene.getByRole("button", { name: "Send invitation" }).click();
  await waitForState(scene, "action-ready");

  const motion = await scene.locator('[data-face="action-ready"]').evaluate((face) => {
    const style = getComputedStyle(face);
    return {
      duration: style.transitionDuration,
      transform: style.transform,
      opacity: style.opacity,
    };
  });
  expect(motion.duration).toBe("0.001s");
  expect(motion.transform).toBe("none");
  expect(motion.opacity).toBe("1");
  await expect(scene.locator("[role=status]")).toHaveText(
    "Invitation sent. Open member profile is ready.",
  );
});
