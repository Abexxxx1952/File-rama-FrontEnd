import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { updateUserSubmitHandler } from ".././updateUserSubmitHandler";

vi.mock("@/srcApp/shared/model/fetchWithAuth", () => ({
  fetchWithAuth: vi.fn(),
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

  describe("when user is updated successfully", () => {
    it("should call fetchWithAuth and update user", async () => {
      // Given
      const setLoading = vi.fn();
      const setUser = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue(user);

      // When
      const result = await updateUserSubmitHandler(
        { name: "Ada", password: "secret" },
        setLoading,
        setUser
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        {
          name: "Ada",
          password: "secret",
        },
        "User updated successfully",
        setLoading
      );
      expect(setUser).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe("when only name is provided", () => {
    it("should update only name field", async () => {
      // Given
      const setUser = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue(user);

      // When
      const result = await updateUserSubmitHandler(
        { name: "Ada" },
        vi.fn(),
        setUser
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        {
          name: "Ada",
        },
        "User updated successfully",
        expect.any(Function)
      );
      expect(result).toEqual(user);
    });
  });

  describe("when update fails", () => {
    it("should return null", async () => {
      // Given
      vi.mocked(fetchWithAuth).mockResolvedValue(null);

      // When
      const result = await updateUserSubmitHandler(
        { password: "weak" },
        vi.fn(),
        vi.fn()
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
