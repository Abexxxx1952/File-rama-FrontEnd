import { useState } from "react";
import Image from "next/image";
import { getFileIconUrl } from "@/srcApp/entities/fileSystemItem/model/getFileIconUrl";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { Icon } from "@/srcApp/shared/ui/icon";
import { deleteFolder } from "../../model/deleteFolder";
import { isFile } from "../../model/isFile";
import styles from "./styles.module.css";

type DashboardItemProps = {
  item: FileSystemItem;
  forceUpdate: () => void;
};

export function DashboardItem({ item, forceUpdate }: DashboardItemProps) {
  const [loading, setLoading] = useState(false);
  const isFileItem = isFile(item);

  function handleDeleteFolder() {
    (async () => {
      await deleteFolder(item.id, setLoading);
      forceUpdate();
    })();
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
        {isFileItem ? item.fileSize : null}
      </span>
      <span
        className={`${styles.tableItem__uploadDate} ${styles.tableItem__row}`}
      >
        {isFileItem ? item.uploadDate : item.createdDate}
      </span>
      <span className={`${styles.tableItem__public} ${styles.tableItem__row}`}>
        {item.isPublic}
      </span>
      <span className={`${styles.tableItem__buttons} ${styles.tableItem__row}`}>
        <Icon
          link="/svg/settings-sprite.svg#update"
          className={styles.tableButton__update}
        />
        <Icon
          link={
            loading
              ? "/svg/settings-sprite.svg#loading"
              : "/svg/settings-sprite.svg#delete"
          }
          className={`${styles.tableButton__delete} ${loading ? styles.tableButton__loading : ""}`}
          onClick={handleDeleteFolder}
        />
      </span>
    </div>
  );
}
