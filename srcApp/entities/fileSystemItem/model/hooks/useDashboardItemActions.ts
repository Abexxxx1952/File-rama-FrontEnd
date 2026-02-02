import { useCallback } from "react";
import { deleteFile } from "@/srcApp/entities/fileSystemItem/model/deleteFile";
import { deleteFolder } from "@/srcApp/entities/fileSystemItem/model/deleteFolder";
import { downloadFile } from "@/srcApp/entities/fileSystemItem/model/downloadFile";
import { openFile } from "@/srcApp/entities/fileSystemItem/model/openFile";
import { DeleteHandlerArgs } from "@/srcApp/entities/fileSystemItem/model/types/deleteHandlerArgs";
import { DoubleClickMeta } from "@/srcApp/entities/fileSystemItem/model/types/doubleClickHandlerArgs";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { OneClickMeta } from "@/srcApp/entities/fileSystemItem/model/types/oneClickHandlerArgs";

interface useDashboardItemActionsArgs {
  toggle: Function;
  forceUpdate: () => void;
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  setParentFolderId: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentFileSystemItem: (item: FileSystemItem) => void;
  setUpdateFileModalOpen: (v: boolean) => void;
  setUpdateFolderModalOpen: (v: boolean) => void;
}

export function useDashboardItemActions({
  toggle,
  forceUpdate,
  setPath,
  setParentFolderId,
  setCurrentFileSystemItem,
  setUpdateFileModalOpen,
  setUpdateFolderModalOpen,
}: useDashboardItemActionsArgs) {
  const oneClickHandler = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      { id, isFileItem, index }: OneClickMeta,
    ) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        toggle(id, isFileItem, index);
      }
    },
    [toggle],
  );

  const handleOpen = useCallback(
    async ({
      isFileItem,
      id,
      folderName,
      setLoadingOpen,
    }: DoubleClickMeta): Promise<void> => {
      if (isFileItem) {
        await openFile(id, setLoadingOpen);
      } else {
        setPath((prev) =>
          prev.length === 1
            ? prev.concat(folderName)
            : prev.concat(`/${folderName}`),
        );
        setParentFolderId((prev) => prev.concat(id));
        forceUpdate();
      }
    },
    [openFile, setPath, setParentFolderId, forceUpdate],
  );

  const handleDownload = useCallback(
    async (
      id: string,
      setLoadingDownload: React.Dispatch<React.SetStateAction<boolean>>,
    ): Promise<void> => {
      await downloadFile(id, setLoadingDownload);
    },
    [downloadFile],
  );

  const handleUpdate = useCallback(
    (isFile: boolean, item: FileSystemItem): void => {
      setCurrentFileSystemItem(item);
      isFile ? setUpdateFileModalOpen(true) : setUpdateFolderModalOpen(true);
    },
    [
      setCurrentFileSystemItem,
      setUpdateFileModalOpen,
      setUpdateFolderModalOpen,
    ],
  );

  const handleDelete = useCallback(
    async ({
      isFileItem,
      id,
      setLoadingDelete,
    }: DeleteHandlerArgs): Promise<void> => {
      isFileItem
        ? await deleteFile(id, setLoadingDelete)
        : await deleteFolder(id, setLoadingDelete);
      forceUpdate();
    },
    [deleteFile, deleteFolder, forceUpdate],
  );

  return {
    oneClickHandler,
    handleOpen,
    handleDownload,
    handleUpdate,
    handleDelete,
  };
}
