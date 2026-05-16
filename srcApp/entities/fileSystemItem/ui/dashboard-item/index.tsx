import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import { areDashboardItemEqual } from "@/srcApp/entities/fileSystemItem/model/areDashboardItemEqual";
import { formatDate } from "@/srcApp/entities/fileSystemItem/model/formatDate";
import { getFileIconUrl } from "@/srcApp/entities/fileSystemItem/model/getFileIconUrl";
import { isFile } from "@/srcApp/entities/fileSystemItem/model/isFile";
import {
  AnimationStage,
  type AnimationStageValues,
} from "@/srcApp/entities/fileSystemItem/model/types/animationStage";
import type { DeleteHandlerArgs } from "@/srcApp/entities/fileSystemItem/model/types/deleteHandlerArgs";
import type { DoubleClickMeta } from "@/srcApp/entities/fileSystemItem/model/types/doubleClickHandlerArgs";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { FileSystemItemPermissions } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItemPermissions";
import type { OneClickMeta } from "@/srcApp/entities/fileSystemItem/model/types/oneClickHandlerArgs";
import type { Dnd } from "@/srcApp/pages/dashboard/model/types/dnd";
import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { ButtonIcon } from "@/srcApp/shared/ui/button-icon";
import { Icon } from "@/srcApp/shared/ui/icon";

import { DashboardItemContextMenu } from "./dashboardItem-context-menu";
import { DraggablePreviewItemContent } from "./draggable-preview-item-content";
import styles from "./styles.module.css";

export type DashboardItemProps = {
  item: FileSystemItem;
  index: number;
  forceUpdate: () => void;
  isSelected: boolean;
  oneClickHandler: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    meta: OneClickMeta
  ) => void;
  handleOpen: (meta: DoubleClickMeta) => void;
  handleDownload: (
    id: string,
    setLoadingDownload: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
  handleUpdate: (isFile: boolean, item: FileSystemItem) => void;
  handleDelete: (deleteHandlerArgs: DeleteHandlerArgs) => Promise<void>;
  isDraggable: boolean;
  dndRef: React.RefObject<Dnd>;
  cursorPosition: React.RefObject<{
    x: number;
    y: number;
  }>;
  draggableQuantity: number;
};

