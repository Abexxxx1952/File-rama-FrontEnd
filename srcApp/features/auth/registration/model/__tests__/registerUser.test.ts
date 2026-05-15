import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { fetchRegisterUser } from "../../api/fetchRegisterUser";
import { registerUser } from ".././registerUser";

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock("../../api/fetchRegisterUser", () => ({
  fetchRegisterUser: vi.fn(),
}));

const registerData = {
  email: "ada@example.com",
  password: "password",
  passwordRepeat: "password",
};

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

describe("registerUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when registration succeeds", () => {
    it("should notify success and navigate to login", async () => {
      // Given
      const setLoading = vi.fn();
      const router = { replace: vi.fn() };
      vi.mocked(fetchRegisterUser).mockResolvedValue(user);

      // When
      await registerUser(registerData, setLoading, router as any);

      // Then
      expect(fetchRegisterUser).toHaveBeenCalledWith(registerData);
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "User ada@example.com register successfully",
      });
      expect(router.replace).toHaveBeenCalledWith("/login");
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenLastCalledWith(false);
    });
  });

  describe("when registration response contains error data", () => {
    it("should notify error without navigation", async () => {
      // Given
      const error = {
        message: "Email already exists",
        statusCode: 409,
        error: "Conflict",
      };
      const router = { replace: vi.fn() };
      vi.mocked(fetchRegisterUser).mockResolvedValue(error);

      // When
      await registerUser(registerData, vi.fn(), router as any);

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(router.replace).not.toHaveBeenCalled();
      expect(notifyResponse).not.toHaveBeenCalledWith({
        isError: false,
        successMessage: "User ada@example.com register successfully",
      });
    });
  });
});
