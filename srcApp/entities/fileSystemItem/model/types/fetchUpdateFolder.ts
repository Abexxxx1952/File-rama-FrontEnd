export type FetchUpdateFolder = {
  folderId: string;
  folderName?: string;
  parentFolderId?: string | null;
};

export type FetchUpdateFolderForm = {
  folderName: string;
};
