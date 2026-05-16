import { revalidateTag } from "next/cache";

import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/srcApp/shared/model/apiClient";

import { fetchUpdateFolder } from ".././fetchUpdateFolder";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

const folder = {
  id: "folder-1",
  folderName: "Updated documents",
  userId: "user-1",
  parentFolderId: null,
  createdDate: "2026-05-15T10:00:00.000Z",
  isPublic: false,
};

describe("fetchUpdateFolder", () => {
  afterEach(() => {
    delete process.env.UPDATE_FOLDER_URL;
    vi.restoreAllMocks();
  });

  describe("when folder is updated", () => {
    it("should send update payload and revalidate current tags", async () => {
      // Given
      process.env.UPDATE_FOLDER_URL = "https://api.example.com/folders";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(folder),
      } as unknown as Response);

      // When
      const result = await fetchUpdateFolder("access-token", {
        updateFolderData: {
          folderId: "folder-1",
          folderName: "Updated documents",
        },
        fileSystemItemsCurrentTags: ["files-current", "files-parent"],
      });

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/folders",
        method: "PATCH",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
        bodyData: {
          folderId: "folder-1",
          folderName: "Updated documents",
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith("files-current");
      expect(revalidateTag).toHaveBeenCalledWith("files-parent");
      expect(result).toEqual(folder);
    });
  });

  describe("when update response contains error data", () => {
    it("should return error data without revalidating tags", async () => {
      // Given
      const error = {
        message: "Folder not found",
        statusCode: 404,
        error: "Not Found",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchUpdateFolder("access-token", {
        updateFolderData: {
          folderId: "folder-1",
          folderName: "Updated documents",
        },
        fileSystemItemsCurrentTags: ["files-current"],
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
