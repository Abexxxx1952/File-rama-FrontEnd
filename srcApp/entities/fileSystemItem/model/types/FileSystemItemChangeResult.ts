type ChangeStatus = "success" | "error";

type FileChangeResult = {
  fileId: string;
  status: ChangeStatus;
};

type FolderChangeResult = {
  folderId: string;
  status: ChangeStatus;
};

export type FileSystemItemChangeResult = FileChangeResult | FolderChangeResult;
