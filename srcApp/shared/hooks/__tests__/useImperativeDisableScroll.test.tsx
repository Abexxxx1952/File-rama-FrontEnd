import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useImperativeDisableScroll } from ".././useImperativeDisableScroll";

describe("useImperativeDisableScroll", () => {
  describe("when disabled is true", () => {
    it("should hide vertical overflow and restore it on unmount", () => {
      // Given
      const element = document.createElement("div");

      // When
      const { unmount } = renderHook(() =>
        useImperativeDisableScroll(element, true)
      );

      // Then
      expect(element.style.overflowY).toBe("hidden");

      // When
      unmount();

      // Then
      expect(element.style.overflowY).toBe("auto");
    });
  });

  describe("when disabled is false", () => {
    it("should allow vertical overflow", () => {
      // Given
      const element = document.createElement("div");

      // When
      renderHook(() => useImperativeDisableScroll(element, false));

      // Then
      expect(element.style.overflowY).toBe("auto");
    });
  });
});
