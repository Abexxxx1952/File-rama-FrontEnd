import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SORT_ORDER } from "@/srcApp/pages/dashboard/model/types/sort";

import { getFileSystemItems } from "../../getFileSystemItems";
import { type FileSystemItem } from "../../types/fileSystemItem";
import { useFileSystem } from ".././useFileSystem";

vi.mock("../../getFileSystemItems", () => ({
  getFileSystemItems: vi.fn(),
}));

const sortRules = {
  sortFolderRules: [{ key: "folderName", order: SORT_ORDER.ASC }],
  sortFileRules: [{ key: "fileName", order: SORT_ORDER.ASC }],
} as const;

const folder: FileSystemItem = {
  id: "folder-1",
  folderName: "Documents",
  userId: "user-1",
  parentFolderId: null,
  createdDate: "2026-05-15T10:00:00.000Z",
  isPublic: false,
};

describe("useFileSystem", () => {
  describe("when hook is initialized", () => {
    it("should load file system items with current params", async () => {
      // Given
      vi.mocked(getFileSystemItems).mockResolvedValue([folder]);

      // When
      const { result } = renderHook(() =>
        useFileSystem({
          currentParentFolderId: "parent-1",
          sortRules,
          version: 1,
          fileSystemItemsCurrentTag: "files-current",
        })
      );

      // Then
      await waitFor(() => expect(result.current[0]).toEqual([folder]));
      expect(getFileSystemItems).toHaveBeenCalledWith(
        "parent-1",
        sortRules,
        "files-current",
        expect.any(Function)
      );
      expect(result.current[1]).toBe(false);
    });
  });

  describe("when version changes", () => {
    it("should reload file system items", async () => {
      // Given
      vi.mocked(getFileSystemItems).mockResolvedValue([folder]);
      const { rerender } = renderHook(
        ({ version }) =>
          useFileSystem({
            currentParentFolderId: "parent-1",
            sortRules,
            version,
            fileSystemItemsCurrentTag: "files-current",
          }),
        {
          initialProps: {
            version: 1,
          },
        }
      );

      await waitFor(() => expect(getFileSystemItems).toHaveBeenCalledTimes(1));

      // When
      rerender({ version: 2 });

      // Then
      await waitFor(() => expect(getFileSystemItems).toHaveBeenCalledTimes(2));
    });
  });
});
