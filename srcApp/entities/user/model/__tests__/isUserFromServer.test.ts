import { describe, expect, it } from "vitest";
import { isUserFromServer } from ".././isUserFromServer";

describe("isUserFromServer", () => {
  describe("when value contains user identity fields", () => {
    it("should return true", () => {
      // Given
      const value = {
        id: "user-1",
        email: "ada@example.com",
      };

      // When
      const result = isUserFromServer(value as any);

      // Then
      expect(result).toBe(true);
    });
  });

  describe("when value is error data", () => {
    it("should return false", () => {
      // Given
      const value = {
        message: "Unauthorized",
        statusCode: 401,
        error: "Unauthorized",
      };

      // When
      const result = isUserFromServer(value);

      // Then
      expect(result).toBe(false);
    });
  });

  describe("when value is null", () => {
    it("should return false", () => {
      // Given
      const value = null;

      // When
      const result = isUserFromServer(value);

      // Then
      expect(result).toBe(false);
    });
  });
});
