import { revalidateTag } from "next/cache";

import { afterEach, describe, expect, it, vi } from "vitest";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient } from "@/srcApp/shared/model/apiClient";

import { fetchDeleteUser } from ".././fetchDeleteUser";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
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

describe("fetchDeleteUser", () => {
  afterEach(() => {
    delete process.env.DELETE_USER_URL;
    vi.restoreAllMocks();
  });

  describe("when user is deleted", () => {
    it("should delete user and revalidate user and stat tags", async () => {
      // Given
      process.env.DELETE_USER_URL = "https://api.example.com/user";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(user),
      } as unknown as Response);

      // When
      const result = await fetchDeleteUser("access-token");

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/user",
        method: "DELETE",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG.USER);
      expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG.STAT);
      expect(result).toEqual(user);
    });
  });

  describe("when delete response contains error data", () => {
    it("should return error data without revalidating tags", async () => {
      // Given
      const error = {
        message: "Forbidden",
        statusCode: 403,
        error: "Forbidden",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchDeleteUser("access-token");

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
