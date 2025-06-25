"use client";

import { useEffect, useRef, useState } from "react";
import { getFileSystemItems } from "@/srcApp/entities/fileSystemItem/model/getFileSystemItem";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import {
  DashboardItem,
  FolderCreateModal,
} from "@/srcApp/entities/fileSystemItem/ui";
import { EmptyItem } from "@/srcApp/entities/fileSystemItem/ui/emptyItem";
import { FileCreateModal } from "@/srcApp/entities/fileSystemItem/ui/file-create-modal";
import { Options } from "@/srcApp/features/options/ui";
import { Search } from "@/srcApp/features/search/ui";
import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

export function DashboardPage() {
  const [fileSystemItems, setFileSystemItems] = useState<
    FileSystemItem[] | null
  >();
  const [addFolderModalOpen, setAddFolderModalOpen] = useState<boolean>(false);
  const [addFileModalOpen, setAddFileModalOpen] = useState<boolean>(false);
  const [version, setVersion] = useState(0);
  const [path, setPath] = useState<string[]>([":/"]);
  const [parentFolderId, setParentFolderId] = useState<string[]>([]);
  const portalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRef.current = document.getElementById("portal");
  }, []);

  useEffect(() => {
    (async () => {
      let fileSystemItems: FileSystemItem[] | null = null;
      if (parentFolderId.length === 0) {
        fileSystemItems = await getFileSystemItems();
      }
      if (parentFolderId.length > 0) {
        fileSystemItems = await getFileSystemItems(
          parentFolderId[parentFolderId.length - 1],
        );
      }

      setFileSystemItems(fileSystemItems);
    })();
  }, [version, parentFolderId]);

  if (!fileSystemItems) {
    return null;
  }
  const forceUpdate = () => setVersion((v) => v + 1);
  return (
    <>
      <Search />
      <Options
        path={path}
        setPath={setPath}
        setParentFolderId={setParentFolderId}
      />
      <div className={styles.storage__content}>
        <div className={styles.storage__table}>
          <div className={styles.tableHeader}>
            <span
              className={`${styles.tableHeader__name} ${styles.tableHeader__column}`}
            >
              Name
            </span>

            <span
              className={`${styles.tableHeader__size} ${styles.tableHeader__column}`}
            >
              Size
            </span>
            <span
              className={`${styles.tableHeader__uploadDate} ${styles.tableHeader__column}`}
            >
              Upload Date
            </span>
            <span
              className={`${styles.tableHeader__public} ${styles.tableHeader__column}`}
            >
              Public
            </span>
          </div>
          {fileSystemItems.length === 0 && <EmptyItem />}
          {fileSystemItems.map((elem) => {
            return (
              <DashboardItem
                key={elem.id}
                item={elem}
                setPath={setPath}
                setParentFolderId={setParentFolderId}
                forceUpdate={forceUpdate}
              />
            );
          })}
        </div>
        <div className={styles.dashboard__extraItem}>
          <div className={styles.dashboard__addButton}>
            <Button
              text="+ Add File"
              backgroundColor="rgba(116, 181, 227,0.5)"
              onClick={() => setAddFileModalOpen(true)}
            />
          </div>
          <div className={styles.dashboard__addButton}>
            <Button
              text="+ Create Folder"
              backgroundColor="rgba(116, 181, 227,0.5)"
              onClick={() => setAddFolderModalOpen(true)}
            />
          </div>
          <div className={styles.dashboard__usageSize}>
            <div className={styles.dashboard__usageSizeHeader}>
              <Icon
                link="/svg/dashboard-page-sprite.svg#cloud"
                className={styles.dashboard__cloudIcon}
                viewBox="0 0 36 36"
              />
              <span className={styles.dashboard__usageSizeTitle}>
                My Storage
              </span>
            </div>
            <div className={styles.dashboard__usageSizeValue}>
              <span className={styles.dashboard__totalValue}></span>
              <span className={styles.dashboard__usageValue}></span>
            </div>
            <span className={styles.dashboard__usageSizeText}>
              Used 5 GB out of 15 GB.
            </span>
          </div>
        </div>
      </div>
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
    </>
  );
}
