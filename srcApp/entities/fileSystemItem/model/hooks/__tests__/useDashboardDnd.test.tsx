import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type SelectedMap } from "@/srcApp/pages/dashboard/model/types/selectedMap";

import { updateFile } from "../../updateFile";
import { updateFolder } from "../../updateFolder";
import { updateMany } from "../../updateMany";
import { useDashboardDnd } from ".././useDashboardDnd";

vi.mock("../../updateFile", () => ({
  updateFile: vi.fn(),
}));

vi.mock("../../updateFolder", () => ({
  updateFolder: vi.fn(),
}));

vi.mock("../../updateMany", () => ({
  updateMany: vi.fn(),
}));

function renderDnd(selected: SelectedMap) {
  const params = {
    selected,
    clear: vi.fn(),
    fileSystemItemsCurrentTag:
      'fileSystemItem/root/[{"key":"folderName","order":"asc"}]',
    forceUpdate: vi.fn(),
  };

  return {
    params,
    ...renderHook(() => useDashboardDnd(params)),
  };
}

describe("useDashboardDnd", () => {
  describe("when multiple items are selected and drag starts", () => {
    it("should mark selected items as draggable", () => {
      // Given
      const selected: SelectedMap = new Map([
        ["file-1", { index: 1, fileId: "file-1" }],
        ["folder-1", { index: 2, folderId: "folder-1" }],
      ]);
      const { result, params } = renderDnd(selected);

      // When
      act(() => {
        result.current.onDragStart();
      });

      // Then
      expect(result.current.isDraggable("file-1")).toBe(true);
      expect(result.current.isDraggable("folder-1")).toBe(true);
      expect(params.forceUpdate).toHaveBeenCalled();
    });
  });

  describe("when drag moves over dashboard", () => {
    it("should store current cursor position", () => {
      // Given
      const { result } = renderDnd(new Map());

      // When
      act(() => {
        result.current.onDragOver({
          clientX: 12,
          clientY: 34,
          preventDefault: vi.fn(),
        } as any);
      });

      // Then
      expect(result.current.cursorPositionRef.current).toEqual({
        x: 12,
        y: 34,
      });
    });
  });

  describe("when several selected items are dropped", () => {
    it("should update many items and clear selection", async () => {
      // Given
      const selected: SelectedMap = new Map([
        ["file-1", { index: 1, fileId: "file-1" }],
        ["folder-1", { index: 2, folderId: "folder-1" }],
      ]);
      const { result, params } = renderDnd(selected);
      vi.mocked(updateMany).mockResolvedValue(null);
      act(() => {
        result.current.onDragStart();
        result.current.dndRef.current.droppable = "target-folder";
      });

      // When
      await act(async () => {
        await result.current.onDrop();
      });

      // Then
      await waitFor(() =>
        expect(updateMany).toHaveBeenCalledWith(
          [
            { fileId: "file-1", parentFolderId: "target-folder" },
            { folderId: "folder-1", parentFolderId: "target-folder" },
          ],
          [
            'fileSystemItem/root/[{"key":"folderName","order":"asc"}]',
            'fileSystemItem/target-folder/[{"key":"folderName","order":"asc"}]',
          ]
        )
      );
      expect(params.clear).toHaveBeenCalled();
    });
  });

  describe("when one folder is dropped", () => {
    it("should update folder parent", async () => {
      // Given
      const selected: SelectedMap = new Map([
        ["folder-1", { index: 1, folderId: "folder-1" }],
      ]);
      const { result } = renderDnd(selected);
      vi.mocked(updateFolder).mockResolvedValue(null);
      act(() => {
        result.current.dndRef.current.draggable.set("folder-1", {
          folderId: "folder-1",
        });
        result.current.dndRef.current.droppable = "target-folder";
      });

      // When
      await act(async () => {
        await result.current.onDrop();
      });

      // Then
      expect(updateFolder).toHaveBeenCalledWith(
        { folderId: "folder-1", parentFolderId: "target-folder" },
        [
          'fileSystemItem/root/[{"key":"folderName","order":"asc"}]',
          'fileSystemItem/target-folder/[{"key":"folderName","order":"asc"}]',
        ],
        expect.any(Function)
      );
    });
  });

  describe("when one file is dropped", () => {
    it("should update file parent", async () => {
      // Given
      const selected: SelectedMap = new Map([
        ["file-1", { index: 1, fileId: "file-1" }],
      ]);
      const { result } = renderDnd(selected);
      vi.mocked(updateFile).mockResolvedValue(null);
      act(() => {
        result.current.dndRef.current.draggable.set("file-1", {
          fileId: "file-1",
        });
        result.current.dndRef.current.droppable = "target-folder";
      });

      // When
      await act(async () => {
        await result.current.onDrop();
      });

      // Then
      expect(updateFile).toHaveBeenCalledWith(
        { fileId: "file-1", parentFolderId: "target-folder" },
        [
          'fileSystemItem/root/[{"key":"folderName","order":"asc"}]',
          'fileSystemItem/target-folder/[{"key":"folderName","order":"asc"}]',
        ],
        expect.any(Function)
      );
    });
  });

  describe("when drag ends", () => {
    it("should reset dnd state and force update", () => {
      // Given
      const selected: SelectedMap = new Map([
        ["file-1", { index: 1, fileId: "file-1" }],
        ["folder-1", { index: 2, folderId: "folder-1" }],
      ]);
      const { result, params } = renderDnd(selected);
      act(() => {
        result.current.onDragStart();
      });

      // When
      act(() => {
        result.current.onDragEnd();
      });

      // Then
      expect(result.current.isDraggable("file-1")).toBe(false);
      expect(params.forceUpdate).toHaveBeenCalledTimes(2);
    });
  });
});
