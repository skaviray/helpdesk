import { test, expect } from "@playwright/test";
import { login } from "../helpers/auth";

test.describe("Tickets", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("should display existing tickets on home page", async ({ page }) => {
    await expect(page.getByText("Fix login bug")).toBeVisible();
  });

  test("should create a new ticket", async ({ page }) => {
    await page.getByPlaceholder("Ticket title").fill("E2E Test Ticket");
    await page.getByPlaceholder("Description").fill("Created by Playwright");
    await page.getByRole("button", { name: "Create Ticket" }).click();
    await expect(page.getByText("E2E Test Ticket")).toBeVisible();
  });
});
