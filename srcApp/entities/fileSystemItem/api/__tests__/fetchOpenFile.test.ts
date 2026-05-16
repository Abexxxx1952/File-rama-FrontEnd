import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchOpenFile } from ".././fetchOpenFile";

describe("fetchOpenFile", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_DOWNLOAD_FILE_URL;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("when file is opened", () => {
    it("should create object url, open it in new tab, and return file info", async () => {
      // Given
      process.env.NEXT_PUBLIC_DOWNLOAD_FILE_URL =
        "https://api.example.com/download/";
      const fileBlob = new Blob(["content"], { type: "application/pdf" });
      const createObjectURL = vi.fn().mockReturnValue("blob:open-url");
      Object.defineProperty(URL, "createObjectURL", {
        configurable: true,
        value: createObjectURL,
      });
      const open = vi.spyOn(window, "open").mockImplementation(() => null);
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          headers: {
            get: vi
              .fn()
              .mockReturnValue('inline; filename="Report%202026.pdf"'),
          },
          blob: vi.fn().mockResolvedValue(fileBlob),
        })
      );

      // When
      const result = await fetchOpenFile("access-token", {
        fileDownloadId: "file-1",
      });

      // Then
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/download/file-1",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer access-token",
          },
        }
      );
      expect(createObjectURL).toHaveBeenCalledWith(fileBlob);
      expect(open).toHaveBeenCalledWith("blob:open-url", "_blank");
      expect(result).toEqual({
        fileUrl: "blob:open-url",
        fileName: "Report 2026.pdf",
      });
    });
  });

  describe("when open response contains error data", () => {
    it("should return error data", async () => {
      // Given
      const error = {
        message: "File not found",
        statusCode: 404,
        error: "Not Found",
      };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockResolvedValue(error),
        })
      );

      // When
      const result = await fetchOpenFile("access-token", {
        fileDownloadId: "file-1",
      });

      // Then
      expect(result).toEqual(error);
    });
  });
});
