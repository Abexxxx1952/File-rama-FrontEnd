"use client";

import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchUpdateFolder } from "../api/fetchUpdateFolder";
import type { FetchUpdateFolder } from "./types/fetchUpdateFolder";
import type { Folder } from "./types/folder";

export async function updateFolder(
  updateFolderData: FetchUpdateFolder,
  fileSystemItemsCurrentTags: string[],
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<Folder | null> {
  return await fetchWithAuth<
    Folder,
    {
      updateFolderData: FetchUpdateFolder;
      fileSystemItemsCurrentTags: string[];
    }
  >(
    fetchUpdateFolder,
    { updateFolderData, fileSystemItemsCurrentTags },
    (data) => `Folder ${data.folderName} edited successfully`,
    setLoading
  );
}
