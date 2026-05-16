import { afterEach, describe, expect, it, vi } from "vitest";

import { revalidateFromClientByTag } from ".././revalidateFromClientByTag";

describe("revalidateFromClientByTag", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("when revalidation succeeds", () => {
    it("should post tags to revalidation endpoint", async () => {
      // Given
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          json: vi.fn().mockResolvedValue({ revalidated: true }),
        })
      );

      // When
      await revalidateFromClientByTag(["tag-a", "tag-b"]);

      // Then
      expect(fetch).toHaveBeenCalledWith("/api/revalidateByTag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: ["tag-a", "tag-b"] }),
      });
    });
  });

  describe("when revalidation fails", () => {
    it("should log revalidation failure", async () => {
      // Given
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          json: vi.fn().mockResolvedValue({ revalidated: false }),
        })
      );

      // When
      await revalidateFromClientByTag(["tag-a"]);

      // Then
      expect(console.error).toHaveBeenCalledWith("Revalidation failed");
    });
  });
});
