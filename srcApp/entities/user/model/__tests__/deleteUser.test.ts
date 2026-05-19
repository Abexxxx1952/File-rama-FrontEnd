import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { deleteUser } from ".././deleteUser";

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
  isTwoFactorEnabled: false,
};

describe("deleteUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when user is deleted successfully", () => {
    it("should call fetchWithAuth and redirect to main page", async () => {
      // Given
      const setLoading = vi.fn();
      const router = { replace: vi.fn() };
      vi.mocked(fetchWithAuth).mockResolvedValue(user);

      // When
      await deleteUser(setLoading, router as any);

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        undefined,
        "User deleted successfully",
        setLoading
      );
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });

  describe("when delete fails", () => {
    it("should call fetchWithAuth and not redirect", async () => {
      // Given
      const setLoading = vi.fn();
      const router = { replace: vi.fn() };
      vi.mocked(fetchWithAuth).mockResolvedValue(null);

      // When
      await deleteUser(setLoading, router as any);

      // Then
      expect(fetchWithAuth).toHaveBeenCalled();
      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
