import { afterEach, describe, expect, it, vi } from "vitest";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient } from "@/srcApp/shared/model/apiClient";
import { fetchUpdateUser } from ".././fetchUpdateUser";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
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

describe("fetchUpdateUser", () => {
  afterEach(() => {
    delete process.env.UPDATE_USER_URL;
    vi.restoreAllMocks();
  });

  describe("when user is updated", () => {
    it("should send update payload and revalidate user tag", async () => {
      // Given
      process.env.UPDATE_USER_URL = "https://api.example.com/user";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(user),
      } as unknown as Response);

      // When
      const result = await fetchUpdateUser("access-token", {
        name: "Ada",
      });

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/user",
        method: "PATCH",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
        bodyData: {
          name: "Ada",
        },
      });
      expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG.USER);
      expect(result).toEqual(user);
    });
  });

  describe("when update response contains error data", () => {
    it("should return error data without revalidating tag", async () => {
      // Given
      const error = {
        message: "Invalid payload",
        statusCode: 400,
        error: "Bad Request",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchUpdateUser("access-token", {
        name: "Ada",
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
