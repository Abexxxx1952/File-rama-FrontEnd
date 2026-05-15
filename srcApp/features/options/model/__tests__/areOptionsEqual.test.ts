import { describe, expect, it } from "vitest";
import { areOptionsEqual } from ".././areOptionsEqual";

describe("areOptionsEqual", () => {
  describe("when tracked props are equal", () => {
    it("should return true", () => {
      // Given
      const props = {
        currentParentFolderId: "folder-1",
        isSelected: true,
        loadingDelete: false,
      } as any;

      // When
      const result = areOptionsEqual(props, { ...props });

      // Then
      expect(result).toBe(true);
    });
  });

  describe("when tracked prop changes", () => {
    it("should return false", () => {
      // Given
      const prevProps = {
        currentParentFolderId: "folder-1",
        isSelected: true,
        loadingDelete: false,
      } as any;
      const nextProps = {
        ...prevProps,
        loadingDelete: true,
      } as any;

      // When
      const result = areOptionsEqual(prevProps, nextProps);

      // Then
      expect(result).toBe(false);
    });
  });
});
