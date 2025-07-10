export type FetchDeleteMany = (
  | {
      fileId: string;
    }
  | {
      folderId: string;
    }
)[];
