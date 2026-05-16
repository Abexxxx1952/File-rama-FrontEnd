import { describe, expect, it, vi } from "vitest";

import { type File } from "@/srcApp/entities/fileSystemItem/model/types/file";
import { type FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { type Folder } from "@/srcApp/entities/fileSystemItem/model/types/folder";

import { selectBetween } from ".././selectBetween";
import { type SelectedMap } from ".././types/selectedMap";

const folder: Folder = {
  id: "folder-1",
  folderName: "Documents",
  userId: "user-1",
  parentFolderId: null,
  createdDate: "2026-05-15T10:00:00.000Z",
  isPublic: false,
};

const file: File = {
  id: "file-1",
  userId: "user-1",
  fileUrl: "https://example.com/file.pdf",
  fileDownloadUrl: "https://example.com/file.pdf?download=true",
  fileName: "Document",
  fileExtension: "pdf",
  fileSize: "1024",
  parentFolderId: null,
  fileGoogleDriveId: "drive-file-1",
  fileGoogleDriveParentFolderId: "drive-folder-1",
  fileGoogleDriveClientEmail: "drive@example.com",
  uploadDate: "2026-05-15T10:00:00.000Z",
  fileStaticUrl: "https://example.com/static/file.pdf",
  publicAccessRole: null,
  fileDescription: null,
};

const nestedFolder: Folder = {
  ...folder,
  id: "folder-2",
  folderName: "Nested",
};

const items: FileSystemItem[] = [folder, file, nestedFolder];

describe("selectBetween", () => {
  describe("when selected map has fewer than two items", () => {
    it("should not update selection", () => {
      // Given
      const selected: SelectedMap = new Map([
        ["folder-1", { index: 0, folderId: "folder-1" }],
      ]);
      const setSelected = vi.fn();

      // When
      selectBetween(selected, items, setSelected);

      // Then
      expect(setSelected).not.toHaveBeenCalled();
    });
  });

  describe("when selected map has two boundary items", () => {
    it("should update selection with all items between boundaries", () => {
      // Given
      const selected: SelectedMap = new Map([
        ["folder-1", { index: 0, folderId: "folder-1" }],
        ["folder-2", { index: 2, folderId: "folder-2" }],
      ]);
      const setSelected = vi.fn();

      // When
      selectBetween(selected, items, setSelected);

      // Then
      expect(setSelected).toHaveBeenCalledWith(
        new Map([
          ["folder-1", { index: 0, folderId: "folder-1" }],
          ["file-1", { index: 1, fileId: "file-1" }],
          ["folder-2", { index: 2, folderId: "folder-2" }],
        ])
      );
    });
  });
});
