import { describe, expect, it } from "vitest";
import { areDashboardExtraItemEqual } from ".././areDashboardExtraItemEqual";

describe("areDashboardExtraItemEqual", () => {
  describe("when size props are equal", () => {
    it("should return true", () => {
      // Given
      const prevProps = { usedSize: 100, totalSize: 1000 };
      const nextProps = { usedSize: 100, totalSize: 1000 };

      // When
      const result = areDashboardExtraItemEqual(prevProps, nextProps);

      // Then
      expect(result).toBe(true);
    });
  });

  describe("when used size changes", () => {
    it("should return false", () => {
      // Given
      const prevProps = { usedSize: 100, totalSize: 1000 };
      const nextProps = { usedSize: 200, totalSize: 1000 };

      // When
      const result = areDashboardExtraItemEqual(prevProps, nextProps);

      // Then
      expect(result).toBe(false);
    });
  });
});
