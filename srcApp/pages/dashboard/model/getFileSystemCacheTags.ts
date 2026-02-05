import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { SortFileSystemRules } from "./types/sort";

export function getFileSystemCacheTags(
  parentFolderId: string | null,
  sortRules: SortFileSystemRules,
): string {
  let cacheTag = `${CACHE_TAG.FILE_SYSTEM_ITEM}/`;
  const { sortFolderRules, sortFileRules } = sortRules;

  cacheTag += `${parentFolderId}/`;

  if (sortFolderRules.length > 0) {
    cacheTag += `${JSON.stringify(sortFolderRules)}`;
  }

  if (sortFileRules.length > 0) {
    cacheTag += `${JSON.stringify(sortFileRules)}`;
  }

  return cacheTag;
}
