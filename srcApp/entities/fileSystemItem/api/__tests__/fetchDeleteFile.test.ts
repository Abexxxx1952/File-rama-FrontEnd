import { afterEach, describe, expect, it, vi } from "vitest";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient } from "@/srcApp/shared/model/apiClient";
import { fetchDeleteFile } from ".././fetchDeleteFile";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

const file = {
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

describe("fetchDeleteFile", () => {
  afterEach(() => {
    delete process.env.DELETE_FILE_URL;
  });

  describe("when delete response is successful", () => {
    it("should revalidate dashboard and stat tags and return deleted file", async () => {
      // Given
      process.env.DELETE_FILE_URL = "https://api.example.com/files";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(file),
      } as unknown as Response);

      // When
      const result = await fetchDeleteFile("access-token", {
        id: "file-1",
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/files/file-1",
        method: "DELETE",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith("files-current");
      expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG.STAT);
      expect(result).toEqual(file);
    });
  });

  describe("when delete response contains error data", () => {
    it("should return error data without revalidating tags", async () => {
      // Given
      const error = {
        message: "Forbidden",
        statusCode: 403,
        error: "Forbidden",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchDeleteFile("access-token", {
        id: "file-1",
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
