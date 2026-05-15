import { describe, expect, it } from "vitest";
import { userRegistrationSchema } from ".././userRegistrationSchema";

describe("userRegistrationSchema", () => {
  describe("when registration data is valid", () => {
    it("should pass validation", () => {
      // Given
      const data = {
        email: "user@example.com",
        password: "secret",
        passwordRepeat: "secret",
      };

      // When
      const result = userRegistrationSchema.safeParse(data);

      // Then
      expect(result.success).toBe(true);
    });
  });

  describe("when password repeat is missing", () => {
    it("should return password repeat error", () => {
      // Given
      const data = {
        email: "user@example.com",
        password: "secret",
        passwordRepeat: "",
      };

      // When
      const result = userRegistrationSchema.safeParse(data);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.passwordRepeat).toContain(
          "Repeat password is required",
        );
      }
    });
  });

  describe("when passwords do not match", () => {
    it("should return password match error", () => {
      // Given
      const data = {
        email: "user@example.com",
        password: "secret",
        passwordRepeat: "another",
      };

      // When
      const result = userRegistrationSchema.safeParse(data);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.passwordRepeat).toContain(
          "Passwords do not match",
        );
      }
    });
  });
});
