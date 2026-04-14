import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5179",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command:
        "DATABASE_URL='postgresql://root:root@localhost:5437/ticketing_test?schema=public' BETTER_AUTH_SECRET='kJ9xP2mQ7vR4wL6nT8yB3cF5hA1dG0eS' bun run start",
      port: 3001,
      reuseExistingServer: !process.env.CI,
      cwd: "../backend",
    },
    {
      command: "bunx --bun vite",
      port: 5179,
      reuseExistingServer: !process.env.CI,
      cwd: "../frontend",
    },
  ],
});
