"use server";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { fetchEntity } from "@/srcApp/shared/model/fetchEntity";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { FileSystemItem } from "../model/types/fileSystemItem";

export async function fetchFileSystemItem(
  access_token: string,
): Promise<FileSystemItem[] | ErrorData | null> {
  const url: string = `${process.env.GET_FILE_SYSTEM_ITEM_URL}`;

  return fetchEntity<FileSystemItem>(url, access_token, [
    CACHE_TAG.FILE_SYSTEM_ITEM,
  ]);
}
