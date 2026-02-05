import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";

export function getFolderPathCacheTags(parentFolderId: string | null): string {
  let cacheTag = CACHE_TAG.FILE_SYSTEM_ITEM;

  cacheTag += `/${parentFolderId}/`;

  return cacheTag;
}
