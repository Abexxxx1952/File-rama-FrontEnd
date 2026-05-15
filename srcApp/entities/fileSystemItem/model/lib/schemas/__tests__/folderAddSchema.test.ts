import { describe, expect, it } from "vitest";
import { folderAddSchema } from ".././folderAddSchema";

describe("folderAddSchema", () => {
  describe("when folder name contains surrounding spaces", () => {
    it("should trim folder name", () => {
      // Given
      const data = { folderName: "  Documents  " };

      // When
      const result = folderAddSchema.safeParse(data);

      // Then
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.folderName).toBe("Documents");
      }
    });
  });

  describe("when folder name is empty after trim", () => {
    it("should return validation error", () => {
      // Given
      const data = { folderName: "   " };

      // When
      const result = folderAddSchema.safeParse(data);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.folderName).toContain(
          "Folder name must be a non-empty string",
        );
      }
    });
  });
});
