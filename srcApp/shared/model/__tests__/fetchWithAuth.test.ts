import { afterEach, describe, expect, it, vi } from "vitest";

import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";

import { fetchWithAuth } from ".././fetchWithAuth";
import { notifyResponse } from ".././notifyResponse";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/features/auth/refresh-tokens/model/refreshTokens", () => ({
  refreshTokens: vi.fn(),
}));

vi.mock(".././notifyResponse", () => ({
  notifyResponse: vi.fn(),
}));

const args = { id: "entity-1" };
const data = { id: "entity-1", name: "Entity" };

describe("fetchWithAuth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when access token is available", () => {
    it("should call request function and return data", async () => {
      // Given
      const request = vi.fn().mockResolvedValue(data);
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: "refresh-token",
      });

      // When
      const result = await fetchWithAuth(request, args, "Saved successfully");

      // Then
      expect(request).toHaveBeenCalledWith("access-token", args);
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "Saved successfully",
      });
      expect(result).toEqual(data);
    });
  });

  describe("when success message callback returns several messages", () => {
    it("should notify every success message", async () => {
      // Given
      const request = vi.fn().mockResolvedValue(data);
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });

      // When
      const result = await fetchWithAuth(request, args, () => [
        "First saved",
        "Second saved",
      ]);

      // Then
      expect(result).toEqual(data);
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "First saved",
      });
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "Second saved",
      });
    });
  });

  describe("when success message callback returns one message", () => {
    it("should notify success message", async () => {
      // Given
      const request = vi.fn().mockResolvedValue(data);
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });

      // When
      const result = await fetchWithAuth(
        request,
        args,
        (savedData) => `${savedData.name} saved`
      );

      // Then
      expect(result).toEqual(data);
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: false,
        successMessage: "Entity saved",
      });
    });
  });

  describe("when request returns error data", () => {
    it("should notify error and return null", async () => {
      // Given
      const error = {
        message: "Forbidden",
        statusCode: 403,
        error: "Forbidden",
      };
      const request = vi.fn().mockResolvedValue(error);
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });

      // When
      const result = await fetchWithAuth(request, args);

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: error,
      });
      expect(result).toBeNull();
    });
  });

  describe("when request returns null", () => {
    it("should notify unexpected error and return null", async () => {
      // Given
      const request = vi.fn().mockResolvedValue(null);
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });

      // When
      const result = await fetchWithAuth(request, args);

      // Then
      expect(notifyResponse).toHaveBeenCalledWith({
        isError: true,
        responseResult: null,
      });
      expect(result).toBeNull();
    });
  });

  describe("when only refresh token is available", () => {
    it("should refresh tokens and retry request", async () => {
      // Given
      const request = vi.fn().mockResolvedValue(data);
      vi.mocked(getCookies)
        .mockResolvedValueOnce({
          access_token: undefined,
          refresh_token: "refresh-token",
        })
        .mockResolvedValueOnce({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
        });

      // When
      const result = await fetchWithAuth(request, args);

      // Then
      expect(refreshTokens).toHaveBeenCalledWith("refresh-token");
      expect(request).toHaveBeenCalledWith("new-access-token", args);
      expect(result).toEqual(data);
    });
  });

  describe("when no tokens are available", () => {
    it("should return null without calling request function", async () => {
      // Given
      const request = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: undefined,
        refresh_token: undefined,
      });

      // When
      const result = await fetchWithAuth(request, args);

      // Then
      expect(request).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("when request throws unexpected error", () => {
    it("should log error and return null", async () => {
      // Given
      const error = new Error("Network error");
      const request = vi.fn().mockRejectedValue(error);
      vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });

      // When
      const result = await fetchWithAuth(request, args);

      // Then
      expect(console.warn).toHaveBeenCalledWith("error", error);
      expect(result).toBeNull();
    });
  });

  describe("when loading setter is provided", () => {
    it("should toggle loading around the request", async () => {
      // Given
      const setLoading = vi.fn();
      const request = vi.fn().mockResolvedValue(data);
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });

      // When
      await fetchWithAuth(request, args, undefined, setLoading);

      // Then
      expect(setLoading).toHaveBeenNthCalledWith(1, true);
      expect(setLoading).toHaveBeenLastCalledWith(false);
    });
  });
});
