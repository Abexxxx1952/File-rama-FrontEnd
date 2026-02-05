import {
  FilesSortKey,
  FolderSortKey,
  MappedFileSortKey,
  MappedFolderSortKey,
  MappedSortFileRule,
  MappedSortFolderRule,
  SortFileSystemRules,
  SortRules,
  sortFilesRules,
  sortFoldersRules,
} from "@/srcApp/pages/dashboard/model/types/sort";

export function splitSortRules(sort: SortRules[]): SortFileSystemRules {
  const folderKeys = new Set<keyof typeof FolderSortKey>(
    Object.keys(FolderSortKey) as (keyof typeof FolderSortKey)[],
  );

  const fileKeys = new Set<keyof typeof FilesSortKey>(
    Object.keys(FilesSortKey) as (keyof typeof FilesSortKey)[],
  );

  const sortFolderRules: MappedSortFolderRule[] = [];
  const sortFileRules: MappedSortFileRule[] = [];

  for (const rule of sort) {
    if (folderKeys.has(rule.key as keyof typeof FolderSortKey)) {
      sortFolderRules.push(sortFolderMapping(rule as sortFoldersRules));
    }
    if (fileKeys.has(rule.key as keyof typeof FilesSortKey)) {
      sortFileRules.push(sortFileMapping(rule as sortFilesRules));
    }
  }

  return { sortFolderRules, sortFileRules };
}

const folderSortKeyMap: Record<sortFoldersRules["key"], MappedFolderSortKey> = {
  name: "folderName",
  upload_date: "createdDate",
};

const fileSortKeyMap: Record<sortFilesRules["key"], MappedFileSortKey> = {
  name: "fileName",
  upload_date: "uploadDate",
  size: "fileSize",
};
function sortFolderMapping(rule: sortFoldersRules): MappedSortFolderRule {
  return {
    ...rule,
    key: folderSortKeyMap[rule.key],
  };
}

function sortFileMapping(rule: sortFilesRules): MappedSortFileRule {
  return {
    ...rule,
    key: fileSortKeyMap[rule.key],
  };
}
