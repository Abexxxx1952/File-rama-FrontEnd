"use client";

import { Dispatch, SetStateAction } from "react";
import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";
import { fetchDeleteFile } from "../api/fetchDeleteFile";
import { File } from "./types/file";

export async function deleteFile(
  id: string,
  fileSystemItemsCurrentTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<File | null> {
  return await fetchWithAuth<
    File,
    {
      id: string;
      fileSystemItemsCurrentTag: string;
    }
  >(
    fetchDeleteFile,
    { id, fileSystemItemsCurrentTag },
    (data) => `File ${data.fileName} deleted successfully`,
    setLoading,
  );
}
