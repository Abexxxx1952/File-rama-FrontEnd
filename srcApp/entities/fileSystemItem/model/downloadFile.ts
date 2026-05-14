"use client";

import { Dispatch, SetStateAction } from "react";
import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";
import { fetchDownloadFile } from "../api/fetchDownloadFile";

export async function downloadFile(
  fileDownloadId: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  abortControllerRef?: React.RefObject<AbortController | null>,
): Promise<{ fileUrl: string; fileName: string } | null> {
  return await fetchWithAuth<
    { fileUrl: string; fileName: string },
    {
      fileDownloadId: string;
      abortControllerRef?: React.RefObject<AbortController | null>;
    }
  >(
    fetchDownloadFile,
    { fileDownloadId, abortControllerRef },
    undefined,
    setLoading,
  );
}
