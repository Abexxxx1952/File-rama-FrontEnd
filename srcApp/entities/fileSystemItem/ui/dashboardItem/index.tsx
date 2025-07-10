import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { deleteFile } from "@/srcApp/entities/fileSystemItem/model/deleteFile";
import { deleteFolder } from "@/srcApp/entities/fileSystemItem/model/deleteFolder";
import { downloadFile } from "@/srcApp/entities/fileSystemItem/model/downloadFile";
import { getFileIconUrl } from "@/srcApp/entities/fileSystemItem/model/getFileIconUrl";
import { isFile } from "@/srcApp/entities/fileSystemItem/model/isFile";
import { isFolder } from "@/srcApp/entities/fileSystemItem/model/isFolder";
import { openFile } from "@/srcApp/entities/fileSystemItem/model/openFile";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { SelectedMap } from "@/srcApp/pages/dashboard/model/types/selectedMap";
import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { ButtonIcon } from "@/srcApp/shared/ui/button-icon";
import { createPortal } from "react-dom";
import { areDashboardItemEqual } from "../../model/areDashboardItemEqual";
import { FileUpdateModal } from "../file-update-modal";
import { FolderUpdateModal } from "../folder-update-modal";
import { DashboardItemContextMenu } from "./dashboardItem-context-menu";
import styles from "./styles.module.css";

export type DashboardItemProps = {
  item: FileSystemItem;
  index: number;
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  setParentFolderId: React.Dispatch<React.SetStateAction<string[]>>;
  forceUpdate: () => void;
  isSelected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<SelectedMap>>;
};

