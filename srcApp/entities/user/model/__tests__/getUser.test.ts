import { afterEach, describe, expect, it, vi } from "vitest";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { fetchUser } from "../../api/fetchUser";
import { getUser } from ".././getUser";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/features/auth/refresh-tokens/model/refreshTokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock("../../api/fetchUser", () => ({
  fetchUser: vi.fn(),
}));

const user = {
  id: "user-1",
  email: "ada@example.com",
  createdAt: new Date("2026-05-15T10:00:00.000Z"),
  payloads: [],
  googleServiceAccounts: [],
  permissions: [],
  registrationSources: [],
  isVerified: true,
  isTwoFactorEnabled: false,
};

describe("getUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when access token is available", () => {
    it("should return fetched user", async () => {
      // Given
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUser).mockResolvedValue(user);

      // When
      const result = await getUser();

      // Then
      expect(fetchUser).toHaveBeenCalledWith("access-token");
      expect(result).toEqual(user);
    });
  });

  describe("when user response contains error data", () => {
    it("should notify error and return null", async () => {
      // Given
      const error = {
        message: "Unauthorized",
        statusCode: 401,
        error: "Unauthorized",
      };
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUser).mockResolvedValue(error);

      // When
      const result = await getUser();

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(result).toBeNull();
    });
  });

  describe("when only refresh token is available", () => {
    it("should refresh tokens and retry user request", async () => {
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
      vi.mocked(fetchUser).mockResolvedValue(user);

      // When
      const result = await getUser();

      // Then
      expect(refreshTokens).toHaveBeenCalledWith("refresh-token");
      expect(fetchUser).toHaveBeenCalledWith("new-access-token");
      expect(result).toEqual(user);
    });
  });
});
