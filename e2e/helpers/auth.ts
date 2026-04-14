import { Page } from "@playwright/test";

export async function login(
  page: Page,
  email = "admin@example.com",
  password = "Admin123@"
) {
  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("/");
}
