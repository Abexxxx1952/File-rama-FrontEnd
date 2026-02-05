type DraggableItem = { fileId: string } | { folderId: string };
export type Dnd = {
  draggable: Map<string, DraggableItem>;
  droppable: string | null;
};
