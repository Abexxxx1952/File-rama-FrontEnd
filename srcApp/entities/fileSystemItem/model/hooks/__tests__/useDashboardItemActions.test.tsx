import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { deleteFile } from "@/srcApp/entities/fileSystemItem/model/deleteFile";
import { deleteFolder } from "@/srcApp/entities/fileSystemItem/model/deleteFolder";
import { downloadFile } from "@/srcApp/entities/fileSystemItem/model/downloadFile";
import { openFile } from "@/srcApp/entities/fileSystemItem/model/openFile";

import { type FileSystemItem } from "../../types/fileSystemItem";
import { useDashboardItemActions } from ".././useDashboardItemActions";

vi.mock("@/srcApp/entities/fileSystemItem/model/deleteFile", () => ({
  deleteFile: vi.fn(),
}));

vi.mock("@/srcApp/entities/fileSystemItem/model/deleteFolder", () => ({
  deleteFolder: vi.fn(),
}));

vi.mock("@/srcApp/entities/fileSystemItem/model/downloadFile", () => ({
  downloadFile: vi.fn(),
}));

vi.mock("@/srcApp/entities/fileSystemItem/model/openFile", () => ({
  openFile: vi.fn(),
}));

const folder: FileSystemItem = {
  id: "folder-1",
  folderName: "Documents",
  userId: "user-1",
  parentFolderId: null,
  createdDate: "2026-05-15T10:00:00.000Z",
  isPublic: false,
};

function renderActions() {
  const params = {
    toggle: vi.fn(),
    forceUpdate: vi.fn(),
    routerForward: vi.fn(),
    setCurrentFileSystemItem: vi.fn(),
    setUpdateFileModalOpen: vi.fn(),
    setUpdateFolderModalOpen: vi.fn(),
    fileSystemItemsCurrentTag: "files-current",
  };

  return {
    params,
    ...renderHook(() => useDashboardItemActions(params)),
  };
}

describe("useDashboardItemActions", () => {
  describe("when user ctrl-clicks item", () => {
    it("should toggle item selection", () => {
      // Given
      const { result, params } = renderActions();

      // When
      act(() => {
        result.current.oneClickHandler(
          { ctrlKey: true, metaKey: false, shiftKey: false } as any,
          { id: "file-1", isFileItem: true, index: 2 }
        );
      });

      // Then
      expect(params.toggle).toHaveBeenCalledWith("file-1", true, 2);
    });
  });

  describe("when user opens a file", () => {
    it("should call openFile", async () => {
      // Given
      const { result } = renderActions();
      const setLoadingOpen = vi.fn();
      vi.mocked(openFile).mockResolvedValue(null);

      // When
      await act(async () => {
        await result.current.handleOpen({
          isFileItem: true,
          id: "file-1",
          setLoadingOpen,
        });
      });

      // Then
      expect(openFile).toHaveBeenCalledWith("file-1", setLoadingOpen);
    });
  });

  describe("when user opens a folder", () => {
    it("should navigate forward", async () => {
      // Given
      const { result, params } = renderActions();

      // When
      await act(async () => {
        await result.current.handleOpen({
          isFileItem: false,
          id: "folder-1",
          setLoadingOpen: vi.fn(),
        });
      });

      // Then
      expect(params.routerForward).toHaveBeenCalledWith("folder-1");
    });
  });

  describe("when user downloads a file", () => {
    it("should call downloadFile", async () => {
      // Given
      const { result } = renderActions();
      const setLoadingDownload = vi.fn();
      vi.mocked(downloadFile).mockResolvedValue(null);

      // When
      await act(async () => {
        await result.current.handleDownload("file-1", setLoadingDownload);
      });

      // Then
      expect(downloadFile).toHaveBeenCalledWith("file-1", setLoadingDownload);
    });
  });

  describe("when user updates a folder", () => {
    it("should set current item and open folder update modal", () => {
      // Given
      const { result, params } = renderActions();

      // When
      act(() => {
        result.current.handleUpdate(false, folder);
      });

      // Then
      expect(params.setCurrentFileSystemItem).toHaveBeenCalledWith(folder);
      expect(params.setUpdateFolderModalOpen).toHaveBeenCalledWith(true);
      expect(params.setUpdateFileModalOpen).not.toHaveBeenCalled();
    });
  });

  describe("when user deletes a file", () => {
    it("should delete file and force update", async () => {
      // Given
      const { result, params } = renderActions();
      const setLoadingDelete = vi.fn();
      vi.mocked(deleteFile).mockResolvedValue(null);

      // When
      await act(async () => {
        await result.current.handleDelete({
          isFileItem: true,
          id: "file-1",
          setLoadingDelete,
        });
      });

      // Then
      await waitFor(() =>
        expect(deleteFile).toHaveBeenCalledWith(
          "file-1",
          "files-current",
          setLoadingDelete
        )
      );
      expect(params.forceUpdate).toHaveBeenCalled();
    });
  });

  describe("when user deletes a folder", () => {
    it("should delete folder and force update", async () => {
      // Given
      const { result, params } = renderActions();
      const setLoadingDelete = vi.fn();
      vi.mocked(deleteFolder).mockResolvedValue(null);

      // When
      await act(async () => {
        await result.current.handleDelete({
          isFileItem: false,
          id: "folder-1",
          setLoadingDelete,
        });
      });

      // Then
      await waitFor(() =>
        expect(deleteFolder).toHaveBeenCalledWith(
          "folder-1",
          "files-current",
          setLoadingDelete
        )
      );
      expect(params.forceUpdate).toHaveBeenCalled();
    });
  });
});
