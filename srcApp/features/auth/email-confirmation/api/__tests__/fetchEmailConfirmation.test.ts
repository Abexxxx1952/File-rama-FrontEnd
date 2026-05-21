import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/srcApp/shared/model/apiClient";

import { fetchEmailConfirmation } from ".././fetchEmailConfirmation";

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

const responseData = {
  message: "Confirmation email sent",
};

describe("fetchEmailConfirmation", () => {
  afterEach(() => {
    delete process.env.EMAIL_CONFIRMATION_URL;
    vi.restoreAllMocks();
  });

  describe("when confirmation request succeeds", () => {
    it("should post with authorization header and return response data", async () => {
      // Given
      process.env.EMAIL_CONFIRMATION_URL = "https://api.example.com/confirm";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(responseData),
      } as unknown as Response);

      // When
      const result = await fetchEmailConfirmation("access-token", {});

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/confirm",
        method: "POST",
        additionalHeaders: {
          Authorization: "Bearer access-token",
        },
      });
      expect(result).toEqual(responseData);
    });
  });

  describe("when confirmation response contains error data", () => {
    it("should return error data", async () => {
      // Given
      const error = {
        message: "Already confirmed",
        statusCode: 409,
        error: "Conflict",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchEmailConfirmation("access-token", {});

      // Then
      expect(result).toEqual(error);
    });
  });
});
