import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { getFolderPath } from ".././getFolderPath";

vi.mock("@/srcApp/shared/model/fetchWithAuth", () => ({
  fetchWithAuth: vi.fn(),
}));

describe("getFolderPath", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when folder id is null route segment", () => {
    it("should return root path without calling fetchWithAuth", async () => {
      // Given
      const setLoading = vi.fn();

      // When
      const result = await getFolderPath("null", "folder-path-tag", setLoading);

      // Then
      expect(result).toBe(":/");
      expect(fetchWithAuth).not.toHaveBeenCalled();
    });
  });

  describe("when fetchWithAuth succeeds", () => {
    it("should call fetchWithAuth with correct parameters and return result", async () => {
      // Given
      const setLoading = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue(":/Documents");

      // When
      const result = await getFolderPath(
        "folder-1",
        "folder-path-tag",
        setLoading
      );

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        { folderID: "folder-1", folderPathTag: "folder-path-tag" },
        undefined,
        setLoading
      );
      expect(result).toBe(":/Documents");
    });
  });

  describe("when fetchWithAuth returns null", () => {
    it("should return root path", async () => {
      // Given
      const setLoading = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue(null);

      // When
      const result = await getFolderPath(
        "folder-1",
        "folder-path-tag",
        setLoading
      );

      // Then
      expect(result).toBe(":/");
    });
  });
});
