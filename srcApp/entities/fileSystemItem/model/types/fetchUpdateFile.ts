export type FetchUpdateFile = {
  fileId: string;
  fileName?: string;
  parentFolderId?: string | null;
};

export type FetchUpdateFileForm = {
  fileName: string;
  isPublic: boolean;
  canRewritten: boolean;
  fileGDriveUrl: string;
  fileStaticUrl: string;
};
