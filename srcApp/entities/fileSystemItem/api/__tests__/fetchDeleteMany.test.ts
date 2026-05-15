import { afterEach, describe, expect, it, vi } from "vitest";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient } from "@/srcApp/shared/model/apiClient";
import { fetchDeleteMany } from ".././fetchDeleteMany";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

const deletedItems = [
  {
    id: "file-1",
    isDeleted: true,
  },
];

const deleteMany = {
  fileIds: ["file-1"],
  folderIds: ["folder-1"],
};

describe("fetchDeleteMany", () => {
  afterEach(() => {
    delete process.env.DELETE_MANY_URL;
    vi.restoreAllMocks();
  });

  describe("when items are deleted", () => {
    it("should send delete payload and revalidate tags", async () => {
      // Given
      process.env.DELETE_MANY_URL = "https://api.example.com/items";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(deletedItems),
      } as unknown as Response);

      // When
      const result = await fetchDeleteMany("access-token", {
        deleteMany,
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/items",
        method: "DELETE",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
        bodyData: {
          deleteMany,
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
      const result = await fetchDeleteMany("access-token", {
        deleteMany,
        fileSystemItemsCurrentTag: "files-current",
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
