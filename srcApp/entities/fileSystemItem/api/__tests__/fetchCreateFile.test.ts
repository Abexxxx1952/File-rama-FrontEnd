import { afterEach, describe, expect, it, vi } from "vitest";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { revalidateFromClientByTag } from "@/srcApp/shared/model/revalidateFromClientByTag";

import { StatusUpload } from "../../model/types/fileUploadResult";
import { fetchCreateFile } from ".././fetchCreateFile";

vi.mock("@/srcApp/shared/model/revalidateFromClientByTag", () => ({
  revalidateFromClientByTag: vi.fn(),
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

describe("fetchCreateFile", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_CREATE_FILE_URL;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("when file upload is successful", () => {
    it("should upload form data, revalidate tags, and return first upload result", async () => {
      // Given
      process.env.NEXT_PUBLIC_CREATE_FILE_URL =
        "https://api.example.com/files/";
      const params = new FormData();
      params.append("file", new Blob(["content"]), "report.pdf");
      const uploadResult = {
        file,
        status: StatusUpload.COMPLETED,
        account: "drive@example.com",
      };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue([uploadResult]),
        })
      );

      // When
      const result = await fetchCreateFile("access-token", {
        params,
        fileUploadId: "upload-1",
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/files/upload-1",
        {
          method: "POST",
          body: params,
          headers: {
            Authorization: "Bearer access-token",
          },
        }
      );
      expect(revalidateFromClientByTag).toHaveBeenCalledWith([
        "files-current",
        CACHE_TAG.STAT,
      ]);
      expect(result).toEqual(uploadResult);
    });
  });

  describe("when upload response contains error data", () => {
    it("should return error data without revalidating tags", async () => {
      // Given
      const error = {
        message: "Upload failed",
        statusCode: 400,
        error: "Bad Request",
      };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockResolvedValue(error),
        })
      );

      // When
      const result = await fetchCreateFile("access-token", {
        params: new FormData(),
        fileUploadId: "upload-1",
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateFromClientByTag).not.toHaveBeenCalled();
    });
  });
});
