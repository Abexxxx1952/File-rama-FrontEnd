import { afterEach, describe, expect, it, vi } from "vitest";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { fetchStat } from "../../api/fetchStat";
import { getStat } from ".././getStat";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/features/auth/refresh-tokens/model/refreshTokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock("../../api/fetchStat", () => ({
  fetchStat: vi.fn(),
}));

const stat = {
  id: "stat-1",
  userId: "user-1",
  fileCount: 3,
  folderCount: 2,
  totalSize: 1024,
  usedSize: 512,
  driveInfoResult: [],
};

describe("getStat", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when access token is available", () => {
    it("should return fetched stat", async () => {
      // Given
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: "refresh-token",
      });
      vi.mocked(fetchStat).mockResolvedValue(stat);

      // When
      const result = await getStat();

      // Then
      expect(fetchStat).toHaveBeenCalledWith("access-token");
      expect(result).toEqual(stat);
    });
  });

  describe("when stat response contains error data", () => {
    it("should notify error and return null", async () => {
      // Given
      const error = {
        message: "Forbidden",
        statusCode: 403,
        error: "Forbidden",
      };
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchStat).mockResolvedValue(error);

      // When
      const result = await getStat();

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(result).toBeNull();
    });
  });

  describe("when only refresh token is available", () => {
    it("should refresh tokens and retry stat request", async () => {
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
      vi.mocked(fetchStat).mockResolvedValue(stat);

      // When
      const result = await getStat();

      // Then
      expect(refreshTokens).toHaveBeenCalledWith("refresh-token");
      expect(fetchStat).toHaveBeenCalledWith("new-access-token");
      expect(result).toEqual(stat);
    });
  });

  describe("when no tokens are available", () => {
    it("should return null without fetching stat", async () => {
      // Given
      vi.mocked(getCookies).mockResolvedValue({
        access_token: undefined,
        refresh_token: undefined,
      });

      // When
      const result = await getStat();

      // Then
      expect(fetchStat).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
