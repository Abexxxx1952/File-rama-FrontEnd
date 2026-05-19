import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { getUser } from ".././getUser";

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

describe("getUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when user is fetched successfully", () => {
    it("should return fetched user", async () => {
      // Given
      vi.mocked(fetchWithAuth).mockResolvedValue(user);

      // When
      const result = await getUser();

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(user);
    });
  });

  describe("when fetch fails", () => {
    it("should return null", async () => {
      // Given
      vi.mocked(fetchWithAuth).mockResolvedValue(null);

      // When
      const result = await getUser();

      // Then
      expect(fetchWithAuth).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
