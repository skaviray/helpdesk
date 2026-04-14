import { test, expect } from "@playwright/test";
import { login } from "../helpers/auth";

test.describe("Authentication", () => {
  test("should show login page for unauthenticated users", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole("heading", { name: "Sign In" })
    ).toBeVisible();
  });

  test("should login with valid admin credentials", async ({ page }) => {
    await login(page);
    await expect(
      page.getByRole("heading", { name: "Ticketing App" })
    ).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Email").fill("wrong@example.com");
    await page.getByPlaceholder("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });
});
