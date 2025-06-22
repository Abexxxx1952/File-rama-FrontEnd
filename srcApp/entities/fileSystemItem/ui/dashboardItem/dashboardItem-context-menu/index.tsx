"use client";

import { useRef } from "react";
import { useClickOutside } from "@/srcApp/shared/hooks/useClickOutside";
import { Icon } from "@/srcApp/shared/ui/icon";
import styles from "./styles.module.css";

type DashboardItemContextMenuProps = {
  isFileItem: boolean;
  setDashboardItemContextMenuOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  loadingDownload: boolean;
  loadingDelete: boolean;
  handleDownload: () => void;
  handleUpdate: () => void;
  handleDelete: () => void;
};

export function DashboardItemContextMenu({
  isFileItem,
  setDashboardItemContextMenuOpen,
  loadingDownload,
  loadingDelete,
  handleDownload,
  handleUpdate,
  handleDelete,
}: DashboardItemContextMenuProps) {
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(contextMenuRef, () => {
    setDashboardItemContextMenuOpen(false);
  });

  function handleContextMenuDownload() {
    (async () => {
      await handleDownload();
      setDashboardItemContextMenuOpen(false);
    })();
  }

  function handleContextMenuUpdate() {
    handleUpdate();
    setDashboardItemContextMenuOpen(false);
  }

  return (
    <div ref={contextMenuRef} className={styles.contextMenu}>
      <ul className={styles.contextMenu__list}>
        {isFileItem && (
          <li className={styles.list__item} onClick={handleContextMenuDownload}>
            <Icon
              link={
                loadingDownload
                  ? "/svg/settings-sprite.svg#loading"
                  : "/svg/dashboard-page-sprite.svg#download"
              }
              className={`${styles.contextButton__download} ${loadingDownload && styles.contextButton__loading}`}
            />
            <span className={styles.contextButton__text}>Download</span>
          </li>
        )}
        <li className={styles.list__item} onClick={handleContextMenuUpdate}>
          <Icon
            link="/svg/settings-sprite.svg#update"
            className={styles.contextButton__update}
          />
          <span className={styles.contextButton__text}>Edit</span>
        </li>
        <li className={styles.list__item} onClick={handleDelete}>
          <Icon
            link={
              loadingDelete
                ? "/svg/settings-sprite.svg#loading"
                : "/svg/settings-sprite.svg#delete"
            }
            className={`${styles.contextButton__delete} ${loadingDelete && styles.contextButton__loading}`}
          />
          <span className={styles.contextButton__text}>Delete</span>
        </li>
      </ul>
    </div>
  );
}
