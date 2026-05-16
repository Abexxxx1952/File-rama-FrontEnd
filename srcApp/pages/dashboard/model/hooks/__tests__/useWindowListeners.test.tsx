import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { deleteMany } from "@/srcApp/entities/fileSystemItem/model/deleteMany";
import { type FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";

import { type SelectedMap } from "../../types/selectedMap";
import { useWindowListeners } from ".././useWindowListeners";

vi.mock("@/srcApp/entities/fileSystemItem/model/deleteMany", () => ({
  deleteMany: vi.fn(),
}));

const fileSystemItems: FileSystemItem[] = [
  {
    id: "folder-1",
    folderName: "Documents",
    userId: "user-1",
    parentFolderId: null,
    createdDate: "2026-05-15T10:00:00.000Z",
    isPublic: false,
  },
  {
    id: "file-1",
    userId: "user-1",
    fileUrl: "https://example.com/report.pdf",
    fileDownloadUrl: "https://example.com/report.pdf?download=true",
    fileName: "Report",
    fileExtension: "pdf",
    fileSize: "1024",
    parentFolderId: null,
    fileGoogleDriveId: "drive-file-1",
    fileGoogleDriveParentFolderId: "drive-folder-1",
    fileGoogleDriveClientEmail: "drive@example.com",
    uploadDate: "2026-05-15T10:00:00.000Z",
    fileStaticUrl: "https://example.com/static/report.pdf",
    publicAccessRole: null,
    fileDescription: null,
  },
];

describe("useWindowListeners", () => {
  describe("when Escape key is pressed", () => {
    it("should clear selection", () => {
      // Given
      const clear = vi.fn();
      renderHook(() =>
        useWindowListeners({
          fileSystemItems,
          fileSystemItemsCurrentTag: "files-current",
          selected: new Map(),
          clear,
          setSelected: vi.fn(),
          forceUpdate: vi.fn(),
        })
      );

      // When
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      // Then
      expect(clear).toHaveBeenCalled();
    });
  });

  describe("when Delete key is pressed with selected items", () => {
    it("should delete selected items, clear selection, and force update", async () => {
      // Given
      const selected: SelectedMap = new Map([
        ["file-1", { index: 1, fileId: "file-1" }],
        ["folder-1", { index: 0, folderId: "folder-1" }],
      ]);
      const clear = vi.fn();
      const forceUpdate = vi.fn();
      vi.mocked(deleteMany).mockResolvedValue(null);
      renderHook(() =>
        useWindowListeners({
          fileSystemItems,
          fileSystemItemsCurrentTag: "files-current",
          selected,
          clear,
          setSelected: vi.fn(),
          forceUpdate,
        })
      );

      // When
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));
      });

      // Then
      await waitFor(() =>
        expect(deleteMany).toHaveBeenCalledWith(
          [{ fileId: "file-1" }, { folderId: "folder-1" }],
          "files-current",
          expect.any(Function)
        )
      );
      expect(clear).toHaveBeenCalled();
      expect(forceUpdate).toHaveBeenCalled();
    });
  });

  describe("when shift click is emitted", () => {
    it("should select items between selected boundaries", () => {
      // Given
      const selected: SelectedMap = new Map([
        ["folder-1", { index: 0, folderId: "folder-1" }],
        ["file-1", { index: 1, fileId: "file-1" }],
      ]);
      const setSelected = vi.fn();
      renderHook(() =>
        useWindowListeners({
          fileSystemItems,
          fileSystemItemsCurrentTag: "files-current",
          selected,
          clear: vi.fn(),
          setSelected,
          forceUpdate: vi.fn(),
        })
      );

      // When
      act(() => {
        window.dispatchEvent(new MouseEvent("click", { shiftKey: true }));
      });

      // Then
      expect(setSelected).toHaveBeenCalled();
    });
  });
});
