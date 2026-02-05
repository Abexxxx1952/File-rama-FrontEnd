"use server";

import { SortFileSystemRules } from "@/srcApp/pages/dashboard/model/types/sort";
import { fetchEntity } from "@/srcApp/shared/model/fetchEntity";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { FileSystemItem } from "../model/types/fileSystemItem";

export async function fetchFileSystemItem(
  access_token: string,
  parentFolderId: string | null,
  sort: SortFileSystemRules,
  fileSystemItemsCurrentTag: string,
): Promise<FileSystemItem[] | ErrorData | null> {
  const urlFromEnv: string = `${process.env.GET_FILE_SYSTEM_ITEM_URL}`;
  const url = new URL(urlFromEnv);

  if (parentFolderId) {
    url.searchParams.set("parentFolderId", parentFolderId);
  }

  if (sort.sortFolderRules.length > 0) {
    url.searchParams.set(
      "orderFoldersBy",
      JSON.stringify(sort.sortFolderRules),
    );
  }

  if (sort.sortFileRules.length > 0) {
    url.searchParams.set("orderFilesBy", JSON.stringify(sort.sortFileRules));
  }

  return fetchEntity<FileSystemItem>(url, access_token, [
    fileSystemItemsCurrentTag,
  ]);
}
