import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  FileSystemSortKey,
  SORT_ORDER,
} from "@/srcApp/pages/dashboard/model/types/sort";

import { useDashboardNavigation } from ".././useDashboardNavigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

const router = {
  push: vi.fn(),
  replace: vi.fn(),
};

function mockSearchParams(query = "") {
  const params = new URLSearchParams(query);
  vi.mocked(useSearchParams).mockReturnValue(params);
}

describe("useDashboardNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(router as any);
    vi.mocked(usePathname).mockReturnValue("/dashboard/folder-1");
    mockSearchParams();
  });

  describe("when ids are provided", () => {
    it("should expose current and grand parent ids with default sort", () => {
      // Given
      const { result } = renderHook(() =>
        useDashboardNavigation(["folder-1", "folder-2"])
      );

      // When
      const navigation = result.current;

      // Then
      expect(navigation.currentParentFolderId).toBe("folder-2");
      expect(navigation.grandParentId).toBe("folder-1");
      expect(navigation.sort).toEqual([
        { key: FileSystemSortKey.name, order: SORT_ORDER.ASC },
      ]);
    });
  });

  describe("when sort params are valid", () => {
    it("should read sort rules from search params", () => {
      // Given
      mockSearchParams("sort=size&order=desc&sort=name&order=asc");

      // When
      const { result } = renderHook(() => useDashboardNavigation([]));

      // Then
      expect(result.current.sort).toEqual([
        { key: FileSystemSortKey.size, order: SORT_ORDER.DESC },
        { key: FileSystemSortKey.name, order: SORT_ORDER.ASC },
      ]);
    });
  });

  describe("when user navigates forward", () => {
    it("should push dashboard path with next id", () => {
      // Given
      const { result } = renderHook(() => useDashboardNavigation(["folder-1"]));

      // When
      act(() => {
        result.current.routerForward("folder-2");
      });

      // Then
      expect(router.push).toHaveBeenCalledWith("/dashboard/folder-1/folder-2");
    });
  });

  describe("when user navigates back from nested folder", () => {
    it("should push parent folder path", () => {
      // Given
      const { result } = renderHook(() =>
        useDashboardNavigation(["folder-1", "folder-2", "folder-3"])
      );

      // When
      act(() => {
        result.current.routerBack();
      });

      // Then
      expect(router.push).toHaveBeenCalledWith("/dashboard/folder-1/folder-2");
    });
  });

  describe("when user upserts sort rule", () => {
    it("should replace sort params in current path", () => {
      // Given
      mockSearchParams("sort=name&order=asc&page=2");
      const { result } = renderHook(() => useDashboardNavigation([]));

      // When
      act(() => {
        result.current.upsertSortRule({
          key: FileSystemSortKey.size,
          order: SORT_ORDER.DESC,
        });
      });

      // Then
      expect(router.replace).toHaveBeenCalledWith(
        "/dashboard/folder-1?page=2&sort=size&order=desc&sort=name&order=asc",
        { scroll: false }
      );
    });
  });
});
