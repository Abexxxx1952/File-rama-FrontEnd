"use client";

import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchOpenFile } from "../api/fetchOpenFile";

export async function openFile(
  fileDownloadId: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  abortControllerRef?: React.RefObject<AbortController | null>
): Promise<{ fileUrl: string; fileName: string } | null> {
  return await fetchWithAuth<
    { fileUrl: string; fileName: string },
    {
      fileDownloadId: string;
      abortControllerRef?: React.RefObject<AbortController | null>;
    }
  >(
    fetchOpenFile,
    { fileDownloadId, abortControllerRef },
    undefined,
    setLoading
  );
}
