import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useMediaQuery } from ".././useMediaQuery";

function mockMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<() => void>();

  vi.stubGlobal("matchMedia", (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn((_event: string, callback: () => void) => {
      listeners.add(callback);
    }),
    removeEventListener: vi.fn((_event: string, callback: () => void) => {
      listeners.delete(callback);
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      listeners.forEach((listener) => listener());
    },
  };
}

describe("useMediaQuery", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("when media query matches", () => {
    it("should return true", () => {
      // Given
      mockMatchMedia(true);

      // When
      const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

      // Then
      expect(result.current).toBe(true);
    });
  });

  describe("when media query result changes", () => {
    it("should update value", () => {
      // Given
      const media = mockMatchMedia(false);
      const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

      // When
      act(() => {
        media.setMatches(true);
      });

      // Then
      expect(result.current).toBe(true);
    });
  });
});
