"use client";

import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchGetFolderPath } from "./api/fetchFolderPath";

export async function getFolderPath(
  folderID: string,
  folderPathTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<string> {
  if (folderID === "null") return ":/";
  setLoading(true);

  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: string | ErrorData | null = await fetchGetFolderPath(
        access_token,
        folderID,
        folderPathTag,
      );
      if (isErrorData(data)) {
        notifyResponse({
          isError: true,
          responseResult: data,
        });
        return ":/";
      }

      if (data === null) {
        notifyResponse({
          isError: true,
          responseResult: null,
        });
        return ":/";
      }

      setLoading(false);
      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return getFolderPath(folderID, folderPathTag, setLoading);
    }
    return ":/";
  } catch (error: unknown) {
    console.log("error", error);
    return ":/";
  } finally {
    setLoading(false);
  }
}
