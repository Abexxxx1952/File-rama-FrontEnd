import { describe, expect, it } from "vitest";
import { SORT_ORDER, SortRules } from "@/srcApp/pages/dashboard/model/types/sort";
import { areDashboardTableHeaderEqual } from ".././areDashboardTableHeaderEqual";

describe("areDashboardTableHeaderEqual", () => {
  describe("when sort reference is the same", () => {
    it("should return true", () => {
      // Given
      const sort: SortRules[] = [{ key: "name", order: SORT_ORDER.ASC }];

      // When
      const result = areDashboardTableHeaderEqual(
        { sort },
        { sort },
      );

      // Then
      expect(result).toBe(true);
    });
  });

  describe("when sort reference changes", () => {
    it("should return false", () => {
      // Given
      const prevSort: SortRules[] = [{ key: "name", order: SORT_ORDER.ASC }];
      const nextSort: SortRules[] = [{ key: "name", order: SORT_ORDER.ASC }];

      // When
      const result = areDashboardTableHeaderEqual(
        { sort: prevSort },
        { sort: nextSort },
      );

      // Then
      expect(result).toBe(false);
    });
  });
});
