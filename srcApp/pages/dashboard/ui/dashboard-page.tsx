"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDashboardDnd } from "@/srcApp/entities/fileSystemItem/model/hooks/useDashboardDnd";
import { useDashboardItemActions } from "@/srcApp/entities/fileSystemItem/model/hooks/useDashboardItemActions";
import { useFileSystem } from "@/srcApp/entities/fileSystemItem/model/hooks/useFileSystem";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import {
  BackItem,
  DashboardExtraItem,
  DashboardItem,
  EmptyItem,
} from "@/srcApp/entities/fileSystemItem/ui";
import { getStat } from "@/srcApp/entities/stats/model/getStat";
import type { Stat } from "@/srcApp/entities/stats/model/types/stat";
import { Options } from "@/srcApp/features/options/ui";
import { Search } from "@/srcApp/features/search/ui";
import { Loading } from "@/srcApp/shared/ui/loading";
import { DashboardModals } from "@/srcApp/widgets/dashboard-modals";
import { DashboardTableHeader } from "@/srcApp/widgets/dashboard-table-header";
import { useDashboardNavigation } from "../model/hooks/useDashboardNavigation";
import { useLazyScrollLoading } from "../model/hooks/useLazyScrollLoading";
import { useSearch } from "../model/hooks/useSearch";
import { useSelection } from "../model/hooks/useSelection";
import { useWindowListeners } from "../model/hooks/useWindowListeners";
import styles from "./styles.module.css";

const INITIAL_MAX_COUNT =
  Number(process.env.NEXT_PUBLIC_INITIAL_MAX_FILE_SYSTEM_ITEMS_COUNT) || 20;
const ADD_STEP =
  Number(process.env.NEXT_PUBLIC_ADD_STEP_FILE_SYSTEM_ITEMS_COUNT) || 20;

export function DashboardPage({ ids }: { ids: string[] }) {
  const [version, setVersion] = useState(0);
  const forceUpdate = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const {
    routerForward,
    routerBack,
    currentParentFolderId,
    grandParentId,
    fileSystemItemsCurrentTag,
    folderPathTag,
    sort,
    upsertSortRule,
    sortRules,
  } = useDashboardNavigation(ids);

  const [search, setSearch] = useState("");
  const [fileSystemItems, loading] = useFileSystem({
    currentParentFolderId,
    sortRules,
    version,
    fileSystemItemsCurrentTag,
  });
  const filteredFileSystemItems = useSearch(fileSystemItems, search);
  const [filteredFileSystemItemsSliced, setFilteredFileSystemItemsSliced] =
    useState<FileSystemItem[]>([]);
  const { selected, setSelected, isSelected, toggle, clear } = useSelection();
  const {
    dndRef,
    cursorPositionRef,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    isDraggable,
  } = useDashboardDnd({
    selected,
    clear,
    fileSystemItemsCurrentTag,
    forceUpdate,
  });
  const [currentFileSystemItem, setCurrentFileSystemItem] =
    useState<FileSystemItem | null>(null);
  const { portalRef, handleDeleteMany, loadingDelete } = useWindowListeners({
    fileSystemItemsCurrentTag,
    clear,
    selected,
    setSelected,
    fileSystemItems,
    forceUpdate,
  });
  const [stat, setStat] = useState<Stat | null>();
  const [addFolderModalOpen, setAddFolderModalOpen] = useState<boolean>(false);
  const [addFileModalOpen, setAddFileModalOpen] = useState<boolean>(false);
  const [updateFolderModalOpen, setUpdateFolderModalOpen] =
    useState<boolean>(false);
  const [updateFileModalOpen, setUpdateFileModalOpen] =
    useState<boolean>(false);
  const {
    oneClickHandler,
    handleOpen,
    handleDownload,
    handleUpdate,
    handleDelete,
  } = useDashboardItemActions({
    toggle,
    forceUpdate,
    routerForward,
    setCurrentFileSystemItem,
    setUpdateFileModalOpen,
    setUpdateFolderModalOpen,
    fileSystemItemsCurrentTag,
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const maxCount = useLazyScrollLoading(
    INITIAL_MAX_COUNT,
    filteredFileSystemItems.length || 0,
    ADD_STEP,
    sentinelRef,
  );

  useEffect(() => {
    (async () => {
      const stat = await getStat();

      setStat(stat);
    })();
  }, [version]);

  useEffect(() => {
    setFilteredFileSystemItemsSliced(
      filteredFileSystemItems.slice(0, maxCount),
    );
  }, [maxCount, filteredFileSystemItems]);

  return (
    <>
      <Search setSearch={setSearch} />
      <Options
        currentParentFolderId={currentParentFolderId}
        folderPathTag={folderPathTag}
        routerBack={routerBack}
        isSelected={isSelected()}
        handleDeleteMany={handleDeleteMany}
        loadingDelete={loadingDelete}
      />
      <div className={styles.storage__content}>
        <div
          className={styles.storage__table}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
        >
          <DashboardTableHeader sort={sort} upsertSortRule={upsertSortRule} />
          {ids.length > 1 && (
            <BackItem
              grandParentId={grandParentId}
              dndRef={dndRef}
              routerBack={routerBack}
            />
          )}
          {loading && <Loading />}
          {filteredFileSystemItemsSliced.length === 0 && !loading && (
            <EmptyItem />
          )}
          {filteredFileSystemItemsSliced.map((elem, index) => {
            return (
              <DashboardItem
                key={elem.id}
                item={elem}
                index={index}
                forceUpdate={forceUpdate}
                isSelected={isSelected(elem.id)}
                oneClickHandler={oneClickHandler}
                handleOpen={handleOpen}
                handleDownload={handleDownload}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                isDraggable={isDraggable(elem.id)}
                dndRef={dndRef}
                cursorPosition={cursorPositionRef}
                draggableQuantity={selected.size}
              />
            );
          })}
          <div ref={sentinelRef} />
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
        currentParentFolderId={currentParentFolderId}
        addFileModalOpen={addFileModalOpen}
        setAddFileModalOpen={setAddFileModalOpen}
        currentFileSystemItem={currentFileSystemItem}
        updateFolderModalOpen={updateFolderModalOpen}
        setUpdateFolderModalOpen={setUpdateFolderModalOpen}
        updateFileModalOpen={updateFileModalOpen}
        setUpdateFileModalOpen={setUpdateFileModalOpen}
        fileSystemItemsCurrentTag={fileSystemItemsCurrentTag}
      />
    </>
  );
}
