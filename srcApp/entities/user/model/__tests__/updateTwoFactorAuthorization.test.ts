import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { updateTwoFactorAuthorization } from ".././updateTwoFactorAuthorization";

vi.mock("@/srcApp/shared/model/fetchWithAuth", () => ({
  fetchWithAuth: vi.fn(),
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
    it("should call fetchWithAuth and update user", async () => {
      // Given
      const setUser = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue(user);

      // When
      const result = await updateTwoFactorAuthorization(true, vi.fn(), setUser);

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        {
          isTwoFactorEnabled: true,
        },
        "Two Factor Authorization is Enable",
        expect.any(Function)
      );
      expect(setUser).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe("when two factor auth is disabled", () => {
    it("should call fetchWithAuth with disabled message", async () => {
      // Given
      const setUser = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue({
        ...user,
        isTwoFactorEnabled: false,
      });

      // When
      const result = await updateTwoFactorAuthorization(
        false,
        vi.fn(),
        setUser
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        {
          isTwoFactorEnabled: false,
        },
        "Two Factor Authorization is Disable",
        expect.any(Function)
      );
      expect(result).toEqual({ ...user, isTwoFactorEnabled: false });
    });
  });

  describe("when update fails", () => {
    it("should return null", async () => {
      // Given
      vi.mocked(fetchWithAuth).mockResolvedValue(null);

      // When
      const result = await updateTwoFactorAuthorization(
        false,
        vi.fn(),
        vi.fn()
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
