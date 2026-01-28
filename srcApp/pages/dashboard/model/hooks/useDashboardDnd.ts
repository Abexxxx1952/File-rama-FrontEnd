import { useRef } from "react";
import { updateMany } from "@/srcApp/entities/fileSystemItem/model/updateMany";
import { Dnd } from "../types/dnd";
import { SelectedMap } from "../types/selectedMap";

export function useDashboardDnd(
  selected: SelectedMap,
  forceUpdate: () => void,
) {
  const dndRef = useRef<Dnd>({ draggable: [], droppable: "" });
  const cursorPositionRef = useRef({ x: 0, y: 0 });

  const onDragStart = () => {
    if (selected.size === 0) return;
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
    if (!dropId) return;
    await updateMany(
      dndRef.current.draggable.map((i) => ({
        ...i,
        parentFolderId: dropId,
      })),
    );
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
