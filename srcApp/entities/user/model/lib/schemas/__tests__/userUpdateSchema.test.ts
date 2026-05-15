import { describe, expect, it } from "vitest";
import { userUpdateSchema } from ".././userUpdateSchema";

describe("userUpdateSchema", () => {
  describe("when update data is valid", () => {
    it("should pass validation", () => {
      // Given
      const data = {
        name: "Alex",
        password: "secret",
        repeatPassword: "secret",
      };

      // When
      const result = userUpdateSchema.safeParse(data);

      // Then
      expect(result.success).toBe(true);
    });
  });

  describe("when password is provided without repeat password", () => {
    it("should return repeat password required error", () => {
      // Given
      const data = {
        name: "Alex",
        password: "secret",
        repeatPassword: "",
      };

      // When
      const result = userUpdateSchema.safeParse(data);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.repeatPassword).toContain(
          "Repeat password is required when changing password",
        );
      }
    });
  });

  describe("when passwords do not match", () => {
    it("should return password match error", () => {
      // Given
      const data = {
        name: "Alex",
        password: "secret",
        repeatPassword: "another",
      };

      // When
      const result = userUpdateSchema.safeParse(data);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.repeatPassword).toContain(
          "Passwords do not match",
        );
      }
    });
  });
});
