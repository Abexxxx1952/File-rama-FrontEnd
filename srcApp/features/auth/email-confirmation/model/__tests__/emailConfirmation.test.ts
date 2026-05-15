import { afterEach, describe, expect, it, vi } from "vitest";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { fetchEmailConfirmation } from "../../api/fetchEmailConfirmation";
import { emailConfirmation } from ".././emailConfirmation";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/features/auth/refresh-tokens/model/refreshTokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock("../../api/fetchEmailConfirmation", () => ({
  fetchEmailConfirmation: vi.fn(),
}));

describe("emailConfirmation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when access token is available", () => {
    it("should send confirmation and notify success message", async () => {
      // Given
      const setLoading = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchEmailConfirmation).mockResolvedValue({
        message: "Confirmation email sent",
      } as any);

      // When
      await emailConfirmation(setLoading);

      // Then
      expect(fetchEmailConfirmation).toHaveBeenCalledWith(
        "access-token",
        undefined,
      );
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "Confirmation email sent",
      });
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenLastCalledWith(false);
    });
  });

  describe("when confirmation response contains error data", () => {
    it("should notify error and return null", async () => {
      // Given
      const error = {
        message: "Already confirmed",
        statusCode: 409,
        error: "Conflict",
      };
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      vi.mocked(fetchEmailConfirmation).mockResolvedValue(error);

      // When
      const result = await emailConfirmation(vi.fn());

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(result).toBeNull();
    });
  });

  describe("when only refresh token is available", () => {
    it("should refresh tokens and retry confirmation", async () => {
      // Given
      vi.mocked(getCookies)
        .mockResolvedValueOnce({
          access_token: undefined,
          refresh_token: "refresh-token",
        })
        .mockResolvedValueOnce({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
        });
      vi.mocked(fetchEmailConfirmation).mockResolvedValue({
        message: "Confirmation email sent",
      } as any);

      // When
      await emailConfirmation(vi.fn());

      // Then
      expect(refreshTokens).toHaveBeenCalledWith("refresh-token");
      expect(fetchEmailConfirmation).toHaveBeenCalledWith(
        "new-access-token",
        undefined,
      );
    });
  });
});
