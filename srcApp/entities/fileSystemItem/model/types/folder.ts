export type Folder = {
  id: string;
  folderName: string;
  userId: string;
  parentFolderId: string | null;
  createdDate: string;
  isPublic: boolean;
};
