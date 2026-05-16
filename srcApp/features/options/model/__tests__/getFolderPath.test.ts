import { afterEach, describe, expect, it, vi } from "vitest";

import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";

import { fetchGetFolderPath } from ".././api/fetchFolderPath";
import { getFolderPath } from ".././getFolderPath";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/features/auth/refresh-tokens/model/refreshTokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock(".././api/fetchFolderPath", () => ({
  fetchGetFolderPath: vi.fn(),
}));

describe("getFolderPath", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when folder id is null route segment", () => {
    it("should return root path without loading", async () => {
      // Given
      const setLoading = vi.fn();

      // When
      const result = await getFolderPath("null", "folder-path-tag", setLoading);

      // Then
      expect(result).toBe(":/");
      expect(setLoading).not.toHaveBeenCalled();
    });
  });

  describe("when access token is available", () => {
    it("should fetch folder path and toggle loading", async () => {
      // Given
      const setLoading = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchGetFolderPath).mockResolvedValue(":/Documents");

      // When
      const result = await getFolderPath(
        "folder-1",
        "folder-path-tag",
        setLoading
      );

      // Then
      expect(fetchGetFolderPath).toHaveBeenCalledWith(
        "access-token",
        "folder-1",
        "folder-path-tag"
      );
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenLastCalledWith(false);
      expect(result).toBe(":/Documents");
    });
  });

  describe("when folder path response contains error data", () => {
    it("should notify error and return root path", async () => {
      // Given
      const error = {
        message: "Folder not found",
        statusCode: 404,
        error: "Not Found",
      };
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchGetFolderPath).mockResolvedValue(error);

      // When
      const result = await getFolderPath(
        "folder-1",
        "folder-path-tag",
        vi.fn()
      );

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(result).toBe(":/");
    });
  });

  describe("when only refresh token is available", () => {
    it("should refresh tokens and retry folder path request", async () => {
      // Given
      vi.mocked(getCookies)
        .mockResolvedValueOnce({
          access_token: undefined,
          refresh_token: "refresh-token",
        })
        .mockResolvedValueOnce({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
        });
      vi.mocked(fetchGetFolderPath).mockResolvedValue(":/Documents");

      // When
      const result = await getFolderPath(
        "folder-1",
        "folder-path-tag",
        vi.fn()
      );

      // Then
      expect(refreshTokens).toHaveBeenCalledWith("refresh-token");
      expect(fetchGetFolderPath).toHaveBeenCalledWith(
        "new-access-token",
        "folder-1",
        "folder-path-tag"
      );
      expect(result).toBe(":/Documents");
    });
  });
});
