import { describe, expect, it } from "vitest";
import { transformZodErrors } from ".././transformZodErrors";

describe("transformZodErrors", () => {
  describe("when zod errors contain multiple messages", () => {
    it("should use the first message for each field", () => {
      // Given
      const zodErrors = {
        email: ["Invalid email address", "Email is required"],
        password: ["Password is too short", "Password is required"],
      };

      // When
      const result = transformZodErrors(zodErrors);

      // Then
      expect(result).toEqual({
        email: "Invalid email address",
        password: "Password is too short",
      });
    });
  });

  describe("when zod errors are empty", () => {
    it("should return empty error object", () => {
      // Given
      const zodErrors = {};

      // When
      const result = transformZodErrors(zodErrors);

      // Then
      expect(result).toEqual({});
    });
  });
});
