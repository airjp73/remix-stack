import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "__checks__",
  testMatch: "**/*.check.js",
});
