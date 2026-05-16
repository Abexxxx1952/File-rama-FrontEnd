import { revalidateTag } from "next/cache";

import { afterEach, describe, expect, it, vi } from "vitest";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient } from "@/srcApp/shared/model/apiClient";

import { fetchCreateFolder } from ".././fetchCreateFolder";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

const folder = {
  id: "folder-1",
  userId: "user-1",
  folderName: "Documents",
  parentFolderId: null,
  folderGoogleDriveId: "drive-folder-1",
  folderGoogleDriveParentFolderId: null,
  folderGoogleDriveClientEmail: "drive@example.com",
  createdAt: "2026-05-15T10:00:00.000Z",
  updatedAt: "2026-05-15T10:00:00.000Z",
};

describe("fetchCreateFolder", () => {
  afterEach(() => {
    delete process.env.CREATE_FOLDER_URL;
    vi.restoreAllMocks();
  });

  describe("when folder is created", () => {
    it("should revalidate dashboard and stat tags and return folder", async () => {
      // Given
      process.env.CREATE_FOLDER_URL = "https://api.example.com/folders";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(folder),
      } as unknown as Response);

      // When
      const result = await fetchCreateFolder("access-token", {
        addFolderData: {
          folderName: "Documents",
          parentFolderId: null,
        },
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/folders",
        method: "POST",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
        bodyData: {
          folderName: "Documents",
          parentFolderId: null,
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith("files-current");
      expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG.STAT);
      expect(result).toEqual(folder);
    });
  });

  describe("when folder create response contains error data", () => {
    it("should return error data without revalidating tags", async () => {
      // Given
      const error = {
        message: "Folder already exists",
        statusCode: 409,
        error: "Conflict",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchCreateFolder("access-token", {
        addFolderData: {
          folderName: "Documents",
          parentFolderId: null,
        },
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
