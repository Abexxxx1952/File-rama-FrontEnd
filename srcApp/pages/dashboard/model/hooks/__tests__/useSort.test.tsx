import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  FileSystemSortKey,
  SORT_ORDER,
} from "@/srcApp/pages/dashboard/model/types/sort";

import { useSort } from ".././useSort";

describe("useSort", () => {
  describe("when hook is initialized", () => {
    it("should use name ascending as default sort", () => {
      // Given
      const { result } = renderHook(() => useSort());

      // When
      const sort = result.current.sort;

      // Then
      expect(sort).toEqual([
        { key: FileSystemSortKey.name, order: SORT_ORDER.ASC },
      ]);
      expect(result.current.sortRules).toEqual({
        sortFolderRules: [{ key: "folderName", order: SORT_ORDER.ASC }],
        sortFileRules: [{ key: "fileName", order: SORT_ORDER.ASC }],
      });
    });
  });

  describe("when user adds new sort rule", () => {
    it("should place new rule before existing rules", () => {
      // Given
      const { result } = renderHook(() => useSort());

      // When
      act(() => {
        result.current.upsertSortRule({
          key: FileSystemSortKey.size,
          order: SORT_ORDER.DESC,
        });
      });

      // Then
      expect(result.current.sort).toEqual([
        { key: FileSystemSortKey.size, order: SORT_ORDER.DESC },
        { key: FileSystemSortKey.name, order: SORT_ORDER.ASC },
      ]);
    });
  });

  describe("when user updates existing sort rule", () => {
    it("should move updated rule to the beginning", () => {
      // Given
      const { result } = renderHook(() => useSort());

      act(() => {
        result.current.upsertSortRule({
          key: FileSystemSortKey.size,
          order: SORT_ORDER.ASC,
        });
      });

      // When
      act(() => {
        result.current.upsertSortRule({
          key: FileSystemSortKey.name,
          order: SORT_ORDER.DESC,
        });
      });

      // Then
      expect(result.current.sort).toEqual([
        { key: FileSystemSortKey.name, order: SORT_ORDER.DESC },
        { key: FileSystemSortKey.size, order: SORT_ORDER.ASC },
      ]);
    });
  });
});
