import { afterEach, describe, expect, it, vi } from "vitest";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { fetchEntity } from "@/srcApp/shared/model/fetchEntity";
import { fetchUser } from ".././fetchUser";

vi.mock("@/srcApp/shared/model/fetchEntity", () => ({
  fetchEntity: vi.fn(),
}));

const user = {
  id: "user-1",
  email: "user@example.com",
  createdAt: new Date("2026-05-15T10:00:00.000Z"),
  payloads: [],
  googleServiceAccounts: [],
  permissions: [],
  registrationSources: [],
  isVerified: true,
  isTwoFactorEnabled: false,
};

describe("fetchUser", () => {
  afterEach(() => {
    delete process.env.GET_USER_URL;
  });

  describe("when called with access token", () => {
    it("should fetch user with user cache tag", async () => {
      // Given
      process.env.GET_USER_URL = "https://api.example.com/user";
      vi.mocked(fetchEntity).mockResolvedValue(user);

      // When
      const result = await fetchUser("access-token");

      // Then
      expect(fetchEntity).toHaveBeenCalledWith(
        "https://api.example.com/user",
        "access-token",
        [CACHE_TAG.USER],
      );
      expect(result).toEqual(user);
    });
  });
});
