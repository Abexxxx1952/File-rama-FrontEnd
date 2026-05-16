import { describe, expect, it } from "vitest";

import { type File } from "@/srcApp/entities/fileSystemItem/model/types/file";
import { type FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { type Folder } from "@/srcApp/entities/fileSystemItem/model/types/folder";

import { getElementsBetween } from ".././getElementsBetween";

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

describe("getElementsBetween", () => {
  describe("when start index is before end index", () => {
    it("should return selected items in forward order", () => {
      // Given
      const startIndex = 0;
      const endIndex = 2;

      // When
      const result = getElementsBetween(items, startIndex, endIndex);

      // Then
      expect(result).toEqual([
        ["folder-1", { index: 0, folderId: "folder-1" }],
        ["file-1", { index: 1, fileId: "file-1" }],
        ["folder-2", { index: 2, folderId: "folder-2" }],
      ]);
    });
  });

  describe("when start index is after end index", () => {
    it("should return selected items in reverse order", () => {
      // Given
      const startIndex = 2;
      const endIndex = 0;

      // When
      const result = getElementsBetween(items, startIndex, endIndex);

      // Then
      expect(result).toEqual([
        ["folder-2", { index: 2, folderId: "folder-2" }],
        ["file-1", { index: 1, fileId: "file-1" }],
        ["folder-1", { index: 0, folderId: "folder-1" }],
      ]);
    });
  });
});
