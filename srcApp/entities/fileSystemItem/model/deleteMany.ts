"use client";

import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchDeleteMany } from "../api/fetchDeleteMany";
import { type FileSystemItemChangeResult } from "./types/FileSystemItemChangeResult";
import { type FetchDeleteMany } from "./types/fetchDeleteMany";

export async function deleteMany(
  deleteMany: FetchDeleteMany,
  fileSystemItemsCurrentTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<FileSystemItemChangeResult[] | null> {
  function getSuccessMessage(data: FileSystemItemChangeResult[]): string {
    let successFiles: number = 0;
    let errorFiles: number = 0;
    let successFolders: number = 0;
    let errorFolders: number = 0;

    data.forEach((item) => {
      if ("fileId" in item) {
        if (item.status === "success") {
          successFiles++;
        } else {
          errorFiles++;
        }
      }
      if ("folderId" in item) {
        if (item.status === "success") {
          successFolders++;
        } else {
          errorFolders++;
        }
      }
    });

    const parts = [];

    if (successFiles > 0) {
      parts.push(`${successFiles} file${successFiles !== 1 ? "s" : ""}.`);
    }

    if (successFolders > 0) {
      parts.push(`${successFolders} folder${successFolders !== 1 ? "s" : ""}.`);
    }

    const deletedParts = parts.length > 0 ? `${parts.join(" and ")}.` : "";

    const errorMessage =
      errorFiles + errorFolders > 0
        ? ` ${errorFiles + errorFolders} item${errorFiles + errorFolders !== 1 ? "s" : ""} failed to delete.`
        : "";

    return `Successfully deleted: ${deletedParts}${errorMessage}`;
  }

  return await fetchWithAuth<
    FileSystemItemChangeResult[],
    {
      deleteMany: FetchDeleteMany;
      fileSystemItemsCurrentTag: string;
    }
  >(
    fetchDeleteMany,
    { deleteMany, fileSystemItemsCurrentTag },
    getSuccessMessage,
    setLoading
  );
}
