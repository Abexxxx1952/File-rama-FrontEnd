import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { fetchLoginUser } from "../../api/fetchLoginUser";
import { loginUser } from ".././loginUser";

vi.mock("@/srcApp/shared/model/notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

vi.mock("../../api/fetchLoginUser", () => ({
  fetchLoginUser: vi.fn(),
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

describe("loginUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when credentials are invalid", () => {
    it("should set validation errors without calling login api", async () => {
      // Given
      const setErrors = vi.fn();
      const setLoading = vi.fn();
      const router = { push: vi.fn() };

      // When
      await loginUser("bad-email", "", setErrors, setLoading, router as any);

      // Then
      expect(setErrors).toHaveBeenCalled();
      expect(fetchLoginUser).not.toHaveBeenCalled();
      expect(setLoading).not.toHaveBeenCalled();
    });
  });

  describe("when login succeeds", () => {
    it("should notify success and navigate to dashboard", async () => {
      // Given
      const setLoading = vi.fn();
      const router = { push: vi.fn() };
      vi.mocked(fetchLoginUser).mockResolvedValue(user);

      // When
      await loginUser(
        "ada@example.com",
        "password",
        vi.fn(),
        setLoading,
        router as any,
      );

      // Then
      expect(fetchLoginUser).toHaveBeenCalledWith("ada@example.com", "password");
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "Successfully logged ada@example.com",
      });
      expect(router.push).toHaveBeenCalledWith("/dashboard/null");
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenLastCalledWith(false);
    });
  });

  describe("when login response contains error data", () => {
    it("should notify error without navigation", async () => {
      // Given
      const error = {
        message: "Unauthorized",
        statusCode: 401,
        error: "Unauthorized",
      };
      const router = { push: vi.fn() };
      vi.mocked(fetchLoginUser).mockResolvedValue(error);

      // When
      const result = await loginUser(
        "ada@example.com",
        "password",
        vi.fn(),
        vi.fn(),
        router as any,
      );

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(router.push).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
