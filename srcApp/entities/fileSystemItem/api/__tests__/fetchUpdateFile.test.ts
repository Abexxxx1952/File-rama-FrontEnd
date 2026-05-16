import { revalidateTag } from "next/cache";

import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/srcApp/shared/model/apiClient";

import { fetchUpdateFile } from ".././fetchUpdateFile";

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
  fileName: "Updated report",
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

describe("fetchUpdateFile", () => {
  afterEach(() => {
    delete process.env.UPDATE_FILE_URL;
    vi.restoreAllMocks();
  });

  describe("when file is updated", () => {
    it("should send update payload and revalidate current tags", async () => {
      // Given
      process.env.UPDATE_FILE_URL = "https://api.example.com/files";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(file),
      } as unknown as Response);

      // When
      const result = await fetchUpdateFile("access-token", {
        updateFileData: {
          fileId: "file-1",
          fileName: "Updated report",
        },
        fileSystemItemsCurrentTags: ["files-current", "files-parent"],
      });

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/files",
        method: "PATCH",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
        bodyData: {
          fileId: "file-1",
          fileName: "Updated report",
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith("files-current");
      expect(revalidateTag).toHaveBeenCalledWith("files-parent");
      expect(result).toEqual(file);
    });
  });

  describe("when update response contains error data", () => {
    it("should return error data without revalidating tags", async () => {
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
      const result = await fetchUpdateFile("access-token", {
        updateFileData: {
          fileId: "file-1",
          fileName: "Updated report",
        },
        fileSystemItemsCurrentTags: ["files-current"],
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
