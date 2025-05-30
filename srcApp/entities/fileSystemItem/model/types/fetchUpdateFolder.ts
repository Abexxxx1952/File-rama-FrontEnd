export type FetchUpdateFolder = {
  folderId: string;
  folderName?: string;
  parentFolderId?: string;
};

export type FetchUpdateFolderForm = {
  folderName: string;
  isPublic: boolean;
};
