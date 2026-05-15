import { describe, expect, it } from "vitest";
import { validationSchema } from ".././schema";

describe("validationSchema", () => {
  describe("when login data is valid", () => {
    it("should pass validation", () => {
      // Given
      const data = {
        email: "user@example.com",
        password: "secret",
      };

      // When
      const result = validationSchema.safeParse(data);

      // Then
      expect(result.success).toBe(true);
    });
  });

  describe("when email and password are invalid", () => {
    it("should return validation errors", () => {
      // Given
      const data = {
        email: "not-email",
        password: "12",
      };

      // When
      const result = validationSchema.safeParse(data);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors).toEqual({
          email: ["Invalid email address"],
          password: ["Password must be at least 3 characters"],
        });
      }
    });
  });
});
