import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useKeyboardHandler } from ".././useKeyboardHandler";

describe("useKeyboardHandler", () => {
  describe("when matching key is pressed", () => {
    it("should call matching callback", () => {
      // Given
      const element = document.createElement("div");
      const onEscape = vi.fn();
      const onEnter = vi.fn();

      renderHook(() =>
        useKeyboardHandler(element, [
          ["Escape", onEscape],
          ["Enter", onEnter],
        ]),
      );

      // When
      element.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

      // Then
      expect(onEscape).toHaveBeenCalledTimes(1);
      expect(onEnter).not.toHaveBeenCalled();
    });
  });

  describe("when element is null", () => {
    it("should not subscribe to keyboard events", () => {
      // Given
      const onEscape = vi.fn();

      renderHook(() => useKeyboardHandler(null, [["Escape", onEscape]]));

      // When
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

      // Then
      expect(onEscape).not.toHaveBeenCalled();
    });
  });
});
