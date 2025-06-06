export type File = {
  id: string;
  userId: string;
  fileUrl: string;
  fileDownloadUrl: string;
  fileName: string;
  fileExtension: string;
  fileSize: string;
  parentFolderId: string | null;
  fileGoogleDriveId: string;
  fileGoogleDriveParentFolderId: string;
  fileGoogleDriveClientEmail: string;
  uploadDate: string;
  isPublic: boolean;
  fileDescription?: string | null;
};
