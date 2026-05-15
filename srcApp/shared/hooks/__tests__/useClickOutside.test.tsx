import { RefObject } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useClickOutside } from ".././useClickOutside";

describe("useClickOutside", () => {
  describe("when user clicks outside referenced element", () => {
    it("should call handler", () => {
      // Given
      const element = document.createElement("div");
      document.body.appendChild(element);
      const ref: RefObject<HTMLElement> = { current: element };
      const handler = vi.fn();

      renderHook(() => useClickOutside(ref, handler));

      // When
      document.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
        }),
      );

      // Then
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe("when user clicks inside referenced element", () => {
    it("should not call handler", () => {
      // Given
      const element = document.createElement("div");
      const child = document.createElement("button");
      element.appendChild(child);
      document.body.appendChild(element);
      const ref: RefObject<HTMLElement> = { current: element };
      const handler = vi.fn();

      renderHook(() => useClickOutside(ref, handler));

      // When
      child.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
        }),
      );

      // Then
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
