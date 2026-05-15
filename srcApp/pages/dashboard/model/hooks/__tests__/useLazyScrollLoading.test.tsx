import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLazyScrollLoading } from ".././useLazyScrollLoading";

let observerCallback: IntersectionObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  observe = observe;
  disconnect = disconnect;
}

describe("useLazyScrollLoading", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe("when last element intersects", () => {
    it("should increase max count by add step", () => {
      // Given
      vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
      const element = document.createElement("div");
      const ref = { current: element };
      const { result } = renderHook(() =>
        useLazyScrollLoading(10, 25, 5, ref),
      );

      // When
      act(() => {
        observerCallback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });

      // Then
      expect(observe).toHaveBeenCalledWith(element);
      expect(result.current).toBe(15);
    });
  });

  describe("when max count already reaches products length", () => {
    it("should keep current max count", () => {
      // Given
      vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
      const ref = { current: document.createElement("div") };
      const { result } = renderHook(() => useLazyScrollLoading(10, 10, 5, ref));

      // When
      act(() => {
        observerCallback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      });

      // Then
      expect(result.current).toBe(10);
    });
  });

  describe("when hook unmounts", () => {
    it("should disconnect observer", () => {
      // Given
      vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
      const ref = { current: document.createElement("div") };
      const { unmount } = renderHook(() => useLazyScrollLoading(10, 25, 5, ref));

      // When
      unmount();

      // Then
      expect(disconnect).toHaveBeenCalled();
    });
  });
});
