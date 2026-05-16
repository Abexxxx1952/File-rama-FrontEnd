import { revalidateTag } from "next/cache";

import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/srcApp/shared/model/apiClient";

import { fetchDeleteFilePermissions } from ".././fetchDeleteFilePermissions";

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
  fileName: "Report",
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

describe("fetchDeleteFilePermissions", () => {
  afterEach(() => {
    delete process.env.DELETE_FILE_PERMISSIONS_URL;
    vi.restoreAllMocks();
  });

  describe("when permissions are deleted", () => {
    it("should patch permissions endpoint and revalidate current tag", async () => {
      // Given
      process.env.DELETE_FILE_PERMISSIONS_URL =
        "https://api.example.com/file-permissions";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(file),
      } as unknown as Response);

      // When
      const result = await fetchDeleteFilePermissions("access-token", {
        fileId: "file-1",
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/file-permissions/file-1",
        method: "PATCH",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith("files-current");
      expect(result).toEqual(file);
    });
  });

  describe("when permissions response contains error data", () => {
    it("should return error data without revalidating tag", async () => {
      // Given
      const error = {
        message: "File not found",
        statusCode: 404,
        error: "Not Found",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchDeleteFilePermissions("access-token", {
        fileId: "file-1",
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
