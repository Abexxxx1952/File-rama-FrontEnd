import { afterEach, describe, expect, it, vi } from "vitest";
import { apiClient } from ".././apiClient";
import { fetchEntity } from ".././fetchEntity";

vi.mock(".././apiClient", () => ({
  apiClient: vi.fn(),
}));

describe("fetchEntity", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when response is successful", () => {
    it("should return parsed response data", async () => {
      // Given
      const data = { id: "user-1" };
      vi.mocked(apiClient).mockResolvedValue(
        new Response(JSON.stringify(data), {
          status: 200,
        }),
      );

      // When
      const result = await fetchEntity<typeof data>(
        "https://api.example.com/user",
        "access-token",
        ["user"],
      );

      // Then
      expect(apiClient).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/user",
        method: "GET",
        additionalHeaders: {
          authorization: "Bearer access-token",
        },
        cacheTags: ["user"],
      });
      expect(result).toEqual(data);
    });
  });

  describe("when response contains error data", () => {
    it("should return parsed error data", async () => {
      // Given
      const error = {
        message: "Unauthorized",
        statusCode: 401,
        error: "Unauthorized",
      };
      vi.mocked(apiClient).mockResolvedValue(
        new Response(JSON.stringify(error), {
          status: 401,
        }),
      );

      // When
      const result = await fetchEntity(
        "https://api.example.com/user",
        "access-token",
      );

      // Then
      expect(result).toEqual(error);
    });
  });

  describe("when request fails with unknown error", () => {
    it("should return null", async () => {
      // Given
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(apiClient).mockRejectedValue(new Error("Network error"));

      // When
      const result = await fetchEntity(
        "https://api.example.com/user",
        "access-token",
      );

      // Then
      expect(result).toBeNull();
    });
  });
});
