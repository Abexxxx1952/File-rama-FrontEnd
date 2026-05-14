"use client";

import { Dispatch, SetStateAction } from "react";
import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";
import { fetchCreateFilePermissions } from "../api/fetchCreateFilePermissions";
import { FetchCreateFilePermissions } from "./types/fetchCreateFilePermissions";
import type { File } from "./types/file";

export async function createFilePermissions(
  createFilePermissionsData: FetchCreateFilePermissions,
  fileSystemItemsCurrentTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<File | null> {
  return await fetchWithAuth<
    File,
    {
      createFilePermissionsData: FetchCreateFilePermissions;
      fileSystemItemsCurrentTag: string;
    }
  >(
    fetchCreateFilePermissions,
    { createFilePermissionsData, fileSystemItemsCurrentTag },
    (data) => `Permissions for file ${data.fileName} created successfully`,
    setLoading,
  );
}
