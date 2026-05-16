import { describe, expect, it } from "vitest";

import { getLastAndSecondLastFromMap } from ".././getLastAndSecondLastFromMap";
import { type SelectedMap } from ".././types/selectedMap";

describe("getLastAndSecondLastFromMap", () => {
  describe("when map has fewer than two selected items", () => {
    it("should return null", () => {
      // Given
      const selected: SelectedMap = new Map([
        ["file-1", { index: 1, fileId: "file-1" }],
      ]);

      // When
      const result = getLastAndSecondLastFromMap(selected);

      // Then
      expect(result).toBeNull();
    });
  });

  describe("when map has at least two selected items", () => {
    it("should return indexes of the last two inserted items", () => {
      // Given
      const selected: SelectedMap = new Map([
        ["folder-1", { index: 0, folderId: "folder-1" }],
        ["file-1", { index: 4, fileId: "file-1" }],
        ["folder-2", { index: 2, folderId: "folder-2" }],
      ]);

      // When
      const result = getLastAndSecondLastFromMap(selected);

      // Then
      expect(result).toEqual({ secondLast: 4, last: 2 });
    });
  });
});
