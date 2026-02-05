export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export const FileSystemSortKey = {
  name: "name",
  size: "size",
  upload_date: "upload_date",
} as const;
export type FileSystemSortKey =
  (typeof FileSystemSortKey)[keyof typeof FileSystemSortKey];
export const FolderSortKey = {
  name: "name",
  upload_date: "upload_date",
} as const;

export const FilesSortKey = {
  name: "name",
  size: "size",
  upload_date: "upload_date",
} as const;

export type SortRules = {
  key: keyof typeof FileSystemSortKey;
  order: SortOrder;
};

export type sortFoldersRules = {
  key: keyof typeof FolderSortKey;
  order: SortOrder;
};

export type sortFilesRules = {
  key: keyof typeof FilesSortKey;
  order: SortOrder;
};
export type MappedFolderSortKey = "folderName" | "createdDate";

export type MappedFileSortKey = "fileName" | "fileSize" | "uploadDate";

export type MappedSortFolderRule = {
  key: MappedFolderSortKey;
  order: "asc" | "desc";
};

export type MappedSortFileRule = {
  key: MappedFileSortKey;
  order: "asc" | "desc";
};

export type SortFileSystemRules = {
  sortFolderRules: MappedSortFolderRule[];
  sortFileRules: MappedSortFileRule[];
};
