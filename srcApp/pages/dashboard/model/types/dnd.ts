export type Dnd = {
  draggable: (
    | {
        fileId: string;
      }
    | {
        folderId: string;
      }
  )[];
  droppable: string;
};
