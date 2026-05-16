import { type Dispatch, type SetStateAction } from "react";

import { type SortFileSystemRules } from "@/srcApp/pages/dashboard/model/types/sort";
import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchFileSystemItem } from "../api/fetchFileSystemItem";
import { type FileSystemItem } from "./types/fileSystemItem";

export async function getFileSystemItems(
  parentFolderId: string | null,
  sort: SortFileSystemRules,
  fileSystemItemsCurrentTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<FileSystemItem[] | null> {
  return await fetchWithAuth<
    FileSystemItem[],
    {
      parentFolderId: string | null;
      sort: SortFileSystemRules;
      fileSystemItemsCurrentTag: string;
    }
  >(
    fetchFileSystemItem,
    { parentFolderId, sort, fileSystemItemsCurrentTag },
    undefined,
    setLoading
  );
}
