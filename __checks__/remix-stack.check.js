/**
 * To learn more about Playwright Test visit:
 * https://www.checklyhq.com/docs/browser-checks/playwright-test/
 * https://playwright.dev/docs/writing-tests
 */
const { expect, test } = require("@playwright/test");

test("visit page and take screenshot", async ({ page }) => {
  // If available, we set the target URL to a preview deployment URL provided by the ENVIRONMENT_URL created by Vercel.
  // Otherwise, we use the Production URL.
  const targetUrl =
    process.env.ENVIRONMENT_URL || "https://remix-stack.vercel.app";

  // We visit the page. This waits for the "load" event by default.
  const response = await page.goto(targetUrl);
  expect(response.status()).toBeLessThan(400);
  await page.screenshot({ path: "landing.jpg" });

  const login = page.getByRole("link", { name: /login/i });
  await login.waitFor();
  await login.click();

  await page
    .getByRole("textbox", { name: /email/i })
    .type(process.env.TEST_EMAIL);
  await page.getByLabel(/password/i).type(process.env.TEST_PASSWORD);

  await page.getByRole("button", { name: /login/i }).click();
  await page.screenshot({ path: "dashboard.jpg" });
  expect(page.getByText(/dashboard/i)).toBeTruthy();
});
