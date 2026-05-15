import { describe, expect, it } from "vitest";
import { formatKeyToEnvString } from ".././formatKeyToEnvString";

describe("formatKeyToEnvString", () => {
  describe("when key contains header and footer with whitespace", () => {
    it("should format key with escaped new lines", () => {
      // Given
      const key = `
        -----BEGIN PRIVATE KEY-----
        abc
        def
        -----END PRIVATE KEY-----
      `;

      // When
      const result = formatKeyToEnvString(key);

      // Then
      expect(result).toBe(
        "-----BEGIN PRIVATE KEY-----\\nabc\\ndef\\n-----END PRIVATE KEY-----",
      );
    });
  });

  describe("when key is wrapped in quotes", () => {
    it("should remove quotes before formatting", () => {
      // Given
      const key = '"abc def"';

      // When
      const result = formatKeyToEnvString(key);

      // Then
      expect(result).toBe(
        "-----BEGIN PRIVATE KEY-----\\nabc\\ndef\\n-----END PRIVATE KEY-----",
      );
    });
  });
});
