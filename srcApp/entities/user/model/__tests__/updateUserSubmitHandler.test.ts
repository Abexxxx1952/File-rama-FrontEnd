import { afterEach, describe, expect, it, vi } from "vitest";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { fetchUpdateUser } from "../../api/fetchUpdateUser";
import { updateUserSubmitHandler } from ".././updateUserSubmitHandler";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/features/auth/refresh-tokens/model/refreshTokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock("../../api/fetchUpdateUser", () => ({
  fetchUpdateUser: vi.fn(),
}));

const user = {
  id: "user-1",
  name: "Ada",
  email: "ada@example.com",
  createdAt: new Date("2026-05-15T10:00:00.000Z"),
  payloads: [],
  googleServiceAccounts: [],
  permissions: [],
  registrationSources: [],
  isVerified: true,
  isTwoFactorEnabled: false,
};

describe("updateUserSubmitHandler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when access token is available", () => {
    it("should update user, notify success, and set user", async () => {
      // Given
      const setLoading = vi.fn();
      const setUser = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUpdateUser).mockResolvedValue(user);

      // When
      const result = await updateUserSubmitHandler(
        { name: "Ada", password: "secret" },
        setLoading,
        setUser,
      );

      // Then
      expect(fetchUpdateUser).toHaveBeenCalledWith("access-token", {
        name: "Ada",
        password: "secret",
      });
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "User updated successfully",
      });
      expect(setUser).toHaveBeenCalledWith(user);
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenLastCalledWith(false);
      expect(result).toEqual(user);
    });
  });

  describe("when update response contains error data", () => {
    it("should notify error and return null", async () => {
      // Given
      const error = {
        message: "Invalid password",
        statusCode: 400,
        error: "Bad Request",
      };
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUpdateUser).mockResolvedValue(error);

      // When
      const result = await updateUserSubmitHandler(
        { password: "weak" },
        vi.fn(),
        vi.fn(),
      );

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(result).toBeNull();
    });
  });

  describe("when only refresh token is available", () => {
    it("should refresh tokens and retry update", async () => {
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
      vi.mocked(fetchUpdateUser).mockResolvedValue(user);

      // When
      const result = await updateUserSubmitHandler(
        { name: "Ada" },
        vi.fn(),
        vi.fn(),
      );

      // Then
      expect(refreshTokens).toHaveBeenCalledWith("refresh-token");
      expect(fetchUpdateUser).toHaveBeenCalledWith("new-access-token", {
        name: "Ada",
      });
      expect(result).toEqual(user);
    });
  });
});
