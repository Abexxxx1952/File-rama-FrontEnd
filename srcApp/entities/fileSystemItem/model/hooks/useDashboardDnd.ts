import { useRef } from "react";
import { updateFile } from "@/srcApp/entities/fileSystemItem/model/updateFile";
import { updateFolder } from "@/srcApp/entities/fileSystemItem/model/updateFolder";
import { updateMany } from "@/srcApp/entities/fileSystemItem/model/updateMany";
import { Dnd } from "@/srcApp/pages/dashboard/model/types/dnd";
import { SelectedMap } from "@/srcApp/pages/dashboard/model/types/selectedMap";

export function useDashboardDnd(
  selected: SelectedMap,
  clear: () => void,
  forceUpdate: () => void,
) {
  const dndRef = useRef<Dnd>({ draggable: [], droppable: "" });
  const cursorPositionRef = useRef({ x: 0, y: 0 });

  const onDragStart = () => {
    if (selected.size < 2) return;
    dndRef.current.draggable = [...selected.values()].map(
      ({ index, ...id }) => id,
    );
    forceUpdate();
  };

  const onDragOver = (e: React.MouseEvent) => {
    e.preventDefault();
    cursorPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const onDrop = async () => {
    const dropId = dndRef.current.droppable;
    if (dropId !== null && (typeof dropId !== "string" || dropId === "")) {
      return;
    }
    if (selected.size > 1) {
      await updateMany(
        dndRef.current.draggable.map((i) => ({
          ...i,
          parentFolderId: dropId,
        })),
      );
      clear();
      forceUpdate();
      return;
    }
    const draggableItem = dndRef.current.draggable[0];
    if ("folderId" in draggableItem) {
      await updateFolder(
        { folderId: draggableItem.folderId, parentFolderId: dropId },
        () => {},
      );
      forceUpdate();
      return;
    }
    if ("fileId" in draggableItem) {
      await updateFile(
        { fileId: draggableItem.fileId, parentFolderId: dropId },
        () => {},
      );
      forceUpdate();
      return;
    }
  };

  const onDragEnd = () => {
    dndRef.current = { draggable: [], droppable: "" };
    forceUpdate();
  };

  const isDraggable = (id: string): boolean => {
    return dndRef.current.draggable.some((draggableItem) => {
      if ("folderId" in draggableItem) {
        return draggableItem.folderId === id;
      }
      if ("fileId" in draggableItem) {
        return draggableItem.fileId === id;
      }
      return false;
    });
  };

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
