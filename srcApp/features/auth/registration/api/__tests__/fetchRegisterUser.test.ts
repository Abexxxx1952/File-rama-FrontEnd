import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/srcApp/shared/model/apiClient";

import { fetchRegisterUser } from ".././fetchRegisterUser";

vi.mock("@/srcApp/shared/model/apiClient", () => ({
  apiClient: vi.fn(),
}));

const user = {
  id: "user-1",
  email: "user@example.com",
  createdAt: new Date("2026-05-15T10:00:00.000Z"),
  payloads: [],
  googleServiceAccounts: [],
  permissions: [],
  registrationSources: [],
  isVerified: false,
  isTwoFactorEnabled: false,
};

describe("fetchRegisterUser", () => {
  afterEach(() => {
    delete process.env.REGISTER_URL;
  });

  describe("when registration response is successful", () => {
    it("should send registration data and return user", async () => {
      // Given
      process.env.REGISTER_URL = "https://api.example.com/register";
      const registerData = {
        email: "user@example.com",
        password: "secret",
        passwordRepeat: "secret",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(user),
      } as unknown as Response);

      // When
      const result = await fetchRegisterUser(registerData);

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/register",
        method: "POST",
        bodyData: registerData,
      });
      expect(result).toEqual(user);
    });
  });

  describe("when registration response contains error data", () => {
    it("should return error data", async () => {
      // Given
      const error = {
        message: "Conflict",
        statusCode: 409,
        error: "Conflict",
      };
      vi.mocked(apiClient).mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue(error),
      } as unknown as Response);

      // When
      const result = await fetchRegisterUser({
        email: "user@example.com",
        password: "secret",
        passwordRepeat: "secret",
      });

      // Then
      expect(result).toEqual(error);
    });
  });
});
