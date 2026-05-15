import { describe, expect, it } from "vitest";
import { isFolder } from ".././isFolder";
import { File } from ".././types/file";
import { Folder } from ".././types/folder";

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

const folder: Folder = {
  id: "folder-1",
  folderName: "Documents",
  userId: "user-1",
  parentFolderId: null,
  createdDate: "2026-05-15T10:00:00.000Z",
  isPublic: false,
};

describe("isFolder", () => {
  describe("when item has folder fields", () => {
    it("should return true", () => {
      // Given
      const item = folder;

      // When
      const result = isFolder(item);

      // Then
      expect(result).toBe(true);
    });
  });

  describe("when item is a file", () => {
    it("should return false", () => {
      // Given
      const item = file;

      // When
      const result = isFolder(item);

      // Then
      expect(result).toBe(false);
    });
  });

  describe("when item is null", () => {
    it("should return false", () => {
      // Given
      const item = null;

      // When
      const result = isFolder(item);

      // Then
      expect(result).toBe(false);
    });
  });
});
