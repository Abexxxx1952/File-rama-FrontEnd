"use server";

import { CACHE_TAG } from "@/srcApp/shared/constants/cacheTag";
import { fetchEntity } from "@/srcApp/shared/model/fetchEntity";
import { ErrorData } from "@/srcApp/shared/model/types";
import { FileSystemItem } from "../model/types";

export async function fetchFileSystemItem(
  access_token: string,
): Promise<FileSystemItem | ErrorData> {
  const url: string = `${process.env.GET_FILE_SYSTEM_ITEM_URL}`;

  return fetchEntity<FileSystemItem>(url, access_token, [
    CACHE_TAG.FILE_SYSTEM_ITEM,
  ]);
}
