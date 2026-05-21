"use client";

import { type Dispatch, type SetStateAction } from "react";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { fetchGetFolderPath } from "./api/fetchFolderPath";

export async function getFolderPath(
  folderID: string,
  folderPathTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<string> {
  if (folderID === "null") {
    return ":/";
  }
  const folderPath = await fetchWithAuth<
    string,
    {
      folderID: string;
      folderPathTag: string;
    }
  >(fetchGetFolderPath, { folderID, folderPathTag }, undefined, setLoading);
  if (folderPath === null) {
    return ":/";
  }
  return folderPath;
}
