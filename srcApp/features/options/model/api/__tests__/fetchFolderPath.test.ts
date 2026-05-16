import { revalidateTag } from "next/cache";

import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/srcApp/shared/model/apiClient";

import { fetchGetFolderPath } from ".././fetchFolderPath";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

describe("fetchGetFolderPath", () => {
  afterEach(() => {
    delete process.env.GET_FOLDER_PATH_URL;
  });

  describe("when folder path response is successful", () => {
    it("should revalidate folder path tag and return text response", async () => {
      // Given
      process.env.GET_FOLDER_PATH_URL = "https://api.example.com/folders/path";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        text: vi.fn().mockResolvedValue(":/Documents"),
      } as unknown as Response);

      // When
      const result = await fetchGetFolderPath(
        "access-token",
        "folder-1",
        "folder-path-tag"
      );

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/folders/path/folder-1",
        method: "GET",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith("folder-path-tag");
      expect(result).toBe(":/Documents");
    });
  });

  describe("when folder path response contains error data", () => {
    it("should return error data", async () => {
      // Given
      const error = {
        message: "Not found",
        statusCode: 404,
        error: "Not Found",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchGetFolderPath(
        "access-token",
        "folder-1",
        "folder-path-tag"
      );

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
