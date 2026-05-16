import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useSelection } from ".././useSelection";

describe("useSelection", () => {
  describe("when hook is initialized", () => {
    it("should start with empty selection", () => {
      // Given
      const { result } = renderHook(() => useSelection());

      // When
      const selected = result.current.selected;

      // Then
      expect(selected.size).toBe(0);
      expect(result.current.isSelected()).toBe(false);
    });
  });

  describe("when user toggles file selection", () => {
    it("should add selected file and report it as selected", () => {
      // Given
      const { result } = renderHook(() => useSelection());

      // When
      act(() => {
        result.current.toggle("file-1", true, 3);
      });

      // Then
      expect(result.current.selected.get("file-1")).toEqual({
        index: 3,
        fileId: "file-1",
      });
      expect(result.current.isSelected("file-1")).toBe(true);
      expect(result.current.isSelected()).toBe(true);
    });
  });

  describe("when user toggles folder selection", () => {
    it("should add selected folder with folder id", () => {
      // Given
      const { result } = renderHook(() => useSelection());

      // When
      act(() => {
        result.current.toggle("folder-1", false, 2);
      });

      // Then
      expect(result.current.selected.get("folder-1")).toEqual({
        index: 2,
        folderId: "folder-1",
      });
    });
  });

  describe("when user toggles already selected item", () => {
    it("should remove item from selection", () => {
      // Given
      const { result } = renderHook(() => useSelection());
      act(() => {
        result.current.toggle("file-1", true, 1);
      });

      // When
      act(() => {
        result.current.toggle("file-1", true, 1);
      });

      // Then
      expect(result.current.selected.has("file-1")).toBe(false);
      expect(result.current.isSelected()).toBe(false);
    });
  });

  describe("when user clears selection", () => {
    it("should remove all selected items", () => {
      // Given
      const { result } = renderHook(() => useSelection());
      act(() => {
        result.current.toggle("file-1", true, 1);
        result.current.toggle("folder-1", false, 2);
      });

      // When
      act(() => {
        result.current.clear();
      });

      // Then
      expect(result.current.selected.size).toBe(0);
    });
  });
});
