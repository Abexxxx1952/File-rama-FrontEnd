import { afterEach, describe, expect, it, vi } from "vitest";
import { revalidateTag } from "next/cache";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { apiClient } from "@/srcApp/shared/model/apiClient";
import { UpdateMode } from "../../model/types/user";
import { fetchUpdateGoogleServiceAccounts } from ".././fetchUpdateGoogleServiceAccounts";

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
  googleServiceAccounts: [{ clientEmail: "drive@example.com" }],
  permissions: [],
  registrationSources: [],
  isVerified: true,
  isTwoFactorEnabled: false,
};

describe("fetchUpdateGoogleServiceAccounts", () => {
  afterEach(() => {
    delete process.env.UPDATE_USER_URL;
    vi.restoreAllMocks();
  });

  describe("when service accounts are updated", () => {
    it("should send update payload and revalidate stat tag", async () => {
      // Given
      process.env.UPDATE_USER_URL = "https://api.example.com/user";
      const updateData = {
        googleServiceAccounts: [
          {
            clientEmail: "drive@example.com",
            privateKey: "private-key",
            updateMode: UpdateMode.CREATE,
          },
        ],
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(user),
      } as unknown as Response);

      // When
      const result = await fetchUpdateGoogleServiceAccounts(
        "access-token",
        updateData,
      );

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/user",
        method: "PATCH",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
        bodyData: updateData,
      });
      expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG.STAT);
      expect(result).toEqual(user);
    });
  });

  describe("when update response contains error data", () => {
    it("should return error data without revalidating tag", async () => {
      // Given
      const error = {
        message: "Drive account error",
        statusCode: 400,
        error: "Bad Request",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchUpdateGoogleServiceAccounts("access-token", {
        googleServiceAccounts: [
          {
            clientEmail: "drive@example.com",
            updateMode: UpdateMode.DELETE,
          },
        ],
      });

      // Then
      expect(result).toEqual(error);
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
