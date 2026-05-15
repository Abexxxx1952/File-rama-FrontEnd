import { describe, expect, it } from "vitest";
import { getAdditionalTag } from ".././getAdditionalTag";

describe("getAdditionalTag", () => {
  describe("when tag has fewer than two slashes", () => {
    it("should return the original tag", () => {
      // Given
      const tag = "fileSystem/root";

      // When
      const result = getAdditionalTag(tag, "folder-2");

      // Then
      expect(result).toBe(tag);
    });
  });

  describe("when tag has nested path segments", () => {
    it("should replace the second segment with drop id", () => {
      // Given
      const tag = "fileSystem/folder-1/items";

      // When
      const result = getAdditionalTag(tag, "folder-2");

      // Then
      expect(result).toBe("fileSystem/folder-2/items");
    });
  });
});
