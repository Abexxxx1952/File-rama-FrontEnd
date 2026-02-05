"use client";

import { Dispatch, SetStateAction } from "react";
import { refreshTokens } from "@/srcApp/features/auth/refresh-tokens/model/refreshTokens";
import { getCookies } from "@/srcApp/features/cookies/model/getCookies";
import { isErrorData } from "@/srcApp/shared/model/isErrorData";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { ErrorData } from "@/srcApp/shared/model/types/errorData";
import { fetchCreateFilePermissions } from "../api/fetchCreateFilePermissions";
import { FetchCreateFilePermissions } from "./types/fetchCreateFilePermissions";
import type { File } from "./types/file";

export async function createFilePermissions(
  createFilePermissionsData: FetchCreateFilePermissions,
  fileSystemItemsCurrentTag: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
): Promise<File | null> {
  setLoading(true);
  try {
    const { access_token, refresh_token } = await getCookies();

    if (access_token) {
      const data: File | ErrorData | null = await fetchCreateFilePermissions(
        access_token,
        createFilePermissionsData,
        fileSystemItemsCurrentTag,
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
        successMessage: `Permissions for file ${data.fileName} created successfully`,
      });
      setLoading(false);
      return data;
    }
    if (!access_token && refresh_token) {
      await refreshTokens(refresh_token);
      return createFilePermissions(
        createFilePermissionsData,
        fileSystemItemsCurrentTag,
        setLoading,
      );
    }
    return null;
  } catch (error: unknown) {
    console.log("error", error);
    return null;
  } finally {
    setLoading(false);
  }
}
