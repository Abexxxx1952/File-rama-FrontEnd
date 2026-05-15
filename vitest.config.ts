import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./srcApp/shared/tests/setupTests.ts"],
    globals: false,
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
