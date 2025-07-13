"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { deleteMany } from "@/srcApp/entities/fileSystemItem/model/deleteMany";
import { getFileSystemItems } from "@/srcApp/entities/fileSystemItem/model/getFileSystemItem";
import { FetchDeleteMany } from "@/srcApp/entities/fileSystemItem/model/types/fetchDeleteMany";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { updateMany } from "@/srcApp/entities/fileSystemItem/model/updateMany";
import {
  DashboardItem,
  FolderCreateModal,
} from "@/srcApp/entities/fileSystemItem/ui";
import { EmptyItem } from "@/srcApp/entities/fileSystemItem/ui/empty-item";
import { FileCreateModal } from "@/srcApp/entities/fileSystemItem/ui/file-create-modal";
import { Options } from "@/srcApp/features/options/ui";
import { Search } from "@/srcApp/features/search/ui";
import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { createPortal } from "react-dom";
import { selectBetween } from "../model/selectBetween";
import type { Dnd } from "../model/types/dnd";
import type { Draggable } from "../model/types/draggable";
import type { SelectedMap } from "../model/types/selectedMap";
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
  const [selected, setSelected] = useState<SelectedMap>(new Map());

  const portalRef = useRef<HTMLElement | null>(null);
  const dndRef = useRef<Dnd>({ draggable: [], droppable: "" });
  const cursorPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    portalRef.current = document.getElementById("portal");
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelected(new Map());
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: MouseEvent) {
      if (event.shiftKey) {
        selectBetween(selected, fileSystemItems!, setSelected);
      }
    }

    window.addEventListener("click", handleKeyDown);

    return () => {
      window.removeEventListener("click", handleKeyDown);
    };
  }, [selected, fileSystemItems]);

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

  function forceUpdate() {
    setVersion((v) => v + 1);
  }

  function isSelected(id?: string): boolean {
    if (id && selected.size > 0) return selected.has(id);
    if (selected.size > 0) {
      return true;
    }
    return false;
  }

  function isDraggable(id: string): boolean {
    return dndRef.current.draggable.some((draggableItem) => {
      if ("folderId" in draggableItem) {
        return draggableItem.folderId === id;
      }
      if ("fileId" in draggableItem) {
        return draggableItem.fileId === id;
      }
      return false;
    });
  }

  function draggableMoreThenOne(selected: SelectedMap): boolean {
    return selected.size > 1;
  }

  const selectedMapped = useMemo(() => {
    const result: FetchDeleteMany = [];

    selected.forEach(({ index, ...id }) => {
      result.push(id);
    });

    return result;
  }, [selected]);

  async function handleDelete(
    setLoadingDelete: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    await deleteMany(selectedMapped, setLoadingDelete);
    setSelected(new Map());
    forceUpdate();
  }

  async function handleDragStart() {
    if (selected.size > 0) {
      const currentDraggableItem = dndRef.current.draggable[0];

      if (!currentDraggableItem) return;

      let id: string | undefined;

      if ("folderId" in currentDraggableItem) {
        id = currentDraggableItem.folderId;
      }
      if ("fileId" in currentDraggableItem) {
        id = currentDraggableItem.fileId;
      }

      if (!id || !selected.has(id)) {
        setSelected(new Map());
        return;
      }

      const draggable: Draggable = [];
      selected.forEach((value) => {
        const { index, ...rest } = value;
        draggable.push(rest);
      });

      dndRef.current.draggable = draggable;
    }
    forceUpdate();
  }

  function handleDragOver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    cursorPositionRef.current = { x: e.clientX, y: e.clientY };
  }
  async function handleDrop(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    const dropItemId = dndRef.current.droppable;
    if (dropItemId === "") return;
    const selectedToUpdate = dndRef.current.draggable.map((item) => ({
      ...item,
      parentFolderId: dropItemId,
    }));

    await updateMany(selectedToUpdate);
    setSelected(new Map());
  }

  function handleDragEnd(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    dndRef.current = { draggable: [], droppable: "" };
    forceUpdate();
  }

  if (!fileSystemItems) {
    return null;
  }

  return (
    <>
      <Search />
      <Options
        path={path}
        setPath={setPath}
        setParentFolderId={setParentFolderId}
        isSelected={isSelected()}
        handleDelete={handleDelete}
      />
      <div className={styles.storage__content}>
        <div
          className={styles.storage__table}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        >
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
          {fileSystemItems.map((elem, index) => {
            return (
              <DashboardItem
                key={elem.id}
                item={elem}
                index={index}
                setPath={setPath}
                setParentFolderId={setParentFolderId}
                forceUpdate={forceUpdate}
                isSelected={isSelected(elem.id)}
                setSelected={setSelected}
                dndRef={dndRef}
                isDraggable={isDraggable(elem.id)}
                cursorPosition={cursorPositionRef}
                draggableQuantity={selected.size}
              />
            );
          })}
        </div>
        <div className={styles.dashboard__extraItem}>
          <div className={styles.dashboard__addButton}>
            <Button
              text="+ Add File"
              className={styles.dashboard__button}
              onClick={() => setAddFileModalOpen(true)}
            />
          </div>
          <div className={styles.dashboard__addButton}>
            <Button
              text="+ Create Folder"
              className={styles.dashboard__button}
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
