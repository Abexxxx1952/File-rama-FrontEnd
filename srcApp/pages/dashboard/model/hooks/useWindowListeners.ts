import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { deleteMany } from "@/srcApp/entities/fileSystemItem/model/deleteMany";
import type { FetchDeleteMany } from "@/srcApp/entities/fileSystemItem/model/types/fetchDeleteMany";
import type { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { selectBetween } from "../selectBetween";
import { SelectedMap } from "../types/selectedMap";

type useWindowListenersParams = {
  fileSystemItems: FileSystemItem[] | null;
  fileSystemItemsCurrentTag: string;
  selected: SelectedMap;
  clear: () => void;
  setSelected: Dispatch<SetStateAction<SelectedMap>>;
  forceUpdate: () => void;
};

export function useWindowListeners({
  fileSystemItemsCurrentTag,
  clear,
  selected,
  setSelected,
  fileSystemItems,
  forceUpdate,
}: useWindowListenersParams) {
  const portalRef = useRef<HTMLElement | null>(null);
  const selectedRef = useRef<SelectedMap>(selected);
  const fileSystemItemsCurrentTagRef = useRef(fileSystemItemsCurrentTag);
  const itemsRef = useRef<FileSystemItem[] | null>(fileSystemItems);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    itemsRef.current = fileSystemItems;
  }, [fileSystemItems]);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    portalRef.current = document.getElementById("portal");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clear();
        return;
      }

      if (event.key === "Delete") {
        handleDeleteMany();
      }
    };

    const onClick = (event: MouseEvent) => {
      if (!event.shiftKey) return;

      const items = itemsRef.current;
      if (!items) return;

      selectBetween(selectedRef.current, items, setSelected);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    fileSystemItemsCurrentTagRef.current = fileSystemItemsCurrentTag;
  }, [fileSystemItemsCurrentTag]);

  async function handleDeleteMany() {
    const mapped: FetchDeleteMany = [];

    selectedRef.current.forEach(({ index, ...id }) => {
      mapped.push(id);
    });

    if (mapped.length === 0) return;

    await deleteMany(
      mapped,
      fileSystemItemsCurrentTagRef.current,
      setLoadingDelete,
    );
    clear();
    forceUpdate();
  }

  return { portalRef, handleDeleteMany, loadingDelete };
}
