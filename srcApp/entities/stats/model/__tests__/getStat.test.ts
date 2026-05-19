import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { getStat } from ".././getStat";

vi.mock("@/srcApp/shared/model/fetchWithAuth", () => ({
  fetchWithAuth: vi.fn(),
}));

const stat = {
  id: "stat-1",
  userId: "user-1",
  fileCount: 3,
  folderCount: 2,
  totalSize: 1024,
  usedSize: 512,
  driveInfoResult: [],
};

describe("getStat", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when stat is fetched successfully", () => {
    it("should return fetched stat", async () => {
      // Given
      vi.mocked(fetchWithAuth).mockResolvedValue(stat);

      // When
      const result = await getStat();

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(expect.any(Function));
      expect(result).toEqual(stat);
    });
  });

  describe("when fetch fails", () => {
    it("should return null", async () => {
      // Given
      vi.mocked(fetchWithAuth).mockResolvedValue(null);

      // When
      const result = await getStat();

      // Then
      expect(fetchWithAuth).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
