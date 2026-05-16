"use client";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchCreateFile } from "../api/fetchCreateFile";
import { type FileUploadResult, StatusUpload } from "./types/fileUploadResult";

export async function createFile(
  params: FormData,
  fileUploadId: string,
  fileSystemItemsCurrentTag: string,
  abortControllerRef?: React.RefObject<AbortController | null>
): Promise<FileUploadResult | null> {
  return await fetchWithAuth<
    FileUploadResult,
    {
      params: FormData;
      fileUploadId: string;
      fileSystemItemsCurrentTag: string;
      abortControllerRef?: React.RefObject<AbortController | null>;
    }
  >(
    fetchCreateFile,
    { params, fileUploadId, fileSystemItemsCurrentTag, abortControllerRef },
    (data) =>
      data.status === StatusUpload.COMPLETED
        ? `File ${data.file.fileName} added successfully`
        : `File ${data.fileName} upload failed`
  );
}
