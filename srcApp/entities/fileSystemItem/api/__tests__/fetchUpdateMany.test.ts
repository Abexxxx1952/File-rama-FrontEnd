import { afterEach, describe, expect, it, vi } from "vitest";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient } from "@/srcApp/shared/model/apiClient";
import { fetchUpdateMany } from ".././fetchUpdateMany";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

const updatedItems = [
  {
    fileId: "file-1",
    status: "success" as const,
  },
  {
    folderId: "folder-1",
    status: "success" as const,
  },
];

const updateMany = [
  {
    fileId: "file-1",
    parentFolderId: "folder-2",
  },
  {
    folderId: "folder-1",
    parentFolderId: "folder-2",
  },
];

describe("fetchUpdateMany", () => {
  afterEach(() => {
    delete process.env.UPDATE_MANY_URL;
    vi.restoreAllMocks();
  });

  describe("when items are updated", () => {
    it("should send update payload and revalidate current tags and stat tag", async () => {
      // Given
      process.env.UPDATE_MANY_URL = "https://api.example.com/items";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(updatedItems),
      } as unknown as Response);

      // When
      const result = await fetchUpdateMany("access-token", {
        updateMany,
        fileSystemItemsCurrentTags: ["files-current", "files-parent"],
      });

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/items",
        method: "PATCH",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
        bodyData: {
          updateMany,
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith("files-current");
      expect(revalidateTag).toHaveBeenCalledWith("files-parent");
      expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG.STAT);
      expect(result).toEqual(updatedItems);
    });
  });

  describe("when update response contains error data", () => {
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
      const result = await fetchUpdateMany("access-token", {
        updateMany,
        fileSystemItemsCurrentTags: ["files-current"],
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
