export type FetchAddFolder = {
  folderName: string;
  parentFolderId: string | null;
  conflictChoice?: NameConflictChoice;
};

export type FetchAddFolderForm = Pick<FetchAddFolder, "folderName">;

export enum NameConflictChoice {
  RENAME = "RENAME",
  OVERWRITE = "OVERWRITE",
}
