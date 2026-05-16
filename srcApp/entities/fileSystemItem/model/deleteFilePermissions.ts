"use client";

import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchDeleteFilePermissions } from "../api/fetchDeleteFilePermissions";
import type { File } from "./types/file";

export async function deleteFilePermissions(
  fileId: string,
  fileSystemItemsCurrentTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<File | null> {
  return await fetchWithAuth<
    File,
    {
      fileId: string;
      fileSystemItemsCurrentTag: string;
    }
  >(
    fetchDeleteFilePermissions,
    { fileId, fileSystemItemsCurrentTag },
    (data) => `Permissions for file ${data.fileName} deleted successfully`,
    setLoading
  );
}
