import { describe, expect, it, vi } from "vitest";

import { type FileWithOptions, UploadStatus } from ".././types/fileWithId";
import { updateFileUploadStatus } from ".././updateFileUploadStatus";

const file = {} as File;

function createFiles(): FileWithOptions[] {
  return [
    { id: "file-1", file, uploadStatus: UploadStatus.uploading },
    { id: "file-2", file, uploadStatus: UploadStatus.queued },
    { id: "file-3", file, uploadStatus: UploadStatus.queued },
  ];
}

describe("updateFileUploadStatus", () => {
  describe("when updated file finishes and another file is queued", () => {
    it("should update current file and promote next queued file", () => {
      // Given
      const setAvailableToUpload = vi.fn();

      // When
      const result = updateFileUploadStatus(
        createFiles(),
        "file-1",
        UploadStatus.completed,
        setAvailableToUpload
      );

      // Then
      expect(result).toEqual([
        { id: "file-1", file, uploadStatus: UploadStatus.completed },
        { id: "file-2", file, uploadStatus: UploadStatus.uploading },
        { id: "file-3", file, uploadStatus: UploadStatus.queued },
      ]);
      expect(setAvailableToUpload).not.toHaveBeenCalled();
    });
  });

  describe("when no queued files are available", () => {
    it("should increase available upload slots", () => {
      // Given
      const setAvailableToUpload = vi.fn();
      const files: FileWithOptions[] = [
        { id: "file-1", file, uploadStatus: UploadStatus.uploading },
        { id: "file-2", file, uploadStatus: UploadStatus.completed },
      ];

      // When
      const result = updateFileUploadStatus(
        files,
        "file-1",
        UploadStatus.error,
        setAvailableToUpload
      );

      // Then
      expect(result).toEqual([
        { id: "file-1", file, uploadStatus: UploadStatus.error },
        { id: "file-2", file, uploadStatus: UploadStatus.completed },
      ]);
      expect(setAvailableToUpload).toHaveBeenCalledWith(expect.any(Function));
      expect(setAvailableToUpload.mock.calls[0][0](2)).toBe(3);
    });
  });

  describe("when matching file is queued", () => {
    it("should not promote the same file as next upload", () => {
      // Given
      const setAvailableToUpload = vi.fn();
      const files: FileWithOptions[] = [
        { id: "file-1", file, uploadStatus: UploadStatus.queued },
      ];

      // When
      const result = updateFileUploadStatus(
        files,
        "file-1",
        UploadStatus.completed,
        setAvailableToUpload
      );

      // Then
      expect(result).toEqual([
        { id: "file-1", file, uploadStatus: UploadStatus.completed },
      ]);
      expect(setAvailableToUpload).toHaveBeenCalled();
    });
  });
});
