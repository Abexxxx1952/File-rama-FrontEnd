"use client";

import { Dispatch, SetStateAction } from "react";
import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";
import { fetchCreateFolder } from "../api/fetchCreateFolder";
import { FetchAddFolder } from "./types/fetchAddFolder";
import { Folder } from "./types/folder";

export async function createFolder(
  addFolderData: FetchAddFolder,
  fileSystemItemsCurrentTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<Folder | null> {
  const result = await fetchWithAuth<
    Folder,
    {
      addFolderData: FetchAddFolder;
      fileSystemItemsCurrentTag: string;
    }
  >(
    fetchCreateFolder,
    { addFolderData, fileSystemItemsCurrentTag },
    (data) => `Folder ${data.folderName} added successfully`,
    setLoading,
  );
  setModalOpen(false);

  return result;
}
