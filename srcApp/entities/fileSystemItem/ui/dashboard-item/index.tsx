import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { areDashboardItemEqual } from "@/srcApp/entities/fileSystemItem/model/areDashboardItemEqual";
import { deleteFile } from "@/srcApp/entities/fileSystemItem/model/deleteFile";
import { deleteFolder } from "@/srcApp/entities/fileSystemItem/model/deleteFolder";
import { downloadFile } from "@/srcApp/entities/fileSystemItem/model/downloadFile";
import { getFileIconUrl } from "@/srcApp/entities/fileSystemItem/model/getFileIconUrl";
import { isFile } from "@/srcApp/entities/fileSystemItem/model/isFile";
import { isFolder } from "@/srcApp/entities/fileSystemItem/model/isFolder";
import { openFile } from "@/srcApp/entities/fileSystemItem/model/openFile";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import type { Dnd } from "@/srcApp/pages/dashboard/model/types/dnd";
import type { SelectedMap } from "@/srcApp/pages/dashboard/model/types/selectedMap";
import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { ButtonIcon } from "@/srcApp/shared/ui/button-icon";
import { createPortal } from "react-dom";
import { FileUpdateModal } from "../file-update-modal";
import { FolderUpdateModal } from "../folder-update-modal";
import { DashboardItemContextMenu } from "./dashboardItem-context-menu";
import { DraggablePreviewItemContent } from "./draggable-preview-item-content";
import styles from "./styles.module.css";

export type DashboardItemProps = {
  item: FileSystemItem;
  index: number;
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  setParentFolderId: React.Dispatch<React.SetStateAction<string[]>>;
  forceUpdate: () => void;
  isSelected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<SelectedMap>>;
  dndRef: React.MutableRefObject<Dnd>;
  isDraggable: boolean;
  cursorPosition: React.MutableRefObject<{
    x: number;
    y: number;
  }>;
  draggableQuantity: number;
};

export const DashboardItem = memo(function ({
  item,
  index,
  setPath,
  setParentFolderId,
  forceUpdate,
  isSelected,
  setSelected,
  dndRef,
  isDraggable,
  cursorPosition,
  draggableQuantity,
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

  const [dragEnter, setDragEnter] = useState(false);
  const [stage, setStage] = useState<"shrink" | "fly" | "follow">("shrink");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const portalRef = useRef<HTMLElement | null>(null);

  const previewRef = useRef<HTMLDivElement | null>(null);

  const body = document.querySelector("body");
  const draggableMoreThenOne = draggableQuantity > 1;

  useKeyboardHandler(body, [
    ["Escape", () => setDashboardItemContextMenuOpen(false)],
  ]);

  useEffect(() => {
    portalRef.current = document.getElementById("portal");
  }, []);

  useLayoutEffect(() => {
    if (previewRef.current && stage === "fly") {
      const rect = previewRef.current.getBoundingClientRect();

      setStartPos({ x: rect.left, y: rect.top });
    }
    if (!isDraggable) return;

    const timerId = setTimeout(() => {
      if (stage === "shrink") setStage("fly");
      if (stage === "fly") setStage("follow");
    }, 300);

    return () => {
      clearTimeout(timerId);
      setStartPos({ x: 0, y: 0 });
    };
  }, [stage, isDraggable]);

  useEffect(() => {
    if (!isDraggable) {
      setStage("shrink");
    }
  }, [isDraggable]);

  useEffect(() => {
    if (stage !== "follow") return;

    const el = previewRef.current;
    if (!el) return;

    let animationFrameId: number;

    const updatePosition = () => {
      el.style.left = cursorPosition.current.x - startPos.x + "px";
      el.style.top = cursorPosition.current.y - startPos.y + "px";
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stage]);

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
        await openFile(item.id, setLoadingOpen);
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

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setDragImage(document.createElement("img"), 0, 0);
    dndRef.current.draggable = [
      isFileItem ? { fileId: item.id } : { folderId: item.id },
    ];
  }

  function handleDragOver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {}

  function handleDragEnter(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!isFileItem && !isSelected) {
      e.preventDefault();
      setDragEnter(true);
    }
  }

  function handleDragLeave(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    if (
      !isFileItem &&
      !isSelected &&
      !e.currentTarget.contains(e.relatedTarget as Node)
    ) {
      setDragEnter(false);
    }
  }

  function handleDrop() {
    if (isFileItem || isSelected) return;
    const draggableItem = dndRef.current.draggable?.[0];
    if (draggableItem && "folderId" in draggableItem) {
      if (draggableItem.folderId === item.id) {
        return;
      }
    }
    dndRef.current.droppable = item.id;
    setDragEnter(false);
  }

  return (
    <div className={styles.tableItemContainer}>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`${styles.tableItem} ${isSelected && styles.tableItem__selected} ${dragEnter && styles.tableItem__dragEnter} ${isDraggable && styles.tableItem__dragStart}`}
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
        <span
          className={`${styles.tableItem__public} ${styles.tableItem__row}`}
        >
          {item.isPublic}
        </span>
        <span
          className={`${styles.tableItem__buttons} ${styles.tableItem__row}`}
        >
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

      {isDraggable && (
        <div
          className={`${styles.previewItem} ${stage === "follow" && draggableMoreThenOne && styles.previewItem_follow}`}
          ref={previewRef}
          style={
            stage === "fly"
              ? {
                  left: 0,
                  top: 0,
                  transform: `translate(
                  ${cursorPosition.current.x - startPos.x}px,
                  ${cursorPosition.current.y - startPos.y}px
                )`,

                  transition: "transform 0.3s ease",
                }
              : stage === "shrink"
                ? { top: startPos.y, left: startPos.x }
                : undefined
          }
        >
          <DraggablePreviewItemContent item={item} />
          {draggableMoreThenOne && stage === "follow" && (
            <div className={styles.previewItem__backElement}>
              <div className={styles.previewItem__quantity}>
                {draggableQuantity}
              </div>
              <DraggablePreviewItemContent item={item} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}, areDashboardItemEqual);
