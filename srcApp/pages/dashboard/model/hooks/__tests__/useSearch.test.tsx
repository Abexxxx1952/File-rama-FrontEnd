import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { useSearch } from ".././useSearch";

const items: FileSystemItem[] = [
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

describe("useSearch", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("when items are null", () => {
    it("should return empty list", () => {
      // Given
      const { result } = renderHook(() => useSearch(null, ""));

      // When
      const filtered = result.current;

      // Then
      expect(filtered).toEqual([]);
    });
  });

  describe("when search query is empty", () => {
    it("should return all items", async () => {
      // Given
      const { result } = renderHook(() => useSearch(items, ""));

      // When / Then
      await waitFor(() => expect(result.current).toEqual(items));
    });
  });

  describe("when search query matches file name", () => {
    it("should return matching items after debounce delay", async () => {
      // Given
      vi.useFakeTimers();
      const { result } = renderHook(() => useSearch(items, "rep"));

      // When
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Then
      expect(result.current).toEqual([items[1]]);
    });
  });
});
