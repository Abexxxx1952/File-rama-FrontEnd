export type FetchUpdateFile = {
  fileId: string;
  fileName?: string;
  parentFolderId?: string;
};

export type FetchUpdateFileForm = {
  fileName: string;
  isPublic: boolean;
};
