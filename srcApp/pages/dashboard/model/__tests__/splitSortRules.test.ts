import { describe, expect, it } from "vitest";
import { SORT_ORDER, SortRules } from ".././types/sort";
import { splitSortRules } from ".././splitSortRules";

describe("splitSortRules", () => {
  describe("when sort contains folder and file keys", () => {
    it("should map rules to separate folder and file rule lists", () => {
      // Given
      const sort: SortRules[] = [
        { key: "name", order: SORT_ORDER.ASC },
        { key: "size", order: SORT_ORDER.DESC },
        { key: "upload_date", order: SORT_ORDER.ASC },
      ];

      // When
      const result = splitSortRules(sort);

      // Then
      expect(result).toEqual({
        sortFolderRules: [
          { key: "folderName", order: SORT_ORDER.ASC },
          { key: "createdDate", order: SORT_ORDER.ASC },
        ],
        sortFileRules: [
          { key: "fileName", order: SORT_ORDER.ASC },
          { key: "fileSize", order: SORT_ORDER.DESC },
          { key: "uploadDate", order: SORT_ORDER.ASC },
        ],
      });
    });
  });

  describe("when sort is empty", () => {
    it("should return empty rule lists", () => {
      // Given
      const sort: SortRules[] = [];

      // When
      const result = splitSortRules(sort);

      // Then
      expect(result).toEqual({
        sortFolderRules: [],
        sortFileRules: [],
      });
    });
  });
});
