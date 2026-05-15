import { afterEach, describe, expect, it, vi } from "vitest";
import { setCookies } from "@/srcApp/features/cookies/model/setCookies";
import { apiClient } from "@/srcApp/shared/model/apiClient";
import { fetchLoginUser } from ".././fetchLoginUser";

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

vi.mock("@/srcApp/features/cookies/model/setCookies", () => ({
  setCookies: vi.fn(),
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

describe("fetchLoginUser", () => {
  afterEach(() => {
    delete process.env.LOGIN_URL;
  });

  describe("when login response is successful", () => {
    it("should set cookies and return user", async () => {
      // Given
      process.env.LOGIN_URL = "https://api.example.com/login";
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        headers: {
          getSetCookie: () => [
            "access_token=access-token; Path=/",
            "refresh_token=refresh-token; Path=/",
          ],
        },
        json: vi.fn().mockResolvedValue(user),
      } as unknown as Response);

      // When
      const result = await fetchLoginUser("user@example.com", "secret");

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/login",
        method: "POST",
        bodyData: {
          email: "user@example.com",
          password: "secret",
        },
      });
      expect(setCookies).toHaveBeenCalledWith("access-token", "refresh-token");
      expect(result).toEqual(user);
    });
  });

  describe("when login response contains error data", () => {
    it("should return error data", async () => {
      // Given
      const error = {
        message: "Unauthorized",
        statusCode: 401,
        error: "Unauthorized",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchLoginUser("user@example.com", "wrong");

      // Then
      expect(result).toEqual(error);
    });
  });
});
