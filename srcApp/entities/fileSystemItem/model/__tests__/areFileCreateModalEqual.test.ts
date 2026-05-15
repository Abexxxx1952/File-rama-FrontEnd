import { describe, expect, it } from "vitest";
import { areFileCreateModalEqual } from ".././areFileCreateModalEqual";

describe("areFileCreateModalEqual", () => {
  describe("when parent folder and current tag are equal", () => {
    it("should return true", () => {
      // Given
      const prevProps = {
        parentFolderId: "folder-1",
        fileSystemItemsCurrentTag: "files/folder-1/items",
      };
      const nextProps = {
        parentFolderId: "folder-1",
        fileSystemItemsCurrentTag: "files/folder-1/items",
      };

      // When
      const result = areFileCreateModalEqual(prevProps, nextProps);

      // Then
      expect(result).toBe(true);
    });
  });

  describe("when parent folder changes", () => {
    it("should return false", () => {
      // Given
      const prevProps = {
        parentFolderId: "folder-1",
        fileSystemItemsCurrentTag: "files/folder-1/items",
      };
      const nextProps = {
        parentFolderId: "folder-2",
        fileSystemItemsCurrentTag: "files/folder-1/items",
      };

      // When
      const result = areFileCreateModalEqual(prevProps, nextProps);

      // Then
      expect(result).toBe(false);
    });
  });
});
