import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchDownloadFile } from ".././fetchDownloadFile";

describe("fetchDownloadFile", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_DOWNLOAD_FILE_URL;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("when file is downloaded", () => {
    it("should create download link and return file url with decoded name", async () => {
      // Given
      process.env.NEXT_PUBLIC_DOWNLOAD_FILE_URL =
        "https://api.example.com/download/";
      const fileBlob = new Blob(["content"], { type: "application/pdf" });
      const createObjectURL = vi.fn().mockReturnValue("blob:download-url");
      const revokeObjectURL = vi.fn();
      Object.defineProperty(URL, "createObjectURL", {
        configurable: true,
        value: createObjectURL,
      });
      Object.defineProperty(URL, "revokeObjectURL", {
        configurable: true,
        value: revokeObjectURL,
      });
      const click = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(() => {});
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          headers: {
            get: vi
              .fn()
              .mockReturnValue('attachment; filename="Report%202026.pdf"'),
          },
          blob: vi.fn().mockResolvedValue(fileBlob),
        })
      );

      // When
      const result = await fetchDownloadFile("access-token", {
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
      expect(click).toHaveBeenCalled();
      expect(result).toEqual({
        fileUrl: "blob:download-url",
        fileName: "Report 2026.pdf",
      });
    });
  });

  describe("when download response contains error data", () => {
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
      const result = await fetchDownloadFile("access-token", {
        fileDownloadId: "file-1",
      });

      // Then
      expect(result).toEqual(error);
    });
  });
});
