import { useRef } from "react";
import type { Dnd } from "@/srcApp/pages/dashboard/model/types/dnd";
import { SelectedMap } from "@/srcApp/pages/dashboard/model/types/selectedMap";
import { getAdditionalTag } from "../getAdditionalTag";
import { updateFile } from "../updateFile";
import { updateFolder } from "../updateFolder";
import { updateMany } from "../updateMany";

type useDashboardDndParams = {
  selected: SelectedMap;
  clear: () => void;
  fileSystemItemsCurrentTag: string;
  forceUpdate: () => void;
};

const initialDndState = (): Dnd => ({
  draggable: new Map(),
  droppable: "",
});

export function useDashboardDnd({
  selected,
  clear,
  fileSystemItemsCurrentTag,
  forceUpdate,
}: useDashboardDndParams) {
  const dndRef = useRef<Dnd>(initialDndState());
  const cursorPositionRef = useRef({ x: 0, y: 0 });

  const onDragStart = () => {
    if (selected.size < 2) return;

    for (const item of selected.values()) {
      if ("fileId" in item) {
        dndRef.current.draggable.set(item.fileId, { fileId: item.fileId });
      } else {
        dndRef.current.draggable.set(item.folderId, {
          folderId: item.folderId,
        });
      }
    }

    forceUpdate();
  };

  const onDragOver = (e: React.MouseEvent) => {
    e.preventDefault();
    cursorPositionRef.current.x = e.clientX;
    cursorPositionRef.current.y = e.clientY;
  };

  const onDrop = async () => {
    const dropId = dndRef.current.droppable;
    if (dropId !== null && (typeof dropId !== "string" || dropId === "")) {
      return;
    }

    const additionalTag = getAdditionalTag(fileSystemItemsCurrentTag, dropId);

    if (selected.size > 1) {
      await updateMany(
        [...dndRef.current.draggable.values()].map((i) => ({
          ...i,
          parentFolderId: dropId,
        })),
        [fileSystemItemsCurrentTag, additionalTag],
      );
      clear();
      return;
    }

    const draggableItem = dndRef.current.draggable.values().next().value;

    if (!draggableItem) return;

    if ("folderId" in draggableItem) {
      await updateFolder(
        { folderId: draggableItem.folderId, parentFolderId: dropId },
        [fileSystemItemsCurrentTag, additionalTag],
        () => {},
      );
      return;
    }

    if ("fileId" in draggableItem) {
      await updateFile(
        { fileId: draggableItem.fileId, parentFolderId: dropId },
        [fileSystemItemsCurrentTag, additionalTag],
        () => {},
      );
      return;
    }
  };

  const onDragEnd = () => {
    dndRef.current = initialDndState();
    forceUpdate();
  };

  const isDraggable = (id: string): boolean => dndRef.current.draggable.has(id);

  return {
    dndRef,
    cursorPositionRef,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    isDraggable,
  };
}
