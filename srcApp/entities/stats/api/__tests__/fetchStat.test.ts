import { afterEach, describe, expect, it, vi } from "vitest";
import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { fetchEntity } from "@/srcApp/shared/model/fetchEntity";
import { fetchStat } from ".././fetchStat";

vi.mock("@/srcApp/shared/model/fetchEntity", () => ({
  fetchEntity: vi.fn(),
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

describe("fetchStat", () => {
  afterEach(() => {
    delete process.env.GET_STAT_URL;
    vi.restoreAllMocks();
  });

  describe("when called with access token", () => {
    it("should fetch stat with stat cache tag", async () => {
      // Given
      process.env.GET_STAT_URL = "https://api.example.com/stat";
      vi.mocked(fetchEntity).mockResolvedValue(stat);

      // When
      const result = await fetchStat("access-token");

      // Then
      expect(fetchEntity).toHaveBeenCalledWith(
        "https://api.example.com/stat",
        "access-token",
        [CACHE_TAG.STAT],
      );
      expect(result).toEqual(stat);
    });
  });
});
