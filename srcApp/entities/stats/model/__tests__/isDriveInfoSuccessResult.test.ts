import { describe, expect, it } from "vitest";
import { isDriveInfoSuccessResult } from ".././isDriveInfoSuccessResult";

describe("isDriveInfoSuccessResult", () => {
  describe("when value contains drive space fields", () => {
    it("should return true", () => {
      // Given
      const value = {
        driveEmail: "drive@example.com",
        totalSpace: 100,
        usedSpace: 40,
        availableSpace: 60,
      };

      // When
      const result = isDriveInfoSuccessResult(value);

      // Then
      expect(result).toBe(true);
    });
  });

  describe("when value is an error result", () => {
    it("should return false", () => {
      // Given
      const value = {
        driveEmail: "drive@example.com",
        error: "Connection error",
        errorMessage: "Cannot connect",
      };

      // When
      const result = isDriveInfoSuccessResult(value);

      // Then
      expect(result).toBe(false);
    });
  });

  describe("when value is null", () => {
    it("should return false", () => {
      // Given
      const value = null;

      // When
      const result = isDriveInfoSuccessResult(value);

      // Then
      expect(result).toBe(false);
    });
  });
});
