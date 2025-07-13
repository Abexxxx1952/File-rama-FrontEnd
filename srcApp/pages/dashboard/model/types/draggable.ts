export type Draggable = (
  | {
      fileId: string;
    }
  | {
      folderId: string;
    }
)[];
