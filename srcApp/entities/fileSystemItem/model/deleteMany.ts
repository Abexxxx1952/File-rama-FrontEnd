"use client";

import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchDeleteMany } from "../api/fetchDeleteMany";
import { FileSystemItemChangeResult } from "./types/FileSystemItemChangeResult";
import { FetchDeleteMany } from "./types/fetchDeleteMany";

export async function deleteMany(
  selected: FetchDeleteMany,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<FileSystemItemChangeResult[] | null> {
  setLoading(true);
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: FileSystemItemChangeResult[] | ErrorData | null =
        await fetchDeleteMany(access_token, selected);

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
        parts.push(
          `${successFolders} folder${successFolders !== 1 ? "s" : ""}.`,
        );
      }

      const deletedParts = parts.length > 0 ? parts.join(" and ") + "." : "";

      const errorMessage =
        errorFiles + errorFolders > 0
          ? ` ${errorFiles + errorFolders} item${errorFiles + errorFolders !== 1 ? "s" : ""} failed to delete.`
          : "";

      notifyResponse({
        isError: false,
        successMessage: `Successfully deleted: ${deletedParts}${errorMessage}`,
      });
      setLoading(false);
      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return deleteMany(selected, setLoading);
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  } finally {
    setLoading(false);
  }
}
