"use server";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { fetchEntity } from "@/srcApp/shared/model/fetchEntity";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { FileSystemItem } from "../model/types/fileSystemItem";

export async function fetchFileSystemItem(
  access_token: string,
  parentFolderId?: string,
): Promise<FileSystemItem[] | ErrorData | null> {
  const urlFromEnv: string = `${process.env.GET_FILE_SYSTEM_ITEM_URL}`;
  const url = new URL(urlFromEnv);
  if (parentFolderId) {
    url.searchParams.set("parentFolderId", parentFolderId);
  }

  const cacheTag = parentFolderId
    ? `${CACHE_TAG.FILE_SYSTEM_ITEM} + "/" + ${parentFolderId}`
    : CACHE_TAG.FILE_SYSTEM_ITEM;

  return fetchEntity<FileSystemItem>(url, access_token, [cacheTag]);
}
