import { afterEach, describe, expect, it, vi } from "vitest";

import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";

import { fetchUpdateUser } from "../../api/fetchUpdateUser";
import { updateTwoFactorAuthorization } from ".././updateTwoFactorAuthorization";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock("../../api/fetchUpdateUser", () => ({
  fetchUpdateUser: vi.fn(),
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
  isTwoFactorEnabled: true,
};

describe("updateTwoFactorAuthorization", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when two factor auth is enabled", () => {
    it("should update user and notify enabled state", async () => {
      // Given
      const setUser = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUpdateUser).mockResolvedValue(user);

      // When
      const result = await updateTwoFactorAuthorization(true, vi.fn(), setUser);

      // Then
      expect(fetchUpdateUser).toHaveBeenCalledWith("access-token", {
        isTwoFactorEnabled: true,
      });
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "Two Factor Authorization is Enable",
      });
      expect(setUser).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe("when update response is null", () => {
    it("should notify unexpected error and return null", async () => {
      // Given
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchUpdateUser).mockResolvedValue(null);

      // When
      const result = await updateTwoFactorAuthorization(
        false,
        vi.fn(),
        vi.fn()
      );

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: null,
      });
      expect(result).toBeNull();
    });
  });
});
