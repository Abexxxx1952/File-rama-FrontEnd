"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { deleteMany } from "@/srcApp/entities/fileSystemItem/model/deleteMany";
import type { FetchDeleteMany } from "@/srcApp/entities/fileSystemItem/model/types/fetchDeleteMany";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import {
  DashboardExtraItem,
  DashboardItem,
  EmptyItem,
} from "@/srcApp/entities/fileSystemItem/ui";
import { getStat } from "@/srcApp/entities/stats/model/getStat";
import type { Stat } from "@/srcApp/entities/stats/model/types/stat";
import { Options } from "@/srcApp/features/options/ui";
import { Search } from "@/srcApp/features/search/ui";
import { DashboardModals } from "@/srcApp/widgets/dashboard-modals";
import { DashboardTableHeader } from "@/srcApp/widgets/dashboard-table-header";
import { useDashboardDnd } from "../model/hooks/useDashboardDnd";
import { useDashboardItemActions } from "../model/hooks/useDashboardItemActions";
import { useFileSystem } from "../model/hooks/useFileSystem";
import { useSearch } from "../model/hooks/useSearch";
import { useSelection } from "../model/hooks/useSelection";
import { selectBetween } from "../model/selectBetween";
import styles from "./styles.module.css";

export function DashboardPage() {
  const [parentFolderId, setParentFolderId] = useState<string[]>([]);
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState("");
  const fileSystemItems = useFileSystem(parentFolderId, version);
  const filteredFileSystemItems = useSearch(fileSystemItems, search);
  const { selected, setSelected, isSelected, toggle, clear } = useSelection();
  const {
    dndRef,
    cursorPositionRef,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    isDraggable,
  } = useDashboardDnd(selected, forceUpdate);
  const [currentFileSystemItem, setCurrentFileSystemItem] =
    useState<FileSystemItem | null>(null);
  const [stat, setStat] = useState<Stat | null>();
  const [addFolderModalOpen, setAddFolderModalOpen] = useState<boolean>(false);
  const [addFileModalOpen, setAddFileModalOpen] = useState<boolean>(false);
  const [path, setPath] = useState<string[]>([":/"]);
  const [updateFolderModalOpen, setUpdateFolderModalOpen] =
    useState<boolean>(false);
  const [updateFileModalOpen, setUpdateFileModalOpen] =
    useState<boolean>(false);

  const {
    oneClickHandler,
    doubleClickHandler,
    handleOpen,
    handleDownload,
    handleUpdate,
    handleDelete,
  } = useDashboardItemActions({
    toggle,
    forceUpdate,
    setPath,
    setParentFolderId,
    setCurrentFileSystemItem,
    setUpdateFileModalOpen,
    setUpdateFolderModalOpen,
  });

  const portalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRef.current = document.getElementById("portal");
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        clear();
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
      const stat = await getStat();

      setStat(stat);
    })();
  }, [version]);

  function forceUpdate() {
    setVersion((v) => v + 1);
  }

  const selectedMapped = useMemo(() => {
    const result: FetchDeleteMany = [];

    selected.forEach(({ index, ...id }) => {
      result.push(id);
    });

    return result;
  }, [selected]);

  async function handleDeleteMany(
    setLoadingDelete: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    await deleteMany(selectedMapped, setLoadingDelete);
    clear();
    forceUpdate();
  }

  if (!fileSystemItems) {
    return null;
  }

  return (
    <>
      <Search setSearch={setSearch} />
      <Options
        path={path}
        setPath={setPath}
        setParentFolderId={setParentFolderId}
        isSelected={isSelected()}
        handleDeleteMany={handleDeleteMany}
      />
      <div className={styles.storage__content}>
        <div
          className={styles.storage__table}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
        >
          <DashboardTableHeader />
          {filteredFileSystemItems.length === 0 && <EmptyItem />}
          {filteredFileSystemItems.map((elem, index) => {
            return (
              <DashboardItem
                key={elem.id}
                item={elem}
                index={index}
                forceUpdate={forceUpdate}
                isSelected={isSelected(elem.id)}
                oneClickHandler={oneClickHandler}
                doubleClickHandler={doubleClickHandler}
                handleOpen={handleOpen}
                handleDownload={handleDownload}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                dndRef={dndRef}
                isDraggable={isDraggable(elem.id)}
                cursorPosition={cursorPositionRef}
                draggableQuantity={selected.size}
              />
            );
          })}
        </div>
        <DashboardExtraItem
          usedSize={stat?.usedSize || 0}
          totalSize={stat?.totalSize || 0}
          setAddFileModalOpen={setAddFileModalOpen}
          setAddFolderModalOpen={setAddFolderModalOpen}
        />
      </div>
      <DashboardModals
        portalRef={portalRef}
        addFolderModalOpen={addFolderModalOpen}
        setAddFolderModalOpen={setAddFolderModalOpen}
        forceUpdate={forceUpdate}
        parentFolderId={parentFolderId}
        addFileModalOpen={addFileModalOpen}
        setAddFileModalOpen={setAddFileModalOpen}
        currentFileSystemItem={currentFileSystemItem}
        updateFolderModalOpen={updateFolderModalOpen}
        setUpdateFolderModalOpen={setUpdateFolderModalOpen}
        updateFileModalOpen={updateFileModalOpen}
        setUpdateFileModalOpen={setUpdateFileModalOpen}
      />
    </>
  );
}
