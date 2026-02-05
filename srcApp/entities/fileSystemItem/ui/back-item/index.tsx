import { memo, useState } from "react";
import Image from "next/image";
import { areBackItemEqual } from "@/srcApp/entities/fileSystemItem/model/areBackItemEqual";
import { Dnd } from "@/srcApp/pages/dashboard/model/types/dnd";
import styles from "./styles.module.css";

export type BackItemProps = {
  grandParentId: string | null;
  dndRef: React.MutableRefObject<Dnd>;

  routerBack: () => void;
};

export const BackItem = memo(function ({
  grandParentId,
  dndRef,
  routerBack,
}: BackItemProps) {
  const [dragEnter, setDragEnter] = useState(false);
  function handleDragOver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
  }

  function handleDragEnter(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    setDragEnter(true);
  }

  function handleDragLeave(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();

    if (e.currentTarget.contains(e.relatedTarget as Node)) return;

    setDragEnter(false);
  }

  function handleDrop() {
    dndRef.current.droppable = grandParentId;
    setDragEnter(false);
  }

  const onClick = () => {
    routerBack();
  };
  return (
    <div
      className={`${styles.backItem} ${dragEnter && styles.backItem__dragEnter}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={onClick}
    >
      <span className={styles.backItem__icon}>
        <Image
          src="/img/storage/open_folder.png"
          fill={true}
          alt={`Folder up image`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </span>
      <span className={styles.backItem__text}>Up one level</span>
    </div>
  );
}, areBackItemEqual);
