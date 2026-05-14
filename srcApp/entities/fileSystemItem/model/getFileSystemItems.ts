import { Dispatch, SetStateAction } from "react";
import { SortFileSystemRules } from "@/srcApp/pages/dashboard/model/types/sort";
import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";
import { fetchFileSystemItem } from "../api/fetchFileSystemItem";
import { FileSystemItem } from "./types/fileSystemItem";

export async function getFileSystemItems(
  parentFolderId: string | null,
  sort: SortFileSystemRules,
  fileSystemItemsCurrentTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
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
    setLoading,
  );
}
