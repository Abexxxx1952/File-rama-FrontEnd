import { afterEach, describe, expect, it, vi } from "vitest";

import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";

import { fetchDeleteUser } from "../../api/fetchDeleteUser";
import { deleteUser } from ".././deleteUser";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/features/auth/refresh-tokens/model/refreshTokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock("../../api/fetchDeleteUser", () => ({
  fetchDeleteUser: vi.fn(),
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

describe("deleteUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when user is deleted", () => {
    it("should notify success and redirect to main page", async () => {
      // Given
      const setLoading = vi.fn();
      const router = { replace: vi.fn() };
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchDeleteUser).mockResolvedValue(user);

      // When
      await deleteUser(setLoading, router as any);

      // Then
      expect(fetchDeleteUser).toHaveBeenCalledWith("access-token");
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "User deleted successfully",
      });
      expect(router.replace).toHaveBeenCalledWith("/");
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenLastCalledWith(false);
    });
  });

  describe("when delete response contains error data", () => {
    it("should notify error without redirecting", async () => {
      // Given
      const error = {
        message: "Forbidden",
        statusCode: 403,
        error: "Forbidden",
      };
      const router = { replace: vi.fn() };
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchDeleteUser).mockResolvedValue(error);

      // When
      await deleteUser(vi.fn(), router as any);

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(router.replace).not.toHaveBeenCalled();
      expect(notifyResponse).not.toHaveBeenCalledWith({
        isError: false,
        successMessage: "User deleted successfully",
      });
    });
  });

  describe("when only refresh token is available", () => {
    it("should refresh tokens and retry delete", async () => {
      // Given
      const router = { replace: vi.fn() };
      vi.mocked(getCookies)
        .mockResolvedValueOnce({
          access_token: undefined,
          refresh_token: "refresh-token",
        })
        .mockResolvedValueOnce({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
        });
      vi.mocked(fetchDeleteUser).mockResolvedValue(user);

      // When
      await deleteUser(vi.fn(), router as any);

      // Then
      expect(refreshTokens).toHaveBeenCalledWith("refresh-token");
      expect(fetchDeleteUser).toHaveBeenCalledWith("new-access-token");
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });
});