export const DashboardItem = memo(function DashboardItem({
  item,
  index,
  forceUpdate,
  isSelected,
  oneClickHandler,
  handleOpen,
  handleDownload,
  handleUpdate,
  handleDelete,
  isDraggable,
  dndRef,
  cursorPosition,
  draggableQuantity,
}: DashboardItemProps) {
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const isFileItem = isFile(item);
  const [dashboardItemMenuOpen, setDashboardItemContextMenuOpen] =
    useState<boolean>(false);
  const [dragEnter, setDragEnter] = useState(false);
  const [stage, setStage] = useState<AnimationStageValues>(
    AnimationStage.SHRINK
  );
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const previewRef = useRef<HTMLDivElement | null>(null);

  const body = document.querySelector("body");
  const draggableMoreThenOne = draggableQuantity > 1;

  useKeyboardHandler(body, [
    ["Escape", () => setDashboardItemContextMenuOpen(false)],
  ]);

  useLayoutEffect(() => {
    if (previewRef.current && stage === AnimationStage.FLY) {
      const rect = previewRef.current.getBoundingClientRect();

      setStartPos({ x: rect.left, y: rect.top });
    }
    if (!isDraggable) {
      return;
    }

    const timerId = setTimeout(() => {
      if (stage === AnimationStage.SHRINK) {
        setStage(AnimationStage.FLY);
      }
      if (stage === AnimationStage.FLY) {
        setStage(AnimationStage.FOLLOW);
      }
    }, 300);

    return () => {
      clearTimeout(timerId);
      setStartPos({ x: 0, y: 0 });
    };
  }, [stage, isDraggable]);

  useEffect(() => {
    if (!isDraggable) {
      setStage(AnimationStage.SHRINK);
    }
  }, [isDraggable]);

  useEffect(() => {
    if (stage !== AnimationStage.FOLLOW) {
      return;
    }

    const el = previewRef.current;
    if (!el) {
      return;
    }

    let animationFrameId: number;

    const updatePosition = () => {
      el.style.left = `${cursorPosition.current.x - startPos.x}px`;
      el.style.top = `${cursorPosition.current.y}px`;
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stage]);

  const handleEllipsis = useCallback(() => {
    setDashboardItemContextMenuOpen((prev) => !prev);
  }, []);

  const handleDownloadWrapper = useCallback(async () => {
    await handleDownload(item.id, setLoadingDownload);
  }, [handleDownload, item.id]);

  const handleDeleteWrapper = useCallback(async () => {
    await handleDelete({ isFileItem, id: item.id, setLoadingDelete });
  }, [handleDelete, isFileItem, item.id]);

  const oneClickHandlerWrapper = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      oneClickHandler(e, { id: item.id, isFileItem, index });
    },
    [oneClickHandler, item.id, isFileItem, index]
  );

  const doubleClickHandlerWrapper = useCallback(() => {
    handleOpen({
      isFileItem,
      id: item.id,
      folderName: isFileItem ? "" : item?.folderName,
      setLoadingOpen,
    });
  }, [handleOpen, isFileItem, item]);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setDragImage(document.createElement("img"), 0, 0);
      isFileItem
        ? dndRef.current.draggable.set(item.id, {
            fileId: item.id,
          })
        : dndRef.current.draggable.set(item.id, {
            folderId: item.id,
          });

      forceUpdate();
    },
    [isFileItem, item.id, dndRef, forceUpdate]
  );

  function handleDragOver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
  }

  function handleDragEnter(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (isFileItem || isSelected) {
      return;
    }
    e.preventDefault();
    setDragEnter(true);
  }

  function handleDragLeave(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();

    if (isFileItem || isSelected) {
      return;
    }
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setDragEnter(false);
  }

  function handleDrop() {
    if (isFileItem || isSelected) {
      return;
    }
    const draggableItem = dndRef.current.draggable.values().next().value;
    if (
      draggableItem &&
      "folderId" in draggableItem &&
      draggableItem.folderId === item.id
    ) {
      return;
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
        onClick={oneClickHandlerWrapper}
        onDoubleClick={doubleClickHandlerWrapper}
      >
        <span className={`${styles.tableItem__name} ${styles.tableItem__row}`}>
          {isFileItem ? (
            <span className={styles.tableItem__icon}>
              <Image
                src={`/img/storage/${getFileIconUrl(item.fileExtension)}`}
                fill={true}
                alt="File image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </span>
          ) : (
            <span className={styles.tableItem__icon}>
              <Image
                src="/img/storage/folder.png"
                fill={true}
                alt="Folder image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </span>
          )}
          <span className={styles.tableItem__text}>
            {isFileItem
              ? `${item.fileName}.${item.fileExtension}`
              : item.folderName}
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
          className={`${styles.tableItem__publicRead} ${styles.tableItem__row}`}
        >
          {isFileItem &&
            (item.publicAccessRole === FileSystemItemPermissions.READER ||
              item.publicAccessRole === FileSystemItemPermissions.WRITER) && (
              <Icon
                link="/svg/isPublic-sprite.svg#reader"
                className={styles.tableItem__publicReadIcon}
              />
            )}
        </span>
        <span
          className={`${styles.tableItem__publicWrite} ${styles.tableItem__row}`}
        >
          {isFileItem &&
            item.publicAccessRole === FileSystemItemPermissions.WRITER && (
              <Icon
                link="/svg/isPublic-sprite.svg#writer"
                className={styles.tableItem__publicWriteIcon}
              />
            )}
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
              handleOpen={doubleClickHandlerWrapper}
              handleDownload={handleDownloadWrapper}
              handleUpdate={() => handleUpdate(isFileItem, item)}
              handleDelete={handleDeleteWrapper}
            />
          )}
          <ButtonIcon
            iconUrl="/svg/dashboard-page-sprite.svg#ellipsis"
            onClick={handleEllipsis}
            className={styles.tableButton__ellipsis}
          />
          <ButtonIcon
            iconUrl="/svg/dashboard-page-sprite.svg#open"
            onClick={doubleClickHandlerWrapper}
            loading={loadingOpen}
            disabled={loadingDownload || loadingDelete}
            className={styles.tableButton__open}
          />
          {isFileItem && (
            <ButtonIcon
              iconUrl="/svg/dashboard-page-sprite.svg#download"
              onClick={handleDownloadWrapper}
              loading={loadingDownload}
              disabled={loadingOpen || loadingDelete}
              className={styles.tableButton__download}
            />
          )}
          <ButtonIcon
            iconUrl="/svg/settings-sprite.svg#update"
            onClick={() => handleUpdate(isFileItem, item)}
            disabled={loadingOpen || loadingDelete || loadingDownload}
            className={styles.tableButton__update}
          />
          <ButtonIcon
            iconUrl="/svg/settings-sprite.svg#delete"
            onClick={handleDeleteWrapper}
            loading={loadingDelete}
            disabled={loadingOpen || loadingDownload}
            className={styles.tableButton__delete}
          />
        </span>
      </div>
      {isDraggable && (
        <div
          className={`${styles.previewItem} ${stage === AnimationStage.FOLLOW && styles.previewItem_follow} ${stage === AnimationStage.FLY && styles.previewItem_fly}`}
          ref={previewRef}
          style={
            stage === AnimationStage.FLY
              ? {
                  transform: `translate(
                  ${cursorPosition.current.x - startPos.x}px,
                  ${cursorPosition.current.y - startPos.y}px
                )`,
                }
              : stage === AnimationStage.SHRINK
                ? { top: startPos.y, left: startPos.x }
                : undefined
          }
        >
          <DraggablePreviewItemContent item={item} />
          {draggableMoreThenOne && stage === AnimationStage.FOLLOW && (
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
