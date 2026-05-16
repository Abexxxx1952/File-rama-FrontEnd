import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from ".././apiClient";

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("when request has JSON body and additional headers", () => {
    it("should call fetch with serialized body and JSON content type", async () => {
      // Given
      const fetchMock = vi.fn().mockResolvedValue(new Response(null));
      vi.stubGlobal("fetch", fetchMock);

      // When
      await apiClient({
        baseUrl: "https://api.example.com/files",
        method: "POST",
        additionalHeaders: {
          authorization: "Bearer token",
        },
        bodyData: {
          name: "Report",
        },
      });

      // Then
      expect(fetchMock).toHaveBeenCalledWith("https://api.example.com/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer token",
        },
        body: JSON.stringify({ name: "Report" }),
      });
    });
  });

  describe("when request has condition and cache tags", () => {
    it("should add encoded condition query and next cache config", async () => {
      // Given
      const fetchMock = vi.fn().mockResolvedValue(new Response(null));
      vi.stubGlobal("fetch", fetchMock);

      // When
      await apiClient({
        baseUrl: "https://api.example.com/files",
        condition: {
          parentFolderId: "folder-1",
        },
        cacheTags: ["files"],
        revalidateTime: 120,
      });

      // Then
      const [url, options] = fetchMock.mock.calls[0];
      const parsedUrl = new URL(url);

      expect(parsedUrl.origin + parsedUrl.pathname).toBe(
        "https://api.example.com/files"
      );
      expect(
        JSON.parse(
          decodeURIComponent(parsedUrl.searchParams.get("condition") || "")
        )
      ).toEqual({
        parentFolderId: "folder-1",
      });
      expect(options).toEqual({
        method: "GET",
        headers: {},
        next: {
          tags: ["files"],
          revalidate: 120,
        },
      });
    });
  });

  describe("when abort controller ref is provided", () => {
    it("should abort previous request and pass next signal", async () => {
      // Given
      const fetchMock = vi.fn().mockResolvedValue(new Response(null));
      vi.stubGlobal("fetch", fetchMock);
      const previousController = new AbortController();
      const abortSpy = vi.spyOn(previousController, "abort");
      const abortControllerRef = {
        current: previousController,
      };

      // When
      await apiClient({
        baseUrl: "https://api.example.com/files",
        abortControllerRef,
      });

      // Then
      expect(abortSpy).toHaveBeenCalledTimes(1);
      expect(abortControllerRef.current).not.toBe(previousController);
      expect(fetchMock.mock.calls[0][1].signal).toBe(
        abortControllerRef.current.signal
      );
    });
  });
});
