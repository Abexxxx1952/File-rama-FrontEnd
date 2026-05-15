import { describe, expect, it } from "vitest";
import { SORT_ORDER, SortRules } from "@/srcApp/pages/dashboard/model/types/sort";
import { buildSortMap } from ".././buildSortMap";

describe("buildSortMap", () => {
  describe("when sort rules are provided", () => {
    it("should map each rule by key with order and index", () => {
      // Given
      const sort: SortRules[] = [
        { key: "size", order: SORT_ORDER.DESC },
        { key: "name", order: SORT_ORDER.ASC },
      ];

      // When
      const result = buildSortMap(sort);

      // Then
      expect(result).toEqual(
        new Map([
          ["size", { order: SORT_ORDER.DESC, index: 0 }],
          ["name", { order: SORT_ORDER.ASC, index: 1 }],
        ]),
      );
    });
  });
});