export const DashboardItem = React.memo(function ({
  item,
  index,
  setPath,
  setParentFolderId,
  forceUpdate,
  isSelected,
  setSelected,
}: DashboardItemProps) {
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const isFileItem = isFile(item);
  const [dashboardItemMenuOpen, setDashboardItemContextMenuOpen] =
    useState<boolean>(false);
  const [updateFolderModalOpen, setUpdateFolderModalOpen] =
    useState<boolean>(false);
  const [updateFileModalOpen, setUpdateFileModalOpen] =
    useState<boolean>(false);

  const portalRef = useRef<HTMLElement | null>(null);

  const body = document.querySelector("body");

  useKeyboardHandler(body, [
    ["Escape", () => setDashboardItemContextMenuOpen(false)],
  ]);

  useEffect(() => {
    portalRef.current = document.getElementById("portal");
  }, []);

  function handleEllipsis() {
    setDashboardItemContextMenuOpen((prev) => !prev);
  }

  async function handleOpen() {
    await openFile(item.id, setLoadingOpen);
  }

  async function handleDownload() {
    await downloadFile(item.id, setLoadingDownload);
  }

  function handleUpdate() {
    if (isFileItem) setUpdateFileModalOpen(true);
    else setUpdateFolderModalOpen(true);
  }

  function handleDelete() {
    if (isFileItem) {
      (async () => {
        await deleteFile(item.id, setLoadingDelete);
      })();
    } else {
      (async () => {
        await deleteFolder(item.id, setLoadingDelete);
      })();
    }
    forceUpdate();
  }

  function formatDate(isoDate: string) {
    const dateFromIso = new Date(isoDate);
    const date = dateFromIso.toLocaleDateString("ru-RU");
    const time = dateFromIso.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${date} ${time}`;
  }

  function doubleClickHandler() {
    if (isFileItem) {
      (async () => {
        await openFile(item.id, setLoadingDownload);
      })();
    } else {
      setPath((prev) =>
        prev.length === 1
          ? prev.concat(item.folderName)
          : prev.concat(`/${item.folderName}`),
      );
      setParentFolderId((prev) => prev.concat(item.id));
      forceUpdate();
    }
  }

  function oneClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      selectItemHandler();
    }
  }

  function selectItemHandler() {
    if (isSelected) {
      setSelected((prev) => {
        prev.delete(item.id);
        return new Map(prev);
      });
    } else {
      const mapElement = isFileItem
        ? { index, fileId: item.id }
        : { index, folderId: item.id };
      setSelected((prev) => new Map(prev.set(item.id, mapElement)));
    }
  }

  return (
    <div
      className={`${styles.tableItem} ${isSelected && styles.tableItem_selected}`}
      onClick={oneClickHandler}
      onDoubleClick={doubleClickHandler}
    >
      <span className={`${styles.tableItem__name} ${styles.tableItem__row}`}>
        {isFileItem ? (
          <span className={styles.tableItem__icon}>
            <Image
              src={`/img/storage/${getFileIconUrl(item.fileExtension)}`}
              fill={true}
              alt={`File image`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </span>
        ) : (
          <span className={styles.tableItem__icon}>
            <Image
              src="/img/storage/folder.png"
              fill={true}
              alt={`Folder image`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </span>
        )}
        <span className={styles.tableItem__text}>
          {isFileItem ? item.fileName : item.folderName}
        </span>
      </span>

      <span className={`${styles.tableItem__size} ${styles.tableItem__row}`}>
        {isFileItem ? formatBytes(Number(item.fileSize)) : null}
      </span>
      <span
        className={`${styles.tableItem__uploadDate} ${styles.tableItem__row}`}
      >
        {isFileItem
          ? formatDate(item.uploadDate)
          : formatDate(item.createdDate)}
      </span>
      <span className={`${styles.tableItem__public} ${styles.tableItem__row}`}>
        {item.isPublic}
      </span>
      <span className={`${styles.tableItem__buttons} ${styles.tableItem__row}`}>
        {dashboardItemMenuOpen && (
          <DashboardItemContextMenu
            isFileItem={isFileItem}
            setDashboardItemContextMenuOpen={setDashboardItemContextMenuOpen}
            loadingOpen={loadingOpen}
            loadingDownload={loadingDownload}
            loadingDelete={loadingDelete}
            handleOpen={handleOpen}
            handleDownload={handleDownload}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        )}
        <ButtonIcon
          iconUrl="/svg/dashboard-page-sprite.svg#ellipsis"
          onClick={handleEllipsis}
          className={styles.tableButton__ellipsis}
        />
        {isFileItem && (
          <ButtonIcon
            iconUrl="/svg/dashboard-page-sprite.svg#open"
            onClick={handleOpen}
            loading={loadingOpen}
            disabled={loadingDownload || loadingDelete}
            className={styles.tableButton__open}
          />
        )}
        {isFileItem && (
          <ButtonIcon
            iconUrl="/svg/dashboard-page-sprite.svg#download"
            onClick={handleDownload}
            loading={loadingDownload}
            disabled={loadingOpen || loadingDelete}
            className={styles.tableButton__download}
          />
        )}
        <ButtonIcon
          iconUrl="/svg/settings-sprite.svg#update"
          onClick={handleUpdate}
          disabled={loadingOpen || loadingDelete || loadingDownload}
          className={styles.tableButton__update}
        />
        <ButtonIcon
          iconUrl="/svg/settings-sprite.svg#delete"
          onClick={handleDelete}
          loading={loadingDelete}
          disabled={loadingOpen || loadingDownload}
          className={styles.tableButton__delete}
        />
      </span>
      {portalRef.current &&
        updateFolderModalOpen &&
        isFolder(item) &&
        createPortal(
          <FolderUpdateModal
            folderId={item.id}
            folderName={item.folderName}
            isPublic={item.isPublic}
            setUpdateFolderModalOpen={setUpdateFolderModalOpen}
            forceUpdate={forceUpdate}
          />,
          portalRef.current,
        )}
      {portalRef.current &&
        updateFileModalOpen &&
        isFile(item) &&
        createPortal(
          <FileUpdateModal
            fileId={item.id}
            fileName={item.fileName}
            isPublic={item.isPublic}
            setUpdateFileModalOpen={setUpdateFileModalOpen}
            forceUpdate={forceUpdate}
          />,
          portalRef.current,
        )}
    </div>
  );
}, areDashboardItemEqual);
