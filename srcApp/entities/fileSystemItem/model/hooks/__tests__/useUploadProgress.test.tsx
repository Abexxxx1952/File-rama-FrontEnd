import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { StatusUpload } from "../../types/fileUploadResult";
import { useUploadProgress } from ".././useUploadProgress";

vi.mock("@/srcApp/features/cookies/model/getCookies", () => ({
  getCookies: vi.fn(),
}));

vi.mock("@/srcApp/features/auth/refresh-tokens/model/refreshTokens", () => ({
  refreshTokens: vi.fn(),
}));

const eventSources: MockEventSource[] = [];

class MockEventSource {
  static CLOSED = 2;

  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  readyState = 1;
  close = vi.fn(() => {
    this.readyState = MockEventSource.CLOSED;
  });

  constructor(
    public url: string,
    public options?: EventSourceInit,
  ) {
    eventSources.push(this);
  }
}

describe("useUploadProgress", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CREATE_FILE_STATUS_URL =
      "https://api.example.com/upload-status/";
    vi.stubGlobal("EventSource", MockEventSource);
    eventSources.length = 0;
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_CREATE_FILE_STATUS_URL;
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("when access token is available", () => {
    it("should create event source for upload status", async () => {
      // Given
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });

      // When
      renderHook(() => useUploadProgress("upload-1", vi.fn()));

      // Then
      await waitFor(() => expect(eventSources).toHaveLength(1));
      expect(eventSources[0].url).toBe(
        "https://api.example.com/upload-status/upload-1",
      );
      expect(eventSources[0].options).toEqual({ withCredentials: true });
    });
  });

  describe("when upload progress message is received", () => {
    it("should call progress handler", async () => {
      // Given
      const onProgress = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      renderHook(() => useUploadProgress("upload-1", onProgress));
      await waitFor(() => expect(eventSources).toHaveLength(1));
      const event = {
        fileName: "report.pdf",
        progress: 50,
        status: StatusUpload.UPLOADING,
        error: null,
      };

      // When
      act(() => {
        eventSources[0].onmessage?.({ data: JSON.stringify(event) } as MessageEvent);
      });

      // Then
      expect(onProgress).toHaveBeenCalledWith(event);
    });
  });

  describe("when upload completes", () => {
    it("should call complete handler and close event source", async () => {
      // Given
      const onComplete = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      renderHook(() =>
        useUploadProgress("upload-1", vi.fn(), onComplete, vi.fn()),
      );
      await waitFor(() => expect(eventSources).toHaveLength(1));
      const event = {
        fileName: "report.pdf",
        progress: 100,
        status: StatusUpload.COMPLETED,
        error: null,
      };

      // When
      act(() => {
        eventSources[0].onmessage?.({ data: JSON.stringify(event) } as MessageEvent);
      });

      // Then
      expect(onComplete).toHaveBeenCalledWith(event);
      expect(eventSources[0].close).toHaveBeenCalled();
    });
  });

  describe("when upload fails", () => {
    it("should call error handler and close event source", async () => {
      // Given
      const onError = vi.fn();
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      renderHook(() => useUploadProgress("upload-1", vi.fn(), vi.fn(), onError));
      await waitFor(() => expect(eventSources).toHaveLength(1));
      const event = {
        fileName: "report.pdf",
        progress: 75,
        status: StatusUpload.FAILED,
        error: "Upload failed",
      };

      // When
      act(() => {
        eventSources[0].onmessage?.({ data: JSON.stringify(event) } as MessageEvent);
      });

      // Then
      expect(onError).toHaveBeenCalledWith(event);
      expect(eventSources[0].close).toHaveBeenCalled();
    });
  });

  describe("when only refresh token is available", () => {
    it("should refresh tokens and retry event source creation", async () => {
      // Given
      vi.mocked(getCookies)
        .mockResolvedValueOnce({
          access_token: undefined,
          refresh_token: "refresh-token",
        })
        .mockResolvedValueOnce({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
        });

      // When
      renderHook(() => useUploadProgress("upload-1", vi.fn()));

      // Then
      await waitFor(() => expect(refreshTokens).toHaveBeenCalledWith("refresh-token"));
      await waitFor(() => expect(eventSources).toHaveLength(1));
    });
  });

  describe("when event data cannot be parsed", () => {
    it("should log parse error", async () => {
      // Given
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      renderHook(() => useUploadProgress("upload-1", vi.fn()));
      await waitFor(() => expect(eventSources).toHaveLength(1));

      // When
      act(() => {
        eventSources[0].onmessage?.({ data: "invalid-json" } as MessageEvent);
      });

      // Then
      expect(console.error).toHaveBeenCalledWith(
        "Failed to parse SSE event",
        expect.any(SyntaxError),
      );
    });
  });

  describe("when event source errors before closing", () => {
    it("should call error handler and close event source", async () => {
      // Given
      const onError = vi.fn();
      const error = new Event("error");
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(getCookies).mockResolvedValue({
        access_token: "access-token",
        refresh_token: undefined,
      });
      renderHook(() => useUploadProgress("upload-1", vi.fn(), vi.fn(), onError));
      await waitFor(() => expect(eventSources).toHaveLength(1));

      // When
      act(() => {
        eventSources[0].onerror?.(error);
      });

      // Then
      expect(console.error).toHaveBeenCalledWith("SSE connection error", error);
      expect(onError).toHaveBeenCalledWith(error);
      expect(eventSources[0].close).toHaveBeenCalled();
    });
  });
});
