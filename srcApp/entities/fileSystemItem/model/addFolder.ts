"use client";

import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchCreateFolder } from "../api/fetchCreateFolder";
import { FetchAddFolder } from "./types/fetchAddFolder";
import { FileSystemItem } from "./types/fileSystemItem";
import { Folder } from "./types/folder";

export async function addFolder(
  params: FetchAddFolder,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<Folder | null> {
  setLoading(true);
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: FileSystemItem | ErrorData | null = await fetchCreateFolder(
        access_token,
        params,
      );

      if (isErrorData(data)) {
        notifyResponse({
          isError: true,
          responseResult: data,
        });
        return null;
      }

      if (data === null) {
        notifyResponse({
          isError: true,
          responseResult: null,
        });
        return null;
      }

      notifyResponse({
        isError: false,
        successMessage: `Folder ${data.folderName} added successfully`,
      });
      setLoading(false);
      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return addFolder(params, setLoading, setModalOpen);
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  } finally {
    setLoading(false);
    setModalOpen(false);
  }
}
