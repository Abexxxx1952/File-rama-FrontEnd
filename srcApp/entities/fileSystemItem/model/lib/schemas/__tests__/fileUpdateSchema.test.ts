import { describe, expect, it } from "vitest";
import { fileUpdateSchema } from ".././fileUpdateSchema";

describe("fileUpdateSchema", () => {
  describe("when file data is valid", () => {
    it("should trim file name and extension", () => {
      // Given
      const data = {
        fileName: "  Report  ",
        fileExtension: " pdf ",
        isPublic: true,
        canRewritten: false,
        fileGDriveUrl: "https://drive.example.com/report",
        fileStaticUrl: "https://static.example.com/report.pdf",
      };

      // When
      const result = fileUpdateSchema.safeParse(data);

      // Then
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fileName).toBe("Report");
        expect(result.data.fileExtension).toBe("pdf");
      }
    });
  });

  describe("when file name is empty after trim", () => {
    it("should return validation error", () => {
      // Given
      const data = {
        fileName: " ",
        fileExtension: "pdf",
        isPublic: true,
        canRewritten: false,
        fileGDriveUrl: "https://drive.example.com/report",
        fileStaticUrl: "https://static.example.com/report.pdf",
      };

      // When
      const result = fileUpdateSchema.safeParse(data);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.fileName).toContain(
          "File name must be a non-empty string",
        );
      }
    });
  });
});
