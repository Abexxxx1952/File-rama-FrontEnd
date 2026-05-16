import { useCallback } from "react";

import { deleteFile } from "@/srcApp/entities/fileSystemItem/model/deleteFile";
import { deleteFolder } from "@/srcApp/entities/fileSystemItem/model/deleteFolder";
import { downloadFile } from "@/srcApp/entities/fileSystemItem/model/downloadFile";
import { openFile } from "@/srcApp/entities/fileSystemItem/model/openFile";
import type { DeleteHandlerArgs } from "@/srcApp/entities/fileSystemItem/model/types/deleteHandlerArgs";
import type { DoubleClickMeta } from "@/srcApp/entities/fileSystemItem/model/types/doubleClickHandlerArgs";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import type { OneClickMeta } from "@/srcApp/entities/fileSystemItem/model/types/oneClickHandlerArgs";

interface useDashboardItemActionsParams {
  toggle: (id: string, isFile: boolean, index: number) => void;
  forceUpdate: () => void;
  routerForward: (param: string) => void;
  setCurrentFileSystemItem: (item: FileSystemItem) => void;
  setUpdateFileModalOpen: (v: boolean) => void;
  setUpdateFolderModalOpen: (v: boolean) => void;
  fileSystemItemsCurrentTag: string;
}

export function useDashboardItemActions({
  toggle,
  forceUpdate,
  routerForward,
  setCurrentFileSystemItem,
  setUpdateFileModalOpen,
  setUpdateFolderModalOpen,
  fileSystemItemsCurrentTag,
}: useDashboardItemActionsParams) {
  const oneClickHandler = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      { id, isFileItem, index }: OneClickMeta
    ) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        toggle(id, isFileItem, index);
      }
    },
    [toggle]
  );

  const handleOpen = useCallback(
    async ({
      isFileItem,
      id,
      setLoadingOpen,
    }: DoubleClickMeta): Promise<void> => {
      if (isFileItem) {
        await openFile(id, setLoadingOpen);
      } else {
        routerForward(id);
      }
    },
    []
  );

  const handleDownload = useCallback(
    async (
      id: string,
      setLoadingDownload: React.Dispatch<React.SetStateAction<boolean>>
    ): Promise<void> => {
      await downloadFile(id, setLoadingDownload);
    },
    []
  );

  const handleUpdate = useCallback(
    (isFile: boolean, item: FileSystemItem): void => {
      setCurrentFileSystemItem(item);
      isFile ? setUpdateFileModalOpen(true) : setUpdateFolderModalOpen(true);
    },
    []
  );

  const handleDelete = useCallback(
    async ({
      isFileItem,
      id,
      setLoadingDelete,
    }: DeleteHandlerArgs): Promise<void> => {
      isFileItem
        ? await deleteFile(id, fileSystemItemsCurrentTag, setLoadingDelete)
        : await deleteFolder(id, fileSystemItemsCurrentTag, setLoadingDelete);
      forceUpdate();
    },
    []
  );

  return {
    oneClickHandler,
    handleOpen,
    handleDownload,
    handleUpdate,
    handleDelete,
  };
}
