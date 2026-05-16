import { revalidateTag } from "next/cache";

import { afterEach, describe, expect, it, vi } from "vitest";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient } from "@/srcApp/shared/model/apiClient";

import { fetchDeleteFolder } from ".././fetchDeleteFolder";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

const deletedItems = [
  {
    folderId: "folder-1",
    status: "success" as const,
  },
];

describe("fetchDeleteFolder", () => {
  afterEach(() => {
    delete process.env.DELETE_FOLDER_URL;
    vi.restoreAllMocks();
  });

  describe("when folder is deleted", () => {
    it("should revalidate dashboard and stat tags and return deleted items", async () => {
      // Given
      process.env.DELETE_FOLDER_URL = "https://api.example.com/folders";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(deletedItems),
      } as unknown as Response);

      // When
      const result = await fetchDeleteFolder("access-token", {
        id: "folder-1",
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/folders/folder-1",
        method: "DELETE",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith("files-current");
      expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG.STAT);
      expect(result).toEqual(deletedItems);
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
      const result = await fetchDeleteFolder("access-token", {
        id: "folder-1",
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
