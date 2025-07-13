"use client";

import Image from "next/image";
import { getFileIconUrl } from "@/srcApp/entities/fileSystemItem/model/getFileIconUrl";
import { isFile } from "@/srcApp/entities/fileSystemItem/model/isFile";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import styles from "./styles.module.css";

type DraggablePreviewItemContentProps = {
  item: FileSystemItem;
};
export function DraggablePreviewItemContent({
  item,
}: DraggablePreviewItemContentProps) {
  const isFileItem = isFile(item);
  return (
    <span className={`${styles.previewItem__name} ${styles.tableItem__row}`}>
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
  );
}
