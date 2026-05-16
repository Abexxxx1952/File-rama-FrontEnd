"use client";

import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchUpdateFile } from "../api/fetchUpdateFile";
import type { FetchUpdateFile } from "./types/fetchUpdateFile";
import type { File } from "./types/file";

export async function updateFile(
  updateFileData: FetchUpdateFile,
  fileSystemItemsCurrentTags: string[],
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<File | null> {
  return await fetchWithAuth<
    File,
    {
      updateFileData: FetchUpdateFile;
      fileSystemItemsCurrentTags: string[];
    }
  >(
    fetchUpdateFile,
    { updateFileData, fileSystemItemsCurrentTags },
    (data) => `File ${data.fileName} edited successfully`,
    setLoading
  );
}
