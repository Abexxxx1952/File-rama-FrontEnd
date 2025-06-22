import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getFileIconUrl } from "@/srcApp/entities/fileSystemItem/model/getFileIconUrl";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { Icon } from "@/srcApp/shared/ui/icon";
import { createPortal } from "react-dom";
import { deleteFile } from "../../model/deleteFile";
import { deleteFolder } from "../../model/deleteFolder";
import { downloadFile } from "../../model/downloadFile";
import { isFile } from "../../model/isFile";
import { isFolder } from "../../model/isFolder";
import { FileUpdateModal } from "../file-update-modal";
import { FolderUpdateModal } from "../folder-update-modal";
import { DashboardItemContextMenu } from "./dashboardItem-context-menu";
import styles from "./styles.module.css";

type DashboardItemProps = {
  item: FileSystemItem;
  forceUpdate: () => void;
};

export function DashboardItem({ item, forceUpdate }: DashboardItemProps) {
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

  return (
    <div className={styles.tableItem}>
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
            loadingDownload={loadingDownload}
            loadingDelete={loadingDelete}
            handleDownload={handleDownload}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        )}
        <Icon
          link="/svg/dashboard-page-sprite.svg#ellipsis"
          className={styles.tableButton__ellipsis}
          onClick={handleEllipsis}
        />
        {isFileItem && (
          <Icon
            link={
              loadingDownload
                ? "/svg/settings-sprite.svg#loading"
                : "/svg/dashboard-page-sprite.svg#download"
            }
            className={`${styles.tableButton__download}  ${loadingDownload && styles.tableButton__loading}`}
            onClick={handleDownload}
          />
        )}
        <Icon
          link="/svg/settings-sprite.svg#update"
          className={styles.tableButton__update}
          onClick={handleUpdate}
        />
        <Icon
          link={
            loadingDelete
              ? "/svg/settings-sprite.svg#loading"
              : "/svg/settings-sprite.svg#delete"
          }
          className={`${styles.tableButton__delete} ${loadingDelete && styles.tableButton__loading}`}
          onClick={handleDelete}
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
}
