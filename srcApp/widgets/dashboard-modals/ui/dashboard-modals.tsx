"use client";

import { createPortal } from "react-dom";

import { isFile } from "@/srcApp/entities/fileSystemItem/model/isFile";
import { isFolder } from "@/srcApp/entities/fileSystemItem/model/isFolder";
import { type FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import {
  FileCreateModal,
  FileUpdateModal,
  FolderCreateModal,
  FolderUpdateModal,
} from "@/srcApp/entities/fileSystemItem/ui";

interface DashboardModalsProps {
  portalRef: React.RefObject<HTMLElement | null>;
  addFolderModalOpen: boolean;
  setAddFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
  currentParentFolderId: string | null;
  addFileModalOpen: boolean;
  setAddFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentFileSystemItem: FileSystemItem | null;
  updateFolderModalOpen: boolean;
  setUpdateFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateFileModalOpen: boolean;
  setUpdateFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileSystemItemsCurrentTag: string;
}

export function DashboardModals({
  portalRef,
  addFolderModalOpen,
  setAddFolderModalOpen,
  forceUpdate,
  currentParentFolderId,
  addFileModalOpen,
  setAddFileModalOpen,
  currentFileSystemItem,
  updateFolderModalOpen,
  setUpdateFolderModalOpen,
  updateFileModalOpen,
  setUpdateFileModalOpen,
  fileSystemItemsCurrentTag,
}: DashboardModalsProps) {
  if (!portalRef) {
    return null;
  }
  return (
    <>
      {portalRef.current &&
        addFolderModalOpen &&
        createPortal(
          <FolderCreateModal
            setAddFolderModalOpen={setAddFolderModalOpen}
            forceUpdate={forceUpdate}
            fileSystemItemsCurrentTag={fileSystemItemsCurrentTag}
            parentFolderId={currentParentFolderId}
          />,
          portalRef.current
        )}
      {portalRef.current &&
        addFileModalOpen &&
        createPortal(
          <FileCreateModal
            parentFolderId={currentParentFolderId}
            setAddFileModalOpen={setAddFileModalOpen}
            forceUpdate={forceUpdate}
            fileSystemItemsCurrentTag={fileSystemItemsCurrentTag}
          />,
          portalRef.current
        )}
      {portalRef.current &&
        updateFolderModalOpen &&
        isFolder(currentFileSystemItem) &&
        createPortal(
          <FolderUpdateModal
            folderId={currentFileSystemItem.id}
            folderName={currentFileSystemItem.folderName}
            setUpdateFolderModalOpen={setUpdateFolderModalOpen}
            forceUpdate={forceUpdate}
            fileSystemItemsCurrentTag={fileSystemItemsCurrentTag}
          />,
          portalRef.current
        )}
      {portalRef.current &&
        updateFileModalOpen &&
        isFile(currentFileSystemItem) &&
        createPortal(
          <FileUpdateModal
            fileId={currentFileSystemItem.id}
            fileName={currentFileSystemItem.fileName}
            fileExtension={currentFileSystemItem.fileExtension}
            publicAccessRole={currentFileSystemItem.publicAccessRole}
            fileUrl={currentFileSystemItem.fileUrl}
            setUpdateFileModalOpen={setUpdateFileModalOpen}
            forceUpdate={forceUpdate}
            fileSystemItemsCurrentTag={fileSystemItemsCurrentTag}
          />,
          portalRef.current
        )}
    </>
  );
}
