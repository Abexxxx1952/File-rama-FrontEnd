import Image from "next/image";
import { getFileIconUrl } from "@/srcApp/entities/fileSystemItem/model/getFileIconUrl";
import { FileSystemItemType } from "@/srcApp/entities/fileSystemItem/model/types";
import { isFile } from "../../model/isFile";
import styles from "./styles.module.css";

export function FileSystemItem({ item }: { item: FileSystemItemType }) {
  const isFileItem = isFile(item);

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
    </div>
  );
}
