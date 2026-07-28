import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.PWA_BASE_URL || "http://localhost:4173",
    channel: "msedge",
    trace: "retain-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
});
