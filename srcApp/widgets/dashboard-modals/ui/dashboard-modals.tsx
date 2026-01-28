"use client";

import { isFile } from "@/srcApp/entities/fileSystemItem/model/isFile";
import { isFolder } from "@/srcApp/entities/fileSystemItem/model/isFolder";
import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import {
  FileCreateModal,
  FileUpdateModal,
  FolderCreateModal,
  FolderUpdateModal,
} from "@/srcApp/entities/fileSystemItem/ui";
import { createPortal } from "react-dom";

interface DashboardModalsProps {
  portalRef: React.RefObject<HTMLElement | null>;
  addFolderModalOpen: boolean;
  setAddFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
  parentFolderId: string[];
  addFileModalOpen: boolean;
  setAddFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentFileSystemItem: FileSystemItem | null;
  updateFolderModalOpen: boolean;
  setUpdateFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateFileModalOpen: boolean;
  setUpdateFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DashboardModals({
  portalRef,
  addFolderModalOpen,
  setAddFolderModalOpen,
  forceUpdate,
  parentFolderId,
  addFileModalOpen,
  setAddFileModalOpen,
  currentFileSystemItem,
  updateFolderModalOpen,
  setUpdateFolderModalOpen,
  updateFileModalOpen,
  setUpdateFileModalOpen,
}: DashboardModalsProps) {
  if (!portalRef) return null;
  return (
    <>
      {portalRef.current &&
        addFolderModalOpen &&
        createPortal(
          <FolderCreateModal
            setAddFolderModalOpen={setAddFolderModalOpen}
            forceUpdate={forceUpdate}
            parentFolderId={
              parentFolderId.length > 0
                ? parentFolderId[parentFolderId.length - 1]
                : null
            }
          />,
          portalRef.current,
        )}
      {portalRef.current &&
        addFileModalOpen &&
        createPortal(
          <FileCreateModal
            parentFolderId={
              parentFolderId.length > 0
                ? parentFolderId[parentFolderId.length - 1]
                : null
            }
            setAddFileModalOpen={setAddFileModalOpen}
            forceUpdate={forceUpdate}
          />,
          portalRef.current,
        )}
      {portalRef.current &&
        updateFolderModalOpen &&
        isFolder(currentFileSystemItem) &&
        createPortal(
          <FolderUpdateModal
            folderId={currentFileSystemItem.id}
            folderName={currentFileSystemItem.folderName}
            isPublic={currentFileSystemItem.isPublic}
            setUpdateFolderModalOpen={setUpdateFolderModalOpen}
            forceUpdate={forceUpdate}
          />,
          portalRef.current,
        )}
      {portalRef.current &&
        updateFileModalOpen &&
        isFile(currentFileSystemItem) &&
        createPortal(
          <FileUpdateModal
            fileId={currentFileSystemItem.id}
            fileName={currentFileSystemItem.fileName}
            isPublic={currentFileSystemItem.isPublic}
            setUpdateFileModalOpen={setUpdateFileModalOpen}
            forceUpdate={forceUpdate}
          />,
          portalRef.current,
        )}
    </>
  );
}
