import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./srcApp/shared/tests/setupTests.ts"],
    css: true,
    coverage: {
      include: ["srcApp/**/*.{ts,tsx}"],
      exclude: [
        "srcApp/**/*.test.{ts,tsx}",
        "srcApp/**/*.spec.{ts,tsx}",
        "srcApp/**/*.d.ts",
        "srcApp/**/types/**",
        "srcApp/**/index.{ts,tsx}",
        "srcApp/app/**",
        "srcApp/shared/tests/**",
      ],
    },
  },
});
