import { describe, expect, it } from "vitest";
import { googleServiceAccountsAddSchema } from ".././googleServiceAccountsAddSchema";

describe("googleServiceAccountsAddSchema", () => {
  describe("when service account data is valid", () => {
    it("should pass validation", () => {
      // Given
      const data = {
        clientEmail: "service@example.com",
        privateKey: "private-key",
        rootFolderId: "root-folder",
      };

      // When
      const result = googleServiceAccountsAddSchema.safeParse(data);

      // Then
      expect(result.success).toBe(true);
    });
  });

  describe("when client email is invalid", () => {
    it("should return client email error", () => {
      // Given
      const data = {
        clientEmail: "bad",
        privateKey: "private-key",
      };

      // When
      const result = googleServiceAccountsAddSchema.safeParse(data);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.clientEmail).toContain(
          "Client email must be a valid email address",
        );
      }
    });
  });

  describe("when private key is empty", () => {
    it("should return private key error", () => {
      // Given
      const data = {
        clientEmail: "service@example.com",
        privateKey: "",
      };

      // When
      const result = googleServiceAccountsAddSchema.safeParse(data);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.privateKey).toContain(
          "Private key must be a string",
        );
      }
    });
  });
});
