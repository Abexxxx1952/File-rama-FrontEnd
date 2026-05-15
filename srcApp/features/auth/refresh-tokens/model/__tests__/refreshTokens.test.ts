import { afterEach, describe, expect, it, vi } from "vitest";
import { setCookies } from "@/srcApp/features/cookies/model/setCookies";
import { refreshTokens } from ".././refreshTokens";

vi.mock("@/srcApp/features/cookies/model/setCookies", () => ({
  setCookies: vi.fn(),
}));

describe("refreshTokens", () => {
  afterEach(() => {
    delete process.env.REFRESH_TOKENS_URL;
    vi.restoreAllMocks();
  });

  describe("when refresh response contains tokens", () => {
    it("should send refresh token and save new cookies", async () => {
      // Given
      process.env.REFRESH_TOKENS_URL = "https://api.example.com/refresh";
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            access_token: "new-access-token",
            refresh_token: "new-refresh-token",
          }),
        }),
      );

      // When
      await refreshTokens("refresh-token");

      // Then
      expect(fetch).toHaveBeenCalledWith("https://api.example.com/refresh", {
        method: "POST",
        headers: {
          Authorization: "Bearer refresh-token",
        },
      });
      expect(setCookies).toHaveBeenCalledWith(
        "new-access-token",
        "new-refresh-token",
      );
    });
  });

  describe("when refresh response misses one token", () => {
    it("should not save cookies", async () => {
      // Given
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            access_token: "new-access-token",
            refresh_token: undefined,
          }),
        }),
      );

      // When
      await refreshTokens("refresh-token");

      // Then
      expect(setCookies).not.toHaveBeenCalled();
    });
  });

  describe("when refresh response is not successful", () => {
    it("should not save cookies", async () => {
      // Given
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockResolvedValue({
            message: "Unauthorized",
            statusCode: 401,
            error: "Unauthorized",
          }),
        }),
      );

      // When
      await refreshTokens("expired-refresh-token");

      // Then
      expect(setCookies).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith({
        message: "Unauthorized",
        statusCode: 401,
        error: "Unauthorized",
      });
    });
  });
});
